import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int orangesRotting(vector<vector<int>>& grid) {` },
    { id: 1, text: `    queue<pair<int,int>> q;` },
    { id: 2, text: `    int fresh = 0;` },
    { id: 3, text: `    // Add all rotten oranges to queue` },
    { id: 4, text: `    for each cell: if rotten, q.push; if fresh, fresh++;` },
    { id: 5, text: `    int minutes = 0;` },
    { id: 6, text: `    while (!q.empty() && fresh > 0) {` },
    { id: 7, text: `        int sz = q.size();` },
    { id: 8, text: `        for (int i = 0; i < sz; i++) {` },
    { id: 9, text: `            auto [r,c] = q.front(); q.pop();` },
    { id: 10, text: `            // rot 4 neighbors` },
    { id: 11, text: `            if (fresh neighbor) { rot it; fresh--; }` },
    { id: 12, text: `        }` },
    { id: 13, text: `        minutes++;` },
    { id: 14, text: `    }` },
    { id: 15, text: `    return fresh == 0 ? minutes : -1;` },
    { id: 16, text: `}` },
];
const PC = { init: "#8b5cf6", rot: "#f59e0b", spread: "#f87171", done: "#10b981" };
const PL = { init: "🔧 INIT", rot: "🍊 ROT", spread: "💀 SPREAD", done: "✅ DONE" };

const SAMPLE = [[2, 1, 1], [1, 1, 0], [0, 1, 1]];
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function gen(grid) {
    const g = grid.map(r => [...r]);
    const rows = g.length, cols = g[0].length;
    const steps = []; let fresh = 0, minutes = 0; const MAX = 200;
    let queue = [];
    let cnt = 0;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, minutes, fresh }); cnt++; } };

    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            if (g[r][c] === 2) queue.push([r, c]);
            if (g[r][c] === 1) fresh++;
        }
    snap(4, "init", { fresh, rotten: queue.length }, `${queue.length} rotten, ${fresh} fresh`);

    while (queue.length > 0 && fresh > 0) {
        const sz = queue.length;
        const next = [];
        for (let i = 0; i < sz; i++) {
            const [r, c] = queue[i];
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === 1) {
                    g[nr][nc] = 2; fresh--;
                    next.push([nr, nc]);
                    snap(11, "spread", { r: nr, c: nc, minute: minutes + 1 }, `🍊 (${nr},${nc}) rots at min ${minutes + 1}`, nr, nc);
                }
            }
        }
        queue = next; minutes++;
        snap(13, "rot", { minutes, fresh }, `Minute ${minutes}: ${fresh} fresh remaining`);
    }
    const result = fresh === 0 ? minutes : -1;
    snap(15, "done", { result }, result === -1 ? `❌ Impossible: ${fresh} fresh remain` : `✅ All rotted in ${minutes} minutes`);
    return { steps, result };
}

function OrangeGrid({ grid, curR, curC, rows, cols }) {
    const colorMap = { 0: "#0f172a", 1: "#f59e0b", 2: "#7f1d1d" };
    const emoji = { 0: "", 1: "🍊", 2: "🤢" };
    return (
        <VizCard title="🍊 Orange Grid">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 44px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((v, c) => (
                    <div key={`${r}-${c}`} style={{
                        width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "8px", fontSize: "1.1rem",
                        background: colorMap[v],
                        border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : v === 2 ? "#f87171" : v === 1 ? "#f59e0b" : "#1e293b"}`,
                    }}>{emoji[v]}</div>
                )))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a grid of oranges (0=empty, 1=fresh, 2=rotten), each minute rotten oranges infect adjacent fresh ones. Return minutes until all fresh are rotten, or -1 if impossible.

## Key Insight
**Multi-source BFS!** Start BFS from ALL rotten oranges simultaneously. Each BFS level = 1 minute of rotting.

## Mental Model
1. Enqueue all initially rotten oranges
2. BFS level-by-level: each level = 1 minute
3. Process all oranges at current level, enqueue newly rotten
4. After BFS: if any fresh remain → return -1`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. Find all rotten oranges, add to queue
2. Count total fresh oranges
3. BFS: for each rotten, rot all 4 neighbors that are fresh
4. Each complete BFS level = +1 minute
5. If freshCount == 0 at end → return minutes, else -1

## Why Multi-Source BFS?
All rotten oranges spread simultaneously, not sequentially. BFS from multiple sources handles this naturally.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
queue = all rotten cells, fresh = count of 1s
min = 0
while queue not empty:
  process entire level
  for each cell: rot 4 neighbors, fresh--
  min++ if any rotted
return fresh == 0 ? min : -1
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** — each cell processed once |
| Space | **O(m × n)** — queue size |`
    }
];

export default function RottingOranges() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Rotting Oranges" subtitle="BFS level-by-level · LC #994">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="rotting_oranges.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <OrangeGrid grid={step.grid} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VizCard title="⏱ Minutes"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#f59e0b", textAlign: "center" }}>{step.minutes}</div></VizCard>
                    <VizCard title="🍊 Fresh"><div style={{ fontSize: "1.5rem", fontWeight: 900, color: step.fresh > 0 ? "#f87171" : "#10b981", textAlign: "center" }}>{step.fresh}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.result >= 0 ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.result >= 0 ? `⏱ ${sess.result} min` : "❌ Impossible"}</span></StepInfo>
        </VizLayout>
    );
}
