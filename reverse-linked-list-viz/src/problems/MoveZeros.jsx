import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void moveZeroes(int arr[], int n) {` },
    { id: 1, text: `    int j = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        if (arr[i] != 0) {` },
    { id: 4, text: `            swap(arr[i], arr[j]);` },
    { id: 5, text: `            j++;` },
    { id: 6, text: `        }` },
    { id: 7, text: `    }` },
    { id: 8, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr];
    const push = (cl, ph, v, m, hl, snap) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...snap] });

    let j = 0;
    push(1, "init", { j }, "j points to next non-zero position", [{ idx: 0, color: "#22c55e" }], a);

    for (let i = 0; i < a.length; i++) {
        push(3, "check", { i, j, "arr[i]": a[i] },
            `Check arr[${i}] = ${a[i]}`,
            [{ idx: i, color: "#38bdf8" }, ...(j !== i ? [{ idx: j, color: "#22c55e" }] : [])], a);

        if (a[i] !== 0) {
            if (i !== j) {
                [a[i], a[j]] = [a[j], a[i]];
                push(4, "swap", { i, j },
                    `Swap arr[${i}]↔arr[${j}]`,
                    [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#f59e0b" }], a);
            } else {
                push(4, "no-swap", { i, j },
                    `arr[${i}]=${a[i]} already in place`,
                    [{ idx: i, color: "#22c55e" }], a);
            }
            j++;
        } else {
            push(6, "zero", { i, j },
                `arr[${i}]=0, skip — j stays at ${j}`,
                [{ idx: i, color: "#64748b" }, { idx: j, color: "#22c55e" }], a);
        }
    }

    push(7, "done", {}, `✅ All zeros moved to end`, [], a);
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
                    const isZero = val === 0;
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: c ? `${c}20` : isZero ? (isDark ? "#0f172a" : "#f8fafc") : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isZero ? (isDark ? "#1e293b" : "#cbd5e1") : (isDark ? "#334155" : "#e2e8f0"))}`,
                                color: c || (isZero ? "#64748b" : (isDark ? "#e2e8f0" : "#1e293b")),
                                transition: "all 0.3s",
                                opacity: isZero && !c ? 0.5 : 1,
                            }}>{val}</div>
                            <span style={{ fontSize: "0.5rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", check: "#38bdf8", swap: "#f59e0b", "no-swap": "#22c55e", zero: "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", check: "🔍 CHECK", swap: "🔀 SWAP", "no-swap": "✓ OK", zero: "0️⃣ ZERO", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Move all zeros to the end while maintaining relative order of non-zero elements.
[0, 1, 0, 3, 12] → [1, 3, 12, 0, 0]

## Key Insight — Snowball / Two Pointer
Use pointer **j** = "next non-zero position". Scan with **i**:
- If arr[i] != 0 → swap arr[i] with arr[j], advance j
- If arr[i] == 0 → just skip

## Why This Works
j always stays at or behind i. Non-zero elements get "pulled forward" to position j, filling gaps left by zeros.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [0, 1, 0, 3, 12]

1. i=0: arr[0]=0 → skip, j=0
2. i=1: arr[1]=1 ≠ 0 → swap(1,0), j=1 → [1,0,0,3,12]
3. i=2: arr[2]=0 → skip, j=1
4. i=3: arr[3]=3 ≠ 0 → swap(3,1), j=2 → [1,3,0,0,12]
5. i=4: arr[4]=12 ≠ 0 → swap(4,2), j=3 → [1,3,12,0,0] ✅

### Complexity
- **Time:** O(n)
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Two Pointers

### j = 0 (slow pointer)
Points to next position where a non-zero should go.

### i scans (fast pointer)
When arr[i] is non-zero, swap with j and advance j.

### Why swap instead of just copy?
Swap ensures zeros naturally "bubble" to the end without extra work.`
    },
];

const DEFAULT = [0, 1, 0, 3, 12];
export default function MoveZeros() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Move Zeros to End" subtitle="Two-pointer swap · O(n) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="0,1,0,3,12" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="moveZeros.cpp" />
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
