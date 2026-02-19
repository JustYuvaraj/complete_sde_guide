import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void rotate(vector<vector<int>>& m) {` },
    { id: 1, text: `    int n = m.size();` },
    { id: 2, text: `    // Transpose` },
    { id: 3, text: `    for(int i=0;i<n;i++)` },
    { id: 4, text: `        for(int j=i+1;j<n;j++)` },
    { id: 5, text: `            swap(m[i][j], m[j][i]);` },
    { id: 6, text: `    // Reverse each row` },
    { id: 7, text: `    for(int i=0;i<n;i++)` },
    { id: 8, text: `        reverse(m[i].begin(),m[i].end());` },
    { id: 9, text: `}` },
];

function gen(matrix) {
    const steps = [];
    const m = matrix.map(r => [...r]);
    const n = m.length;
    const push = (cl, ph, v, msg, hlCells) => steps.push({
        cl, phase: ph, vars: { ...v }, msg, hlCells: hlCells || [], matrix: m.map(r => [...r])
    });

    push(1, "init", { n }, `${n}×${n} matrix — Step 1: Transpose, Step 2: Reverse rows`, []);

    // Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
            push(5, "transpose", { "swap": `m[${i}][${j}]↔m[${j}][${i}]` },
                `Transpose: swap(${m[j][i]}, ${m[i][j]})`,
                [{ r: i, c: j, color: "#f59e0b" }, { r: j, c: i, color: "#f59e0b" }]);
        }
    }

    push(6, "transposed", {}, "Transposed! Now reverse each row", []);

    // Reverse each row
    for (let i = 0; i < n; i++) {
        m[i].reverse();
        push(8, "reverse-row", { row: i },
            `Reverse row ${i}: [${m[i].join(",")}]`,
            m[i].map((_, j) => ({ r: i, c: j, color: "#38bdf8" })));
    }

    push(8, "done", {}, `✅ Rotated 90° clockwise!`, []);
    return { steps, matrix: m, original: matrix };
}

function MatrixGrid({ matrix, hlCells = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    hlCells.forEach(h => { hlMap[`${h.r},${h.c}`] = h.color; });
    return (
        <VizCard title="📊 Matrix">
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "center", padding: "8px 0" }}>
                {matrix.map((row, i) => (
                    <div key={i} style={{ display: "flex", gap: "3px" }}>
                        {row.map((val, j) => {
                            const c = hlMap[`${i},${j}`];
                            return (
                                <div key={j} style={{
                                    width: "44px", height: "44px", borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.8rem",
                                    background: c ? `${c}20` : (isDark ? "#1e293b" : "#f1f5f9"),
                                    border: `2px solid ${c || (isDark ? "#334155" : "#e2e8f0")}`,
                                    color: c || (isDark ? "#e2e8f0" : "#1e293b"),
                                    transition: "all 0.3s",
                                }}>{val}</div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", transpose: "#f59e0b", transposed: "#a78bfa", "reverse-row": "#38bdf8", done: "#10b981" };
const PL = { init: "⚙️ INIT", transpose: "🔀 TRANSPOSE", transposed: "✓ TRANSPOSED", "reverse-row": "↔️ REVERSE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Rotate an N×N matrix 90° clockwise **in-place**. (LC #48)

## Key Insight — Two Steps
1. **Transpose** the matrix (swap rows and columns)
2. **Reverse** each row

This is equivalent to a 90° clockwise rotation!

## Why This Works
Transposing flips along the main diagonal. Reversing each row then gives the clockwise rotation.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example:
Original:        Transpose:       Reverse rows:
[1, 2, 3]        [1, 4, 7]        [7, 4, 1]
[4, 5, 6]   →    [2, 5, 8]   →    [8, 5, 2]
[7, 8, 9]        [3, 6, 9]        [9, 6, 3] ✅

### Complexity
- **Time:** O(n²)
- **Space:** O(1) — in-place!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Transpose + Reverse

### Transpose: j starts from i+1
    for(int j=i+1;j<n;j++)
        swap(m[i][j], m[j][i]);
Only swap upper triangle to avoid double-swapping.

### Reverse each row
    reverse(m[i].begin(), m[i].end());

### For counter-clockwise
Reverse each COLUMN instead of each row after transposing.`
    },
];

const DEFAULT = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
export default function RotateMatrix() {
    const [input, setInput] = useState("1,2,3;4,5,6;7,8,9");
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const rows = input.split(";").map(r => r.split(",").map(Number));
        const n = rows.length;
        if (n < 2 || n > 5 || rows.some(r => r.length !== n || r.some(v => isNaN(v)))) return;
        setSess(gen(rows)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput("1,2,3;4,5,6;7,8,9"); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Rotate Matrix 90°" subtitle="Transpose + reverse rows · O(n²)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3;4,5,6;7,8,9" label="Matrix (;-sep rows):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="rotateMatrix.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MatrixGrid matrix={step.matrix} hlCells={step.hlCells} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length} />
        </VizLayout>
    );
}
