import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int numDecodings(string s) {` },
    { id: 1, text: `    int n = s.size();` },
    { id: 2, text: `    vector<int> dp(n+1, 0);` },
    { id: 3, text: `    dp[0] = 1;  // empty prefix` },
    { id: 4, text: `    dp[1] = s[0] != '0' ? 1 : 0;` },
    { id: 5, text: `    for (int i = 2; i <= n; i++) {` },
    { id: 6, text: `        int one = stoi(s.substr(i-1, 1));` },
    { id: 7, text: `        int two = stoi(s.substr(i-2, 2));` },
    { id: 8, text: `        if (one >= 1) dp[i] += dp[i-1];` },
    { id: 9, text: `        if (two >= 10 && two <= 26) dp[i] += dp[i-2];` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return dp[n];` },
    { id: 12, text: `}` },
];
const PC = { init: "#8b5cf6", oneDigit: "#3b82f6", twoDigit: "#f59e0b", skip: "#f87171", done: "#10b981" };
const PL = { init: "🔧 INIT", oneDigit: "1️⃣ ONE", twoDigit: "2️⃣ TWO", skip: "⏭ SKIP", done: "✅ DONE" };

function gen(s) {
    const n = s.length, steps = [];
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = s[0] !== "0" ? 1 : 0;
    let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, dp: [...dp], str: s }); cnt++; } };

    snap(3, "init", { "dp[0]": 1, "dp[1]": dp[1] }, `Init: dp[0]=1, dp[1]=${dp[1]}`);

    for (let i = 2; i <= n; i++) {
        const oneD = parseInt(s[i - 1]);
        const twoD = parseInt(s.substring(i - 2, i));
        if (oneD >= 1) {
            dp[i] += dp[i - 1];
            const ch = String.fromCharCode(64 + oneD);
            snap(8, "oneDigit", { i, digit: oneD, letter: ch, "dp[i]": dp[i] }, `"${oneD}" → '${ch}', dp[${i}] += dp[${i - 1}] = ${dp[i]}`);
        } else {
            snap(8, "skip", { i, digit: 0 }, `"0" can't be single digit`);
        }
        if (twoD >= 10 && twoD <= 26) {
            dp[i] += dp[i - 2];
            const ch = String.fromCharCode(64 + twoD);
            snap(9, "twoDigit", { i, twoDigit: twoD, letter: ch, "dp[i]": dp[i] }, `"${twoD}" → '${ch}', dp[${i}] += dp[${i - 2}] = ${dp[i]}`);
        }
    }
    snap(11, "done", { result: dp[n] }, `✅ ${dp[n]} ways to decode`);
    return { steps, result: dp[n] };
}

function DPViz({ dp, str }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📊 DP Array (ways)">
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {dp.map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: v > 0 ? "#052e16" : theme.cardBg, border: `1.5px solid ${v > 0 ? "#10b981" : theme.cardBorder}`, color: v > 0 ? "#4ade80" : theme.textDim }}>{v}</div>
                        <span style={{ fontSize: "0.45rem", color: theme.textMuted }}>{i === 0 ? "ε" : str[i - 1]}</span>
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
Decode a digit string where A=1, B=2,...,Z=26. Count total decodings. E.g., "226" → 3 ways: BZ, VF, BBF.

## How to Think About It
At each position, you have **two choices**:
1. Take **1 digit** (1-9 maps to A-I)
2. Take **2 digits** (10-26 maps to J-Z)

### Like Climbing Stairs!
Similar to Fibonacci: dp[i] = dp[i-1] + dp[i-2] (if 2-digit valid).

**Think of it like:** Reading a coded message where you decide: is this one letter or two letters?`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "226"

1. dp[0] = 1 (empty string = 1 way)
2. dp[1] = 1 ("2" → B)
3. dp[2]: "22" can be split as 2|2 or 22 → dp[1]+dp[0] = 2
4. dp[3]: "226" can be 22|6 or 2|26 → dp[2]+dp[1] = **3**

The 3 decodings: B-B-F, B-Z, V-F ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### 1-digit decode
    if (s[i] != '0') dp[i] += dp[i-1]
**WHY check Ⅰ0?** '0' alone can't be decoded.

### 2-digit decode
    if (s[i-1] == '1' || (s[i-1] == '2' && s[i] <= '6'))
        dp[i] += dp[i-2]
**WHY 10-26?** Only valid letter codes.

### Edge Case
"0" at start = 0 ways. "10" = 1 way (J only).

## Time & Space Complexity
- **Time:** O(n) single pass
- **Space:** O(1) with two variables`
    },
];

const DS = "226";
export default function DecodeWays() {
    const [sT, setST] = useState(DS);
    const [sess, setSess] = useState(() => gen(DS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const s = sT.replace(/[^0-9]/g, ""); if (s.length < 1 || s.length > 12) return; setSess(gen(s)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setSess(gen(DS)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Decode Ways" subtitle="1-digit or 2-digit cut · DP · LC #91">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={sT} onChange={setST} onRun={run} onReset={reset} placeholder="226" label="Digits (1–12):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="decode_ways.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <DPViz dp={step.dp} str={step.str} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔓 {sess.result} ways</span></StepInfo>
        </VizLayout>
    );
}
