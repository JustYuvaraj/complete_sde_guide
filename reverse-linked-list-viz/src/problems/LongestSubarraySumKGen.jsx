import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int longestSubSum(int arr[], int n, int k) {` },
    { id: 1, text: `    map<int,int> prefixMap;` },
    { id: 2, text: `    int sum = 0, maxLen = 0;` },
    { id: 3, text: `    for (int i = 0; i < n; i++) {` },
    { id: 4, text: `        sum += arr[i];` },
    { id: 5, text: `        if (sum == k) maxLen = i + 1;` },
    { id: 6, text: `        int rem = sum - k;` },
    { id: 7, text: `        if (prefixMap.count(rem))` },
    { id: 8, text: `            maxLen = max(maxLen, i-prefixMap[rem]);` },
    { id: 9, text: `        if (!prefixMap.count(sum))` },
    { id: 10, text: `            prefixMap[sum] = i;` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return maxLen;` },
    { id: 13, text: `}` },
];

function gen(arr, k) {
    const steps = [];
    const prefixMap = {};
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], map: { ...prefixMap } });

    let sum = 0, maxLen = 0;
    push(2, "init", { sum, maxLen, k }, "Initialize prefix sum map", []);

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        push(4, "add", { sum, i, "arr[i]": arr[i], maxLen },
            `sum += ${arr[i]} → sum = ${sum}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (sum === k) {
            maxLen = i + 1;
            const hl = Array.from({ length: i + 1 }, (_, j) => ({ idx: j, color: "#22c55e" }));
            push(5, "full-match", { sum, maxLen, i },
                `sum == k! Subarray [0..${i}], len=${maxLen}`, hl);
        }

        const rem = sum - k;
        if (prefixMap[rem] !== undefined) {
            const len = i - prefixMap[rem];
            maxLen = Math.max(maxLen, len);
            const start = prefixMap[rem] + 1;
            const hl = Array.from({ length: len }, (_, j) => ({ idx: start + j, color: "#f59e0b" }));
            push(8, "prefix-match", { sum, rem, maxLen, "prefix[rem]": prefixMap[rem], len },
                `sum-k=${rem} found at idx ${prefixMap[rem]} → subarray [${start}..${i}], len=${len}`, hl);
        }

        if (prefixMap[sum] === undefined) {
            prefixMap[sum] = i;
            push(10, "store", { sum, i },
                `Store prefix[${sum}] = ${i}`,
                [{ idx: i, color: "#a78bfa" }]);
        }
    }

    push(12, "done", { maxLen, ANSWER: maxLen }, `✅ Longest subarray with sum ${k} = ${maxLen}`, []);
    return { steps, answer: maxLen, arr, k };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (Prefix Sum)">
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

const PC = { init: "#8b5cf6", add: "#38bdf8", "full-match": "#22c55e", "prefix-match": "#f59e0b", store: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", add: "➕ ADD", "full-match": "✅ MATCH", "prefix-match": "🔍 PREFIX", store: "💾 STORE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Longest subarray with sum = k. Works with **positives AND negatives**!

## Key Insight — Prefix Sum + HashMap
If prefix_sum[0..i] - prefix_sum[0..j] = k, then subarray [j+1..i] sums to k.

So for each index i, we check: does (sum - k) exist in our prefix map?

## Why HashMap?
Looking up prefix sums in O(1). We store the **earliest** occurrence of each prefix sum (to maximize subarray length).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, -1, 5, -2, 3], k=3

- i=0: sum=1, rem=-2 not found, store prefix[1]=0
- i=1: sum=0, rem=-3 not found, store prefix[0]=1
- i=2: sum=5, rem=2 not found, store prefix[5]=2
- i=3: sum=3 == k! maxLen=4
- i=3: rem=0 found at idx 1 → [2..3] len=2
- i=4: sum=6, rem=3 not found... wait, prefix[3] at idx 3 → [4..4] len=1

**Answer: 4** (subarray [0..3] = [1,-1,5,-2])

### Complexity
- **Time:** O(n)
- **Space:** O(n) — hashmap`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Prefix Sum Pattern

### Build running sum
    sum += arr[i];

### Check if entire prefix matches
    if (sum == k) maxLen = i + 1;

### Check if a sub-prefix removes to k
    int rem = sum - k;
    if (prefixMap.count(rem))
        maxLen = max(maxLen, i - prefixMap[rem]);

### Store first occurrence only
    if (!prefixMap.count(sum))
        prefixMap[sum] = i;
We keep the FIRST occurrence so subarray is as LONG as possible.`
    },
];

const DEFAULT = [1, -1, 5, -2, 3];
const DEFAULT_K = 3;
export default function LongestSubarraySumKGen() {
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
        <VizLayout title="Longest Subarray with Sum K" subtitle="Prefix sum + hashmap · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,-1,5,-2,3" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>k:</span>
                    <input type="number" value={kInput} onChange={e => setKInput(e.target.value)} style={{
                        width: "50px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="longestSubSumK.cpp" />
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
