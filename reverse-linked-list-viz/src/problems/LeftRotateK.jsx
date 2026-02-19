import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void rotateByK(int arr[], int n, int k) {` },
    { id: 1, text: `    k = k % n;` },
    { id: 2, text: `    reverse(arr, 0, k - 1);` },
    { id: 3, text: `    reverse(arr, k, n - 1);` },
    { id: 4, text: `    reverse(arr, 0, n - 1);` },
    { id: 5, text: `}` },
];

function gen(origArr, k) {
    const steps = [];
    const a = [...origArr];
    const n = a.length;
    k = k % n;
    const push = (cl, ph, v, m, hl, snap) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...snap] });

    push(1, "init", { k, n }, `k mod n = ${k}`, [], a);

    // reverse helper
    const rev = (lo, hi, label, cl) => {
        const before = [...a];
        push(cl, "reverse-start", { reversing: `[${lo}..${hi}]` },
            `${label}: reverse indices ${lo}..${hi}`,
            Array.from({ length: hi - lo + 1 }, (_, i) => ({ idx: lo + i, color: "#a78bfa" })), a);
        let l = lo, r = hi;
        while (l < r) {
            [a[l], a[r]] = [a[r], a[l]];
            push(cl, "swap", { swap: `arr[${l}]↔arr[${r}]` },
                `Swap arr[${l}]=${a[r]}↔arr[${r}]=${a[l]} → ${a[l]},${a[r]}`,
                [{ idx: l, color: "#f59e0b" }, { idx: r, color: "#f59e0b" }], a);
            l++; r--;
        }
    };

    rev(0, k - 1, "Step 1", 2);
    rev(k, n - 1, "Step 2", 3);
    rev(0, n - 1, "Step 3", 4);

    push(4, "done", { k }, `✅ Array rotated left by ${k}`, [], a);
    return { steps, arr: a, original: [...origArr], k };
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

const PC = { init: "#8b5cf6", "reverse-start": "#a78bfa", swap: "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", "reverse-start": "🔄 REVERSE", swap: "🔀 SWAP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Rotate array left by K places. [1,2,3,4,5] with k=2 → [3,4,5,1,2]

## The Reversal Algorithm (O(1) space!)
Instead of shifting elements one-by-one (O(n·k)), use THREE reverses:
1. Reverse first k elements
2. Reverse remaining n-k elements
3. Reverse the entire array

## Why It Works
Think of it as cutting a deck of cards:
- [1,2 | 3,4,5] → reverse each half → [2,1 | 5,4,3] → reverse all → [3,4,5,1,2] ✅

## Edge Case
Always do **k = k % n** first! If k >= n, we're rotating full circles.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1,2,3,4,5] k=2

1. k = 2 % 5 = 2
2. Reverse [0..1]: [2,1,3,4,5]
3. Reverse [2..4]: [2,1,5,4,3]
4. Reverse [0..4]: [3,4,5,1,2] ✅

### Complexity
- **Time:** O(n) — three passes
- **Space:** O(1) — in-place swaps only`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## The Three Reverses

### Line 2: k = k % n
Handles k > n. Rotating by n is a no-op.

### Line 3: reverse(0, k-1)
Reverse the "departing" section.

### Line 4: reverse(k, n-1)
Reverse the "staying" section.

### Line 5: reverse(0, n-1)
One full reverse puts everything in the right place.

### Why not just shift?
Shifting k times is O(n×k). Reversal is always O(n).`
    },
];

const DEFAULT_ARR = [1, 2, 3, 4, 5, 6, 7];
const DEFAULT_K = 2;
export default function LeftRotateK() {
    const [input, setInput] = useState(DEFAULT_ARR.join(","));
    const [kInput, setKInput] = useState(String(DEFAULT_K));
    const [sess, setSess] = useState(() => gen(DEFAULT_ARR, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const kv = parseInt(kInput);
        if (a.length < 2 || a.length > 15 || isNaN(kv) || kv < 0) return;
        setSess(gen(a, kv)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT_ARR.join(",")); setKInput(String(DEFAULT_K)); setSess(gen(DEFAULT_ARR, DEFAULT_K)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Left Rotate Array by K Places" subtitle="Reversal algorithm · O(n) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3,4,5" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>k:</span>
                    <input type="number" value={kInput} onChange={e => setKInput(e.target.value)} style={{
                        width: "50px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="leftRotateK.cpp" />
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
