import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void solve(vector<vector<char>>& board) {` },
    { id: 1, text: `    // Mark border-connected 'O's as safe` },
    { id: 2, text: `    for border cells:` },
    { id: 3, text: `        if (board[r][c] == 'O') dfs(r,c,'S');` },
    { id: 4, text: `    // Flip remaining O→X, S→O` },
    { id: 5, text: `    for all cells:` },
    { id: 6, text: `        if (board[r][c]=='O') board[r][c]='X';` },
    { id: 7, text: `        if (board[r][c]=='S') board[r][c]='O';` },
    { id: 8, text: `}` },
];
const PC = { border: "#f59e0b", safe: "#3b82f6", capture: "#f87171", restore: "#10b981", done: "#10b981" };
const PL = { border: "🔲 BORDER", safe: "🛡 SAFE", capture: "❌ CAPTURE", restore: "♻ RESTORE", done: "✅ DONE" };

const SAMPLE = [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]];

function gen(board) {
    const g = board.map(r => [...r]);
    const rows = g.length, cols = g[0].length;
    const steps = []; let cnt = 0; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols }); cnt++; } };

    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || g[r][c] !== "O") return;
        g[r][c] = "S";
        snap(3, "safe", { r, c }, `(${r},${c}) border-connected → Safe`, r, c);
        dfs(r - 1, c); dfs(r + 1, c); dfs(r, c - 1); dfs(r, c + 1);
    }

    snap(0, "border", {}, `Phase 1: Mark border-connected O's`);
    for (let r = 0; r < rows; r++) { dfs(r, 0); dfs(r, cols - 1); }
    for (let c = 0; c < cols; c++) { dfs(0, c); dfs(rows - 1, c); }

    snap(5, "capture", {}, `Phase 2: Capture surrounded, restore safe`);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (g[r][c] === "O") { g[r][c] = "X"; snap(6, "capture", { r, c }, `(${r},${c}) O→X captured`, r, c); }
            else if (g[r][c] === "S") { g[r][c] = "O"; snap(7, "restore", { r, c }, `(${r},${c}) S→O restored`, r, c); }
        }
    }
    snap(8, "done", {}, `✅ Surrounded regions captured`);
    return { steps };
}

function GridViz({ grid, curR, curC, rows, cols }) {
    const colorMap = { "X": "#1e293b", "O": "#3b82f6", "S": "#10b981" };
    const textMap = { "X": "#475569", "O": "#93c5fd", "S": "#4ade80" };
    return (
        <VizCard title="🗺️ Board">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 40px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((ch, c) => (
                    <div key={`${r}-${c}`} style={{
                        width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "8px", fontSize: "0.9rem", fontWeight: 800,
                        background: colorMap[ch] || "#0f172a",
                        border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : "transparent"}`,
                        color: textMap[ch] || "#64748b",
                    }}>{ch}</div>
                )))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Capture all 'O' regions that are **completely surrounded** by 'X'. Border-connected O's must NOT be captured.

## Key Insight
Instead of finding surrounded regions, find the **un-surrounded** ones! DFS from every border 'O', mark them safe. Everything else gets captured.

## Mental Model
1. DFS from all border O's → mark as 'S' (safe)
2. Scan grid: remaining O's → flip to X (captured)
3. All S's → flip back to O`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. Walk the 4 borders of the grid
2. For each border 'O': DFS inward, marking connected O's as safe
3. After all border DFS: scan entire grid
4. O → X (it was surrounded, not reachable from border)
5. S → O (restore safe cells)

## Why Border-First?
An O is unsurrounded if and only if it connects to a border O. Finding this is simpler than checking every region for enclosure.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
for each border cell:
  if cell == 'O': dfs(r,c) // mark safe

dfs(r,c):
  if OOB or cell != 'O': return
  cell = 'S'
  dfs(4 dirs)

for each cell:
  'O' → 'X', 'S' → 'O'
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** |
| Space | **O(m × n)** — recursion stack |`
    }
];

export default function SurroundedRegions() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Surrounded Regions" subtitle="Border DFS → Capture → Restore · LC #130">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="surrounded_regions.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔲 Capture</span></StepInfo>
        </VizLayout>
    );
}
