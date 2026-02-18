import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int numIslands(vector<vector<char>>& grid) {` },
    { id: 1, text: `    int count = 0;` },
    { id: 2, text: `    for (int r = 0; r < m; r++)` },
    { id: 3, text: `      for (int c = 0; c < n; c++)` },
    { id: 4, text: `        if (grid[r][c] == '1') {` },
    { id: 5, text: `            count++;` },
    { id: 6, text: `            dfs(grid, r, c);  // sink island` },
    { id: 7, text: `        }` },
    { id: 8, text: `    return count;` },
    { id: 9, text: `}` },
    { id: 10, text: `void dfs(grid, r, c) {` },
    { id: 11, text: `    if (OOB || grid[r][c]!='1') return;` },
    { id: 12, text: `    grid[r][c] = '0';` },
    { id: 13, text: `    dfs 4 directions;` },
    { id: 14, text: `}` },
];
const PC = { scan: "#8b5cf6", newIsland: "#f59e0b", sink: "#3b82f6", skip: "#64748b", done: "#10b981" };
const PL = { scan: "🔍 SCAN", newIsland: "🏝 NEW ISLAND", sink: "🌊 SINK", skip: "⏭ SKIP", done: "✅ DONE" };
const COLORS = ["#1e293b", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f87171", "#2dd4bf"];

const SAMPLE = [
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

function gen(grid) {
    const g = grid.map(r => [...r]);
    const color = grid.map(r => r.map(() => 0));
    const rows = g.length, cols = g[0].length;
    const steps = []; let cnt = 0, islandCount = 0; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), color: color.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, islandCount }); cnt++; } };

    function dfs(r, c, id) {
        if (cnt >= MAX) return;
        if (r < 0 || r >= rows || c < 0 || c >= cols || g[r][c] !== 1) return;
        g[r][c] = 0; color[r][c] = id;
        snap(12, "sink", { r, c, island: id }, `Sink (${r},${c}) → island #${id}`, r, c);
        dfs(r - 1, c, id); dfs(r + 1, c, id); dfs(r, c - 1, id); dfs(r, c + 1, id);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cnt >= MAX) break;
            if (g[r][c] === 1) {
                islandCount++;
                snap(5, "newIsland", { r, c, count: islandCount }, `🏝 New island #${islandCount} at (${r},${c})`, r, c);
                dfs(r, c, islandCount);
            }
        }
    }
    snap(8, "done", { total: islandCount }, `✅ ${islandCount} islands found`);
    return { steps, total: islandCount };
}

function GridViz({ grid, color, curR, curC, rows, cols }) {
    return (
        <VizCard title="🗺️ Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 36px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((val, c) => {
                    const cid = color[r][c];
                    const bg = cid > 0 ? COLORS[cid % COLORS.length] : val === 1 ? "#475569" : "#0f172a";
                    return (
                        <div key={`${r}-${c}`} style={{
                            width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                            background: bg, border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : "transparent"}`,
                            color: cid > 0 ? "#fff" : val === 1 ? "#94a3b8" : "#334155",
                            transition: "all 0.2s",
                        }}>{cid > 0 ? `#${cid}` : val}</div>
                    );
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count the number of **islands** (connected components of 1s) in a 2D binary grid. Water (0) separates islands.

## Key Insight
Scan the grid. Each time you find a new unvisited 1, it's a new island. Use **DFS** to "sink" (mark) the entire island so you don't count it again.

## Mental Model
1. islandCount = 0
2. For each cell: if it's 1, increment count and DFS to sink the whole island
3. DFS marks all connected 1s as 0`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. Scan grid left-to-right, top-to-bottom
2. Find a 1? → New island! count++
3. DFS from that cell: mark it 0, recurse into 4 neighbors
4. Continue scanning (all cells of this island are now 0)
5. Next 1 found = another island

## Why Sink Cells?
Setting grid[r][c] = 0 acts as "visited" marking without extra space.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
count = 0
for each cell (r,c):
  if grid[r][c] == '1':
    count++
    dfs(r, c)  // sink entire island

dfs(r, c):
  if OOB or grid[r][c] != '1': return
  grid[r][c] = '0'
  dfs(4 directions)
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** |
| Space | **O(m × n)** worst-case recursion |`
    }
];

export default function NumberOfIslands() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Number of Islands" subtitle="DFS to sink each island · LC #200">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>4×5 grid · 1=land, 0=water</span>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="number_of_islands.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} color={step.color} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VizCard title="🏝 Islands"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", textAlign: "center" }}>{step.islandCount}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🏔 {sess.total} islands</span></StepInfo>
        </VizLayout>
    );
}
