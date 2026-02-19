import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> twoSum(int arr[], int n, int t) {` },
    { id: 1, text: `    unordered_map<int,int> mp;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        int need = t - arr[i];` },
    { id: 4, text: `        if (mp.count(need))` },
    { id: 5, text: `            return {mp[need], i};` },
    { id: 6, text: `        mp[arr[i]] = i;` },
    { id: 7, text: `    }` },
    { id: 8, text: `    return {};` },
    { id: 9, text: `}` },
];

function gen(arr, target) {
    const steps = [];
    const mp = {};
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], map: { ...mp } });

    push(1, "init", { target }, `Find two numbers that sum to ${target}`, []);

    for (let i = 0; i < arr.length; i++) {
        const need = target - arr[i];
        push(3, "check", { i, "arr[i]": arr[i], need },
            `arr[${i}]=${arr[i]}, need ${need} to make ${target}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (mp[need] !== undefined) {
            push(5, "found", { i, "pair": `[${mp[need]}, ${i}]`, "arr[i]": arr[i], "arr[j]": need },
                `✅ Found! arr[${mp[need]}]=${need} + arr[${i}]=${arr[i]} = ${target}`,
                [{ idx: mp[need], color: "#22c55e" }, { idx: i, color: "#22c55e" }]);
            return { steps, answer: [mp[need], i], arr };
        }

        mp[arr[i]] = i;
        push(6, "store", { i, "stored": `mp[${arr[i]}]=${i}` },
            `Store mp[${arr[i]}] = ${i}`,
            [{ idx: i, color: "#a78bfa" }]);
    }

    push(8, "not-found", {}, `❌ No two sum pair found`, []);
    return { steps, answer: [-1, -1], arr };
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

const PC = { init: "#8b5cf6", check: "#38bdf8", found: "#22c55e", store: "#a78bfa", "not-found": "#ef4444" };
const PL = { init: "⚙️ INIT", check: "🔍 CHECK", found: "✅ FOUND", store: "💾 STORE", "not-found": "❌ NONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find two indices whose elements sum to target. LC #1 — most asked!

## Key Insight — Complement Lookup
For each element, compute **need = target - arr[i]**. If need exists in our map → pair found!

## Why HashMap?
O(1) lookup vs O(n) brute-force inner loop. Reduces O(n²) → O(n).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 7, 11, 15], target=9

1. i=0: arr[0]=2, need=7, not in map → store mp[2]=0
2. i=1: arr[1]=7, need=2, found mp[2]=0 → **[0,1]** ✅

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(n) — hashmap`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## One-Pass HashMap

### Compute complement
    int need = t - arr[i];

### Lookup in map
    if (mp.count(need)) return {mp[need], i};

### Store for future lookups
    mp[arr[i]] = i;

### Why one pass works
We store as we go. If a pair exists, the first element gets stored BEFORE we reach the second.`
    },
];

const DEFAULT = [2, 7, 11, 15];
const DEFAULT_T = 9;
export default function TwoSum() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [tgt, setTgt] = useState(String(DEFAULT_T));
    const [sess, setSess] = useState(() => gen(DEFAULT, DEFAULT_T));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => {
        const a = input.split(",").map(Number).filter(v => !isNaN(v));
        const t = parseInt(tgt);
        if (a.length < 2 || a.length > 15 || isNaN(t)) return;
        setSess(gen(a, t)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput(DEFAULT.join(",")); setTgt(String(DEFAULT_T)); setSess(gen(DEFAULT, DEFAULT_T)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Two Sum" subtitle="HashMap one-pass · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,7,11,15" label="Array:" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>Target:</span>
                    <input type="number" value={tgt} onChange={e => setTgt(e.target.value)} style={{
                        width: "60px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155",
                        borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit",
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="twoSum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>Pair: [{sess.answer.join(",")}]</span>
            </StepInfo>
        </VizLayout>
    );
}
