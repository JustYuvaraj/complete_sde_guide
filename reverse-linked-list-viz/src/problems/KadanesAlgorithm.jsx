import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int maxSubArray(int arr[], int n) {` },
    { id: 1, text: `    int maxSum = arr[0], curSum = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        curSum += arr[i];` },
    { id: 4, text: `        maxSum = max(maxSum, curSum);` },
    { id: 5, text: `        if (curSum < 0) curSum = 0;` },
    { id: 6, text: `    }` },
    { id: 7, text: `    return maxSum;` },
    { id: 8, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let maxSum = arr[0], curSum = 0;
    push(1, "init", { maxSum, curSum }, "Start Kadane's algorithm", []);

    let bestStart = 0, bestEnd = 0, tempStart = 0;
    for (let i = 0; i < arr.length; i++) {
        curSum += arr[i];
        push(3, "add", { curSum, maxSum, i, "arr[i]": arr[i] },
            `curSum += ${arr[i]} → ${curSum}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (curSum > maxSum) {
            maxSum = curSum;
            bestStart = tempStart;
            bestEnd = i;
            const hl = [];
            for (let j = bestStart; j <= bestEnd; j++) hl.push({ idx: j, color: "#22c55e" });
            push(4, "new-max", { curSum, maxSum, "best": `[${bestStart}..${bestEnd}]` },
                `New max! curSum=${curSum} > old maxSum → maxSum=${maxSum}`, hl);
        }

        if (curSum < 0) {
            push(5, "reset", { curSum: 0, maxSum, i },
                `curSum=${curSum} < 0 → reset to 0 (discard subarray)`,
                [{ idx: i, color: "#ef4444" }]);
            curSum = 0;
            tempStart = i + 1;
        }
    }

    push(7, "done", { maxSum, ANSWER: maxSum }, `✅ Maximum subarray sum = ${maxSum}`, []);
    return { steps, answer: maxSum, arr, bestStart, bestEnd };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (Kadane's)">
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

const PC = { init: "#8b5cf6", add: "#38bdf8", "new-max": "#22c55e", reset: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", add: "➕ ADD", "new-max": "🏆 MAX", reset: "🔄 RESET", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the contiguous subarray with the **largest sum**. (LC #53)

## Kadane's Key Insight
At each position, make a choice:
- **Extend** the current subarray (curSum + arr[i])
- **Start fresh** from arr[i] (if curSum went negative)

A negative curSum can only HURT future subarrays. So reset to 0.

## The Mental Model
Think of curSum as your "running profit." If it goes negative, you're losing money — better to start a new investment.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

- i=0: cur=-2, max=-2, reset(cur<0→0)
- i=1: cur=1, max=1
- i=2: cur=-2, max=1, reset
- i=3: cur=4, max=4
- i=4: cur=3, max=4
- i=5: cur=5, max=5
- i=6: cur=6, max=6 ← **best!**
- i=7: cur=1, max=6
- i=8: cur=5, max=6

**Answer: 6** (subarray [4,-1,2,1])

### Complexity
- **Time:** O(n)
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Three Lines of Genius

### Extend
    curSum += arr[i];

### Track best
    maxSum = max(maxSum, curSum);

### Reset if negative
    if (curSum < 0) curSum = 0;

### Why initialize maxSum = arr[0]?
Handles all-negative arrays. If we used 0, we'd miss the answer.`
    },
];

const DEFAULT = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
export default function KadanesAlgorithm() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Kadane's Algorithm" subtitle="Maximum subarray sum · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="-2,1,-3,4,-1,2,1,-5,4" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="kadanes.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Max Sum: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
