import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int maxProduct(vector<int>& a) {` },
    { id: 1, text: `    int maxP=a[0], pre=1, suf=1;` },
    { id: 2, text: `    int n = a.size();` },
    { id: 3, text: `    for (int i = 0; i < n; i++) {` },
    { id: 4, text: `        if (pre == 0) pre = 1;` },
    { id: 5, text: `        if (suf == 0) suf = 1;` },
    { id: 6, text: `        pre *= a[i];` },
    { id: 7, text: `        suf *= a[n-1-i];` },
    { id: 8, text: `        maxP = max({maxP, pre, suf});` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return maxP;` },
    { id: 11, text: `}` },
];

function gen(arr) {
    const steps = [];
    const n = arr.length;
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let maxP = arr[0], pre = 1, suf = 1;
    push(1, "init", { maxP, pre, suf }, "Prefix × suffix products", []);

    for (let i = 0; i < n; i++) {
        if (pre === 0) pre = 1;
        if (suf === 0) suf = 1;

        pre *= arr[i];
        suf *= arr[n - 1 - i];
        const oldMax = maxP;
        maxP = Math.max(maxP, pre, suf);

        push(8, maxP > oldMax ? "new-max" : "scan",
            { pre, suf, maxP, i, "a[i]": arr[i], "a[n-1-i]": arr[n - 1 - i] },
            `pre=${pre}, suf=${suf}, maxP=${maxP}`,
            [{ idx: i, color: "#38bdf8" }, { idx: n - 1 - i, color: "#f59e0b" }]);
    }

    push(10, "done", { maxP, ANSWER: maxP }, `✅ Max product subarray = ${maxP}`, []);
    return { steps, answer: maxP, arr };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (Prefix ← → Suffix)">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const isNeg = val < 0;
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.8rem",
                                background: c ? `${c}20` : isNeg ? "#ef444418" : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isNeg ? "#ef444444" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                color: c || (isNeg ? "#ef4444" : (isDark ? "#e2e8f0" : "#1e293b")),
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

const PC = { init: "#8b5cf6", scan: "#38bdf8", "new-max": "#22c55e", done: "#10b981" };
const PL = { init: "⚙️ INIT", scan: "🔍 SCAN", "new-max": "🏆 MAX", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the contiguous subarray with the largest product. (LC #152)

## Key Insight — Prefix × Suffix
The max product subarray either:
1. Starts from the left (prefix product)
2. Starts from the right (suffix product)

Why? Because of negatives: even number of negatives → positive product.

## Zero Handling
When we hit 0, reset product to 1 (start fresh).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 3, -2, 4]

Prefix: 2, 6, -12, -48
Suffix: 4, -8, -24, -48... wait, from right:
Suffix: 4, -8, 24, 48

Max = max(prefix products, suffix products) = 48? No...
Actually: maxP = max(2,6,-12,-48,4,-8,24,48) = wait...

Correct: 2×3 = 6 ← answer!
(The -2 breaks the positive chain)

### Complexity: O(n) time, O(1) space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Prefix-Suffix Trick

### Reset on zero
    if (pre == 0) pre = 1;
    if (suf == 0) suf = 1;

### Both directions
    pre *= a[i];       // left to right
    suf *= a[n-1-i];   // right to left

### Track max
    maxP = max({maxP, pre, suf});

### Why both directions?
With odd negatives, max product is either all-but-last-negative or all-but-first-negative. One direction catches each case.`
    },
];

const DEFAULT = [2, 3, -2, 4];
export default function MaxProductSubarray() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Maximum Product Subarray" subtitle="Prefix × suffix · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,3,-2,4" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="maxProduct.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Max Product: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
