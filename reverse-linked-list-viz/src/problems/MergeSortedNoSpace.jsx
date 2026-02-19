import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void merge(int a[],int m,int b[],int n){` },
    { id: 1, text: `    int i=m-1, j=0;` },
    { id: 2, text: `    while(i>=0 && j<n){` },
    { id: 3, text: `        if(a[i]>b[j]){` },
    { id: 4, text: `            swap(a[i],b[j]);` },
    { id: 5, text: `            i--; j++;` },
    { id: 6, text: `        } else break;` },
    { id: 7, text: `    }` },
    { id: 8, text: `    sort(a,a+m);` },
    { id: 9, text: `    sort(b,b+n);` },
    { id: 10, text: `}` },
];

function gen(arrA, arrB) {
    const steps = [];
    const a = [...arrA], b = [...arrB];
    const push = (cl, ph, v, m, hlA, hlB) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, hlA: hlA || [], hlB: hlB || [], a: [...a], b: [...b] });

    let i = a.length - 1, j = 0;
    push(1, "init", { i, j }, "Compare largest of A with smallest of B", [], []);

    while (i >= 0 && j < b.length) {
        if (a[i] > b[j]) {
            push(3, "compare", { i, j, "a[i]": a[i], "b[j]": b[j] },
                `a[${i}]=${a[i]} > b[${j}]=${b[j]} → swap`,
                [{ idx: i, color: "#ef4444" }], [{ idx: j, color: "#22c55e" }]);
            [a[i], b[j]] = [b[j], a[i]];
            push(4, "swapped", { "a[i]": a[i], "b[j]": b[j] }, `After swap`, [{ idx: i, color: "#22c55e" }], [{ idx: j, color: "#22c55e" }]);
            i--; j++;
        } else {
            push(6, "stop", { "a[i]": a[i], "b[j]": b[j] },
                `a[${i}]=${a[i]} ≤ b[${j}]=${b[j]} → stop`,
                [{ idx: i, color: "#38bdf8" }], [{ idx: j, color: "#38bdf8" }]);
            break;
        }
    }

    a.sort((x, y) => x - y);
    b.sort((x, y) => x - y);
    push(9, "sort", {}, "Sort both arrays individually", [], []);
    push(9, "done", {}, `✅ Merged: A=[${a.join(",")}], B=[${b.join(",")}]`, [], []);

    return { steps, a, b, origA: arrA, origB: arrB };
}

function DualArrayGrid({ a, b, hlA = [], hlB = [] }) {
    const { isDark } = useTheme();
    const renderArr = (arr, hls, label, color) => {
        const hlMap = {};
        hls.forEach(h => { hlMap[h.idx] = h.color; });
        return (
            <div>
                <div style={{ fontSize: "0.55rem", color, marginBottom: "3px", fontWeight: 700 }}>{label}</div>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                    {arr.map((val, i) => {
                        const c = hlMap[i];
                        return (
                            <div key={i} style={{
                                width: "40px", height: "40px", borderRadius: "8px",
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
            </div>
        );
    };
    return (
        <VizCard title="📊 Arrays A & B">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
                {renderArr(a, hlA, "Array A", "#38bdf8")}
                {renderArr(b, hlB, "Array B", "#f59e0b")}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", compare: "#ef4444", swapped: "#22c55e", stop: "#38bdf8", sort: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", compare: "🔄 CMP", swapped: "🔀 SWAP", stop: "🛑 STOP", sort: "📊 SORT", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Merge two sorted arrays WITHOUT extra space. (Modify arrays in-place.)

## Key Insight — Gap Method / Two Pointer
Compare largest of A with smallest of B. If out of order → swap. Then sort both arrays.

## Why This Works
After swapping, all elements in A ≤ all elements in B. Then sorting each independently gives the merged result.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: A=[1,4,8,10], B=[2,3,9]

- i=3,j=0: 10>2 → swap → A=[1,4,8,2], B=[10,3,9]
- i=2,j=1: 8>3 → swap → A=[1,4,3,2], B=[10,8,9]
- i=1,j=2: 4<9 → stop!
- Sort A: [1,2,3,4], Sort B: [8,9,10]

**Merged: [1,2,3,4,8,9,10]** ✅

### Complexity: O((m+n)log(m+n))`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Swap + Sort

### Compare from ends toward middle
    while(a[i] > b[j]) swap and move

### Break early
When a[i] ≤ b[j], all remaining elements are correctly partitioned.

### Sort individually
After partitioning, each array needs its own internal sorting.`
    },
];

const DEFAULT_A = [1, 4, 8, 10];
const DEFAULT_B = [2, 3, 9];
export default function MergeSortedNoSpace() {
    const [inputA, setInputA] = useState(DEFAULT_A.join(","));
    const [inputB, setInputB] = useState(DEFAULT_B.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT_A, DEFAULT_B));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const a = inputA.split(",").map(Number).filter(v => !isNaN(v));
        const b = inputB.split(",").map(Number).filter(v => !isNaN(v));
        if (a.length < 1 || b.length < 1) return;
        setSess(gen(a, b)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInputA(DEFAULT_A.join(",")); setInputB(DEFAULT_B.join(",")); setSess(gen(DEFAULT_A, DEFAULT_B)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Merge Sorted Arrays (No Extra Space)" subtitle="Swap + sort · O((m+n)log(m+n))">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={inputA} onChange={setInputA} onRun={run} onReset={reset} placeholder="1,4,8,10" label="Array A (sorted):" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>B:</span>
                    <input type="text" value={inputB} onChange={e => setInputB(e.target.value)} style={{
                        width: "120px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="mergeNoSpace.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <DualArrayGrid a={step.a} b={step.b} hlA={step.hlA} hlB={step.hlB} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length} />
        </VizLayout>
    );
}
