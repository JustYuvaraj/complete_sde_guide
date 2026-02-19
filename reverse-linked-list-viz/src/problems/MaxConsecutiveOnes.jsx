import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int maxConsecutiveOnes(int arr[], int n) {` },
    { id: 1, text: `    int maxC = 0, count = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        if (arr[i] == 1) {` },
    { id: 4, text: `            count++;` },
    { id: 5, text: `            maxC = max(maxC, count);` },
    { id: 6, text: `        } else {` },
    { id: 7, text: `            count = 0;` },
    { id: 8, text: `        }` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return maxC;` },
    { id: 11, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });
    let maxC = 0, count = 0;
    push(1, "init", { maxC, count }, "Initialize counters", []);

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
            count++;
            maxC = Math.max(maxC, count);
            push(5, "one", { maxC, count, i },
                `arr[${i}]=1 → count=${count}, maxC=${maxC}`,
                [{ idx: i, color: "#22c55e" }]);
        } else {
            count = 0;
            push(7, "zero", { maxC, count, i },
                `arr[${i}]=0 → reset count=0`,
                [{ idx: i, color: "#ef4444" }]);
        }
    }

    push(10, "done", { maxC, ANSWER: maxC }, `✅ Max consecutive ones = ${maxC}`, []);
    return { steps, answer: maxC, arr };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Binary Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const isOne = val === 1;
                    return (
                        <div key={i} style={{ width: "42px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "38px", height: "38px", borderRadius: "8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: c ? `${c}20` : isOne ? "#22c55e12" : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isOne ? "#22c55e44" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                color: c || (isOne ? "#22c55e" : "#64748b"),
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

const PC = { init: "#8b5cf6", one: "#22c55e", zero: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", one: "1️⃣ ONE", zero: "0️⃣ ZERO", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the maximum number of consecutive 1s in a binary array.

## Key Insight
Maintain a **running counter**: increment for 1s, reset to 0 for 0s.
Track the maximum seen so far.

## Why Single Pass?
Each element either extends the current streak or breaks it. We only need to remember the current and best streak.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 1, 0, 1, 1, 1]
1. i=0: arr=1 → count=1, max=1
2. i=1: arr=1 → count=2, max=2
3. i=2: arr=0 → count=0, max=2
4. i=3: arr=1 → count=1, max=2
5. i=4: arr=1 → count=2, max=2
6. i=5: arr=1 → count=3, max=3 ✅

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Counter Pattern
### On 1: increment and update max
    count++;
    maxC = max(maxC, count);

### On 0: reset
    count = 0;

This pattern appears in many "consecutive" problems!`
    },
];

const DEFAULT = [1, 1, 0, 1, 1, 1, 0, 1];
export default function MaxConsecutiveOnes() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = input.split(",").map(Number).filter(v => v === 0 || v === 1); if (a.length < 1 || a.length > 20) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Maximum Consecutive Ones" subtitle="Running counter · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,1,0,1,1,1" label="Binary array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="maxConsecutiveOnes.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Max: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
