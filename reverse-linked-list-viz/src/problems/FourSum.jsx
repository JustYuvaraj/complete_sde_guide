import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<vector<int>> fourSum(vector<int>& a, int t) {` },
    { id: 1, text: `    sort(a.begin(), a.end());` },
    { id: 2, text: `    vector<vector<int>> res;` },
    { id: 3, text: `    for(int i=0;i<n-3;i++){` },
    { id: 4, text: `        if(i>0&&a[i]==a[i-1]) continue;` },
    { id: 5, text: `        for(int j=i+1;j<n-2;j++){` },
    { id: 6, text: `            if(j>i+1&&a[j]==a[j-1]) continue;` },
    { id: 7, text: `            int lo=j+1, hi=n-1;` },
    { id: 8, text: `            while(lo<hi){` },
    { id: 9, text: `                long sum=a[i]+a[j]+a[lo]+a[hi];` },
    { id: 10, text: `                if(sum<t) lo++;` },
    { id: 11, text: `                else if(sum>t) hi--;` },
    { id: 12, text: `                else{` },
    { id: 13, text: `                    res.push_back({a[i],a[j],a[lo],a[hi]});` },
    { id: 14, text: `                    while(lo<hi&&a[lo]==a[lo+1])lo++;` },
    { id: 15, text: `                    while(lo<hi&&a[hi]==a[hi-1])hi--;` },
    { id: 16, text: `                    lo++;hi--;` },
    { id: 17, text: `    }}}}` },
    { id: 18, text: `    return res;` },
    { id: 19, text: `}` },
];

function gen(arr, target) {
    const steps = [];
    const a = [...arr].sort((x, y) => x - y);
    const n = a.length;
    const res = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    push(1, "sort", { "sorted": `[${a.join(",")}]`, target }, "Sort then fix two, two-pointer rest", []);

    for (let i = 0; i < n - 3; i++) {
        if (i > 0 && a[i] === a[i - 1]) continue;
        for (let j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && a[j] === a[j - 1]) continue;

            let lo = j + 1, hi = n - 1;
            push(7, "fix-ij", { i, j, "a[i]": a[i], "a[j]": a[j], lo, hi },
                `Fix a[${i}]=${a[i]}, a[${j}]=${a[j]}`,
                [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#a78bfa" }]);

            while (lo < hi) {
                const sum = a[i] + a[j] + a[lo] + a[hi];
                if (sum < target) {
                    push(10, "too-low", { sum }, `sum=${sum} < ${target} → lo++`,
                        [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#a78bfa" }, { idx: lo, color: "#ef4444" }, { idx: hi, color: "#38bdf8" }]);
                    lo++;
                } else if (sum > target) {
                    push(11, "too-high", { sum }, `sum=${sum} > ${target} → hi--`,
                        [{ idx: i, color: "#f59e0b" }, { idx: j, color: "#a78bfa" }, { idx: lo, color: "#38bdf8" }, { idx: hi, color: "#ef4444" }]);
                    hi--;
                } else {
                    res.push([a[i], a[j], a[lo], a[hi]]);
                    push(13, "found", { "quad": `[${a[i]},${a[j]},${a[lo]},${a[hi]}]` },
                        `✅ [${a[i]},${a[j]},${a[lo]},${a[hi]}] = ${target}`,
                        [{ idx: i, color: "#22c55e" }, { idx: j, color: "#22c55e" }, { idx: lo, color: "#22c55e" }, { idx: hi, color: "#22c55e" }]);
                    while (lo < hi && a[lo] === a[lo + 1]) lo++;
                    while (lo < hi && a[hi] === a[hi - 1]) hi--;
                    lo++; hi--;
                }
            }
        }
    }

    push(18, "done", { "quadruplets": res.length }, `✅ Found ${res.length} quadruplets`, []);
    return { steps, answer: res, arr: a };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Sorted Array">
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    return (
                        <div key={i} style={{ width: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "36px", height: "36px", borderRadius: "8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.75rem",
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

const PC = { sort: "#8b5cf6", "fix-ij": "#f59e0b", "too-low": "#ef4444", "too-high": "#ef4444", found: "#22c55e", done: "#10b981" };
const PL = { sort: "📊 SORT", "fix-ij": "📌 FIX", "too-low": "⬆️ LOW", "too-high": "⬇️ HIGH", found: "✅ FOUND", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find all unique quadruplets summing to target. (LC #18)

## Extension of 3Sum
Fix TWO elements (i, j), then two-pointer on the rest. Sort + skip duplicates.

## Complexity
O(n³) time (two nested loops + two-pointer), O(1) extra space.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 0, -1, 0, -2, 2], target=0
Sorted: [-2, -1, 0, 0, 1, 2]

Triplets found: [-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]

### Key: Duplicate skipping at BOTH i and j levels`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Nested Structure

### Fix i (first loop)
### Fix j (second loop)
### Two-pointer lo, hi (inner while)

### Use long for sum
    long sum = a[i]+a[j]+a[lo]+a[hi];
Prevents integer overflow!`
    },
];

const DEFAULT = [1, 0, -1, 0, -2, 2];
const DEFAULT_T = 0;
export default function FourSum() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [tgt, setTgt] = useState(String(DEFAULT_T));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_T));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const t = parseInt(tgt);
        if (a.length < 4 || a.length > 12 || isNaN(t)) return;
        setSess(gen(a, t)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setTgt(String(DEFAULT_T)); setSess(gen(DEFAULT, DEFAULT_T)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Four Sum" subtitle="Sort + fix 2 + two-pointer · O(n³)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,0,-1,0,-2,2" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>Target:</span>
                    <input type="number" value={tgt} onChange={e => setTgt(e.target.value)} style={{
                        width: "60px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="fourSum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Quads: {sess.answer.length}</span></StepInfo>
        </VizLayout>
    );
}
