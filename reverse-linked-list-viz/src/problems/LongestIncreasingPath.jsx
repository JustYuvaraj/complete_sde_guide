import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int longestIncreasingPath(vector<vector<int>>& mat) {` },
    { id: 1, text: `    int res = 0;` },
    { id: 2, text: `    for each cell (r,c):` },
    { id: 3, text: `        res = max(res, dfs(mat, r, c, memo));` },
    { id: 4, text: `}` },
    { id: 5, text: `int dfs(mat, r, c, memo) {` },
    { id: 6, text: `    if (memo[r][c]) return memo[r][c];` },
    { id: 7, text: `    int best = 1;` },
    { id: 8, text: `    for each neighbor (nr,nc):` },
    { id: 9, text: `        if (mat[nr][nc] > mat[r][c])` },
    { id: 10, text: `            best = max(best, 1+dfs(nr,nc));` },
    { id: 11, text: `    return memo[r][c] = best;` },
    { id: 12, text: `}` },
];
const PC = { scan: "#8b5cf6", dfs: "#3b82f6", memo: "#10b981", done: "#10b981" };
const PL = { scan: "🔍 SCAN", dfs: "🔽 DFS", memo: "💾 MEMO", done: "✅ DONE" };

const SAMPLE = [[9, 9, 4], [6, 6, 8], [2, 1, 1]];
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function gen(mat) {
    const rows = mat.length, cols = mat[0].length;
    const memo = Array.from({ length: rows }, () => new Array(cols).fill(0));
    const steps = []; let cnt = 0, best = 0; const MAX = 200;
    const snap = (cl, ph, v, m, cr, cc) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, memo: memo.map(r => [...r]), mat: mat.map(r => [...r]), curR: cr ?? -1, curC: cc ?? -1, rows, cols, best }); cnt++; } };

    function dfs(r, c) {
        if (cnt >= MAX) return 1;
        if (memo[r][c]) { snap(6, "memo", { r, c, cached: memo[r][c] }, `(${r},${c}) cached=${memo[r][c]}`, r, c); return memo[r][c]; }
        let b = 1;
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mat[nr][nc] > mat[r][c]) {
                snap(9, "dfs", { r, c, nr, nc, "mat[r][c]": mat[r][c], "mat[nr][nc]": mat[nr][nc] }, `${mat[nr][nc]}>${mat[r][c]} → go (${nr},${nc})`, r, c);
                b = Math.max(b, 1 + dfs(nr, nc));
            }
        }
        memo[r][c] = b;
        snap(11, "memo", { r, c, "memo[r][c]": b }, `memo[${r}][${c}] = ${b}`, r, c);
        return b;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cnt >= MAX) break;
            const len = dfs(r, c);
            if (len > best) best = len;
        }
    }
    snap(0, "done", { result: best }, `✅ Longest increasing path: ${best}`);
    return { steps, result: best };
}

function MemoGrid({ mat, memo, curR, curC, rows, cols }) {
    const maxV = Math.max(...memo.flat(), 1);
    return (
        <VizCard title="💾 Memo (path length)">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 50px)`, gap: "3px", justifyContent: "center" }}>
                {memo.map((row, r) => row.map((v, c) => {
                    const intensity = v > 0 ? Math.round((v / maxV) * 200 + 55) : 30;
                    return (<div key={`${r}-${c}`} style={{ width: "50px", height: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: v > 0 ? `rgba(59,130,246,${v / maxV * 0.5 + 0.1})` : "#0f172a", border: `2px solid ${(r === curR && c === curC) ? "#fbbf24" : "#334155"}`, color: "#93c5fd" }}><span>{v || "·"}</span><span style={{ fontSize: "0.4rem", color: "#64748b" }}>{mat[r][c]}</span></div>);
                }))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the length of the **longest increasing path** in a matrix. You can move in 4 directions, and each step must go to a **strictly greater** value.

## Key Insight
Use **DFS + Memoization**. From each cell, explore all 4 neighbors with greater values. Cache the result so each cell is computed only once.

## Mental Model
1. Try starting from every cell
2. DFS: go to any neighbor with a strictly larger value
3. dp[r][c] = 1 + max(dp[neighbors with greater value])
4. Memoize to avoid recomputation`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. For each cell (r,c), call dfs(r,c)
2. If dp[r][c] is already computed, return it
3. Check all 4 neighbors: if neighbor > current, recurse
4. dp[r][c] = 1 + max of all valid neighbor results
5. Track the global maximum across all starting cells

## Why Memoization?
Without caching, the same cell would be recomputed many times in overlapping paths. Memoization ensures each cell's longest path is computed exactly once.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
for each cell (r,c): ans = max(ans, dfs(r,c))

dfs(r, c):
  if dp[r][c] != 0: return dp[r][c]
  dp[r][c] = 1
  for each neighbor (nr, nc) with grid[nr][nc] > grid[r][c]:
    dp[r][c] = max(dp[r][c], 1 + dfs(nr, nc))
  return dp[r][c]
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m × n)** — each cell computed once |
| Space | **O(m × n)** — dp table + recursion stack |`
    }
];

export default function LongestIncreasingPath() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Longest Increasing Path" subtitle="DFS + Memoization · LC #329">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="longest_increasing_path.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <MemoGrid mat={step.mat} memo={step.memo} curR={step.curR} curC={step.curC} rows={step.rows} cols={step.cols} />
                    <VizCard title="📏 Longest"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", textAlign: "center" }}>{step.best}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📏 Longest: {sess.result}</span></StepInfo>
        </VizLayout>
    );
}
