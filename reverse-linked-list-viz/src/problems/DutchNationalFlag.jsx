import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void sortColors(int arr[], int n) {` },
    { id: 1, text: `    int lo = 0, mid = 0, hi = n - 1;` },
    { id: 2, text: `    while (mid <= hi) {` },
    { id: 3, text: `        if (arr[mid] == 0) {` },
    { id: 4, text: `            swap(arr[lo], arr[mid]);` },
    { id: 5, text: `            lo++; mid++;` },
    { id: 6, text: `        } else if (arr[mid] == 1) {` },
    { id: 7, text: `            mid++;` },
    { id: 8, text: `        } else {` },
    { id: 9, text: `            swap(arr[mid], arr[hi]);` },
    { id: 10, text: `            hi--;` },
    { id: 11, text: `        }` },
    { id: 12, text: `    }` },
    { id: 13, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr];
    const push = (cl, ph, v, m, hl, snap) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...snap] });

    let lo = 0, mid = 0, hi = a.length - 1;
    push(1, "init", { lo, mid, hi }, "Initialize 3 pointers", [{ idx: 0, color: "#ef4444" }, { idx: a.length - 1, color: "#3b82f6" }], a);

    while (mid <= hi) {
        if (a[mid] === 0) {
            push(3, "zero", { lo, mid, hi, "arr[mid]": 0 },
                `arr[${mid}]=0 → swap with lo=${lo}`,
                [{ idx: mid, color: "#ef4444" }, { idx: lo, color: "#22c55e" }], a);
            [a[lo], a[mid]] = [a[mid], a[lo]];
            lo++; mid++;
            push(5, "after-swap", { lo, mid, hi }, `After swap → lo=${lo}, mid=${mid}`, [], a);
        } else if (a[mid] === 1) {
            push(6, "one", { lo, mid, hi, "arr[mid]": 1 },
                `arr[${mid}]=1 → already in place, mid++`,
                [{ idx: mid, color: "#f59e0b" }], a);
            mid++;
        } else {
            push(8, "two", { lo, mid, hi, "arr[mid]": 2 },
                `arr[${mid}]=2 → swap with hi=${hi}`,
                [{ idx: mid, color: "#3b82f6" }, { idx: hi, color: "#22c55e" }], a);
            [a[mid], a[hi]] = [a[hi], a[mid]];
            hi--;
            push(10, "after-swap", { lo, mid, hi }, `After swap → hi=${hi}`, [], a);
        }
    }

    push(12, "done", {}, `✅ Array sorted: [${a.join(",")}]`, [], a);
    return { steps, arr: a, original: [...arr] };
}

function ArrayGrid({ arr, highlights = [], lo, mid, hi }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    const valColor = { 0: "#ef4444", 1: "#f59e0b", 2: "#3b82f6" };
    return (
        <VizCard title="🇳🇱 Dutch National Flag">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i] || valColor[val];
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: `${c}20`,
                                border: `2px solid ${c}`,
                                color: c,
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

const PC = { init: "#8b5cf6", zero: "#ef4444", one: "#f59e0b", two: "#3b82f6", "after-swap": "#22c55e", done: "#10b981" };
const PL = { init: "⚙️ INIT", zero: "0️⃣ RED", one: "1️⃣ WHITE", two: "2️⃣ BLUE", "after-swap": "🔀 SWAPPED", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Sort array of 0s, 1s, and 2s in a single pass. (LC #75 Sort Colors)

## Key Insight — Dutch National Flag
Three pointers divide the array into FOUR regions:
- [0..lo-1] → all 0s (sorted)
- [lo..mid-1] → all 1s (sorted)
- [mid..hi] → unsorted (to process)
- [hi+1..n-1] → all 2s (sorted)

## The Three Rules
- arr[mid] == 0 → swap with lo, advance both
- arr[mid] == 1 → already in middle, just mid++
- arr[mid] == 2 → swap with hi, shrink hi (DON'T advance mid — swapped value needs checking!)`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 0, 2, 1, 1, 0]

1. mid=0: arr[0]=2 → swap(0,5), hi=4 → [0,0,2,1,1,2]
2. mid=0: arr[0]=0 → swap(0,0), lo=1,mid=1
3. mid=1: arr[1]=0 → swap(1,1), lo=2,mid=2
4. mid=2: arr[2]=2 → swap(2,4), hi=3 → [0,0,1,1,2,2]
5. mid=2: arr[2]=1 → mid=3
6. mid=3: arr[3]=1 → mid=4
7. mid=4 > hi=3 → DONE! [0,0,1,1,2,2] ✅

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Three Pointers

### lo: boundary of 0s region
### mid: current element being processed
### hi: boundary of 2s region

### Critical: Don't advance mid on case 2!
When we swap arr[mid] with arr[hi], the swapped value hasn't been checked yet. So we only decrement hi.

### When mid > hi → done
All elements have been classified.`
    },
];

const DEFAULT = [2, 0, 2, 1, 1, 0];
export default function DutchNationalFlag() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => v === 0 || v === 1 || v === 2); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Sort 0s, 1s, 2s (Dutch National Flag)" subtitle="Three pointers · O(n) single pass">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,0,2,1,1,0" label="Array (0/1/2):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="sortColors.cpp" />
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
