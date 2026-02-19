import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void nextPermutation(vector<int>& a) {` },
    { id: 1, text: `    int n = a.size(), i = n - 2;` },
    { id: 2, text: `    // Step 1: Find breakpoint` },
    { id: 3, text: `    while (i>=0 && a[i]>=a[i+1]) i--;` },
    { id: 4, text: `    if (i >= 0) {` },
    { id: 5, text: `        // Step 2: Find just-larger` },
    { id: 6, text: `        int j = n - 1;` },
    { id: 7, text: `        while (a[j] <= a[i]) j--;` },
    { id: 8, text: `        swap(a[i], a[j]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `    // Step 3: Reverse suffix` },
    { id: 11, text: `    reverse(a.begin()+i+1, a.end());` },
    { id: 12, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const push = (cl, ph, v, msg, hl, snap) => steps.push({ cl, phase: ph, vars: { ...v }, msg, highlights: hl || [], arr: [...(snap || a)] });

    push(1, "init", { n }, "Find the next lexicographic permutation", [], a);

    // Step 1: find breakpoint
    let i = n - 2;
    while (i >= 0 && a[i] >= a[i + 1]) {
        push(3, "scan-break", { i, "a[i]": a[i], "a[i+1]": a[i + 1] },
            `a[${i}]=${a[i]} >= a[${i + 1}]=${a[i + 1]}, keep scanning`,
            [{ idx: i, color: "#64748b" }, { idx: i + 1, color: "#64748b" }], a);
        i--;
    }

    if (i >= 0) {
        push(4, "breakpoint", { "breakpoint": i, "a[i]": a[i] },
            `Breakpoint at i=${i}, a[${i}]=${a[i]}`,
            [{ idx: i, color: "#f59e0b" }], a);

        // Step 2: find just-larger element from right
        let j = n - 1;
        while (a[j] <= a[i]) j--;
        push(7, "swap-target", { i, j, "a[i]": a[i], "a[j]": a[j] },
            `Found a[${j}]=${a[j]} > a[${i}]=${a[i]}`,
            [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#22c55e" }], a);

        [a[i], a[j]] = [a[j], a[i]];
        push(8, "swapped", { "after swap": `[${a.join(",")}]` },
            `Swapped positions ${i} and ${j}`,
            [{ idx: i, color: "#22c55e" }, { idx: j, color: "#22c55e" }], a);
    } else {
        push(4, "last-perm", {}, "Already last permutation (descending). Will reverse entire array.", [], a);
    }

    // Step 3: reverse suffix
    let lo = i + 1, hi = n - 1;
    while (lo < hi) {
        [a[lo], a[hi]] = [a[hi], a[lo]];
        lo++; hi--;
    }
    const suffixHl = Array.from({ length: n - (i + 1) }, (_, k) => ({ idx: i + 1 + k, color: "#38bdf8" }));
    push(11, "reversed", {}, `Reversed suffix from index ${i + 1}`, suffixHl, a);

    push(11, "done", { RESULT: `[${a.join(",")}]` }, `✅ Next permutation: [${a.join(",")}]`, [], a);
    return { steps, answer: a, original: arr };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Permutation">
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

const PC = { init: "#8b5cf6", "scan-break": "#64748b", breakpoint: "#f59e0b", "swap-target": "#22c55e", swapped: "#22c55e", "last-perm": "#ef4444", reversed: "#38bdf8", done: "#10b981" };
const PL = { init: "⚙️ INIT", "scan-break": "🔍 SCAN", breakpoint: "📍 BREAK", "swap-target": "🎯 TARGET", swapped: "🔀 SWAP", "last-perm": "🔚 LAST", reversed: "↩️ REVERSE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the next lexicographically greater permutation. (LC #31)

## Three Steps
1. **Find breakpoint** — scan right-to-left for first a[i] < a[i+1]
2. **Find swap target** — smallest element > a[i] in the suffix
3. **Reverse suffix** — reverse everything after position i

## Why?
The suffix after breakpoint is DESC (largest possible). We need the NEXT arrangement by making the smallest possible increase at the breakpoint position.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 3, 5, 4, 2]

1. Scan: 4>2✓, 5>4✓, 3<5 → breakpoint i=1 (a[1]=3)
2. From right: find first > 3 → a[3]=4 → swap → [1,4,5,3,2]
3. Reverse suffix [2..4]: [1,4,2,3,5] ✅

**Answer: [1, 4, 2, 3, 5]**

### Complexity
- **Time:** O(n) — three scans
- **Space:** O(1) — in-place`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Critical Details

### Breakpoint: a[i] < a[i+1]
We need STRICTLY less than. Equal doesn't count.

### Finding swap target
Scan right-to-left for first element > a[i]. This gives the smallest possible increase.

### Why reverse?
After swapping, the suffix is still in descending order. Reversing it gives ascending = smallest possible suffix.

### Edge case
If no breakpoint (entire array descending), reverse the whole array → first permutation.`
    },
];

const DEFAULT = [1, 3, 5, 4, 2];
export default function NextPermutationArr() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 12) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Next Permutation" subtitle="Three steps · O(n) in-place">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,3,5,4,2" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="nextPermutation.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={step.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Result: [{sess.answer.join(",")}]</span></StepInfo>
        </VizLayout>
    );
}
