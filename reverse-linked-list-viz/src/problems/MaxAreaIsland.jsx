import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int maxAreaOfIsland(vector<vector<int>>& grid) {` },
    { id: 1, text: `    int maxArea = 0;` },
    { id: 2, text: `    for (int r = 0; r < m; r++)` },
    { id: 3, text: `      for (int c = 0; c < n; c++)` },
    { id: 4, text: `        if (grid[r][c] == 1)` },
    { id: 5, text: `            maxArea = max(maxArea, dfs(r,c));` },
    { id: 6, text: `    return maxArea;` },
    { id: 7, text: `}` },
    { id: 8, text: `int dfs(grid, r, c) {` },
    { id: 9, text: `    if (OOB || grid[r][c] != 1) return 0;` },
    { id: 10, text: `    grid[r][c] = 0;  // mark visited` },
    { id: 11, text: `    return 1 + dfs(4 dirs);` },
    { id: 12, text: `}` },
];
const PC = { scan: "#8b5cf6", newIsland: "#f59e0b", sink: "#3b82f6", done: "#10b981" };
const PL = { scan: "🔍 SCAN", newIsland: "🏝 NEW", sink: "🌊 SINK", done: "✅ DONE" };
const COLORS = ["#1e293b", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f87171", "#2dd4bf"];

const SAMPLE = [[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]];

function gen(grid) {
    const g = grid.map(r => [...r]);
    const color = grid.map(r => r.map(() => 0));
    const rows = g.length, cols = g[0].length;
    const steps = []; let cnt = 0, islandId = 0, maxArea = 0; const MAX = 250;
    const areas = {};
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), color: color.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, maxArea }); cnt++; } };

    function dfs(r, c, id) {
        if (cnt >= MAX) return 0;
        if (r < 0 || r >= rows || c < 0 || c >= cols || g[r][c] !== 1) return 0;
        g[r][c] = 0; color[r][c] = id;
        snap(10, "sink", { r, c, island: id }, `Sink (${r},${c}) island #${id}`, r, c);
        return 1 + dfs(r - 1, c, id) + dfs(r + 1, c, id) + dfs(r, c - 1, id) + dfs(r, c + 1, id);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cnt >= MAX) break;
            if (g[r][c] === 1) {
                islandId++;
                const area = dfs(r, c, islandId);
                if (area > maxArea) maxArea = area;
                snap(5, "newIsland", { r, c, island: islandId, area, maxArea }, `🏝 Island #${islandId}: area=${area}, max=${maxArea}`, r, c);
            }
        }
    }
    snap(6, "done", { maxArea }, `✅ Max area: ${maxArea}`);
    return { steps, result: maxArea };
}

function GridViz({ grid, color, curR, curC, rows, cols }) {
    return (
        <VizCard title="🗺️ Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 28px)`, gap: "2px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((v, c) => {
                    const cid = color[r][c];
                    return (<div key={`${r}-${c}`} style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.5rem", fontWeight: 700, background: cid > 0 ? COLORS[cid % COLORS.length] : "#0f172a", border: `1.5px solid ${(r === curR && c === curC) ? "#fbbf24" : cid > 0 ? "transparent" : "#1e293b"}`, color: cid > 0 ? "#fff" : "#334155" }}>{cid > 0 ? cid : ""}</div>);
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the largest island (connected component of 1s) in a binary grid. Return its area (number of cells).

## Key Insight
Use **DFS** from each unvisited land cell. Each DFS explores the entire island and returns its area. Track the maximum.

## Mental Model
1. Scan the grid left-to-right, top-to-bottom
2. When you find a 1, start DFS to explore the full island
3. Mark visited cells (set to 0) to avoid revisiting
4. Count cells visited = island area
5. Update global max`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. Find first unvisited 1 → start DFS
2. DFS visits cell, marks it as 0, returns 1 + sum of 4 neighbors
3. Each neighbor: if in-bounds AND ==1 → recurse
4. When DFS returns, we have the full island area
5. Compare with current max, continue scanning

## Why Mark Cells?
Setting visited cells to 0 ensures each cell is counted exactly once and prevents infinite loops.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
maxArea = 0
for each cell (r,c):
  if grid[r][c] == 1:
    maxArea = max(maxArea, dfs(r,c))

dfs(r, c):
  if out of bounds or grid[r][c] == 0: return 0
  grid[r][c] = 0  // mark visited
  return 1 + dfs(r-1,c) + dfs(r+1,c) + dfs(r,c-1) + dfs(r,c+1)
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** — each cell visited once |
| Space | **O(m × n)** — recursion stack worst case |`
    }
];

export default function MaxAreaIsland() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 300);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Max Area of Island" subtitle="DFS to compute each island area · LC #695">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="max_area_island.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} color={step.color} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VizCard title="🏝 Max Area"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", textAlign: "center" }}>{step.maxArea}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🏝 Max: {sess.result}</span></StepInfo>
        </VizLayout>
    );
}
