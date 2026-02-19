import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<vector<int>> threeSum(vector<int>& a) {` },
    { id: 1, text: `    sort(a.begin(), a.end());` },
    { id: 2, text: `    vector<vector<int>> res;` },
    { id: 3, text: `    for (int i = 0; i < n-2; i++) {` },
    { id: 4, text: `        if (i > 0 && a[i]==a[i-1]) continue;` },
    { id: 5, text: `        int lo = i+1, hi = n-1;` },
    { id: 6, text: `        while (lo < hi) {` },
    { id: 7, text: `            int sum = a[i]+a[lo]+a[hi];` },
    { id: 8, text: `            if (sum < 0) lo++;` },
    { id: 9, text: `            else if (sum > 0) hi--;` },
    { id: 10, text: `            else {` },
    { id: 11, text: `                res.push_back({a[i],a[lo],a[hi]});` },
    { id: 12, text: `                while(lo<hi&&a[lo]==a[lo+1])lo++;` },
    { id: 13, text: `                while(lo<hi&&a[hi]==a[hi-1])hi--;` },
    { id: 14, text: `                lo++; hi--;` },
    { id: 15, text: `            }` },
    { id: 16, text: `        }` },
    { id: 17, text: `    }` },
    { id: 18, text: `    return res;` },
    { id: 19, text: `}` },
];

function gen(arr) {
    const steps = [];
    const a = [...arr].sort((x, y) => x - y);
    const n = a.length;
    const res = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    push(1, "sort", { "sorted": `[${a.join(",")}]` }, "Sort array first", []);

    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] === a[i - 1]) {
            push(4, "skip-dup", { i, "a[i]": a[i] }, `Skip duplicate a[${i}]=${a[i]}`, [{ idx: i, color: "#64748b" }]);
            continue;
        }

        let lo = i + 1, hi = n - 1;
        push(5, "fix-i", { i, "a[i]": a[i], lo, hi }, `Fix a[${i}]=${a[i]}, two-pointer [${lo}..${hi}]`,
            [{ idx: i, color: "#f59e0b" }]);

        while (lo < hi) {
            const sum = a[i] + a[lo] + a[hi];
            if (sum < 0) {
                push(8, "too-low", { sum, lo, hi }, `${a[i]}+${a[lo]}+${a[hi]}=${sum} < 0 → lo++`,
                    [{ idx: i, color: "#f59e0b" }, { idx: lo, color: "#ef4444" }, { idx: hi, color: "#38bdf8" }]);
                lo++;
            } else if (sum > 0) {
                push(9, "too-high", { sum, lo, hi }, `${a[i]}+${a[lo]}+${a[hi]}=${sum} > 0 → hi--`,
                    [{ idx: i, color: "#f59e0b" }, { idx: lo, color: "#38bdf8" }, { idx: hi, color: "#ef4444" }]);
                hi--;
            } else {
                res.push([a[i], a[lo], a[hi]]);
                push(11, "found", { sum: 0, "triplet": `[${a[i]},${a[lo]},${a[hi]}]` },
                    `✅ Found: [${a[i]}, ${a[lo]}, ${a[hi]}]`,
                    [{ idx: i, color: "#22c55e" }, { idx: lo, color: "#22c55e" }, { idx: hi, color: "#22c55e" }]);
                while (lo < hi && a[lo] === a[lo + 1]) lo++;
                while (lo < hi && a[hi] === a[hi - 1]) hi--;
                lo++; hi--;
            }
        }
    }

    push(18, "done", { "triplets": res.length }, `✅ Found ${res.length} triplets`, []);
    return { steps, answer: res, arr: a };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Sorted Array">
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

const PC = { sort: "#8b5cf6", "skip-dup": "#64748b", "fix-i": "#f59e0b", "too-low": "#ef4444", "too-high": "#ef4444", found: "#22c55e", done: "#10b981" };
const PL = { sort: "📊 SORT", "skip-dup": "⏭️ DUP", "fix-i": "📌 FIX", "too-low": "⬆️ LOW", "too-high": "⬇️ HIGH", found: "✅ FOUND", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find all unique triplets that sum to 0. (LC #15)

## Key Insight — Sort + Two Pointer
1. Sort the array
2. Fix a[i], then use two pointers on the rest
3. Skip duplicates at all levels

## Why Sort?
Enables two-pointer approach (O(n) per fixed element) and easy duplicate detection.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [-1, 0, 1, 2, -1, -4]
Sorted: [-4, -1, -1, 0, 1, 2]

- i=0 (-4): lo=1,hi=5 → all sums < 0
- i=1 (-1): lo=2,hi=5 → -1+0+1=0 ✅, -1+-1+2=0 ✅
- i=2 (-1): skip (dup)

**Answer: [[-1,-1,2], [-1,0,1]]**

### Complexity: O(n²) time, O(1) extra space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Duplicate Handling

### Skip i duplicates
    if (i>0 && a[i]==a[i-1]) continue;

### Skip lo/hi duplicates
    while(lo<hi && a[lo]==a[lo+1]) lo++;
    while(lo<hi && a[hi]==a[hi-1]) hi--;

### Both pointers move after match
    lo++; hi--;`
    },
];

const DEFAULT = [-1, 0, 1, 2, -1, -4];
export default function ThreeSum() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 3 || a.length > 12) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Three Sum" subtitle="Sort + two pointer · O(n²)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="-1,0,1,2,-1,-4" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="threeSum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Triplets: {sess.answer.length}</span></StepInfo>
        </VizLayout>
    );
}
