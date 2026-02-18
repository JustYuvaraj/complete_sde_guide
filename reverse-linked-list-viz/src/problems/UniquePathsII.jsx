import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int uniquePathsWithObstacles(vector<vector<int>>& g) {` },
    { id: 1, text: `    if (g[0][0] == 1) return 0;` },
    { id: 2, text: `    int m = g.size(), n = g[0].size();` },
    { id: 3, text: `    vector<vector<int>> dp(m, vector<int>(n, 0));` },
    { id: 4, text: `    dp[0][0] = 1;` },
    { id: 5, text: `    for first row: dp[0][j] = g blocked ? 0 : dp[0][j-1];` },
    { id: 6, text: `    for first col: dp[i][0] = g blocked ? 0 : dp[i-1][0];` },
    { id: 7, text: `    for (int i = 1; i < m; i++)` },
    { id: 8, text: `      for (int j = 1; j < n; j++)` },
    { id: 9, text: `        dp[i][j] = g[i][j]==1 ? 0 : dp[i-1][j]+dp[i][j-1];` },
    { id: 10, text: `    return dp[m-1][n-1];` },
    { id: 11, text: `}` },
];
const PC = { init: "#8b5cf6", block: "#f87171", fill: "#3b82f6", done: "#10b981" };
const PL = { init: "🔧 INIT", block: "🚫 BLOCKED", fill: "📊 FILL", done: "✅ DONE" };

const SAMPLE = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];

function gen(grid) {
    const m = grid.length, n = grid[0].length;
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, msg, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg, dp: dp.map(r => [...r]), grid: grid.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows: m, cols: n }); cnt++; } };

    if (grid[0][0] === 1) { snap(1, "block", {}, `Start blocked → 0 paths`); return { steps, result: 0 }; }
    dp[0][0] = 1;
    for (let j = 1; j < n; j++) dp[0][j] = grid[0][j] === 1 ? 0 : dp[0][j - 1];
    for (let i = 1; i < m; i++) dp[i][0] = grid[i][0] === 1 ? 0 : dp[i - 1][0];
    snap(6, "init", {}, `Init first row & col with obstacles`);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (grid[i][j] === 1) { dp[i][j] = 0; snap(9, "block", { i, j }, `(${i},${j}) obstacle → 0`, i, j); }
            else { dp[i][j] = dp[i - 1][j] + dp[i][j - 1]; snap(9, "fill", { i, j, "dp[i][j]": dp[i][j] }, `dp[${i}][${j}] = ${dp[i - 1][j]}+${dp[i][j - 1]} = ${dp[i][j]}`, i, j); }
        }
    }
    snap(10, "done", { result: dp[m - 1][n - 1] }, `✅ ${dp[m - 1][n - 1]} paths`);
    return { steps, result: dp[m - 1][n - 1] };
}

function DPGrid({ dp, grid, curR, curC, rows, cols }) {
    return (
        <VizCard title="📊 DP Grid (obstacles in red)">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 44px)`, gap: "3px", justifyContent: "center" }}>
                {dp.map((row, r) => row.map((v, c) => {
                    const ob = grid[r][c] === 1;
                    return (<div key={`${r}-${c}`} style={{ width: "44px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: ob ? "#7f1d1d" : v > 0 ? "#1e3a5f" : "#0f172a", border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : ob ? "#f87171" : "#334155"}`, color: ob ? "#fca5a5" : v > 0 ? "#93c5fd" : "#334155" }}>{ob ? "🚫" : v || "·"}</div>);
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Same as Unique Paths, but with **obstacles** (1s in the grid). You cannot step on obstacles.

## Key Insight
Same DP: dp[r][c] = dp[r-1][c] + dp[r][c-1], but **if cell has obstacle, dp[r][c] = 0**.

## Mental Model
1. If start or end has obstacle → 0 paths
2. dp[0][0] = 1 (if no obstacle)
3. First row/col: 1s until you hit an obstacle, then 0s after
4. dp[r][c] = 0 if obstacle, else dp[r-1][c] + dp[r][c-1]`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
| 1 | 1 | 1 |
| 1 | **0** | 1 |
| 1 | 1 | 2 |

Obstacle at (1,1) blocks that cell. Paths route around it. Answer: **2 paths**.

## Key Difference from Unique Paths
The obstacle "blocks" propagation. Any cell with an obstacle has 0 ways, cutting off paths that would go through it.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
if grid[0][0] == 1: return 0
dp[0][0] = 1
fill first row/col (stop at obstacle)
for r,c:
  if obstacle: dp[r][c] = 0
  else: dp[r][c] = dp[r-1][c] + dp[r][c-1]
return dp[m-1][n-1]
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** |
| Space | **O(m × n)** (can optimize to O(n)) |`
    }
];

export default function UniquePathsII() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Unique Paths II" subtitle="DP with obstacles · LC #63">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>3×3 grid with obstacle</span>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="unique_paths_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <DPGrid dp={step.dp} grid={step.grid} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🛤 {sess.result} paths</span></StepInfo>
        </VizLayout>
    );
}
