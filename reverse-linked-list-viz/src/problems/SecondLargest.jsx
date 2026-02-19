import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int secondLargest(int arr[], int n) {` },
    { id: 1, text: `    int largest = -1, second = -1;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        if (arr[i] > largest) {` },
    { id: 4, text: `            second = largest;` },
    { id: 5, text: `            largest = arr[i];` },
    { id: 6, text: `        } else if (arr[i] > second` },
    { id: 7, text: `                 && arr[i] != largest) {` },
    { id: 8, text: `            second = arr[i];` },
    { id: 9, text: `        }` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return second;` },
    { id: 12, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl ? [...hl] : [] });

    let largest = -1, second = -1;
    push(1, "init", { largest, second }, "Initialize largest = -1, second = -1", []);

    for (let i = 0; i < arr.length; i++) {
        push(2, "scan", { largest, second, i, "arr[i]": arr[i] }, `Checking arr[${i}] = ${arr[i]}`, [{ idx: i, color: "#38bdf8" }]);

        if (arr[i] > largest) {
            second = largest;
            largest = arr[i];
            push(5, "new-largest", { largest, second, i, "arr[i]": arr[i] }, `${arr[i]} > ${largest === arr[i] ? second : largest} → new largest = ${arr[i]}, second = ${second}`, [
                { idx: i, color: "#22c55e" },
            ]);
        } else if (arr[i] > second && arr[i] !== largest) {
            second = arr[i];
            push(8, "new-second", { largest, second, i, "arr[i]": arr[i] }, `${arr[i]} > ${second === arr[i] ? -1 : second} & != ${largest} → new second = ${arr[i]}`, [
                { idx: i, color: "#f59e0b" },
            ]);
        } else {
            push(9, "skip", { largest, second, i, "arr[i]": arr[i] }, `${arr[i]} doesn't update largest or second`, [
                { idx: i, color: "#64748b" },
            ]);
        }
    }

    push(11, "done", { largest, second, ANSWER: second }, `✅ Second largest = ${second}`, []);
    return { steps, answer: second, arr };
}

function ArrayGrid({ arr, highlights = [], largest, second }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const isLargest = val === largest && largest !== -1;
                    const isSecond = val === second && second !== -1 && !isLargest;
                    const hlColor = hlMap[i];
                    return (
                        <div key={i} style={{
                            width: "48px", textAlign: "center",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                        }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: hlColor
                                    ? `${hlColor}20`
                                    : isLargest ? "#22c55e18" : isSecond ? "#f59e0b18" : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${hlColor || (isLargest ? "#22c55e" : isSecond ? "#f59e0b" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                color: hlColor || (isLargest ? "#22c55e" : isSecond ? "#f59e0b" : (isDark ? "#e2e8f0" : "#1e293b")),
                                transition: "all 0.3s",
                            }}>
                                {val}
                            </div>
                            <span style={{ fontSize: "0.5rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                            {isLargest && <span style={{ fontSize: "0.5rem", color: "#22c55e", fontWeight: 700 }}>1st</span>}
                            {isSecond && <span style={{ fontSize: "0.5rem", color: "#f59e0b", fontWeight: 700 }}>2nd</span>}
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", scan: "#38bdf8", "new-largest": "#22c55e", "new-second": "#f59e0b", skip: "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", scan: "🔍 SCAN", "new-largest": "🏆 LARGEST", "new-second": "🥈 SECOND", skip: "⏭️ SKIP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the **second largest** element in an array in a single pass.

## Key Insight
Track TWO variables: **largest** and **second**.
- If current element > largest → old largest becomes second, current becomes largest
- Else if current element > second (and != largest) → current becomes second

## Why Single Pass Works
By maintaining both values simultaneously, we never need to revisit elements. Each element is checked exactly once.

## Edge Cases
- All elements same → second = -1 (no second largest)
- Array of size 1 → second = -1
- Duplicates of largest → second stays unchanged`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [12, 35, 1, 10, 34, 1]

1. i=0: arr[0]=12 > -1 → largest=12, second=-1
2. i=1: arr[1]=35 > 12 → largest=35, second=12
3. i=2: arr[2]=1 → not > 35, not > 12 → skip
4. i=3: arr[3]=10 → not > 35, not > 12 → skip
5. i=4: arr[4]=34 → not > 35, but 34 > 12 → second=34
6. i=5: arr[5]=1 → skip
7. **Answer: second = 34** ✅

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1) — only two variables`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line

### Lines 1-2: Initialize
    int largest = -1, second = -1;
Both start at -1 (assuming positive values).

### Line 3-5: New Largest Found
    if (arr[i] > largest)
        second = largest;   // demote old largest
        largest = arr[i];   // promote current
**Order matters!** We must save old largest to second BEFORE overwriting.

### Lines 6-8: New Second Found
    else if (arr[i] > second && arr[i] != largest)
        second = arr[i];
Only update if strictly between second and largest (and not equal to largest).

### Time & Space
- **Time:** O(n) — one loop through array
- **Space:** O(1) — two integer variables`
    },
];

const DEFAULT = [12, 35, 1, 10, 34, 1];
export default function SecondLargest() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 2 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Second Largest Element" subtitle="Find second largest in one pass · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="12,35,1,10,34,1" label="Array (comma-sep):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="secondLargest.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} largest={step.vars.largest} second={step.vars.second} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#f59e0b", fontWeight: 700 }}>🥈 {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
