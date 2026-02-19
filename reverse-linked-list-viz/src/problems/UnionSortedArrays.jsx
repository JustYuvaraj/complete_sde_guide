import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> unionArr(int a[], int b[], int n, int m) {` },
    { id: 1, text: `    vector<int> res;` },
    { id: 2, text: `    int i = 0, j = 0;` },
    { id: 3, text: `    while (i < n && j < m) {` },
    { id: 4, text: `        if (a[i] <= b[j]) {` },
    { id: 5, text: `            if (!res.size() || res.back()!=a[i])` },
    { id: 6, text: `                res.push_back(a[i]);` },
    { id: 7, text: `            i++;` },
    { id: 8, text: `        } else {` },
    { id: 9, text: `            if (!res.size() || res.back()!=b[j])` },
    { id: 10, text: `                res.push_back(b[j]);` },
    { id: 11, text: `            j++;` },
    { id: 12, text: `        }` },
    { id: 13, text: `    }` },
    { id: 14, text: `    // remaining elements...` },
    { id: 15, text: `    return res;` },
    { id: 16, text: `}` },
];

function gen(a, b) {
    const steps = [];
    const res = [];
    const push = (cl, ph, v, m, hlA, hlB) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, hlA: hlA || [], hlB: hlB || [], result: [...res] });

    let i = 0, j = 0;
    push(2, "init", { i, j }, "Two pointers at start of both arrays", [], []);

    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) {
            push(4, "compare", { i, j, "a[i]": a[i], "b[j]": b[j] },
                `a[${i}]=${a[i]} ≤ b[${j}]=${b[j]} → pick from a`,
                [{ idx: i, color: "#38bdf8" }], [{ idx: j, color: "#a78bfa" }]);
            if (!res.length || res[res.length - 1] !== a[i]) {
                res.push(a[i]);
                push(6, "add", { i, j, added: a[i] },
                    `Add ${a[i]} to result`, [{ idx: i, color: "#22c55e" }], []);
            } else {
                push(7, "skip-dup", { i, j },
                    `${a[i]} already in result, skip`, [{ idx: i, color: "#64748b" }], []);
            }
            i++;
        } else {
            push(4, "compare", { i, j, "a[i]": a[i], "b[j]": b[j] },
                `b[${j}]=${b[j]} < a[${i}]=${a[i]} → pick from b`,
                [{ idx: i, color: "#a78bfa" }], [{ idx: j, color: "#38bdf8" }]);
            if (!res.length || res[res.length - 1] !== b[j]) {
                res.push(b[j]);
                push(10, "add", { i, j, added: b[j] },
                    `Add ${b[j]} to result`, [], [{ idx: j, color: "#22c55e" }]);
            } else {
                push(11, "skip-dup", { i, j },
                    `${b[j]} already in result, skip`, [], [{ idx: j, color: "#64748b" }]);
            }
            j++;
        }
    }

    while (i < a.length) {
        if (!res.length || res[res.length - 1] !== a[i]) res.push(a[i]);
        push(14, "remaining", { i }, `Add remaining a[${i}]=${a[i]}`, [{ idx: i, color: "#f59e0b" }], []);
        i++;
    }
    while (j < b.length) {
        if (!res.length || res[res.length - 1] !== b[j]) res.push(b[j]);
        push(14, "remaining", { j }, `Add remaining b[${j}]=${b[j]}`, [], [{ idx: j, color: "#f59e0b" }]);
        j++;
    }

    push(15, "done", { "union size": res.length }, `✅ Union: [${res.join(",")}]`, [], []);
    return { steps, answer: res, a, b };
}

