import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int missingNumber(int arr[], int n) {` },
    { id: 1, text: `    int xor1 = 0, xor2 = 0;` },
    { id: 2, text: `    for (int i = 0; i < n - 1; i++) {` },
    { id: 3, text: `        xor2 ^= arr[i];` },
    { id: 4, text: `        xor1 ^= (i + 1);` },
    { id: 5, text: `    }` },
    { id: 6, text: `    xor1 ^= n;` },
    { id: 7, text: `    return xor1 ^ xor2;` },
    { id: 8, text: `}` },
];

function gen(arr, n) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let xor1 = 0, xor2 = 0;
    push(1, "init", { xor1, xor2, n }, "Initialize XOR accumulators", []);

    for (let i = 0; i < arr.length; i++) {
        xor2 ^= arr[i];
        xor1 ^= (i + 1);
        push(3, "xor", { xor1, xor2, i, "arr[i]": arr[i], "i+1": i + 1 },
            `xor2 ^= ${arr[i]} = ${xor2}, xor1 ^= ${i + 1} = ${xor1}`,
            [{ idx: i, color: "#38bdf8" }]);
    }

    xor1 ^= n;
    push(6, "final-xor", { xor1, xor2 }, `xor1 ^= ${n} = ${xor1}`, []);

    const answer = xor1 ^ xor2;
    push(7, "done", { xor1, xor2, MISSING: answer }, `✅ Missing = xor1 ^ xor2 = ${answer}`, []);
    return { steps, answer, arr };
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

const PC = { init: "#8b5cf6", xor: "#38bdf8", "final-xor": "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", xor: "⊕ XOR", "final-xor": "⊕ FINAL", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Array of n-1 numbers from 1 to n. Find the missing one.

## Three Approaches
1. **Sum formula:** expected - actual sum = missing (overflow risk)
2. **XOR approach:** XOR all numbers 1..n, XOR all array elements, XOR results → missing
3. **Sorting + scan:** O(n log n) — worse

## Why XOR Works
XOR properties: a ^ a = 0, a ^ 0 = a
If we XOR all numbers 1..n AND all array elements, every number cancels out EXCEPT the missing one!`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 2, 4, 5], n=5

- xor1 = 1^2^3^4^5 = 1
- xor2 = 1^2^4^5 = 2
- missing = 1^2 = 3 ✅

### Complexity
- **Time:** O(n)
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## XOR Both Sequences

### xor1: XOR of 1..n
Built up in the loop (i+1) and final step (^= n).

### xor2: XOR of array elements
Built up by XORing each arr[i].

### Result
    return xor1 ^ xor2;
Paired numbers cancel, leaving only the missing number.`
    },
];

const DEFAULT = [1, 2, 4, 5];
const DEFAULT_N = 5;
export default function MissingNumber() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_N));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const n = Math.max(...a, a.length + 1);
        if (a.length < 1 || a.length > 15) return;
        setSess(gen(a, n)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT, DEFAULT_N)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Find Missing Number" subtitle="XOR approach · O(n) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,4,5" label="Array (1..n missing one):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="missingNumber.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#f59e0b", fontWeight: 700 }}>Missing: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
