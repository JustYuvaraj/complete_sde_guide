import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<vector<int>> pacificAtlantic(heights) {` },
    { id: 1, text: `    // DFS from Pacific borders (top, left)` },
    { id: 2, text: `    for top row & left col: dfs(pac, r, c);` },
    { id: 3, text: `    // DFS from Atlantic borders (bottom, right)` },
    { id: 4, text: `    for bottom row & right col: dfs(atl, r, c);` },
    { id: 5, text: `    // Collect intersection` },
    { id: 6, text: `    result = cells in both pac & atl;` },
    { id: 7, text: `}` },
    { id: 8, text: `void dfs(set, r, c, prevH) {` },
    { id: 9, text: `    if (OOB || visited || h < prevH) return;` },
    { id: 10, text: `    set.add(r,c); dfs 4 directions;` },
    { id: 11, text: `}` },
];
const PC = { pacific: "#3b82f6", atlantic: "#10b981", both: "#f59e0b", done: "#10b981" };
const PL = { pacific: "🌊 PACIFIC", atlantic: "🌊 ATLANTIC", both: "🎯 BOTH", done: "✅ DONE" };

const SAMPLE = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]];
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function gen(heights) {
    const rows = heights.length, cols = heights[0].length;
    const pac = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const atl = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, pac: pac.map(r => [...r]), atl: atl.map(r => [...r]), heights: heights.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols }); cnt++; } };

    function dfs(ocean, r, c, prevH) {
        if (cnt >= MAX) return;
        if (r < 0 || r >= rows || c < 0 || c >= cols || ocean[r][c] || heights[r][c] < prevH) return;
        ocean[r][c] = true;
        const ph = ocean === pac ? "pacific" : "atlantic";
        snap(10, ph, { r, c, h: heights[r][c] }, `${ph === "pacific" ? "P" : "A"}: (${r},${c})=${heights[r][c]}`, r, c);
        for (const [dr, dc] of dirs) dfs(ocean, r + dr, c + dc, heights[r][c]);
    }

    snap(1, "pacific", {}, `Phase 1: DFS from Pacific borders`);
    for (let c = 0; c < cols; c++) dfs(pac, 0, c, 0);
    for (let r = 0; r < rows; r++) dfs(pac, r, 0, 0);

    snap(3, "atlantic", {}, `Phase 2: DFS from Atlantic borders`);
    for (let c = 0; c < cols; c++) dfs(atl, rows - 1, c, 0);
    for (let r = 0; r < rows; r++) dfs(atl, r, cols - 1, 0);

    const result = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (pac[r][c] && atl[r][c]) result.push([r, c]);

    snap(6, "both", { count: result.length }, `✅ ${result.length} cells reach both oceans`);
    return { steps, result };
}

function OceanGrid({ heights, pac, atl, curR, curC, rows, cols }) {
    return (
        <VizCard title="🌊 Pacific & Atlantic">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 40px)`, gap: "3px", justifyContent: "center" }}>
                {heights.map((row, r) => row.map((h, c) => {
                    const p = pac[r][c], a = atl[r][c], both = p && a;
                    const bg = both ? "#854d0e" : p ? "#1e3a5f" : a ? "#052e16" : "#0f172a";
                    const border = (r === curR && c === curC) ? "#fbbf24" : both ? "#f59e0b" : p ? "#3b82f6" : a ? "#10b981" : "#1e293b";
                    return (<div key={`${r}-${c}`} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, background: bg, border: `2px solid ${border}`, color: both ? "#fbbf24" : p ? "#93c5fd" : a ? "#4ade80" : "#475569" }}>{h}</div>);
                }))}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", justifyContent: "center", fontSize: "0.5rem" }}>
                <span style={{ color: "#3b82f6" }}>■ Pacific</span>
                <span style={{ color: "#10b981" }}>■ Atlantic</span>
                <span style={{ color: "#f59e0b" }}>■ Both</span>
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find all cells that can reach **both** the Pacific (top/left) and Atlantic (bottom/right) oceans. Water flows from higher to equal/lower cells.

## Key Insight
**Reverse the flow!** Instead of checking from every cell, start DFS from ocean borders going **uphill** (to equal/greater neighbors).

## Mental Model
1. DFS from Pacific border (top row + left col) → mark all reachable cells
2. DFS from Atlantic border (bottom row + right col) → mark all reachable cells
3. Answer = cells marked in BOTH sets`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. From each Pacific border cell, DFS to neighbors with height ≥ current
2. From each Atlantic border cell, same DFS
3. Collect cells in both visited sets

## Why Reverse DFS?
Forward: O(m×n) cells, each doing full DFS = O(m²n²)
Reverse: Only 2×(m+n) border starts, each cell visited at most twice = O(m×n)`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
dfs from all Pacific border cells (go uphill)
dfs from all Atlantic border cells (go uphill)
return intersection of both visited sets
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** — each cell visited at most twice |
| Space | **O(m × n)** — two visited matrices |`
    }
];

export default function PacificAtlantic() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 400);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Pacific Atlantic Water Flow" subtitle="Reverse DFS from borders · LC #417">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="pacific_atlantic.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <OceanGrid heights={step.heights} pac={step.pac} atl={step.atl} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🌊 {sess.result.length} cells</span></StepInfo>
        </VizLayout>
    );
}