function DualArrayGrid({ a, b, hlA = [], hlB = [], result = [] }) {
    const { isDark } = useTheme();
    const renderArr = (arr, hls, label) => {
        const hlMap = {};
        hls.forEach(h => { hlMap[h.idx] = h.color; });
        return (
            <div>
                <div style={{ fontSize: "0.6rem", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "4px", fontWeight: 700 }}>{label}</div>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                    {arr.map((val, i) => {
                        const c = hlMap[i];
                        return (
                            <div key={i} style={{
                                width: "38px", height: "38px", borderRadius: "8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.75rem",
                                background: c ? `${c}20` : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isDark ? "#334155" : "#e2e8f0")}`,
                                color: c || (isDark ? "#e2e8f0" : "#1e293b"),
                                transition: "all 0.3s",
                            }}>{val}</div>
                        );
                    })}
                </div>
            </div>
        );
    };
    return (
        <VizCard title="📊 Arrays & Result">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
                {renderArr(a, hlA, "Array A")}
                {renderArr(b, hlB, "Array B")}
                <div>
                    <div style={{ fontSize: "0.6rem", color: "#22c55e", marginBottom: "4px", fontWeight: 700 }}>Result</div>
                    <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                        {result.length === 0 ? <span style={{ fontSize: "0.6rem", color: isDark ? "#475569" : "#94a3b8" }}>empty</span> :
                            result.map((val, i) => (
                                <div key={i} style={{
                                    width: "38px", height: "38px", borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.75rem",
                                    background: "#22c55e18", border: "2px solid #22c55e44", color: "#22c55e",
                                }}>{val}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", compare: "#38bdf8", add: "#22c55e", "skip-dup": "#64748b", remaining: "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", compare: "🔍 CMP", add: "➕ ADD", "skip-dup": "⏭️ DUP", remaining: "📌 REST", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Merge two sorted arrays into one sorted array with **no duplicates**.

## Key Insight — Merge Step
Use two pointers (like merge sort's merge step):
- Compare a[i] and b[j]
- Pick the smaller one
- Skip if it's a duplicate of the last added element

## Why Two Pointers Work
Both arrays are sorted. By always picking the smaller element, the result stays sorted automatically.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: a=[1,2,3], b=[2,3,4]

1. a[0]=1 ≤ b[0]=2 → add 1, i++
2. a[1]=2 ≤ b[0]=2 → add 2, i++
3. a[2]=3 > b[0]=2 → 2 is dup, skip. j++
4. a[2]=3 ≤ b[1]=3 → add 3, i++
5. b[1]=3 is dup, skip. j++
6. b[2]=4 remaining → add 4
7. Result: [1, 2, 3, 4] ✅

### Complexity
- **Time:** O(n + m)
- **Space:** O(n + m) for result`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Merge with Dedup

### Two Pointers
i for array a, j for array b. Always advance the pointer of the smaller element.

### Duplicate Check
    if (!res.size() || res.back() != val)
Only add if different from the last element in result.

### Remaining Elements
After one array is exhausted, add remaining elements from the other.`
    },
];

const DEF_A = [1, 2, 3, 4, 5];
const DEF_B = [2, 3, 4, 6, 7];
export default function UnionSortedArrays() {
    const [inA, setInA] = useState(DEF_A.join(","));
    const [inB, setInB] = useState(DEF_B.join(","));
    const [sess, setSess] = useState(() => gen(DEF_A, DEF_B));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1100);
    const run = () => {
        const a = inA.split(",").map(Number).filter(v => !isNaN(v)).sort((x, y) => x - y);
        const b = inB.split(",").map(Number).filter(v => !isNaN(v)).sort((x, y) => x - y);
        if (a.length < 1 || b.length < 1 || a.length + b.length > 20) return;
        setSess(gen(a, b)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInA(DEF_A.join(",")); setInB(DEF_B.join(",")); setSess(gen(DEF_A, DEF_B)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Union of Two Sorted Arrays" subtitle="Two-pointer merge · O(n+m)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={inA} onChange={setInA} onRun={run} onReset={reset} placeholder="1,2,3" label="Array A:" />
                <InputSection value={inB} onChange={setInB} onRun={run} onReset={reset} placeholder="2,3,4" label="Array B:" />
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="unionArrays.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <DualArrayGrid a={sess.a} b={sess.b} hlA={step.hlA} hlB={step.hlB} result={step.result} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Union: [{sess.answer.join(",")}]</span></StepInfo>
        </VizLayout>
    );
}
