import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const DEFAULT_MATRIX = [
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7],
    [1, 0, 3, 0, 5],
];

const CODE = [
    { id: 0, text: `class NumMatrix {` },
    { id: 1, text: `    vector<vector<int>> prefix;` },
    { id: 2, text: `    NumMatrix(vector<vector<int>>& mat) {` },
    { id: 3, text: `        int m = mat.size(), n = mat[0].size();` },
    { id: 4, text: `        prefix.assign(m+1, vector<int>(n+1, 0));` },
    { id: 5, text: `        for (int r = 1; r <= m; r++)` },
    { id: 6, text: `            for (int c = 1; c <= n; c++)` },
    { id: 7, text: `                prefix[r][c] = mat[r-1][c-1]` },
    { id: 8, text: `                    + prefix[r-1][c]` },
    { id: 9, text: `                    + prefix[r][c-1]` },
    { id: 10, text: `                    - prefix[r-1][c-1];` },
    { id: 11, text: `    }` },
    { id: 12, text: `    int sumRegion(r1, c1, r2, c2) {` },
    { id: 13, text: `        return prefix[r2+1][c2+1]` },
    { id: 14, text: `             - prefix[r1][c2+1]` },
    { id: 15, text: `             - prefix[r2+1][c1]` },
    { id: 16, text: `             + prefix[r1][c1];` },
    { id: 17, text: `    }` },
    { id: 18, text: `};` },
];

const PHASE_COLOR = { init: "#8b5cf6", build: "#3b82f6", query: "#f59e0b", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", build: "BUILD PREFIX", query: "QUERY", done: "RESULT ✓" };

function buildPrefix(mat) {
    const m = mat.length, n = mat[0].length;
    const prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let r = 1; r <= m; r++)
        for (let c = 1; c <= n; c++)
            prefix[r][c] = mat[r - 1][c - 1] + prefix[r - 1][c] + prefix[r][c - 1] - prefix[r - 1][c - 1];
    return prefix;
}

function generateSteps(mat) {
    const steps = [];
    const m = mat.length, n = mat[0].length;

    steps.push({
        cl: 2, phase: "init", mat, prefix: null, activeR: -1, activeC: -1, queryRegion: null,
        msg: `Build 2D prefix sum matrix for O(1) range queries`,
        vars: { rows: m, cols: n },
    });

    const prefix = buildPrefix(mat);

    // Show build steps (just a few key ones)
    for (let r = 1; r <= m; r++) {
        steps.push({
            cl: 7, phase: "build", mat, prefix: prefix.map(row => [...row]), activeR: r - 1, activeC: -1, queryRegion: null,
            msg: `Row ${r - 1}: prefix built → [${prefix[r].slice(1).join(",")}]`,
            vars: { row: r - 1, [`prefix[${r}]`]: `[${prefix[r].slice(1).join(",")}]` },
        });
    }

    // Example query
    const r1 = 2, c1 = 1, r2 = 4, c2 = 3;
    const result = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];

    steps.push({
        cl: 13, phase: "query", mat, prefix: prefix.map(row => [...row]),
        activeR: -1, activeC: -1, queryRegion: { r1, c1, r2, c2 },
        msg: `sumRegion(${r1},${c1},${r2},${c2}) = ${prefix[r2 + 1][c2 + 1]} - ${prefix[r1][c2 + 1]} - ${prefix[r2 + 1][c1]} + ${prefix[r1][c1]}`,
        vars: { r1, c1, r2, c2, result },
    });

    steps.push({
        cl: 16, phase: "done", mat, prefix: prefix.map(row => [...row]),
        activeR: -1, activeC: -1, queryRegion: { r1, c1, r2, c2 },
        msg: `🟢 sumRegion(${r1},${c1},${r2},${c2}) = ${result}`,
        vars: { "return": result },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 304 — Range Sum Query 2D - Immutable

**Difficulty:** Medium &nbsp; **Topics:** Array, Matrix, Prefix Sum, Design

---

Given a 2D matrix, handle multiple queries of the form: find the **sum of elements** inside the rectangle defined by (row1, col1) to (row2, col2).

### Key Idea
Build a **2D prefix sum** matrix once → answer any query in O(1).`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## 2D Prefix Sum (Inclusion-Exclusion)

### Build
\`prefix[r][c] = mat[r-1][c-1] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1]\`

### Query
\`sum = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]\``
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Build** | **O(m×n)** | One pass |
| **Query** | **O(1)** | 4 lookups |
| **Space** | **O(m×n)** | Prefix matrix |`
    }
];

export default function RangeSumQuery2D() {
    const { theme, isDark } = useTheme();
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_MATRIX));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1500);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleReset() {
        setSteps(generateSteps(DEFAULT_MATRIX)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Range Sum Query 2D" subtitle="LC #304 · 2D Prefix Sum">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "10px" }}>
                <button onClick={handleReset} style={{
                    padding: "6px 16px", borderRadius: "8px", border: `1px solid ${theme.cardBorder}`,
                    background: theme.cardBg, color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer",
                }}>↺ Reset</button>
            </div>

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="range_sum_query_2d.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="📊 Matrix">
                <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${step.mat[0].length}, 42px)`, gap: "3px", justifyContent: "center" }}>
                    {step.mat.flat().map((val, i) => {
                        const r = Math.floor(i / step.mat[0].length), c = i % step.mat[0].length;
                        const isActiveRow = step.activeR === r;
                        const inQuery = step.queryRegion && r >= step.queryRegion.r1 && r <= step.queryRegion.r2
                            && c >= step.queryRegion.c1 && c <= step.queryRegion.c2;
                        return (
                            <div key={i} style={{
                                width: "42px", height: "42px", borderRadius: "6px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: inQuery ? (isDark ? "#10b98120" : "#dcfce7")
                                    : isActiveRow ? `${pc}12`
                                        : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${inQuery ? "#10b981" : isActiveRow ? pc : theme.cardBorder}`,
                                fontWeight: "800", fontSize: "0.9rem", fontFamily: "monospace",
                                color: inQuery ? "#10b981" : isActiveRow ? pc : theme.text,
                                transition: "all 0.2s",
                            }}>{val}</div>
                        );
                    })}
                </div>
                {step.queryRegion && (
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.7rem", fontWeight: "700", color: "#10b981" }}>
                        Query region: ({step.queryRegion.r1},{step.queryRegion.c1}) → ({step.queryRegion.r2},{step.queryRegion.c2})
                    </div>
                )}
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
