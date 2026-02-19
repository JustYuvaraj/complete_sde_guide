import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int largestSub0(int arr[], int n) {` },
    { id: 1, text: `    unordered_map<int,int> mp;` },
    { id: 2, text: `    int sum = 0, maxLen = 0;` },
    { id: 3, text: `    for (int i = 0; i < n; i++) {` },
    { id: 4, text: `        sum += arr[i];` },
    { id: 5, text: `        if (sum == 0) maxLen = i + 1;` },
    { id: 6, text: `        else if (mp.count(sum))` },
    { id: 7, text: `            maxLen = max(maxLen, i-mp[sum]);` },
    { id: 8, text: `        else mp[sum] = i;` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return maxLen;` },
    { id: 11, text: `}` },
];

function gen(arr) {
    const steps = [];
    const mp = {};
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let sum = 0, maxLen = 0;
    push(2, "init", { sum, maxLen }, "Prefix sum → find sum repeats (means 0-sum subarray)", []);

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        push(4, "add", { sum, i, "arr[i]": arr[i] }, `sum += ${arr[i]} → ${sum}`, [{ idx: i, color: "#38bdf8" }]);

        if (sum === 0) {
            maxLen = i + 1;
            const hl = Array.from({ length: i + 1 }, (_, j) => ({ idx: j, color: "#22c55e" }));
            push(5, "zero-sum", { maxLen }, `sum=0 → entire prefix [0..${i}] is zero-sum! len=${maxLen}`, hl);
        } else if (mp[sum] !== undefined) {
            const len = i - mp[sum];
            maxLen = Math.max(maxLen, len);
            const start = mp[sum] + 1;
            const hl = Array.from({ length: len }, (_, j) => ({ idx: start + j, color: "#f59e0b" }));
            push(7, "repeat", { maxLen, "prev index": mp[sum], len }, `sum=${sum} seen at idx ${mp[sum]} → [${start}..${i}] sums to 0, len=${len}`, hl);
        } else {
            mp[sum] = i;
            push(8, "store", { sum, i }, `Store mp[${sum}]=${i}`, [{ idx: i, color: "#a78bfa" }]);
        }
    }

    push(10, "done", { maxLen, ANSWER: maxLen }, `✅ Longest 0-sum subarray = ${maxLen}`, []);
    return { steps, answer: maxLen, arr };
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

const PC = { init: "#8b5cf6", add: "#38bdf8", "zero-sum": "#22c55e", repeat: "#f59e0b", store: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", add: "➕ SUM", "zero-sum": "🎯 ZERO!", repeat: "🔁 REPEAT", store: "💾 STORE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find longest subarray with sum = 0.

## Key Insight
If prefix_sum[i] == prefix_sum[j], then subarray [j+1..i] sums to 0!
Also if prefix_sum[i] == 0, then [0..i] itself sums to 0.

## Store FIRST occurrence only
We want the LONGEST subarray, so store earliest index for each prefix sum.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [15, -2, 2, -8, 1, 7, 10, 23]

Prefix sums: 15, 13, 15, 7, 8, 15, 25, 48
- sum=15 at i=0, stored
- sum=15 at i=2 → repeat! [1..2] len=2
- sum=15 at i=5 → repeat! [1..5] len=5 ← max!

**Answer: 5** (subarray [-2, 2, -8, 1, 7])

### Complexity: O(n) time, O(n) space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Same pattern as "longest subarray sum K" with K=0

### Three cases:
1. sum == 0 → whole prefix sums to 0
2. sum seen before → subarray between occurrences sums to 0
3. New sum → store in map`
    },
];

const DEFAULT = [15, -2, 2, -8, 1, 7, 10, 23];
export default function LargestSubarraySum0() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Largest Subarray with Sum 0" subtitle="Prefix sum + HashMap · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="15,-2,2,-8,1,7,10,23" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="largestSub0.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Max Length: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
