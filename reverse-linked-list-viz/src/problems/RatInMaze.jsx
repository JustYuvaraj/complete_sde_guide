import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool ratInMaze(vector<vector<int>>& maze,` },
    { id: 1, text: `    int r, int c, vector<vector<bool>>& vis) {` },
    { id: 2, text: `    if (r==n-1 && c==n-1) return true;` },
    { id: 3, text: `    if (OOB || maze[r][c]==0 || vis[r][c]) return false;` },
    { id: 4, text: `    vis[r][c] = true;` },
    { id: 5, text: `    // Try D, L, R, U` },
    { id: 6, text: `    if (solve(r+1,c)) return true;  // Down` },
    { id: 7, text: `    if (solve(r,c-1)) return true;  // Left` },
    { id: 8, text: `    if (solve(r,c+1)) return true;  // Right` },
    { id: 9, text: `    if (solve(r-1,c)) return true;  // Up` },
    { id: 10, text: `    vis[r][c] = false;  // backtrack` },
    { id: 11, text: `    return false;` },
    { id: 12, text: `}` },
];
const PC = { visit: "#3b82f6", found: "#10b981", blocked: "#f87171", back: "#ec4899", done: "#10b981" };
const PL = { visit: "📌 VISIT", found: "🎯 FOUND", blocked: "🚫 BLOCKED", back: "↩ BACK", done: "✅ DONE" };

const SAMPLE = [[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]];

function gen(maze) {
    const n = maze.length;
    const vis = maze.map(r => r.map(() => false));
    const steps = [], path = []; let cnt = 0, solved = false; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, vis: vis.map(r => [...r]), maze: maze.map(r => [...r]), path: [...path], curR: cr ?? -1, curC: cc ?? -1, n, solved }); cnt++; } };

    function solve(r, c) {
        if (cnt >= MAX || solved) return false;
        if (r < 0 || r >= n || c < 0 || c >= n || maze[r][c] === 0 || vis[r][c]) {
            snap(3, "blocked", { r, c }, `(${r},${c}) blocked`, r, c);
            return false;
        }
        vis[r][c] = true; path.push([r, c]);
        snap(4, "visit", { r, c }, `Visit (${r},${c})`, r, c);
        if (r === n - 1 && c === n - 1) { solved = true; snap(2, "found", {}, `🎯 Reached destination!`, r, c); return true; }
        if (solve(r + 1, c) || solve(r, c - 1) || solve(r, c + 1) || solve(r - 1, c)) return true;
        vis[r][c] = false; path.pop();
        if (cnt < MAX) snap(10, "back", { r, c }, `Backtrack (${r},${c})`, r, c);
        return false;
    }
    solve(0, 0);
    snap(0, "done", { result: solved }, solved ? `✅ Path found!` : `❌ No path`);
    return { steps, result: solved };
}

function MazeViz({ maze, vis, path, curR, curC, n }) {
    const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
    return (
        <VizCard title="🐀 Maze">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 40px)`, gap: "3px", justifyContent: "center" }}>
                {maze.map((row, r) => row.map((v, c) => {
                    const isPath = pathSet.has(`${r},${c}`);
                    const isCur = r === curR && c === curC;
                    const isStart = r === 0 && c === 0, isEnd = r === n - 1 && c === n - 1;
                    return (<div key={`${r}-${c}`} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, background: v === 0 ? "#7f1d1d" : isPath ? "#1e3a5f" : "#0f172a", border: `2px solid ${isCur ? "#fbbf24" : isPath ? "#3b82f6" : v === 0 ? "#f87171" : "#1e293b"}`, color: isStart ? "#fbbf24" : isEnd ? "#10b981" : isPath ? "#93c5fd" : v === 0 ? "#fca5a5" : "#334155" }}>{isStart ? "🐀" : isEnd ? "🧀" : v === 0 ? "█" : isPath ? "•" : "·"}</div>);
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
A rat starts at (0,0) in a maze grid. Find all paths to (n-1,n-1). Can move Down, Left, Right, Up (DLRU). Cells with 0 are blocked.

## How to Think About It
From each cell, try all 4 directions. Mark cells as visited to avoid cycles.

### Direction Order: D, L, R, U
- Try each direction
- If valid (in-bounds, not blocked, not visited) → move and recurse
- If stuck → backtrack, unmark visited, try next direction

**Think of it like:** Exploring a maze by always trying doors in alphabetical order. If dead end, go back and try the next door.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step Example

1. Start at (0,0), try D → (1,0) valid, move
2. At (1,0), try D → (2,0), continue...
3. Eventually reach (n-1,n-1) → **FOUND** path ✅
4. Backtrack to try other directions → find more paths

### Grid Rules
- 1 = open cell (can walk)
- 0 = blocked cell (wall)
- Mark visited to prevent loops

### All paths are returned as direction strings like "DDRR"`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Base Case
    if (r == n-1 && c == n-1) { save path; return; }

### Validity Check
- In bounds: 0 ≤ r,c < n
- Not blocked: maze[r][c] == 1
- Not visited: visited[r][c] == false

### Backtracking
    visited[r][c] = true;
    // try all 4 directions
    visited[r][c] = false;  // undo

## Time & Space Complexity
- **Time:** O(4^(n²)) worst case (highly pruned by walls)
- **Space:** O(n²) for visited array + path string`
    },
];

export default function RatInMaze() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Rat in a Maze" subtitle="Backtracking · DLRU directions · GFG">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="rat_in_maze.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <MazeViz maze={step.maze} vis={step.vis} path={step.path} curR={step.curR} curC={step.curC} n={step.n} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.result ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.result ? "🐀→🧀 Path found" : "🔍 Searching"}</span></StepInfo>
        </VizLayout>
    );
}
