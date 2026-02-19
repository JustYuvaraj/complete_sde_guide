import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<vector<int>> merge(vector<vector<int>>& iv) {` },
    { id: 1, text: `    sort(iv.begin(),iv.end());` },
    { id: 2, text: `    vector<vector<int>> res;` },
    { id: 3, text: `    for (auto& i : iv) {` },
    { id: 4, text: `        if (!res.empty() && i[0]<=res.back()[1])` },
    { id: 5, text: `            res.back()[1]=max(res.back()[1],i[1]);` },
    { id: 6, text: `        else` },
    { id: 7, text: `            res.push_back(i);` },
    { id: 8, text: `    }` },
    { id: 9, text: `    return res;` },
    { id: 10, text: `}` },
];

function gen(intervals) {
    const steps = [];
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const res = [];
    const push = (cl, ph, v, m, hlIdx) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, hlIdx, intervals: sorted, result: [...res.map(r => [...r])] });

    push(1, "sort", { "count": sorted.length }, `Sort ${sorted.length} intervals by start`, -1);

    for (let idx = 0; idx < sorted.length; idx++) {
        const [s, e] = sorted[idx];
        if (res.length > 0 && s <= res[res.length - 1][1]) {
            res[res.length - 1][1] = Math.max(res[res.length - 1][1], e);
            push(5, "merge", { "current": `[${s},${e}]`, "merged": `[${res[res.length - 1][0]},${res[res.length - 1][1]}]` },
                `Overlaps! Merge → [${res[res.length - 1][0]},${res[res.length - 1][1]}]`, idx);
        } else {
            res.push([s, e]);
            push(7, "add", { "current": `[${s},${e}]` }, `No overlap → add [${s},${e}]`, idx);
        }
    }

    push(9, "done", { "merged count": res.length }, `✅ ${res.length} merged intervals`, -1);
    return { steps, answer: res, intervals: sorted };
}

function IntervalViz({ intervals, result, hlIdx }) {
    const { isDark } = useTheme();
    const maxEnd = Math.max(...intervals.flat(), 1);
    const scale = 280 / maxEnd;
    return (
        <VizCard title="📊 Intervals">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "8px 0" }}>
                <div style={{ fontSize: "0.55rem", color: "#94a3b8", fontWeight: 700 }}>Input (sorted):</div>
                {intervals.map(([s, e], i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", height: "20px" }}>
                        <span style={{ fontSize: "0.5rem", color: "#64748b", width: "50px", textAlign: "right" }}>[{s},{e}]</span>
                        <div style={{ position: "relative", width: "280px", height: "16px" }}>
                            <div style={{
                                position: "absolute", left: `${s * scale}px`, width: `${Math.max((e - s) * scale, 4)}px`,
                                height: "16px", borderRadius: "3px",
                                background: i === hlIdx ? "#22c55e" : (isDark ? "#334155" : "#cbd5e1"),
                                border: `1px solid ${i === hlIdx ? "#22c55e" : "#475569"}`,
                                transition: "all 0.3s",
                            }} />
                        </div>
                    </div>
                ))}
                {result.length > 0 && <>
                    <div style={{ fontSize: "0.55rem", color: "#22c55e", fontWeight: 700, marginTop: "6px" }}>Result:</div>
                    {result.map(([s, e], i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", height: "20px" }}>
                            <span style={{ fontSize: "0.5rem", color: "#22c55e", width: "50px", textAlign: "right" }}>[{s},{e}]</span>
                            <div style={{ position: "relative", width: "280px", height: "16px" }}>
                                <div style={{
                                    position: "absolute", left: `${s * scale}px`, width: `${Math.max((e - s) * scale, 4)}px`,
                                    height: "16px", borderRadius: "3px",
                                    background: "#22c55e33", border: "1px solid #22c55e",
                                }} />
                            </div>
                        </div>
                    ))}
                </>}
            </div>
        </VizCard>
    );
}

const PC = { sort: "#8b5cf6", merge: "#f59e0b", add: "#22c55e", done: "#10b981" };
const PL = { sort: "📊 SORT", merge: "🔗 MERGE", add: "➕ ADD", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Merge overlapping intervals. (LC #56 — very common!)

## Key Insight
Sort by start time. Then greedily merge: if current overlaps with last result interval, extend the end. Otherwise, start new interval.

## Overlap Condition
    current.start <= result.back().end`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [[1,3],[2,6],[8,10],[15,18]]
Sorted: already sorted

- [1,3] → add → result: [[1,3]]
- [2,6] → 2<=3, merge → [[1,6]]
- [8,10] → 8>6, add → [[1,6],[8,10]]
- [15,18] → 15>10, add → [[1,6],[8,10],[15,18]]

### Complexity: O(n log n) time`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Greedy Merge

### Sort first
    sort(iv.begin(), iv.end());
By start time.

### Overlap check
    if (i[0] <= res.back()[1])
Current starts before/at last end.

### Extend end
    res.back()[1] = max(res.back()[1], i[1]);
Take the farther end point.`
    },
];

const DEFAULT = [[1, 3], [2, 6], [8, 10], [15, 18]];
export default function MergeIntervals() {
    const [input, setInput] = useState("1,3;2,6;8,10;15,18");
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const intervals = input.split(";").map(s => s.split(",").map(Number)).filter(a => a.length === 2 && a.every(v => !isNaN(v)));
        if (intervals.length < 1 || intervals.length > 10) return;
        setSess(gen(intervals)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput("1,3;2,6;8,10;15,18"); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Merge Intervals" subtitle="Sort + greedy merge · O(n log n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,3;2,6;8,10;15,18" label="Intervals (start,end; ...):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="mergeIntervals.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <IntervalViz intervals={step.intervals} result={step.result} hlIdx={step.hlIdx} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Merged: {sess.answer.length} intervals</span></StepInfo>
        </VizLayout>
    );
}
