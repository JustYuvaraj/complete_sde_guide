import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void solveNQueens(int row, int n,` },
    { id: 1, text: `    vector<int>& cols, set<int>& d1, set<int>& d2,` },
    { id: 2, text: `    vector<vector<string>>& res) {` },
    { id: 3, text: `    if (row == n) { /* save solution */ return; }` },
    { id: 4, text: `    for (int col = 0; col < n; col++) {` },
    { id: 5, text: `        if (cols[col] || d1.count(row-col)` },
    { id: 6, text: `            || d2.count(row+col)) continue;` },
    { id: 7, text: `        place queen at (row, col);` },
    { id: 8, text: `        solveNQueens(row+1, ...);` },
    { id: 9, text: `        remove queen from (row, col);` },
    { id: 10, text: `    }` },
    { id: 11, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", place: "#3b82f6", conflict: "#f87171", remove: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "👑 FOUND", place: "♛ PLACE", conflict: "⚔ CONFLICT", remove: "↩ REMOVE", done: "✅ DONE" };

function gen(n) {
    const steps = [], result = [];
    const queens = new Array(n).fill(-1);
    const colUsed = new Set(), d1 = new Set(), d2 = new Set();
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 400;
    const cs = [];

    const snap = (cl, ph, v, m) => {
        if (cnt >= MAX) return;
        steps.push({
            cl, phase: ph, vars: { ...v }, msg: m, callStack: [...cs],
            queens: [...queens], n,
            result: result.map(r => [...r]),
            treeNodes: treeNodes.map(t => ({ ...t })),
            highlightCell: v._cell || null,
            attackCells: v._attacks || [],
        });
        cnt++;
    };

    function getAttacked(row, col) {
        const cells = [];
        for (let r = 0; r < n; r++) {
            if (r !== row) cells.push([r, col]);
            const c1 = col + (r - row), c2 = col - (r - row);
            if (c1 >= 0 && c1 < n && r !== row) cells.push([r, c1]);
            if (c2 >= 0 && c2 < n && r !== row) cells.push([r, c2]);
        }
        return cells;
    }

    function solve(row, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `row=${row}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`nq(r=${row})`);
        snap(0, "call", { row }, `solveNQueens(row=${row})`);

        if (row === n) {
            result.push([...queens]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ sol #${result.length}`;
            snap(3, "found", { solution: result.length }, `👑 Solution #${result.length} found!`);
            cs.pop(); return;
        }

        for (let col = 0; col < n; col++) {
            if (cnt >= MAX) break;
            if (colUsed.has(col) || d1.has(row - col) || d2.has(row + col)) {
                snap(5, "conflict", { row, col, _cell: [row, col], _attacks: getAttacked(row, col) }, `⚔ (${row},${col}) blocked`);
                continue;
            }
            queens[row] = col; colUsed.add(col); d1.add(row - col); d2.add(row + col);
            snap(7, "place", { row, col, _cell: [row, col] }, `♛ Place queen at (${row}, ${col})`);
            solve(row + 1, myId);
            queens[row] = -1; colUsed.delete(col); d1.delete(row - col); d2.delete(row + col);
            if (cnt < MAX) { cs.push(`nq(r=${row})`); snap(9, "remove", { row, col, _cell: [row, col] }, `Remove queen from (${row}, ${col})`); cs.pop(); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    snap(0, "done", { total: result.length }, `✅ ${result.length} solutions for ${n}-Queens`);
    return { steps, result };
}

function BoardViz({ queens, n, highlightCell, attackCells }) {
    const { theme } = useTheme();
    const cells = [];
    const attackSet = new Set((attackCells || []).map(([r, c]) => `${r},${c}`));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const isQueen = queens[r] === c;
            const isDark = (r + c) % 2 === 1;
            const isHighlight = highlightCell && highlightCell[0] === r && highlightCell[1] === c;
            const isAttacked = attackSet.has(`${r},${c}`);
            let bg = isDark ? "#1e293b" : "#334155";
            let border = "transparent";
            if (isQueen) { bg = "#1e3a5f"; border = "#3b82f6"; }
            if (isHighlight) { bg = "#312e81"; border = "#8b5cf6"; }
            if (isAttacked && !isQueen) { bg = "#3b0a0a"; border = "#f87171"; }
            cells.push(
                <div key={`${r}-${c}`} style={{
                    width: `${Math.min(40, 200 / n)}px`, height: `${Math.min(40, 200 / n)}px`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: bg, border: `1.5px solid ${border}`,
                    borderRadius: "3px", fontSize: `${Math.min(20, 120 / n)}px`,
                    transition: "all 0.2s",
                }}>
                    {isQueen ? "♛" : ""}
                </div>
            );
        }
    }
    return (
        <VizCard title={`♛ ${n}×${n} Board`}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, ${Math.min(40, 200 / n)}px)`, gap: "2px", justifyContent: "center" }}>
                {cells}
            </div>
        </VizCard>
    );
}

function SolutionsViz({ result, n }) {
    return (
        <VizCard title={`🏆 Solutions: ${result.length}`}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", minHeight: "30px" }}>
                {result.map((q, si) => (
                    <div key={si} style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 14px)`, gap: "1px", padding: "4px", borderRadius: "6px", background: "#052e16", border: "1.5px solid #10b981" }}>
                        {Array.from({ length: n * n }, (_, i) => {
                            const r = Math.floor(i / n), c = i % n;
                            return <div key={i} style={{
                                width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "8px", background: q[r] === c ? "#10b981" : ((r + c) % 2 ? "#064e3b" : "#052e16"),
                                borderRadius: "1px",
                            }}>{q[r] === c ? "♛" : ""}</div>;
                        })}
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Place n queens on an n×n board so no two queens attack each other. Queens attack along rows, columns, and diagonals.

