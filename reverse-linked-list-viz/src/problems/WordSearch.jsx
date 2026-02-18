import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool exist(board, word, r, c, idx) {` },
    { id: 1, text: `    if (idx == word.size()) return true;` },
    { id: 2, text: `    if (OOB || board[r][c] != word[idx])` },
    { id: 3, text: `        return false;` },
    { id: 4, text: `    char tmp = board[r][c];` },
    { id: 5, text: `    board[r][c] = '#';  // mark visited` },
    { id: 6, text: `    bool found =` },
    { id: 7, text: `        exist(r-1,c) || exist(r+1,c) ||` },
    { id: 8, text: `        exist(r,c-1) || exist(r,c+1);` },
    { id: 9, text: `    board[r][c] = tmp;  // backtrack` },
    { id: 10, text: `    return found;` },
    { id: 11, text: `}` },
];
const PC = { search: "#8b5cf6", match: "#10b981", mismatch: "#f87171", mark: "#3b82f6", unmark: "#ec4899", found: "#10b981", done: "#10b981" };
const PL = { search: "🔍 SEARCH", match: "✅ MATCH", mismatch: "✗ MISS", mark: "📌 MARK", unmark: "↩ UNMARK", found: "🎯 FOUND", done: "✅ DONE" };

const SAMPLE = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]];
const WORD = "ABCCED";

function gen(board, word) {
    const g = board.map(r => [...r]);
    const rows = g.length, cols = g[0].length;
    const visited = board.map(r => r.map(() => false));
    const steps = []; let cnt = 0, foundResult = false; const MAX = 300;
    const path = [];
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), visited: visited.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, path: [...path], word, foundResult }); cnt++; } };

    function dfs(r, c, idx) {
        if (cnt >= MAX || foundResult) return false;
        if (idx === word.length) { foundResult = true; snap(1, "found", { idx }, `🎯 Word "${word}" found!`); return true; }
        if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] || g[r][c] !== word[idx]) {
            const reason = (r < 0 || r >= rows || c < 0 || c >= cols) ? "OOB" : visited[r][c] ? "visited" : `'${g[r]?.[c]}'≠'${word[idx]}'`;
            snap(2, "mismatch", { r, c, idx, need: word[idx], reason }, `(${r},${c}) ${reason}`, r, c);
            return false;
        }
        visited[r][c] = true; path.push([r, c]);
        snap(5, "mark", { r, c, char: g[r][c], idx, need: word[idx] }, `Match '${g[r][c]}' at (${r},${c}) [${idx}/${word.length}]`, r, c);
        if (dfs(r - 1, c, idx + 1) || dfs(r + 1, c, idx + 1) || dfs(r, c - 1, idx + 1) || dfs(r, c + 1, idx + 1)) return true;
        visited[r][c] = false; path.pop();
        if (cnt < MAX) snap(9, "unmark", { r, c }, `Backtrack (${r},${c})`, r, c);
        return false;
    }

    let found = false;
    for (let r = 0; r < rows && !found; r++) {
        for (let c = 0; c < cols && !found; c++) {
            if (g[r][c] === word[0]) {
                snap(0, "search", { r, c, startChar: word[0] }, `Try start at (${r},${c})`, r, c);
                if (dfs(r, c, 0)) found = true;
            }
        }
    }
    snap(0, "done", { result: found }, found ? `✅ "${word}" exists` : `❌ "${word}" not found`);
    return { steps, result: found };
}

function GridViz({ grid, visited, curR, curC, rows, cols, path, word }) {
    const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
    return (
        <VizCard title={`🔤 Grid · Word: "${word}"`}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 40px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((ch, c) => {
                    const isPath = pathSet.has(`${r},${c}`);
                    const isCur = r === curR && c === curC;
                    return (
                        <div key={`${r}-${c}`} style={{
                            width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700,
                            background: isPath ? "#1e3a5f" : "#0f172a",
                            border: `2px solid ${isCur ? "#fbbf24" : isPath ? "#3b82f6" : "#1e293b"}`,
                            color: isPath ? "#93c5fd" : "#64748b",
                            transition: "all 0.2s",
                        }}>{ch}</div>
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
Find if a word exists in a 2D grid. Letters must be adjacent (up/down/left/right) and can't reuse same cell. E.g., Find "ABCCED" in grid.

## How to Think About It
**Start from every cell that matches the first letter.** Then DFS in 4 directions matching the next letter.

### Key Constraints
- Must be adjacent (no diagonal)
- Can't visit same cell twice in one path
- Mark visited during search, unmark after (backtracking)

**Think of it like:** Tracing a path through the grid, letter by letter, like a snake moving to adjacent cells.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step

1. Scan grid for first letter match
2. At each match, start DFS:
   - Current cell matches current letter? Continue.
   - Mark cell as visited
   - Try 4 neighbors for next letter
   - If any path finds full word → return true
   - Unmark cell (backtrack)
3. If all starting cells exhausted → return false

### Pruning
- Wrong letter → stop immediately
- Out of bounds → stop
- Already visited → stop`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Base Case
    if (idx == word.size()) return true;
**WHY:** All letters matched → word found!

### Boundary + Match Check
    if (r<0 || r>=m || c<0 || c>=n || board[r][c] != word[idx]) return false;

### Visited Marking
    char tmp = board[r][c];
    board[r][c] = '#';  // mark visited
    bool found = dfs(4 directions);
    board[r][c] = tmp;  // restore
**WHY modify board?** No extra visited array needed.

## Time & Space Complexity
- **Time:** O(m × n × 4^L) where L = word length
- **Space:** O(L) recursion depth`
    },
];

export default function WordSearch() {
    const [sess, setSess] = useState(() => gen(SAMPLE, WORD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const reset = () => { setSess(gen(SAMPLE, WORD)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Word Search" subtitle="Grid DFS + Backtracking · LC #79">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>Word: "{WORD}"</span>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="word_search.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} visited={step.visited} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} path={step.path || []} word={step.word} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.result ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.result ? "✅ Found" : "🔍 Searching"}</span></StepInfo>
        </VizLayout>
    );
}
