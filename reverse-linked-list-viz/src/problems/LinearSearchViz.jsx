import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int linearSearch(int arr[], int n, int x) {` },
    { id: 1, text: `    for (int i = 0; i < n; i++) {` },
    { id: 2, text: `        if (arr[i] == x)` },
    { id: 3, text: `            return i;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    return -1;` },
    { id: 6, text: `}` },
];

function gen(arr, target) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    push(0, "init", { x: target }, `Searching for ${target}`, []);

    for (let i = 0; i < arr.length; i++) {
        push(2, "compare", { i, "arr[i]": arr[i], x: target },
            `Compare arr[${i}]=${arr[i]} with ${target}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (arr[i] === target) {
            push(3, "found", { i, RESULT: i },
                `✅ Found ${target} at index ${i}!`,
                [{ idx: i, color: "#22c55e" }]);
            return { steps, answer: i, arr };
        }
        push(2, "miss", { i, "arr[i]": arr[i] },
            `${arr[i]} ≠ ${target}, continue`,
            [{ idx: i, color: "#64748b" }]);
    }

    push(5, "not-found", { RESULT: -1 }, `❌ ${target} not found in array`, []);
    return { steps, answer: -1, arr };
}

function ArrayGrid({ arr, highlights = [], target }) {
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

const PC = { init: "#8b5cf6", compare: "#38bdf8", found: "#22c55e", miss: "#64748b", "not-found": "#ef4444" };
const PL = { init: "⚙️ INIT", compare: "🔍 CMP", found: "✅ FOUND", miss: "⏭️ MISS", "not-found": "❌ NOT FOUND" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the index of element x in an unsorted array.

## Simplest Search
Check each element one by one from left to right. No tricks needed — this works on ANY array (sorted or unsorted).

## When to Use
- Array is **unsorted** (can't use binary search)
- Array is **small** (n < 100)
- Only need to search **once** (not worth sorting first)`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Steps
1. Start from index 0
2. Compare each element with target
3. If match → return index
4. If end reached → return -1

### Complexity
- **Time:** O(n) worst case, O(1) best
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Straightforward

### The Loop
    for (int i = 0; i < n; i++)
Check every single element.

### The Compare
    if (arr[i] == x) return i;
Return immediately upon finding — no need to check rest.

### Not Found
    return -1;
Only reached if loop completes without finding x.`
    },
];

const DEFAULT = [10, 25, 3, 8, 42, 15, 7];
const DEFAULT_TARGET = 42;
export default function LinearSearchViz() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [target, setTarget] = useState(String(DEFAULT_TARGET));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_TARGET));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const t = parseInt(target);
        if (a.length < 1 || a.length > 15 || isNaN(t)) return;
        setSess(gen(a, t)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setTarget(String(DEFAULT_TARGET)); setSess(gen(DEFAULT, DEFAULT_TARGET)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Linear Search" subtitle="Sequential scan · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="10,25,3,8,42" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>Target:</span>
                    <input type="number" value={target} onChange={e => setTarget(e.target.value)} style={{
                        width: "60px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="linearSearch.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} target={parseInt(target)} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}>
                <span style={{ color: sess.answer >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                    {sess.answer >= 0 ? `Found at index ${sess.answer}` : "Not found"}
                </span>
            </StepInfo>
        </VizLayout>
    );
}
