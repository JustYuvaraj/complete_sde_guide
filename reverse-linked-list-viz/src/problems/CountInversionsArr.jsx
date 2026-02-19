import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int merge(int a[],int t[],int l,int m,int r){` },
    { id: 1, text: `    int i=l,j=m+1,k=l,inv=0;` },
    { id: 2, text: `    while(i<=m && j<=r){` },
    { id: 3, text: `        if(a[i]<=a[j]) t[k++]=a[i++];` },
    { id: 4, text: `        else{` },
    { id: 5, text: `            inv += m-i+1; // inversions!` },
    { id: 6, text: `            t[k++]=a[j++];` },
    { id: 7, text: `    }} /* copy remaining, copy back */` },
    { id: 8, text: `    return inv;` },
    { id: 9, text: `}` },
    { id: 10, text: `int mergeSort(int a[],int t[],int l,int r){` },
    { id: 11, text: `    if(l>=r) return 0;` },
    { id: 12, text: `    int m=(l+r)/2, inv=0;` },
    { id: 13, text: `    inv+=mergeSort(a,t,l,m);` },
    { id: 14, text: `    inv+=mergeSort(a,t,m+1,r);` },
    { id: 15, text: `    inv+=merge(a,t,l,m,r);` },
    { id: 16, text: `    return inv;` },
    { id: 17, text: `}` },
];

function countInv(arr) {
    const steps = [];
    const a = [...arr];
    let totalInv = 0;
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...a] });

    push(10, "init", { n: a.length }, "Modified merge sort to count inversions", []);

    function mergeCount(l, r) {
        if (l >= r) return 0;
        const m = Math.floor((l + r) / 2);
        let inv = mergeCount(l, m) + mergeCount(m + 1, r);

        // Count inversions during merge
        const left = a.slice(l, m + 1);
        const right = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        let mergeInv = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                a[k++] = left[i++];
            } else {
                mergeInv += left.length - i;
                a[k++] = right[j++];
            }
        }
        while (i < left.length) a[k++] = left[i++];
        while (j < right.length) a[k++] = right[j++];

        if (mergeInv > 0) {
            inv += mergeInv;
            totalInv += mergeInv;
            push(5, "merge", { l, m, r, "merge inversions": mergeInv, "total": totalInv },
                `Merge [${l}..${m}] & [${m + 1}..${r}] → ${mergeInv} inversions`,
                Array.from({ length: r - l + 1 }, (_, idx) => ({ idx: l + idx, color: "#f59e0b" })));
        }

        return inv;
    }

    const total = mergeCount(0, a.length - 1);
    push(16, "done", { ANSWER: total }, `✅ Total inversions = ${total}`, []);
    return { steps, answer: total, arr, sorted: a };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (during merge sort)">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    return (
                        <div key={i} style={{ width: "44px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.8rem",
                                background: c ? `${c}20` : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isDark ? "#334155" : "#e2e8f0")}`,
                                color: c || (isDark ? "#e2e8f0" : "#1e293b"),
                                transition: "all 0.3s",
                            }}>{val}</div>
                            <span style={{ fontSize: "0.45rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", merge: "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", merge: "🔀 MERGE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count inversions: pairs (i,j) where i < j but arr[i] > arr[j].

## Key Insight — Modified Merge Sort
During merge step, when right element goes before left elements, ALL remaining left elements form inversions with it!

## Count = m - i + 1
If left[i] > right[j], then left[i], left[i+1], ..., left[m] ALL form inversions with right[j].`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 4, 1, 3, 5]

Merge sort splits and counts during merge:
- [2,4] and [1,3,5]
- Merging [2,4] with [1]: 1 < 2 → 2 inversions (2>1, 4>1)
- Merging with [3]: 3 < 4 → 1 inversion (4>3)

**Total: 3 inversions** (pairs: (2,1), (4,1), (4,3))

### Complexity: O(n log n) time`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Modified Merge

### Normal merge step
    if(a[i] <= a[j]) t[k++] = a[i++];

### Count inversions when right goes first
    else {
        inv += m - i + 1;
        t[k++] = a[j++];
    }

### Recursion adds up
    inv = mergeSort(left) + mergeSort(right) + merge()`
    },
];

const DEFAULT = [2, 4, 1, 3, 5];
export default function CountInversionsArr() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => countInv(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 2 || a.length > 12) return; setSess(countInv(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(countInv(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Count Inversions" subtitle="Modified merge sort · O(n log n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,4,1,3,5" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="countInversions.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={step.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#f59e0b", fontWeight: 700 }}>Inversions: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
