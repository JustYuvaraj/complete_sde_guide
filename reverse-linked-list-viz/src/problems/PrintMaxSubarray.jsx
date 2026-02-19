import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void printMaxSubarray(int arr[], int n) {` },
    { id: 1, text: `    int maxSum=arr[0], curSum=0;` },
    { id: 2, text: `    int start=0, end=0, tempStart=0;` },
    { id: 3, text: `    for (int i = 0; i < n; i++) {` },
    { id: 4, text: `        curSum += arr[i];` },
    { id: 5, text: `        if (curSum > maxSum) {` },
    { id: 6, text: `            maxSum = curSum;` },
    { id: 7, text: `            start = tempStart; end = i;` },
    { id: 8, text: `        }` },
    { id: 9, text: `        if (curSum < 0) {` },
    { id: 10, text: `            curSum = 0;` },
    { id: 11, text: `            tempStart = i + 1;` },
    { id: 12, text: `        }` },
    { id: 13, text: `    }` },
    { id: 14, text: `    // Print arr[start..end]` },
    { id: 15, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let maxSum = arr[0], curSum = 0;
    let start = 0, end = 0, tempStart = 0;
    push(1, "init", { maxSum, curSum, start, end }, "Modified Kadane's: track indices too", []);

    for (let i = 0; i < arr.length; i++) {
        curSum += arr[i];
        push(4, "add", { curSum, maxSum, i, "arr[i]": arr[i], start, end },
            `curSum += ${arr[i]} → ${curSum}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (curSum > maxSum) {
            maxSum = curSum;
            start = tempStart;
            end = i;
            const hl = [];
            for (let j = start; j <= end; j++) hl.push({ idx: j, color: "#22c55e" });
            push(6, "new-max", { curSum, maxSum, start, end },
                `New max! subarray [${start}..${end}], sum=${maxSum}`, hl);
        }

        if (curSum < 0) {
            push(10, "reset", { curSum: 0, maxSum, tempStart: i + 1 },
                `curSum < 0 → reset, new tempStart=${i + 1}`,
                [{ idx: i, color: "#ef4444" }]);
            curSum = 0;
            tempStart = i + 1;
        }
    }

    const subArr = arr.slice(start, end + 1);
    const hl = Array.from({ length: end - start + 1 }, (_, j) => ({ idx: start + j, color: "#22c55e" }));
    push(14, "done", { maxSum, "subarray": `[${subArr.join(",")}]`, "range": `[${start}..${end}]` },
        `✅ Max subarray: [${subArr.join(",")}] = ${maxSum}`, hl);
    return { steps, answer: maxSum, subArr, arr, start, end };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array + Subarray">
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
Find AND PRINT the maximum sum subarray. Extension of Kadane's.

## Key Extension
Track **start** and **end** indices alongside maxSum. When curSum < 0, update tempStart to the next position.

## When to Update start/end?
Only when curSum > maxSum (new best found). Set start = tempStart, end = i.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Kadane's with index tracking:
- Best subarray: [4, -1, 2, 1] at indices [3..6]
- Sum = 6

### Output:
Sum = 6, Subarray = [4, -1, 2, 1]

### Complexity
- **Time:** O(n)
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Index Tracking

### tempStart: potential start of next subarray
Updated when curSum goes negative.

### start, end: indices of best subarray
Updated only when a new max is found.

### Key difference from basic Kadane's
Three extra variables: start, end, tempStart.`
    },
];

const DEFAULT = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
export default function PrintMaxSubarray() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Print Maximum Subarray" subtitle="Kadane's with index tracking · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="-2,1,-3,4,-1,2,1,-5,4" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="printMaxSubarray.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>Sum: {sess.answer} | [{sess.subArr.join(",")}]</span>
            </StepInfo>
        </VizLayout>
    );
}
