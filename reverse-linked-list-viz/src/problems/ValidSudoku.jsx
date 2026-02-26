import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_BOARD = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];

const CODE = [
    { id: 0, text: `bool isValidSudoku(vector<vector<char>>& board) {` },
    { id: 1, text: `    set<string> seen;` },
    { id: 2, text: `    for (int r = 0; r < 9; r++)` },
    { id: 3, text: `        for (int c = 0; c < 9; c++) {` },
    { id: 4, text: `            char d = board[r][c];` },
    { id: 5, text: `            if (d == '.') continue;` },
    { id: 6, text: `            string row = d+" in row "+to_string(r);` },
    { id: 7, text: `            string col = d+" in col "+to_string(c);` },
    { id: 8, text: `            string box = d+" in box "+...;` },
    { id: 9, text: `            if (!seen.insert(row).second ||` },
    { id: 10, text: `                !seen.insert(col).second ||` },
    { id: 11, text: `                !seen.insert(box).second)` },
    { id: 12, text: `                return false;` },
    { id: 13, text: `        }` },
    { id: 14, text: `    return true;` },
    { id: 15, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", skip: "#64748b", check: "#3b82f6", conflict: "#ef4444", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", skip: "EMPTY CELL", check: "CHECK DIGIT", conflict: "CONFLICT!", done: "VALID ✓" };

function generateSteps(board) {
    const steps = [];
    const seen = new Set();

    steps.push({
        cl: 1, phase: "init", board, r: -1, c: -1, digit: null, conflict: false,
        msg: `Check rows, columns, and 3×3 boxes for duplicates`,
        vars: { "board": "9×9" },
    });

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const d = board[r][c];
            if (d === ".") continue;

            const rowKey = `${d} in row ${r}`;
            const colKey = `${d} in col ${c}`;
            const boxKey = `${d} in box ${Math.floor(r / 3)}-${Math.floor(c / 3)}`;

            const hasConflict = seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey);

            if (hasConflict) {
                let reason = seen.has(rowKey) ? `row ${r}` : seen.has(colKey) ? `col ${c}` : `box ${Math.floor(r / 3)}-${Math.floor(c / 3)}`;
                steps.push({
                    cl: 12, phase: "conflict", board, r, c, digit: d, conflict: true,
                    msg: `❌ '${d}' duplicate in ${reason}!`,
                    vars: { r, c, digit: d, conflict: reason, "return": "false" },
                });
                return steps;
            }

            seen.add(rowKey); seen.add(colKey); seen.add(boxKey);
            steps.push({
                cl: 9, phase: "check", board, r, c, digit: d, conflict: false,
                msg: `'${d}' at (${r},${c}) → OK in row/col/box`,
                vars: { r, c, digit: d, "seen.size": seen.size },
            });
        }
    }

    steps.push({
        cl: 14, phase: "done", board, r: -1, c: -1, digit: null, conflict: false,
        msg: `🟢 Valid Sudoku! No conflicts found`,
        vars: { "return": "true" },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 36 — Valid Sudoku

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, Matrix

---

Determine if a 9×9 Sudoku board is valid. Only filled cells need to be validated:
- Each **row** contains digits 1-9 without repetition
- Each **column** contains digits 1-9 without repetition
- Each of the nine **3×3 sub-boxes** contains digits 1-9 without repetition`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## HashSet with Encoded Keys

### Key Insight
For each digit, encode 3 strings:
- \`"5 in row 0"\`
- \`"5 in col 0"\`
- \`"5 in box 0-0"\`

If any key already exists → invalid!`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(81) = O(1)** | Fixed 9×9 board |
| **Space** | **O(81) = O(1)** | At most 81×3 keys |`
    }
];

export default function ValidSudoku() {
    const { theme, isDark } = useTheme();
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_BOARD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleReset() {
        setSteps(generateSteps(DEFAULT_BOARD)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Valid Sudoku" subtitle="LC #36 · HashSet Encoding">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "10px" }}>
                <button onClick={handleReset} style={{
                    padding: "6px 16px", borderRadius: "8px", border: `1px solid ${theme.cardBorder}`,
                    background: theme.cardBg, color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer",
                }}>↺ Reset</button>
            </div>

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="valid_sudoku.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="🔢 Sudoku Board">
                <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(9, 36px)", gap: "2px", justifyContent: "center" }}>
                    {step.board.flat().map((val, i) => {
                        const r = Math.floor(i / 9), c = i % 9;
                        const isActive = step.r === r && step.c === c;
                        const isConflict = step.conflict && isActive;
                        const isEmpty = val === ".";
                        const boxR = Math.floor(r / 3), boxC = Math.floor(c / 3);
                        const boxShade = (boxR + boxC) % 2 === 0;
                        return (
                            <div key={i} style={{
                                width: "36px", height: "36px", borderRadius: "4px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: isConflict ? "#ef444430"
                                    : isActive ? `${pc}20`
                                        : isEmpty ? (isDark ? "#0f172a" : "#f8fafc")
                                            : boxShade ? (isDark ? "#1e293b" : "#f1f5f9")
                                                : (isDark ? "#162032" : "#e8eef5"),
                                border: `${isActive ? "2px" : "1px"} solid ${isConflict ? "#ef4444" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.2s",
                                transform: isActive ? "scale(1.15)" : "scale(1)",
                                fontWeight: isEmpty ? "400" : "800",
                                fontSize: isEmpty ? "0.7rem" : "0.95rem",
                                fontFamily: "monospace",
                                color: isConflict ? "#ef4444" : isActive ? pc : isEmpty ? theme.textDim : theme.text,
                                borderRight: c === 2 || c === 5 ? `2px solid ${isDark ? "#475569" : "#94a3b8"}` : undefined,
                                borderBottom: r === 2 || r === 5 ? `2px solid ${isDark ? "#475569" : "#94a3b8"}` : undefined,
                            }}>
                                {isEmpty ? "·" : val}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
