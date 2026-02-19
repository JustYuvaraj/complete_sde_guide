import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int totalNQueens(int row, int n,` },
    { id: 1, text: `    set<int>& cols, set<int>& d1, set<int>& d2){` },
    { id: 2, text: `    if (row == n) return 1;` },
    { id: 3, text: `    int count = 0;` },
    { id: 4, text: `    for (int col = 0; col < n; col++) {` },
    { id: 5, text: `        if (cols.count(col) || d1.count(row-col)` },
    { id: 6, text: `            || d2.count(row+col)) continue;` },
    { id: 7, text: `        place(row, col);` },
    { id: 8, text: `        count += totalNQueens(row+1, ...);` },
    { id: 9, text: `        remove(row, col);` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return count;` },
    { id: 12, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", place: "#3b82f6", conflict: "#f87171", remove: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "👑 FOUND", place: "♛ PLACE", conflict: "⚔ SKIP", remove: "↩ REMOVE", done: "✅ DONE" };

function gen(n) {
    const steps = [];
    const queens = new Array(n).fill(-1);
    const colUsed = new Set(), d1 = new Set(), d2 = new Set();
    const treeNodes = []; let nid = 0, cnt = 0, solCount = 0; const MAX = 400;
    const cs = [];
    const snap = (cl, ph, v, m) => {
        if (cnt >= MAX) return;
        steps.push({ cl, phase: ph, vars: { ...v }, msg: m, callStack: [...cs], queens: [...queens], n, solCount, treeNodes: treeNodes.map(t => ({ ...t })) });
        cnt++;
    };
    function solve(row, parentId) {
        if (cnt >= MAX) return 0;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `row=${row}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`nq(r=${row})`);
        snap(0, "call", { row }, `totalNQueens(row=${row})`);
        if (row === n) {
            solCount++;
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ #${solCount}`;
            snap(2, "found", { count: solCount }, `👑 Solution #${solCount}`);
            cs.pop(); return 1;
        }
        let count = 0;
        for (let col = 0; col < n; col++) {
            if (cnt >= MAX) break;
            if (colUsed.has(col) || d1.has(row - col) || d2.has(row + col)) {
                snap(5, "conflict", { row, col }, `⚔ (${row},${col}) blocked`);
                continue;
            }
            queens[row] = col; colUsed.add(col); d1.add(row - col); d2.add(row + col);
            snap(7, "place", { row, col }, `♛ Place at (${row},${col})`);
            count += solve(row + 1, myId);
            queens[row] = -1; colUsed.delete(col); d1.delete(row - col); d2.delete(row + col);
            if (cnt < MAX) { snap(9, "remove", { row, col }, `Remove (${row},${col})`); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
        return count;
    }
    solve(0, null);
    snap(0, "done", { total: solCount }, `✅ ${solCount} solutions for ${n}-Queens`);
    return { steps, total: solCount };
}

function BoardViz({ queens, n }) {
    const cells = [];
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const isQueen = queens[r] === c;
            const isDark = (r + c) % 2 === 1;
            cells.push(
                <div key={`${r}-${c}`} style={{
                    width: `${Math.min(36, 180 / n)}px`, height: `${Math.min(36, 180 / n)}px`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isQueen ? "#1e3a5f" : isDark ? "#1e293b" : "#334155",
                    border: `1.5px solid ${isQueen ? "#3b82f6" : "transparent"}`,
                    borderRadius: "3px", fontSize: `${Math.min(18, 100 / n)}px`,
                }}>{isQueen ? "♛" : ""}</div>
            );
        }
    }
    return (
        <VizCard title={`♛ Board · Solutions: ${0}`}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, ${Math.min(36, 180 / n)}px)`, gap: "2px", justifyContent: "center" }}>{cells}</div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Same as N-Queens, but only **count** the number of solutions instead of returning board layouts.

## How to Think About It
Identical approach to N-Queens, but instead of storing boards, increment a counter when all queens are placed.

### Optimization: Sets vs Board
Use three sets to track attacks:
- **columns:** set of used columns
- **diagonals:** set of (row-col) values
- **anti-diagonals:** set of (row+col) values

Checking validity becomes O(1) instead of O(n)!`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Known Results

| n | Solutions |
|---|----------|
| 1 | 1 |
| 2 | 0 |
| 3 | 0 |
| 4 | 2 |
| 5 | 10 |
| 6 | 4 |
| 7 | 40 |
| 8 | 92 |

Same backtracking as N-Queens, just count++ instead of saving the board.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1-2: Function Signature
    int totalNQueens(int row, int n, set<int>& cols, set<int>& d1, set<int>& d2)
Three sets track attacks: columns, diagonals (row−col), anti-diagonals (row+col).

### Line 3: Base Case
    if (row == n) return 1;
**WHY:** All n rows have a queen placed successfully → found 1 valid arrangement. Count it!

### Line 4-5: Try Each Column
    int count = 0;
    for (int col = 0; col < n; col++)
**WHY:** For the current row, try placing a queen in every column.

### Line 5-6: Conflict Check (O(1)!)
    if (cols.count(col) || d1.count(row-col) || d2.count(row+col)) continue;
**WHY 3 checks?**
- **cols:** Another queen in same column?
- **d1 (row−col):** Same left diagonal? (row−col is constant on \\\\)
- **d2 (row+col):** Same right diagonal? (row+col is constant on /)

### Line 7: Place Queen
    place(row, col);  // add to cols, d1, d2
**WHY sets?** O(1) lookup vs O(n) board scanning in N-Queens I.

### Line 8: Recurse → Count
    count += totalNQueens(row+1, ...);
**WHY +=?** Accumulate solutions from ALL valid column placements.

### Line 9: Remove Queen (Backtrack)
    remove(row, col);  // remove from cols, d1, d2
**WHY?** Restore state to try next column position.

## Time & Space Complexity
- **Time:** O(n!) with set-based pruning
- **Space:** O(n) for 3 sets + recursion depth`
    },
];

const DN = 4;
export default function NQueensII() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const run = () => { const v = parseInt(nT); if (isNaN(v) || v < 1 || v > 8) return; setSess(gen(v)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="N-Queens II" subtitle="Count all solutions · Backtracking · LC #52">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="4" label="n (1–8):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="n_queens_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`♛ Board`}>
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${step.n}, ${Math.min(36, 180 / step.n)}px)`, gap: "2px", justifyContent: "center" }}>
                            {Array.from({ length: step.n * step.n }, (_, i) => {
                                const r = Math.floor(i / step.n), c = i % step.n;
                                const isQ = step.queens[r] === c;
                                return <div key={i} style={{
                                    width: `${Math.min(36, 180 / step.n)}px`, height: `${Math.min(36, 180 / step.n)}px`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: isQ ? "#1e3a5f" : (r + c) % 2 ? "#1e293b" : "#334155",
                                    border: `1.5px solid ${isQ ? "#3b82f6" : "transparent"}`,
                                    borderRadius: "3px", fontSize: `${Math.min(18, 100 / step.n)}px`,
                                }}>{isQ ? "♛" : ""}</div>;
                            })}
                        </div>
                    </VizCard>
                    <VizCard title="📊 Count"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", textAlign: "center" }}>{step.solCount}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>♛ {sess.total} solutions</span></StepInfo>
        </VizLayout>
    );
}
