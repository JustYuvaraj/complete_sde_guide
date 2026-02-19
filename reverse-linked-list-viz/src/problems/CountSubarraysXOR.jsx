import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int countXOR(int arr[], int n, int k) {` },
    { id: 1, text: `    unordered_map<int,int> mp;` },
    { id: 2, text: `    mp[0] = 1;` },
    { id: 3, text: `    int xorSum = 0, count = 0;` },
    { id: 4, text: `    for (int i = 0; i < n; i++) {` },
    { id: 5, text: `        xorSum ^= arr[i];` },
    { id: 6, text: `        int need = xorSum ^ k;` },
    { id: 7, text: `        if (mp.count(need))` },
    { id: 8, text: `            count += mp[need];` },
    { id: 9, text: `        mp[xorSum]++;` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return count;` },
    { id: 12, text: `}` },
];

function gen(arr, k) {
    const steps = [];
    const mp = { 0: 1 };
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let xorSum = 0, count = 0;
    push(2, "init", { xorSum, count, k, "mp[0]": 1 }, "Prefix XOR map with mp[0]=1", []);

    for (let i = 0; i < arr.length; i++) {
        xorSum ^= arr[i];
        const need = xorSum ^ k;
        push(6, "xor", { xorSum, i, "arr[i]": arr[i], need },
            `xorSum ^= ${arr[i]} → ${xorSum}, need = ${xorSum}^${k} = ${need}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (mp[need] !== undefined) {
            count += mp[need];
            push(8, "found", { count, need, "mp[need]": mp[need] },
                `Found ${mp[need]} prefix(es) with XOR=${need} → count=${count}`,
                [{ idx: i, color: "#22c55e" }]);
        }

        mp[xorSum] = (mp[xorSum] || 0) + 1;
        push(9, "store", { xorSum, "mp[xorSum]": mp[xorSum] },
            `Store mp[${xorSum}]=${mp[xorSum]}`,
            [{ idx: i, color: "#a78bfa" }]);
    }

    push(11, "done", { count, ANSWER: count }, `✅ ${count} subarrays with XOR = ${k}`, []);
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

const PC = { init: "#8b5cf6", xor: "#38bdf8", found: "#22c55e", store: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", xor: "⊕ XOR", found: "✅ FOUND", store: "💾 STORE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count subarrays whose XOR equals k.

## Key Insight — Prefix XOR + HashMap
XOR has a special property: if prefixXOR[0..i] ^ prefixXOR[0..j] = k, then XOR of [j+1..i] = k.

Since XOR is its own inverse: need = xorSum ^ k (if this prefix exists in map, subarray found!)

## Why mp[0] = 1?
Handles cases where xorSum itself equals k.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [4, 2, 2, 6, 4], k=6

- i=0: xor=4, need=4^6=2, not found
- i=1: xor=6, need=6^6=0, found! count=1
- i=2: xor=4, need=4^6=2, found! count=2
- i=3: xor=2, need=2^6=4, found(2)! count=4
- i=4: xor=6, need=6^6=0, found! count=5

**Answer: 5**

### Complexity: O(n) time, O(n) space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## XOR Properties

### a ^ a = 0 (self-inverse)
### a ^ 0 = a (identity)

### Prefix XOR analog of prefix sum
    xorSum ^= arr[i]; // like sum += arr[i]
    
### Finding complement
    int need = xorSum ^ k; // like rem = sum - k
Because if prefixXOR[j] = need, then XOR[j+1..i] = xorSum ^ need = k`
    },
];

const DEFAULT = [4, 2, 2, 6, 4];
const DEFAULT_K = 6;
export default function CountSubarraysXOR() {
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
        <VizLayout title="Count Subarrays with XOR K" subtitle="Prefix XOR + HashMap · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="4,2,2,6,4" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>k:</span>
                    <input type="number" value={kInput} onChange={e => setKInput(e.target.value)} style={{
                        width: "50px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="countXOR.cpp" />
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
