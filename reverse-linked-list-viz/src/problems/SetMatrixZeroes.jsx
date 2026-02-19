import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void setZeroes(vector<vector<int>>& m) {` },
    { id: 1, text: `    bool firstRow=false, firstCol=false;` },
    { id: 2, text: `    int R=m.size(), C=m[0].size();` },
    { id: 3, text: `    // Mark zeros in first row/col` },
    { id: 4, text: `    for(int i=0;i<R;i++) for(int j=0;j<C;j++)` },
    { id: 5, text: `        if(m[i][j]==0){` },
    { id: 6, text: `            if(i==0)firstRow=true;` },
    { id: 7, text: `            if(j==0)firstCol=true;` },
    { id: 8, text: `            m[i][0]=0; m[0][j]=0;` },
    { id: 9, text: `        }` },
    { id: 10, text: `    // Set inner cells to 0` },
    { id: 11, text: `    for(int i=1;i<R;i++) for(int j=1;j<C;j++)` },
    { id: 12, text: `        if(m[i][0]==0||m[0][j]==0) m[i][j]=0;` },
    { id: 13, text: `    // Handle first row/col` },
    { id: 14, text: `    if(firstRow) for(int j=0;j<C;j++) m[0][j]=0;` },
    { id: 15, text: `    if(firstCol) for(int i=0;i<R;i++) m[i][0]=0;` },
    { id: 16, text: `}` },
];

function gen(matrix) {
    const steps = [];
    const m = matrix.map(r => [...r]);
    const R = m.length, C = m[0].length;
    const push = (cl, ph, v, msg, hlCells, snap) => steps.push({
        cl, phase: ph, vars: { ...v }, msg, hlCells: hlCells || [], matrix: snap ? snap.map(r => [...r]) : m.map(r => [...r])
    });

    let firstRow = false, firstCol = false;
    push(1, "init", { R, C }, "Scan for zeros, mark in first row/col", [], m);

    for (let i = 0; i < R; i++) {
        for (let j = 0; j < C; j++) {
            if (m[i][j] === 0) {
                if (i === 0) firstRow = true;
                if (j === 0) firstCol = true;
                m[i][0] = 0;
                m[0][j] = 0;
                push(8, "mark", { i, j, firstRow, firstCol },
                    `m[${i}][${j}]=0 → mark row ${i} and col ${j}`,
                    [{ r: i, c: j, color: "#ef4444" }, { r: i, c: 0, color: "#f59e0b" }, { r: 0, c: j, color: "#f59e0b" }], m);
            }
        }
    }

    for (let i = 1; i < R; i++) {
        for (let j = 1; j < C; j++) {
            if (m[i][0] === 0 || m[0][j] === 0) {
                m[i][j] = 0;
            }
        }
    }
    push(12, "fill", { firstRow, firstCol }, "Fill inner cells based on markers", [], m);

    if (firstRow) for (let j = 0; j < C; j++) m[0][j] = 0;
    if (firstCol) for (let i = 0; i < R; i++) m[i][0] = 0;
    push(15, "done", {}, "✅ Matrix zeroed!", [], m);

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
                            const isZero = val === 0;
                            return (
                                <div key={j} style={{
                                    width: "40px", height: "40px", borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.8rem",
                                    background: c ? `${c}20` : isZero ? "#ef444418" : (isDark ? "#1e293b" : "#f1f5f9"),
                                    border: `2px solid ${c || (isZero ? "#ef444444" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                    color: c || (isZero ? "#ef4444" : (isDark ? "#e2e8f0" : "#1e293b")),
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

const PC = { init: "#8b5cf6", mark: "#f59e0b", fill: "#38bdf8", done: "#10b981" };
const PL = { init: "⚙️ INIT", mark: "🔖 MARK", fill: "🔲 FILL", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
If any cell is 0, set its entire row and column to 0. Do it **in-place** with O(1) extra space.

## Key Insight — Use First Row/Col as Markers
Instead of extra arrays, use the first row and first column as "markers":
- If m[i][j]=0, set m[i][0]=0 and m[0][j]=0
- Then scan inner cells: if their row or column is marked → set to 0
- Finally, handle the first row/col using boolean flags`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Three Passes
1. **Mark:** Find zeros, mark in first row/col
2. **Fill:** Set inner cells to 0 based on markers
3. **Handle edges:** Zero out first row/col if needed

### Complexity
- **Time:** O(R × C)
- **Space:** O(1) — in-place!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Why First Row/Col?

### Repurpose existing space
First row marks "this column should be zeroed"
First col marks "this row should be zeroed"

### Two boolean flags
firstRow and firstCol track whether the first row/col themselves need zeroing.

### Order matters!
Fill inner cells BEFORE handling first row/col, or markers get corrupted.`
    },
];

const DEFAULT = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
export default function SetMatrixZeroes() {
    const [input, setInput] = useState("1,1,1;1,0,1;1,1,1");
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1500);
    const run = () => {
        const rows = input.split(";").map(r => r.split(",").map(Number));
        if (rows.length < 1 || rows.some(r => r.some(v => isNaN(v)))) return;
        setSess(gen(rows)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput("1,1,1;1,0,1;1,1,1"); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Set Matrix Zeroes" subtitle="In-place markers · O(R×C) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,1,1;1,0,1;1,1,1" label="Matrix (;-separated rows):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="setMatrixZeroes.cpp" />
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
