import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<string> findWords(board, words) {` },
    { id: 1, text: `    build Trie from words;` },
    { id: 2, text: `    for each cell (r,c):` },
    { id: 3, text: `        dfs(board, r, c, trieRoot, result);` },
    { id: 4, text: `}` },
    { id: 5, text: `void dfs(board, r, c, node, result) {` },
    { id: 6, text: `    if (OOB || visited || !node[ch]) return;` },
    { id: 7, text: `    node = node[ch]; mark visited;` },
    { id: 8, text: `    if (node.word) result.add(node.word);` },
    { id: 9, text: `    dfs 4 directions;` },
    { id: 10, text: `    unmark visited;` },
    { id: 11, text: `}` },
];
const PC = { scan: "#8b5cf6", match: "#10b981", miss: "#f87171", mark: "#3b82f6", found: "#10b981", unmark: "#ec4899", done: "#10b981" };
const PL = { scan: "🔍 SCAN", match: "✅ MATCH", miss: "✗ MISS", mark: "📌 MARK", found: "🎯 FOUND", unmark: "↩ BACK", done: "✅ DONE" };

const BOARD = [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]];
const WORDS = ["oath", "pea", "eat", "rain"];

function gen(board, words) {
    const g = board.map(r => [...r]);
    const rows = g.length, cols = g[0].length;
    const visited = board.map(r => r.map(() => false));
    const steps = [], result = []; let cnt = 0; const MAX = 300;
    const path = [];
    // Simple trie
    const root = {};
    for (const w of words) { let n = root; for (const ch of w) { if (!n[ch]) n[ch] = {}; n = n[ch]; } n._word = w; }

    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, grid: g.map(r => [...r]), visited: visited.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, path: [...path], result: [...result] }); cnt++; } };

    function dfs(r, c, node) {
        if (cnt >= MAX) return;
        if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c]) return;
        const ch = g[r][c];
        if (!node[ch]) { snap(6, "miss", { r, c, char: ch }, `'${ch}' not in trie`, r, c); return; }
        node = node[ch]; visited[r][c] = true; path.push([r, c]);
        snap(7, "mark", { r, c, char: ch }, `Match '${ch}' at (${r},${c})`, r, c);
        if (node._word) { result.push(node._word); snap(8, "found", { word: node._word }, `🎯 Found "${node._word}"!`, r, c); node._word = null; }
        dfs(r - 1, c, node); dfs(r + 1, c, node); dfs(r, c - 1, node); dfs(r, c + 1, node);
        visited[r][c] = false; path.pop();
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cnt >= MAX) break;
            if (root[g[r][c]]) { snap(3, "scan", { r, c }, `Start DFS at (${r},${c})`, r, c); dfs(r, c, root); }
        }
    }
    snap(0, "done", { total: result.length }, `✅ Found ${result.length} words: [${result.join(", ")}]`);
    return { steps, result };
}

function GridViz({ grid, visited, curR, curC, rows, cols, path }) {
    const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
    return (
        <VizCard title="🔤 Board">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 40px)`, gap: "3px", justifyContent: "center" }}>
                {grid.map((row, r) => row.map((ch, c) => {
                    const isPath = pathSet.has(`${r},${c}`);
                    const isCur = r === curR && c === curC;
                    return (<div key={`${r}-${c}`} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, background: isPath ? "#1e3a5f" : "#0f172a", border: `2px solid ${isCur ? "#fbbf24" : isPath ? "#3b82f6" : "#1e293b"}`, color: isPath ? "#93c5fd" : "#64748b" }}>{ch}</div>);
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a grid and a list of words, find **all words** present in the grid. Same adjacency rules as Word Search I.

## How to Think About It
**Optimization: Use a Trie!** Instead of searching each word separately, build a Trie from all words. Then DFS the grid once, following Trie paths.

### Why Trie?
- Multiple words share prefixes (e.g., "oath" and "oat")
- One DFS pass can find all words at once
- Prune early if no Trie child exists for current letter

**Think of it like:** Exploring the grid while simultaneously walking through a dictionary. If the dictionary has no words starting with current path, stop.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step

1. **Build Trie** from all words
2. **For each cell** in grid, start DFS if cell matches a Trie root child
3. During DFS:
   - Follow Trie children as you explore adjacent cells
   - If Trie node has word end marker → add to results
   - Mark visited, explore 4 neighbors, unmark
   - If Trie node has no children left → prune Trie node

### Key Optimization
Remove found words from Trie to avoid duplicates and speed up future searches.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Trie Node Structure
    struct TrieNode {
        children[26]; word = null;
    }
Store the complete word at leaf nodes for easy retrieval.

### DFS with Trie
    function dfs(r, c, node):
        char = board[r][c]
        next = node.children[char]
        if (!next) return  // Trie pruning!
        if (next.word) result.add(next.word)
        // explore 4 directions with 'next' node

## Time & Space Complexity
- **Time:** O(m × n × 4^L) but much faster due to Trie pruning
- **Space:** O(sum of word lengths) for Trie`
    },
];

export default function WordSearchII() {
    const [sess, setSess] = useState(() => gen(BOARD, WORDS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 500);
    const reset = () => { setSess(gen(BOARD, WORDS)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Word Search II" subtitle="Trie + Grid DFS · LC #212">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>Words: [{WORDS.join(", ")}]</span>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="word_search_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <GridViz grid={step.grid} visited={step.visited} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} path={step.path || []} />
                    <VizCard title={`🎯 Found: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "24px" }}>{(step.result || []).map((w, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{w}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎯 {sess.result.length} words</span></StepInfo>
        </VizLayout>
    );
}
