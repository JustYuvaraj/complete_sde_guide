import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int countSubarrays(int arr[], int n, int k) {` },
    { id: 1, text: `    unordered_map<int,int> mp;` },
    { id: 2, text: `    mp[0] = 1;` },
    { id: 3, text: `    int sum = 0, count = 0;` },
    { id: 4, text: `    for (int i = 0; i < n; i++) {` },
    { id: 5, text: `        sum += arr[i];` },
    { id: 6, text: `        int rem = sum - k;` },
    { id: 7, text: `        if (mp.count(rem))` },
    { id: 8, text: `            count += mp[rem];` },
    { id: 9, text: `        mp[sum]++;` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return count;` },
    { id: 12, text: `}` },
];

function gen(arr, k) {
    const steps = [];
    const mp = { 0: 1 };
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], map: { ...mp } });

    let sum = 0, count = 0;
    push(2, "init", { sum, count, k, "mp[0]": 1 }, "Prefix sum map initialized with mp[0]=1", []);

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        const rem = sum - k;
        push(6, "add", { sum, i, "arr[i]": arr[i], rem },
            `sum=${sum}, need prefix=${rem}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (mp[rem] !== undefined) {
            count += mp[rem];
            push(8, "found", { count, rem, "mp[rem]": mp[rem] },
                `Found ${mp[rem]} prefix(es) with sum=${rem} → count += ${mp[rem]} = ${count}`,
                [{ idx: i, color: "#22c55e" }]);
        }

        mp[sum] = (mp[sum] || 0) + 1;
        push(9, "store", { sum, "mp[sum]": mp[sum] },
            `Store mp[${sum}] = ${mp[sum]}`,
            [{ idx: i, color: "#a78bfa" }]);
    }

    push(11, "done", { count, ANSWER: count }, `✅ ${count} subarrays sum to ${k}`, []);
    return { steps, answer: count, arr, k };
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

const PC = { init: "#8b5cf6", add: "#38bdf8", found: "#22c55e", store: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", add: "➕ SUM", found: "✅ MATCH", store: "💾 STORE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count subarrays whose sum equals k. (LC #560 — very popular!)

## Key Insight — Prefix Sum + HashMap
If prefix_sum[0..i] - prefix_sum[0..j] = k, then subarray [j+1..i] sums to k.
For each index i, count how many previous prefixes equal (sum - k).

## Why mp[0] = 1?
When sum itself equals k (sum - k = 0), the subarray [0..i] is a valid answer. mp[0]=1 handles this case.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 1, 1], k=2

- i=0: sum=1, rem=-1 not found, mp[1]=1
- i=1: sum=2, rem=0 found! count+=1=1, mp[2]=1
- i=2: sum=3, rem=1 found! count+=1=2, mp[3]=1

**Answer: 2** ([1,1] starting at 0 and [1,1] starting at 1)

### Complexity
- **Time:** O(n)
- **Space:** O(n)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Prefix Sum Pattern (Count variant)

### Unlike "longest" variant
Here we count ALL occurrences, so mp[sum]++ (can have multiple).

### Key line: count += mp[rem]
One prefix sum can produce MULTIPLE valid subarrays, so we add the count, not just 1.

### Initialize mp[0] = 1
Critical! Without this, we miss subarrays starting from index 0.`
    },
];

const DEFAULT = [1, 1, 1];
const DEFAULT_K = 2;
export default function CountSubarraysSum() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [kInput, setKInput] = useState(String(DEFAULT_K));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const kv = parseInt(kInput);
        if (a.length < 1 || a.length > 15 || isNaN(kv)) return;
        setSess(gen(a, kv)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setKInput(String(DEFAULT_K)); setSess(gen(DEFAULT, DEFAULT_K)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Count Subarrays with Sum K" subtitle="Prefix sum + HashMap · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,1,1" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>k:</span>
                    <input type="number" value={kInput} onChange={e => setKInput(e.target.value)} style={{
                        width: "50px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="countSubarrays.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Count: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
