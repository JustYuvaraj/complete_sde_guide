import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool solveSudoku(vector<vector<char>>& board) {` },
    { id: 1, text: `    for (int r = 0; r < 9; r++)` },
    { id: 2, text: `      for (int c = 0; c < 9; c++) {` },
    { id: 3, text: `        if (board[r][c] != '.') continue;` },
    { id: 4, text: `        for (char d = '1'; d <= '9'; d++) {` },
    { id: 5, text: `            if (!isValid(board, r, c, d)) continue;` },
    { id: 6, text: `            board[r][c] = d;` },
    { id: 7, text: `            if (solveSudoku(board)) return true;` },
    { id: 8, text: `            board[r][c] = '.';  // backtrack` },
    { id: 9, text: `        }` },
    { id: 10, text: `        return false;  // no digit works` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return true;  // all filled` },
    { id: 13, text: `}` },
];
const PC = { scan: "#8b5cf6", try: "#3b82f6", place: "#10b981", conflict: "#f87171", backtrack: "#ec4899", fail: "#f87171", done: "#10b981" };
const PL = { scan: "🔍 SCAN", try: "🔢 TRY", place: "✅ PLACE", conflict: "⚔ INVALID", backtrack: "↩ BACK", fail: "❌ FAIL", done: "✅ SOLVED" };

const SAMPLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function gen(initial) {
    const board = initial.map(r => [...r]);
    const fixed = initial.map(r => r.map(v => v !== 0));
    const steps = []; let cnt = 0; const MAX = 500;
    const snap = (cl, ph, v, m, hr, hc) => {
        if (cnt >= MAX) return;
        steps.push({ cl, phase: ph, vars: { ...v }, msg: m, board: board.map(r => [...r]), fixed, highlightR: hr, highlightC: hc });
        cnt++;
    };

    function isValid(r, c, d) {
        for (let i = 0; i < 9; i++) { if (board[r][i] === d || board[i][c] === d) return false; }
        const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
        for (let i = br; i < br + 3; i++) for (let j = bc; j < bc + 3; j++) if (board[i][j] === d) return false;
        return true;
    }

    function solve() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (cnt >= MAX) return false;
                if (board[r][c] !== 0) continue;
                snap(3, "scan", { row: r, col: c }, `Empty cell (${r},${c})`, r, c);
                for (let d = 1; d <= 9; d++) {
                    if (cnt >= MAX) return false;
                    if (!isValid(r, c, d)) {
                        snap(5, "conflict", { row: r, col: c, digit: d }, `${d} invalid at (${r},${c})`, r, c);
                        continue;
                    }
                    board[r][c] = d;
                    snap(6, "place", { row: r, col: c, digit: d }, `Place ${d} at (${r},${c})`, r, c);
                    if (solve()) return true;
                    board[r][c] = 0;
                    if (cnt < MAX) snap(8, "backtrack", { row: r, col: c, removed: d }, `Backtrack: remove ${d} from (${r},${c})`, r, c);
                }
                snap(10, "fail", { row: r, col: c }, `No digit works at (${r},${c})`, r, c);
                return false;
            }
        }
        snap(12, "done", {}, `✅ Sudoku solved!`, -1, -1);
        return true;
    }
    solve();
    if (steps.length === 0 || steps[steps.length - 1].phase !== "done") {
        snap(12, "done", {}, `✅ Sudoku solved!`, -1, -1);
    }
    return { steps };
}

function SudokuGrid({ board, fixed, highlightR, highlightC }) {
    const { theme } = useTheme();
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 32px)", gap: "1px", padding: "3px", borderRadius: "8px", background: theme.cardBorder }}>
            {board.map((row, r) => row.map((val, c) => {
                const isFixed = fixed[r][c];
                const isHL = r === highlightR && c === highlightC;
                const boxR = Math.floor(r / 3), boxC = Math.floor(c / 3);
                const darkBox = (boxR + boxC) % 2 === 0;
                return (
                    <div key={`${r}-${c}`} style={{
                        width: "32px", height: "32px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: isFixed ? 800 : 600,
                        fontFamily: "monospace",
                        background: isHL ? "#312e81" : darkBox ? "#0f172a" : "#1e293b",
                        color: isFixed ? "#94a3b8" : isHL ? "#a5b4fc" : "#4ade80",
                        border: isHL ? "2px solid #8b5cf6" : "none",
                        borderRadius: "2px",
                        borderRight: c === 2 || c === 5 ? `2px solid ${theme.cardBorder}` : "none",
                        borderBottom: r === 2 || r === 5 ? `2px solid ${theme.cardBorder}` : "none",
                    }}>
                        {val || ""}
                    </div>
                );
            }))}
        </div>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Fill a 9×9 Sudoku grid so every row, column, and 3×3 box contains digits 1-9 exactly once.

## How to Think About It
**Cell by cell:** Find the first empty cell, try digits 1-9. If valid, place it and move to the next empty cell.

### Three Rules to Check:
1. **Row:** digit not already in this row
2. **Column:** digit not already in this column
3. **3×3 Box:** digit not already in the 3×3 sub-box

**Think of it like:** Solving a puzzle by trying numbers. If you hit a dead end, erase your last guess and try the next number.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step

1. Find first empty cell (row, col)
2. Try digits 1 through 9:
   - Check if digit is valid in row, col, and box
   - If valid: place it, recurse to next empty cell
   - If recursion succeeds: done!
   - If recursion fails: remove digit (backtrack)
3. If no digit works: return false (trigger backtrack)
4. If no empty cells remain: **SOLVED!** ✅

### Why Backtracking Works
The constraints are so tight that most digits are quickly eliminated, making the search efficient in practice.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Finding Empty Cell
Scan grid left-to-right, top-to-bottom for first '.' or 0.

### Validity Check
    bool isValid(board, row, col, num)
Checks row, column, and 3×3 box.
Box index: (row/3)*3 + col/3 gives the box number.

### Backtracking
    board[r][c] = num;  // try
    if (solve(board)) return true;
    board[r][c] = '.';  // undo

## Time & Space Complexity
- **Time:** O(9^m) where m = empty cells (heavy pruning in practice)
- **Space:** O(m) recursion depth`
    },
];

export default function SudokuSolver() {
    const [sess, setSess] = useState(() => gen(SAMPLE));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 300);
    const reset = () => { setSess(gen(SAMPLE)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Sudoku Solver" subtitle="Cell-by-cell backtracking · LC #37">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%", maxWidth: "920px" }}>
                <button onClick={reset} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="sudoku_solver.cpp" />
                <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0, alignItems: "center" }}>
                    <VizCard title="🧩 Sudoku Grid">
                        <SudokuGrid board={step.board} fixed={step.fixed} highlightR={step.highlightR} highlightC={step.highlightC} />
                    </VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🧩 Sudoku</span></StepInfo>
        </VizLayout>
    );
}
