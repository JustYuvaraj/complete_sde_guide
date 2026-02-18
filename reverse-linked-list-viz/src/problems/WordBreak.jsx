import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool wordBreak(string s, vector<string>& dict) {` },
    { id: 1, text: `    int n = s.size();` },
    { id: 2, text: `    vector<bool> dp(n+1, false);` },
    { id: 3, text: `    dp[0] = true;` },
    { id: 4, text: `    for (int i = 1; i <= n; i++) {` },
    { id: 5, text: `        for (int j = 0; j < i; j++) {` },
    { id: 6, text: `            string sub = s.substr(j, i-j);` },
    { id: 7, text: `            if (dp[j] && dict.count(sub)) {` },
    { id: 8, text: `                dp[i] = true; break;` },
    { id: 9, text: `            }` },
    { id: 10, text: `        }` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return dp[n];` },
    { id: 13, text: `}` },
];
const PC = { init: "#8b5cf6", check: "#f59e0b", found: "#10b981", miss: "#f87171", done: "#10b981" };
const PL = { init: "🔧 INIT", check: "🔍 CHECK", found: "✅ MATCH", miss: "✗ NO MATCH", done: "✅ DONE" };

function gen(s, dict) {
    const n = s.length, steps = [], dictSet = new Set(dict);
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    let cnt = 0; const MAX = 300;
    const snap = (cl, ph, v, m, hlStart, hlEnd) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, dp: [...dp], str: s, hlStart: hlStart ?? -1, hlEnd: hlEnd ?? -1 }); cnt++; } };

    snap(3, "init", { "dp[0]": true, dict: `[${dict.join(",")}]` }, `Initialize dp[0]=true, dict={${dict.join(",")}}`, -1, -1);

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (cnt >= MAX) break;
            const sub = s.substring(j, i);
            if (dp[j] && dictSet.has(sub)) {
                dp[i] = true;
                snap(8, "found", { i, j, sub: `"${sub}"`, "dp[j]": true }, `dp[${j}]=T & "${sub}"∈dict → dp[${i}]=true`, j, i);
                break;
            } else {
                const reason = !dp[j] ? `dp[${j}]=F` : `"${sub}"∉dict`;
                snap(7, "miss", { i, j, sub: `"${sub}"`, reason }, `${reason}`, j, i);
            }
        }
    }
    snap(12, "done", { result: dp[n] }, `✅ wordBreak = ${dp[n]}`);
    return { steps, result: dp[n] };
}

function StringHighlight({ str, hlStart, hlEnd }) {
    const { theme } = useTheme();
    return (
        <VizCard title="🔤 String">
            <div style={{ display: "flex", gap: "2px", minHeight: "32px" }}>
                {str.split("").map((ch, i) => {
                    const hl = i >= hlStart && i < hlEnd;
                    return <span key={i} style={{ width: "26px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 700, background: hl ? "#1e3a5f" : theme.cardBg, border: `1.5px solid ${hl ? "#3b82f6" : theme.cardBorder}`, color: hl ? "#93c5fd" : theme.text }}>{ch}</span>;
                })}
            </div>
        </VizCard>
    );
}

function DPViz({ dp, str }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📊 DP Array">
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {dp.map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <div style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.6rem", fontWeight: 700, background: v ? "#052e16" : theme.cardBg, border: `1.5px solid ${v ? "#10b981" : theme.cardBorder}`, color: v ? "#4ade80" : theme.textDim }}>{v ? "T" : "F"}</div>
                        <span style={{ fontSize: "0.45rem", color: theme.textMuted }}>{i}</span>
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const DS = "leetcode", DD = ["leet", "code"];
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a string s and a dictionary of words, can s be segmented into a space-separated sequence of dictionary words?

## Key Insight
**DP**: dp[i] = true if s[0..i-1] can be segmented. For each position i, check all words: if dp[i - word.len] is true AND s ends with that word at position i → dp[i] = true.

## Mental Model
1. dp[0] = true (empty string is valid)
2. For i = 1 to n: try every word in dictionary
3. If word fits at position i and dp[i - word.length] is true → dp[i] = true
4. Answer = dp[n]`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
s = "leetcode", dict = ["leet", "code"]
1. dp[0] = true
2. i=4: s[0..3] = "leet" ∈ dict, dp[0] = true → dp[4] = true
3. i=8: s[4..7] = "code" ∈ dict, dp[4] = true → dp[8] = true
4. Answer: dp[8] = true ✔

## Why DP?
Brute-force tries all segmentations (exponential). DP caches whether each prefix is breakable, giving O(n²) or O(n × W).`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
dp[0] = true
for i = 1 to n:
  for each word in dict:
    if i >= word.len &&
       dp[i - word.len] &&
       s[i-word.len..i] == word:
      dp[i] = true; break
return dp[n]
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(n × m × k)** — n=len, m=words, k=avg word len |
| Space | **O(n)** — dp array |`
    }
];

export default function WordBreak() {
    const { theme } = useTheme();
    const [sT, setST] = useState(DS), [dT, setDT] = useState(DD.join(","));
    const [sess, setSess] = useState(() => gen(DS, DD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const s = sT.trim(); const d = dT.split(/[\s,]+/).filter(w => w.length > 0); if (!s || s.length > 12 || d.length < 1) return; setSess(gen(s, d)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setDT(DD.join(",")); setSess(gen(DS, DD)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Word Break" subtitle="DP · Dictionary matching · LC #139">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>String:</span>
                <input value={sT} onChange={e => setST(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Dict:</span>
                <input value={dT} onChange={e => setDT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontWeight: "600", cursor: "pointer" }}>↺</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="word_break.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <StringHighlight str={step.str} hlStart={step.hlStart} hlEnd={step.hlEnd} />
                    <DPViz dp={step.dp} str={step.str} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.result ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.result ? "✅ Breakable" : "❌ Not breakable"}</span></StepInfo>
        </VizLayout>
    );
}
