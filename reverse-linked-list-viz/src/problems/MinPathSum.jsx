import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int minPathSum(vector<vector<int>>& grid) {` },
    { id: 1, text: `    int m = grid.size(), n = grid[0].size();` },
    { id: 2, text: `    vector<vector<int>> dp(m, vector<int>(n, 0));` },
    { id: 3, text: `    dp[0][0] = grid[0][0];` },
    { id: 4, text: `    for first row: dp[0][j] = dp[0][j-1] + grid[0][j];` },
    { id: 5, text: `    for first col: dp[i][0] = dp[i-1][0] + grid[i][0];` },
    { id: 6, text: `    for (int i = 1; i < m; i++)` },
    { id: 7, text: `      for (int j = 1; j < n; j++)` },
    { id: 8, text: `        dp[i][j] = grid[i][j] +` },
    { id: 9, text: `            min(dp[i-1][j], dp[i][j-1]);` },
    { id: 10, text: `    return dp[m-1][n-1];` },
    { id: 11, text: `}` },
];
const PC = { init: "#8b5cf6", fill: "#3b82f6", done: "#10b981" };
const PL = { init: "🔧 INIT", fill: "📊 FILL", done: "✅ DONE" };

const SAMPLE = [[1, 3, 1], [1, 5, 1], [4, 2, 1]];

function gen(grid) {
    const m = grid.length, n = grid[0].length;
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, msg, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg, dp: dp.map(r => [...r]), grid: grid.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows: m, cols: n }); cnt++; } };

    dp[0][0] = grid[0][0];
    for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
    for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
    snap(5, "init", {}, `Init first row & col sums`);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            const from = dp[i - 1][j] <= dp[i][j - 1] ? "↑ above" : "← left";
            snap(8, "fill", { i, j, "grid": grid[i][j], "min": Math.min(dp[i - 1][j], dp[i][j - 1]), "dp[i][j]": dp[i][j], from }, `dp[${i}][${j}] = ${grid[i][j]}+min(${dp[i - 1][j]},${dp[i][j - 1]}) = ${dp[i][j]}`, i, j);
        }
    }
    snap(10, "done", { result: dp[m - 1][n - 1] }, `✅ Min path sum: ${dp[m - 1][n - 1]}`);
    return { steps, result: dp[m - 1][n - 1] };
}

function DPGrid({ dp, grid, curR, curC, rows, cols }) {
    return (
        <VizCard title="📊 DP Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 50px)`, gap: "3px", justifyContent: "center" }}>
                {dp.map((row, r) => row.map((v, c) => (
                    <div key={`${r}-${c}`} style={{
                        width: "50px", height: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                        background: v > 0 ? "#1e3a5f" : "#0f172a",
                        border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : "#334155"}`,
                        color: "#93c5fd",
                    }}>
                        <span>{v || "·"}</span>
                        <span style={{ fontSize: "0.4rem", color: "#64748b" }}>({grid[r][c]})</span>
                    </div>
                )))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find path from top-left to bottom-right with minimum sum. Can only move **right** or **down**.

## How to Think About It
Each cell's min path sum = its value + min(from above, from left).

### Why only right and down?
Guarantees no cycles. Every path has exactly (m+n-2) moves.

**Think of it like:** Finding the cheapest route through a cost grid, where you can only go right or down.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## DP Table

    dp[i][j] = min path sum to reach (i,j)
    dp[0][0] = grid[0][0]
    First row: dp[0][j] = dp[0][j-1] + grid[0][j]
    First col: dp[i][0] = dp[i-1][0] + grid[i][0]
    Rest: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])

Answer: dp[m-1][n-1] ✅

Can modify grid in-place for O(1) extra space!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### First Row & Column
Only one direction possible:
- First row: can only come from left
- First col: can only come from above

### General Case
    dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
**WHY min?** We want the cheapest path.

### In-Place Optimization
Modify grid directly: grid[i][j] += min(grid[i-1][j], grid[i][j-1])

## Time & Space Complexity
- **Time:** O(m × n) single pass
- **Space:** O(1) if modifying in-place`
    },
];

export default function MinPathSum() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Minimum Path Sum" subtitle="DP grid · Choose min(up, left) · LC #64">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="min_path_sum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <DPGrid dp={step.dp} grid={step.grid} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📊 Min sum: {sess.result}</span></StepInfo>
        </VizLayout>
    );
}
