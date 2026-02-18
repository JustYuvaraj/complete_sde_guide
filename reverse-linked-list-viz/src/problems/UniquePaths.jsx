import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int uniquePaths(int m, int n) {` },
    { id: 1, text: `    vector<vector<int>> dp(m, vector<int>(n, 0));` },
    { id: 2, text: `    // First row & col = 1` },
    { id: 3, text: `    for (int i = 0; i < m; i++) dp[i][0] = 1;` },
    { id: 4, text: `    for (int j = 0; j < n; j++) dp[0][j] = 1;` },
    { id: 5, text: `    for (int i = 1; i < m; i++)` },
    { id: 6, text: `        for (int j = 1; j < n; j++)` },
    { id: 7, text: `            dp[i][j] = dp[i-1][j] + dp[i][j-1];` },
    { id: 8, text: `    return dp[m-1][n-1];` },
    { id: 9, text: `}` },
];
const PC = { init: "#8b5cf6", fill: "#3b82f6", done: "#10b981" };
const PL = { init: "🔧 INIT", fill: "📊 FILL", done: "✅ DONE" };

function gen(m, n) {
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, msg, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg, dp: dp.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows: m, cols: n }); cnt++; } };

    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    snap(4, "init", {}, `Init row 0 & col 0 = 1`);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            snap(7, "fill", { i, j, "dp[i-1][j]": dp[i - 1][j], "dp[i][j-1]": dp[i][j - 1], "dp[i][j]": dp[i][j] }, `dp[${i}][${j}] = ${dp[i - 1][j]} + ${dp[i][j - 1]} = ${dp[i][j]}`, i, j);
        }
    }
    snap(8, "done", { result: dp[m - 1][n - 1] }, `✅ ${dp[m - 1][n - 1]} unique paths`);
    return { steps, result: dp[m - 1][n - 1] };
}

function DPGrid({ dp, curR, curC, rows, cols }) {
    return (
        <VizCard title="📊 DP Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 44px)`, gap: "3px", justifyContent: "center" }}>
                {dp.map((row, r) => row.map((v, c) => (
                    <div key={`${r}-${c}`} style={{
                        width: "44px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                        background: (r === 0 || c === 0) ? "#1e293b" : v > 0 ? "#1e3a5f" : "#0f172a",
                        border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : v > 0 ? "#334155" : "#1e293b"}`,
                        color: v > 0 ? "#93c5fd" : "#334155",
                    }}>{v || "·"}</div>
                )))}
            </div>
        </VizCard>
    );
}

const DM = 3, DN = 7;
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count the number of unique paths from top-left to bottom-right in an m×n grid. You can only move **right** or **down**.

## Key Insight
dp[r][c] = number of ways to reach cell (r,c). Each cell can only come from above or from left.

## Mental Model
1. First row: all 1s (only one way → go right)
2. First column: all 1s (only one way → go down)
3. dp[r][c] = dp[r-1][c] + dp[r][c-1]
4. Answer = dp[m-1][n-1]`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace (3×3)
| 1 | 1 | 1 |
| 1 | 2 | 3 |
| 1 | 3 | 6 |

Each cell = sum of cell above + cell left. Answer: **6 paths**.

## Why It Works
Every path goes through exactly (m-1) down moves and (n-1) right moves. dp[r][c] counts all orderings of moves to reach that cell.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
dp[0][*] = 1, dp[*][0] = 1
for r = 1 to m-1:
  for c = 1 to n-1:
    dp[r][c] = dp[r-1][c] + dp[r][c-1]
return dp[m-1][n-1]
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** |
| Space | **O(m × n)** (can optimize to O(n)) |

## Math Alternative
Answer = C(m+n-2, m-1) — choose which moves are "down".`
    }
];

export default function UniquePaths() {
    const { theme } = useTheme();
    const [mT, setMT] = useState(String(DM)), [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DM, DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const run = () => { const m = parseInt(mT), n = parseInt(nT); if (isNaN(m) || isNaN(n) || m < 1 || m > 8 || n < 1 || n > 8) return; setSess(gen(m, n)); setIdx(0); setPlaying(false); };
    const reset = () => { setMT(String(DM)); setNT(String(DN)); setSess(gen(DM, DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Unique Paths" subtitle="DP grid · Right & Down · LC #62">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>m:</span>
                <input value={mT} onChange={e => setMT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>n:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontWeight: "600", cursor: "pointer" }}>↺</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="unique_paths.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <DPGrid dp={step.dp} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🛤 {sess.result} paths</span></StepInfo>
        </VizLayout>
    );
}
