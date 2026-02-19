import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<vector<int>> generate(int n) {` },
    { id: 1, text: `    vector<vector<int>> tri;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        vector<int> row(i+1, 1);` },
    { id: 4, text: `        for (int j = 1; j < i; j++)` },
    { id: 5, text: `            row[j] = tri[i-1][j-1]+tri[i-1][j];` },
    { id: 6, text: `        tri.push_back(row);` },
    { id: 7, text: `    }` },
    { id: 8, text: `    return tri;` },
    { id: 9, text: `}` },
];

function gen(n) {
    const steps = [];
    const tri = [];
    const push = (cl, ph, v, msg, hlRow, hlCol) => steps.push({
        cl, phase: ph, vars: { ...v }, msg, hlRow, hlCol, triangle: tri.map(r => [...r])
    });

    push(1, "init", { n }, `Build Pascal's Triangle with ${n} rows`, -1, -1);

    for (let i = 0; i < n; i++) {
        const row = Array(i + 1).fill(1);
        push(3, "new-row", { "row": i, "size": i + 1 }, `Row ${i}: starts with all 1s`, i, -1);

        for (let j = 1; j < i; j++) {
            row[j] = tri[i - 1][j - 1] + tri[i - 1][j];
            push(5, "compute", { "row": i, j, "tri[i-1][j-1]": tri[i - 1][j - 1], "tri[i-1][j]": tri[i - 1][j], "sum": row[j] },
                `row[${j}] = ${tri[i - 1][j - 1]} + ${tri[i - 1][j]} = ${row[j]}`, i, j);
        }

        tri.push(row);
        push(6, "added", { "row": i }, `Row ${i} complete: [${row.join(",")}]`, i, -1);
    }

    push(8, "done", { "rows": n }, `✅ Pascal's Triangle with ${n} rows`, -1, -1);
    return { steps, triangle: tri, n };
}

function TriangleViz({ triangle, hlRow, hlCol }) {
    const { isDark } = useTheme();
    return (
        <VizCard title="🔺 Pascal's Triangle">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "8px 0" }}>
                {triangle.map((row, i) => (
                    <div key={i} style={{ display: "flex", gap: "3px", justifyContent: "center" }}>
                        {row.map((val, j) => {
                            const isHl = (i === hlRow) || (i === hlRow && j === hlCol);
                            const isCompute = i === hlRow && j === hlCol;
                            const c = isCompute ? "#f59e0b" : isHl ? "#22c55e" : undefined;
                            return (
                                <div key={j} style={{
                                    width: "36px", height: "32px", borderRadius: "6px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 700, fontSize: "0.7rem",
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

const PC = { init: "#8b5cf6", "new-row": "#38bdf8", compute: "#f59e0b", added: "#22c55e", done: "#10b981" };
const PL = { init: "⚙️ INIT", "new-row": "➕ ROW", compute: "🔢 SUM", added: "✅ DONE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Generate Pascal's Triangle. Each number = sum of two numbers above it.

## Key Insight
- Row edges are always 1
- Inner values: tri[i][j] = tri[i-1][j-1] + tri[i-1][j]

## Applications
- Binomial coefficients: C(n,k) = row n, position k
- Polynomial expansion: (a+b)^n`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## First 5 rows:
    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1

### Complexity
- **Time:** O(n²)
- **Space:** O(n²)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Row Construction

### Initialize with 1s
    vector<int> row(i+1, 1);

### Fill inner values
    row[j] = tri[i-1][j-1] + tri[i-1][j];
j goes from 1 to i-1 (skip edges).`
    },
];

const DEFAULT_N = 6;
export default function PascalsTriangle() {
    const [nInput, setNInput] = useState(String(DEFAULT_N));
    const [sess, setSess] = useState(() => gen(DEFAULT_N));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const run = () => { const n = parseInt(nInput); if (n < 1 || n > 10) return; setSess(gen(n)); setIdx(0); setPlaying(false); };
    const reset = () => { setNInput(String(DEFAULT_N)); setSess(gen(DEFAULT_N)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Pascal's Triangle" subtitle="Row-by-row generation · O(n²)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={nInput} onChange={setNInput} onRun={run} onReset={reset} placeholder="6" label="Rows (n):" />
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="pascals.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <TriangleViz triangle={step.triangle} hlRow={step.hlRow} hlCol={step.hlCol} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length} />
        </VizLayout>
    );
}
