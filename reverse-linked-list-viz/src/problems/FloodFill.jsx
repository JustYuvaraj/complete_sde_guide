import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void floodFill(vector<vector<int>>& img,` },
    { id: 1, text: `    int r, int c, int oldColor, int newColor) {` },
    { id: 2, text: `    if (r<0||r>=m||c<0||c>=n) return;` },
    { id: 3, text: `    if (img[r][c] != oldColor) return;` },
    { id: 4, text: `    img[r][c] = newColor;` },
    { id: 5, text: `    floodFill(img, r-1, c, ...); // up` },
    { id: 6, text: `    floodFill(img, r+1, c, ...); // down` },
    { id: 7, text: `    floodFill(img, r, c-1, ...); // left` },
    { id: 8, text: `    floodFill(img, r, c+1, ...); // right` },
    { id: 9, text: `}` },
];
const PC = { visit: "#3b82f6", fill: "#10b981", oob: "#f87171", diff: "#f59e0b", done: "#10b981" };
const PL = { visit: "🔍 VISIT", fill: "🎨 FILL", oob: "🚫 OUT", diff: "⏭ DIFF COLOR", done: "✅ DONE" };

const SAMPLE = [[1, 1, 1], [1, 1, 0], [1, 0, 1]];

function gen(grid, sr, sc, newColor) {
    const g = grid.map(r => [...r]);
    const rows = g.length, cols = g[0].length;
    const oldColor = g[sr][sc];
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols }); cnt++; } };

    if (oldColor === newColor) {
        snap(0, "done", {}, `Old color = new color, nothing to do`);
        return { steps };
    }

    function fill(r, c) {
        if (cnt >= MAX) return;
        if (r < 0 || r >= rows || c < 0 || c >= cols) {
            snap(2, "oob", { r, c }, `(${r},${c}) out of bounds`);
            return;
        }
        if (g[r][c] !== oldColor) {
            snap(3, "diff", { r, c, "cell": g[r][c], oldColor }, `(${r},${c})=${g[r][c]} ≠ oldColor=${oldColor}`);
            return;
        }
        g[r][c] = newColor;
        snap(4, "fill", { r, c }, `🎨 Fill (${r},${c}) → ${newColor}`, r, c);
        fill(r - 1, c);
        fill(r + 1, c);
        fill(r, c - 1);
        fill(r, c + 1);
    }
    fill(sr, sc);
    snap(0, "done", {}, `✅ Flood fill complete`);
    return { steps };
}

function GridViz({ grid, curR, curC, rows, cols }) {
    const { theme } = useTheme();
    const colors = ["#1e293b", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
    return (
        <VizCard title="🎨 Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 36px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((val, c) => (
                    <div key={`${r}-${c}`} style={{
                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700,
                        background: colors[val % colors.length] || theme.cardBg,
                        border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : "transparent"}`,
                        color: "#fff", transition: "all 0.2s",
                    }}>{val}</div>
                )))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a 2D grid, a starting cell (sr, sc), and a new color, change the starting cell and all **connected cells** of the same original color to the new color.

## Key Insight
This is a classic **flood fill** — like the paint bucket tool. From the start cell, spread in 4 directions (up/down/left/right) to any neighbor with the same original color.

## Mental Model
1. Record the original color at (sr, sc)
2. If original == newColor, nothing to do
3. DFS/BFS from (sr, sc), painting each visited cell
4. Only visit cells that match the original color`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. Start at (sr, sc), note its color
2. Paint (sr, sc) with newColor
3. Recurse into 4 neighbors
4. Each neighbor: if in-bounds AND matches original color → paint and recurse
5. If out-of-bounds or different color → return (base case)

## Why DFS Works
Each cell is visited at most once (painted immediately, so it won't match originalColor again). This naturally prevents revisiting.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
floodFill(grid, sr, sc, newColor):
  origColor = grid[sr][sc]
  if origColor == newColor: return
  dfs(sr, sc)

dfs(r, c):
  if out of bounds or grid[r][c] != origColor: return
  grid[r][c] = newColor
  dfs(r±1, c), dfs(r, c±1)
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** — visit each cell at most once |
| Space | **O(m × n)** — recursion stack in worst case |`
    }
];

export default function FloodFill() {
    const [sess, setSess] = useState(() => gen(SAMPLE, 1, 1, 2));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const reset = () => { setSess(gen(SAMPLE, 1, 1, 2)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Flood Fill" subtitle="4-direction DFS from start cell · LC #733">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>Start: (1,1) · Fill color: 2</span>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="flood_fill.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎨 Flood Fill</span></StepInfo>
        </VizLayout>
    );
}
