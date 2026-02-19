import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `bool isSorted(int arr[], int n) {` },
    { id: 1, text: `    for (int i = 1; i < n; i++) {` },
    { id: 2, text: `        if (arr[i] < arr[i-1])` },
    { id: 3, text: `            return false;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    return true;` },
    { id: 6, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });
    push(0, "init", {}, "Start checking if array is sorted", []);

    for (let i = 1; i < arr.length; i++) {
        push(2, "compare", { i, "arr[i]": arr[i], "arr[i-1]": arr[i - 1] },
            `Compare arr[${i}]=${arr[i]} with arr[${i - 1}]=${arr[i - 1]}`,
            [{ idx: i, color: "#38bdf8" }, { idx: i - 1, color: "#a78bfa" }]);

        if (arr[i] < arr[i - 1]) {
            push(3, "unsorted", { i, "arr[i]": arr[i], "arr[i-1]": arr[i - 1], RESULT: false },
                `❌ arr[${i}]=${arr[i]} < arr[${i - 1}]=${arr[i - 1]} → NOT sorted!`,
                [{ idx: i, color: "#ef4444" }, { idx: i - 1, color: "#ef4444" }]);
            return { steps, answer: false, arr };
        }
        push(2, "ok", { i, "arr[i]": arr[i], "arr[i-1]": arr[i - 1] },
            `✓ arr[${i}]=${arr[i]} >= arr[${i - 1}]=${arr[i - 1]}`,
            [{ idx: i, color: "#22c55e" }, { idx: i - 1, color: "#22c55e" }]);
    }

    push(5, "done", { RESULT: true }, `✅ Array is sorted!`, []);
    return { steps, answer: true, arr };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
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
                            }}>{val}</div>
                            <span style={{ fontSize: "0.5rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", compare: "#38bdf8", ok: "#22c55e", unsorted: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", compare: "🔍 COMPARE", ok: "✓ OK", unsorted: "❌ UNSORTED", done: "✅ SORTED" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Check if an array is sorted in **non-decreasing** order.

## Key Insight
A sorted array has **every element >= the previous one**. If we find even ONE pair where arr[i] < arr[i-1], it's not sorted.

## Why One Pass?
We scan left to right. The moment we find a violation, we know the answer immediately — no need to check the rest.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Steps
1. Start from index 1 (need previous element)
2. Compare each arr[i] with arr[i-1]
3. If arr[i] < arr[i-1] → return false
4. If all pass → return true

### Complexity
- **Time:** O(n)
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Lines

### Line 2: The Check
    if (arr[i] < arr[i-1])
We use **strict less than**. Equal elements are fine (non-decreasing).

### Time & Space
- **Time:** O(n) worst, O(1) best (first pair is out of order)
- **Space:** O(1)`
    },
];

const DEFAULT = [1, 2, 3, 4, 5];
export default function CheckSorted() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Check if Array is Sorted" subtitle="Verify non-decreasing order · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3,4,5" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="checkSorted.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.answer ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{sess.answer ? "✅ Sorted" : "❌ Not Sorted"}</span></StepInfo>
        </VizLayout>
    );
}
