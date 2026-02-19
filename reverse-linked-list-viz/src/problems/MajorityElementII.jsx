import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> majorityII(vector<int>& a) {` },
    { id: 1, text: `    int c1=0,c2=0,e1=INT_MIN,e2=INT_MIN;` },
    { id: 2, text: `    for (int x : a) {` },
    { id: 3, text: `        if (c1==0 && x!=e2) {e1=x;c1=1;}` },
    { id: 4, text: `        else if (c2==0 && x!=e1) {e2=x;c2=1;}` },
    { id: 5, text: `        else if (x==e1) c1++;` },
    { id: 6, text: `        else if (x==e2) c2++;` },
    { id: 7, text: `        else { c1--; c2--; }` },
    { id: 8, text: `    }` },
    { id: 9, text: `    // Verify` },
    { id: 10, text: `    c1=c2=0;` },
    { id: 11, text: `    for(int x:a){if(x==e1)c1++;else if(x==e2)c2++;}` },
    { id: 12, text: `    vector<int> res;` },
    { id: 13, text: `    if(c1>a.size()/3) res.push_back(e1);` },
    { id: 14, text: `    if(c2>a.size()/3) res.push_back(e2);` },
    { id: 15, text: `    return res;` },
    { id: 16, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let c1 = 0, c2 = 0, e1 = null, e2 = null;
    push(1, "init", { c1, c2, "e1": "none", "e2": "none" }, "Extended Boyer-Moore (2 candidates)", []);

    for (let i = 0; i < arr.length; i++) {
        const x = arr[i];
        if (c1 === 0 && x !== e2) { e1 = x; c1 = 1; push(3, "elect-1", { e1, c1, e2, c2, "x": x }, `Elect e1=${x}`, [{ idx: i, color: "#22c55e" }]); }
        else if (c2 === 0 && x !== e1) { e2 = x; c2 = 1; push(4, "elect-2", { e1, c1, e2, c2, "x": x }, `Elect e2=${x}`, [{ idx: i, color: "#38bdf8" }]); }
        else if (x === e1) { c1++; push(5, "vote-1", { e1, c1, e2, c2 }, `${x}==e1 → c1=${c1}`, [{ idx: i, color: "#22c55e" }]); }
        else if (x === e2) { c2++; push(6, "vote-2", { e1, c1, e2, c2 }, `${x}==e2 → c2=${c2}`, [{ idx: i, color: "#38bdf8" }]); }
        else { c1--; c2--; push(7, "cancel", { e1, c1, e2, c2, "x": x }, `${x} cancels both → c1=${c1}, c2=${c2}`, [{ idx: i, color: "#ef4444" }]); }
    }

    // Verify
    c1 = 0; c2 = 0;
    for (const x of arr) { if (x === e1) c1++; else if (x === e2) c2++; }
    const res = [];
    const threshold = Math.floor(arr.length / 3);
    if (c1 > threshold) res.push(e1);
    if (c2 > threshold) res.push(e2);

    push(14, "done", { "candidates": `e1=${e1}(${c1}), e2=${e2}(${c2})`, "n/3": threshold, ANSWER: `[${res.join(",")}]` },
        `✅ Majority > n/3: [${res.join(",")}]`, []);
    return { steps, answer: res, arr };
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

const PC = { init: "#8b5cf6", "elect-1": "#22c55e", "elect-2": "#38bdf8", "vote-1": "#22c55e", "vote-2": "#38bdf8", cancel: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", "elect-1": "👑 ELECT1", "elect-2": "👑 ELECT2", "vote-1": "👍 VOTE1", "vote-2": "👍 VOTE2", cancel: "❌ CANCEL", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find all elements appearing more than n/3 times. (LC #229)

## Key Insight
At most **2** elements can appear > n/3 times. Use extended Boyer-Moore with **2 candidates**.

## Why 2 Candidates?
If an element takes > n/3 slots, the remaining < 2n/3 slots can hold at most 1 more such element.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Two Phases

### Phase 1: Find 2 candidates (Boyer-Moore extended)
### Phase 2: Verify by counting

### Example: [3, 2, 3]
- e1=3 (c1=1), e2=2 (c2=1), 3==e1 → c1=2
- Verify: 3 appears 2 > 1(n/3) ✅, 2 appears 1 = 1 ❌
- **Answer: [3]**

### Complexity: O(n) time, O(1) space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Five Cases

1. c1==0 && x≠e2 → elect x as e1
2. c2==0 && x≠e1 → elect x as e2
3. x==e1 → support e1
4. x==e2 → support e2
5. else → cancel both (c1--, c2--)

### Verification
Candidates might be wrong! Must verify with actual counts.`
    },
];

const DEFAULT = [3, 2, 3];
export default function MajorityElementII() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Majority Element II (n/3)" subtitle="Extended Boyer-Moore · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="3,2,3" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="majorityII.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Majority: [{sess.answer.join(",")}]</span></StepInfo>
        </VizLayout>
    );
}
