import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int minCut(string s) {` },
    { id: 1, text: `    int n = s.size();` },
    { id: 2, text: `    vector<vector<bool>> pal(n, vector<bool>(n, false));` },
    { id: 3, text: `    // Build palindrome table` },
    { id: 4, text: `    for (int r = n-1; r >= 0; r--)` },
    { id: 5, text: `      for (int c = r; c < n; c++)` },
    { id: 6, text: `        pal[r][c] = s[r]==s[c] && (c-r<2 || pal[r+1][c-1]);` },
    { id: 7, text: `    vector<int> dp(n, INT_MAX);` },
    { id: 8, text: `    for (int i = 0; i < n; i++) {` },
    { id: 9, text: `        if (pal[0][i]) { dp[i] = 0; continue; }` },
    { id: 10, text: `        for (int j = 1; j <= i; j++)` },
    { id: 11, text: `            if (pal[j][i]) dp[i] = min(dp[i], dp[j-1]+1);` },
    { id: 12, text: `    }` },
    { id: 13, text: `    return dp[n-1];` },
    { id: 14, text: `}` },
];
const PC = { pal: "#f59e0b", dp: "#3b82f6", check: "#8b5cf6", update: "#10b981", done: "#10b981" };
const PL = { pal: "🔍 PAL TABLE", dp: "📊 DP", check: "🔎 CHECK", update: "✅ UPDATE", done: "✅ DONE" };

function gen(s) {
    const n = s.length, steps = [];
    const pal = Array.from({ length: n }, () => new Array(n).fill(false));
    const dp = new Array(n).fill(999);
    let cnt = 0; const MAX = 300;
    const snap = (cl, ph, v, m, hr, hc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, pal: pal.map(r => [...r]), dp: [...dp], str: s, hlR: hr ?? -1, hlC: hc ?? -1 }); cnt++; } };

    for (let r = n - 1; r >= 0; r--) {
        for (let c = r; c < n; c++) {
            pal[r][c] = s[r] === s[c] && (c - r < 2 || pal[r + 1][c - 1]);
            if (pal[r][c]) snap(6, "pal", { r, c, sub: `"${s.substring(r, c + 1)}"`, isPalin: true }, `"${s.substring(r, c + 1)}" is palindrome ✓`, r, c);
        }
    }

    for (let i = 0; i < n; i++) {
        if (pal[0][i]) { dp[i] = 0; snap(9, "dp", { i, "dp[i]": 0, reason: "s[0..i] is palindrome" }, `s[0..${i}] = "${s.substring(0, i + 1)}" palindrome → dp[${i}]=0`); continue; }
        for (let j = 1; j <= i; j++) {
            if (pal[j][i]) {
                const newVal = dp[j - 1] + 1;
                if (newVal < dp[i]) {
                    dp[i] = newVal;
                    snap(11, "update", { i, j, "dp[j-1]": dp[j - 1], "dp[i]": dp[i], cut: `"${s.substring(j, i + 1)}"` }, `pal[${j}][${i}]✓ → dp[${i}] = dp[${j - 1}]+1 = ${dp[i]}`);
                }
            }
        }
        if (cnt < MAX) snap(8, "dp", { i, "dp[i]": dp[i] }, `dp[${i}] = ${dp[i]}`);
    }
    snap(13, "done", { result: dp[n - 1] }, `✅ Minimum cuts: ${dp[n - 1]}`);
    return { steps, result: dp[n - 1] };
}

function DPViz({ dp, str }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📊 DP Array (min cuts)">
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {dp.map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: v < 999 ? "#052e16" : theme.cardBg, border: `1.5px solid ${v < 999 ? "#10b981" : theme.cardBorder}`, color: v < 999 ? "#4ade80" : theme.textDim }}>{v < 999 ? v : "∞"}</div>
                        <span style={{ fontSize: "0.5rem", color: theme.textMuted }}>{str[i]}</span>
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the **minimum number of cuts** to partition a string into palindromes. E.g., "aab" → 1 cut ("aa" | "b").

## How to Think About It
**DP approach:** For each position, find the minimum cuts needed for the substring ending there.

### Key Insight
If s[i..j] is a palindrome, then cuts[j] = min(cuts[j], cuts[i-1] + 1).
- cuts[j] = minimum cuts for s[0..j]
- If we know s[i..j] is palindrome, we need 1 cut + whatever cuts s[0..i-1] needed

**Think of it like:** Building up from small substrings. For each new character, check all palindromes ending here.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "aab"

1. Initialize cuts = [0, 1, 2] (worst case: n-1 cuts)
2. "a" (0..0) is palindrome → cuts[0] = 0
3. "aa" (0..1) is palindrome → cuts[1] = 0 (no cut needed!)
4. "b" (2..2) is palindrome → cuts[2] = cuts[1] + 1 = 1
5. "ab" (1..2) not palindrome
6. "aab" (0..2) not palindrome

Result: min cuts = **1** ✅ ("aa" | "b")`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### DP Table
    cuts[i] = min cuts for s[0..i]
    Initialize: cuts[i] = i (worst case: cut every char)

### Palindrome Expansion
For each center, expand outward checking palindromes:
- Odd length: expand from (i,i)
- Even length: expand from (i,i+1)

### Update Rule
    if s[j..k] is palindrome:
        cuts[k] = min(cuts[k], j == 0 ? 0 : cuts[j-1] + 1)

## Time & Space Complexity
- **Time:** O(n²) for palindrome expansion + DP
- **Space:** O(n) for cuts array`
    },
];

const DS = "aab";
export default function PalindromePartitionII() {
    const [sT, setST] = useState(DS);
    const [sess, setSess] = useState(() => gen(DS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const run = () => { const s = sT.toLowerCase().replace(/[^a-z]/g, ""); if (s.length < 1 || s.length > 10) return; setSess(gen(s)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setSess(gen(DS)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Palindrome Partitioning II" subtitle="Min cuts · DP approach · LC #132">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={sT} onChange={setST} onRun={run} onReset={reset} placeholder="aab" label="String (1–10):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="palindrome_partition_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <DPViz dp={step.dp} str={step.str} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>✂ {sess.result} cuts</span></StepInfo>
        </VizLayout>
    );
}
