import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void rotateByOne(int arr[], int n) {` },
    { id: 1, text: `    int temp = arr[0];` },
    { id: 2, text: `    for (int i = 1; i < n; i++)` },
    { id: 3, text: `        arr[i-1] = arr[i];` },
    { id: 4, text: `    arr[n-1] = temp;` },
    { id: 5, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr];
    const push = (cl, ph, v, m, hl, snap) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...snap] });

    const temp = a[0];
    push(1, "save", { temp }, `Save arr[0] = ${temp} to temp`, [{ idx: 0, color: "#f59e0b" }], a);

    for (let i = 1; i < a.length; i++) {
        a[i - 1] = a[i];
        push(3, "shift", { temp, i, "arr[i]": a[i] },
            `Shift arr[${i}]=${a[i]} → arr[${i - 1}]`,
            [{ idx: i - 1, color: "#38bdf8" }, { idx: i, color: "#a78bfa" }], a);
    }

    a[a.length - 1] = temp;
    push(4, "place", { temp }, `Place temp=${temp} at arr[${a.length - 1}]`, [{ idx: a.length - 1, color: "#22c55e" }], a);
    push(4, "done", {}, `✅ Array rotated left by 1`, [], a);
    return { steps, arr: a, original: [...arr] };
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

const PC = { save: "#f59e0b", shift: "#38bdf8", place: "#22c55e", done: "#10b981" };
const PL = { save: "💾 SAVE", shift: "⬅️ SHIFT", place: "📌 PLACE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Rotate array left by one position.
[1, 2, 3, 4, 5] → [2, 3, 4, 5, 1]

## Key Insight
1. **Save** the first element in temp
2. **Shift** every element one position left
3. **Place** temp at the last position

## Why This Works
The first element "wraps around" to the end. Every other element moves one spot left.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 2, 3, 4, 5]
1. temp = 1
2. Shift: [2, 3, 4, 5, 5]
3. Place temp at end: [2, 3, 4, 5, 1] ✅

### Complexity
- **Time:** O(n)
- **Space:** O(1) — only one temp variable`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line

### Line 2: Save first
    int temp = arr[0];
Must save before overwriting!

### Lines 3-4: Shift left
    arr[i-1] = arr[i];
Each element moves one position to the left.

### Line 5: Place at end
    arr[n-1] = temp;
The saved first element goes to the last position.`
    },
];

const DEFAULT = [1, 2, 3, 4, 5];
export default function LeftRotateOne() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 2 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Left Rotate Array by One" subtitle="Shift left with temp variable · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3,4,5" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="leftRotateOne.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={step.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length} />
        </VizLayout>
    );
}
