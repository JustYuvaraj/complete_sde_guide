import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int longestSubSum(int arr[], int n, int k) {` },
    { id: 1, text: `    int left = 0, sum = 0, maxLen = 0;` },
    { id: 2, text: `    for (int right = 0; right < n; right++) {` },
    { id: 3, text: `        sum += arr[right];` },
    { id: 4, text: `        while (sum > k) {` },
    { id: 5, text: `            sum -= arr[left];` },
    { id: 6, text: `            left++;` },
    { id: 7, text: `        }` },
    { id: 8, text: `        if (sum == k)` },
    { id: 9, text: `            maxLen = max(maxLen, right-left+1);` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return maxLen;` },
    { id: 12, text: `}` },
];

function gen(arr, k) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let left = 0, sum = 0, maxLen = 0;
    push(1, "init", { left, sum, maxLen, k }, "Initialize sliding window", []);

    for (let right = 0; right < arr.length; right++) {
        sum += arr[right];
        const windowHl = [];
        for (let w = left; w <= right; w++) windowHl.push({ idx: w, color: "#38bdf8" });
        push(3, "expand", { left, right, sum, maxLen },
            `Add arr[${right}]=${arr[right]} → sum=${sum}`, windowHl);

        while (sum > k && left <= right) {
            sum -= arr[left];
            push(5, "shrink", { left, right, sum, "removed": arr[left] },
                `sum ${sum + arr[left]} > ${k} → remove arr[${left}]=${arr[left]}, sum=${sum}`,
                [{ idx: left, color: "#ef4444" }]);
            left++;
        }

        if (sum === k) {
            const len = right - left + 1;
            maxLen = Math.max(maxLen, len);
            const hl = [];
            for (let w = left; w <= right; w++) hl.push({ idx: w, color: "#22c55e" });
            push(9, "found", { left, right, sum, maxLen, "window length": len },
                `sum=${k}! Window [${left}..${right}], len=${len}, maxLen=${maxLen}`, hl);
        }
    }

    push(11, "done", { maxLen, ANSWER: maxLen }, `✅ Longest subarray with sum ${k} = ${maxLen}`, []);
    return { steps, answer: maxLen, arr, k };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array (Sliding Window)">
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

const PC = { init: "#8b5cf6", expand: "#38bdf8", shrink: "#ef4444", found: "#22c55e", done: "#10b981" };
const PL = { init: "⚙️ INIT", expand: "➡️ EXPAND", shrink: "⬅️ SHRINK", found: "✅ MATCH", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the **longest** subarray whose elements sum to exactly **k**. (Positives only version → sliding window works.)

## Key Insight — Sliding Window
Since all values are positive:
- If sum < k → expand right (add element)
- If sum > k → shrink left (remove element)
- If sum == k → record window length, keep going

## Why Sliding Window Works Here
With only positive numbers, expanding always increases sum, and shrinking always decreases it. This monotonic property makes sliding window optimal.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 2, 3, 1, 1, 1, 1], k=3

Window slides through:
- [1] sum=1 < 3
- [1,2] sum=3 ✅ len=2
- [1,2,3] sum=6 > 3 → shrink
- [2,3] sum=5 > 3 → shrink
- [3] sum=3 ✅ len=1
- [3,1] sum=4 > 3 → shrink
- [1,1] sum=2
- [1,1,1] sum=3 ✅ len=3 ← max!
- [1,1,1,1] sum=4 > 3 → shrink
- [1,1,1] sum=3 ✅ len=3

**Answer: 3**

### Complexity
- **Time:** O(n) — each element added/removed at most once
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Sliding Window Template

### Expand (right pointer)
    sum += arr[right];
Always add the new element.

### Shrink (left pointer)
    while (sum > k)
        sum -= arr[left++];
Remove from left until sum ≤ k.

### Record
    if (sum == k)
        maxLen = max(maxLen, right-left+1);

### Important
This only works for **positive** values! For arrays with negatives, use hashmap (prefix sum approach).`
    },
];

const DEFAULT = [1, 2, 3, 1, 1, 1, 1];
const DEFAULT_K = 3;
export default function LongestSubarraySumK() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [kInput, setKInput] = useState(String(DEFAULT_K));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v) && v >= 0);
        const kv = parseInt(kInput);
        if (a.length < 1 || a.length > 15 || isNaN(kv)) return;
        setSess(gen(a, kv)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setKInput(String(DEFAULT_K)); setSess(gen(DEFAULT, DEFAULT_K)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Longest Subarray with Sum K" subtitle="Sliding window (positives) · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3,1,1" label="Array (positive):" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>k:</span>
                    <input type="number" value={kInput} onChange={e => setKInput(e.target.value)} style={{
                        width: "50px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="longestSubSum.cpp" />
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