## How to Think About It
**Place one queen per row.** For each row, try every column. If valid, recurse to next row.

### Constraints to Check:
- No two queens in the same **column**
- No two queens on the same **diagonal** (row-col constant)
- No two queens on the same **anti-diagonal** (row+col constant)

**Think of it like:** Filling in a chessboard row by row, ensuring each new queen doesn't conflict with any previously placed one.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for n=4

1. Row 0: Try col 0 → valid, place queen
2. Row 1: Col 0 (same col!) ✘, Col 1 (diagonal!) ✘, Col 2 → valid
3. Row 2: Try all → all conflicted! **BACKTRACK** to Row 1
4. Row 1: Try col 3 → valid
5. Row 2: Col 1 → valid
6. Row 3: Col 0 → diagonal conflict, try others → none work
7. Continue backtracking... eventually find solutions!

Result: 2 solutions for n=4 ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Base Case: row == n
All rows filled successfully → found a valid solution. Save the board.

### Validity Check
For each column in current row, check:
- **Column conflict:** Is any queen in this column?
- **Diagonal \\:** Is row-col same as any placed queen?
- **Anti-diagonal /:** Is row+col same as any placed queen?

### Backtracking
Place queen → recurse next row → remove queen → try next column.

## Time & Space Complexity
- **Time:** O(n!) — n choices for row 0, (n-1) for row 1, etc.
- **Space:** O(n²) for the board + O(n) recursion depth`
    },
];

const DN = 4;
export default function NQueens() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 700);
    const run = () => { const v = parseInt(nT); if (isNaN(v) || v < 1 || v > 8) return; setSess(gen(v)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="N-Queens" subtitle="Classic backtracking · Row-by-row · LC #51">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="4" label="n (1–8):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="n_queens.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <BoardViz queens={step.queens} n={step.n} highlightCell={step.highlightCell} attackCells={step.attackCells} />
                    <SolutionsViz result={step.result || []} n={step.n} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>♛ {sess.result.length} solutions</span></StepInfo>
        </VizLayout>
    );
}
