import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int removeDuplicates(int arr[], int n) {` },
    { id: 1, text: `    int i = 0;` },
    { id: 2, text: `    for (int j = 1; j < n; j++) {` },
    { id: 3, text: `        if (arr[j] != arr[i]) {` },
    { id: 4, text: `            i++;` },
    { id: 5, text: `            arr[i] = arr[j];` },
    { id: 6, text: `        }` },
    { id: 7, text: `    }` },
    { id: 8, text: `    return i + 1;` },
    { id: 9, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr];
    const push = (cl, ph, v, m, hl, arrSnap) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...arrSnap] });

    push(1, "init", { i: 0 }, "Place pointer i at index 0", [{ idx: 0, color: "#22c55e" }], a);

    let i = 0;
    for (let j = 1; j < a.length; j++) {
        push(3, "compare", { i, j, "arr[i]": a[i], "arr[j]": a[j] },
            `Compare arr[${j}]=${a[j]} with arr[${i}]=${a[i]}`,
            [{ idx: i, color: "#22c55e" }, { idx: j, color: "#38bdf8" }], a);

        if (a[j] !== a[i]) {
            i++;
            a[i] = a[j];
            push(5, "place", { i, j, "arr[i]": a[i] },
                `New unique! Place ${a[j]} at index ${i}`,
                [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#38bdf8" }], a);
        } else {
            push(6, "skip", { i, j },
                `Duplicate — skip`,
                [{ idx: i, color: "#22c55e" }, { idx: j, color: "#64748b" }], a);
        }
    }

    push(8, "done", { i, "unique count": i + 1 },
        `✅ ${i + 1} unique elements`,
        Array.from({ length: i + 1 }, (_, k) => ({ idx: k, color: "#22c55e" })), a);
    return { steps, answer: i + 1, arr: a, originalArr: [...arr] };
}

function ArrayGrid({ arr, highlights = [], uniqueCount }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (in-place)">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const isUnique = uniqueCount != null && i < uniqueCount;
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: c ? `${c}20` : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isDark ? "#334155" : "#e2e8f0")}`,
                                color: c || (isDark ? "#e2e8f0" : "#1e293b"),
                                transition: "all 0.3s",
                                opacity: uniqueCount != null && !isUnique && !c ? 0.35 : 1,
                            }}>{val}</div>
                            <span style={{ fontSize: "0.5rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", compare: "#38bdf8", place: "#f59e0b", skip: "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", compare: "🔍 CMP", place: "📌 PLACE", skip: "⏭️ SKIP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Remove duplicates from a **sorted** array **in-place**. Return the count of unique elements.

## Key Insight — Two Pointer
Use a **slow pointer i** (last unique position) and a **fast pointer j** (scanner).
- If arr[j] == arr[i] → duplicate, skip
- If arr[j] != arr[i] → new unique, move i forward and copy

## Why It Works
Since the array is sorted, all duplicates are adjacent. The slow pointer only advances for unique values.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 1, 2, 2, 3, 3]

1. i=0, j=1: arr[1]=1 == arr[0]=1 → skip
2. i=0, j=2: arr[2]=2 != arr[0]=1 → i=1, arr[1]=2
3. i=1, j=3: arr[3]=2 == arr[1]=2 → skip
4. i=1, j=4: arr[4]=3 != arr[1]=2 → i=2, arr[2]=3
5. i=2, j=5: arr[5]=3 == arr[2]=3 → skip
6. Result: [1, 2, 3, ...], unique = 3

### Complexity
- **Time:** O(n)
- **Space:** O(1) — in-place!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Two Pointers

### Slow pointer i
Marks the last position of a unique element.

### Fast pointer j
Scans through the entire array.

### The Copy
    i++;
    arr[i] = arr[j];
Only happens when a NEW unique value is found.

### Return i + 1
Because i is 0-indexed, the count of unique elements is i + 1.`
    },
];

const DEFAULT = [1, 1, 2, 2, 3, 3, 4];
export default function RemoveDuplicates() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)).sort((x, y) => x - y); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";
    const uniqueCount = step.phase === "done" ? sess.answer : null;

    return (
        <VizLayout title="Remove Duplicates from Sorted Array" subtitle="Two-pointer in-place · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,1,2,2,3" label="Sorted array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="removeDuplicates.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={step.arr || sess.arr} highlights={step.highlights} uniqueCount={uniqueCount} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Unique: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
