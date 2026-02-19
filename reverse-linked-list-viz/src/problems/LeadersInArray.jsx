import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> leaders(int arr[], int n) {` },
    { id: 1, text: `    vector<int> res;` },
    { id: 2, text: `    int maxRight = INT_MIN;` },
    { id: 3, text: `    for (int i = n-1; i >= 0; i--) {` },
    { id: 4, text: `        if (arr[i] > maxRight) {` },
    { id: 5, text: `            res.push_back(arr[i]);` },
    { id: 6, text: `            maxRight = arr[i];` },
    { id: 7, text: `        }` },
    { id: 8, text: `    }` },
    { id: 9, text: `    return res; // reversed` },
    { id: 10, text: `}` },
];

function gen(arr) {
    const steps = [];
    const leaders = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], leaders: [...leaders] });

    let maxRight = -Infinity;
    push(2, "init", { maxRight: "-∞" }, "Scan from right to left", []);

    for (let i = arr.length - 1; i >= 0; i--) {
        push(4, "check", { i, "arr[i]": arr[i], maxRight: maxRight === -Infinity ? "-∞" : maxRight },
            `Check arr[${i}]=${arr[i]} vs maxRight=${maxRight === -Infinity ? "∞" : maxRight}`,
            [{ idx: i, color: "#38bdf8" }]);

        if (arr[i] > maxRight) {
            leaders.push(arr[i]);
            maxRight = arr[i];
            push(5, "leader", { i, "arr[i]": arr[i], maxRight },
                `${arr[i]} > maxRight → it's a LEADER!`,
                [{ idx: i, color: "#22c55e" }]);
        } else {
            push(7, "not-leader", { i, "arr[i]": arr[i], maxRight },
                `${arr[i]} ≤ ${maxRight} → not a leader`,
                [{ idx: i, color: "#64748b" }]);
        }
    }

    push(9, "done", { leaders: `[${leaders.reverse().join(",")}]` },
        `✅ Leaders: [${[...leaders].join(",")}]`, []);
    return { steps, answer: leaders, arr };
}

function ArrayGrid({ arr, highlights = [], leaders = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    const leaderSet = new Set(leaders);
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

const PC = { init: "#8b5cf6", check: "#38bdf8", leader: "#22c55e", "not-leader": "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", check: "🔍 CHECK", leader: "👑 LEADER", "not-leader": "⏭️ SKIP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
An element is a **leader** if no element to its RIGHT is greater than it.

## Key Insight — Scan Right to Left
The rightmost element is always a leader. Scan from right, tracking the maximum seen so far. If current > maxRight → it's a leader.

## Why Right to Left?
A leader depends on ALL elements to its right. By scanning right-to-left and tracking the max, we check this in O(1) per element.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [16, 17, 4, 3, 5, 2]

- i=5: 2 > -∞ → leader! max=2
- i=4: 5 > 2 → leader! max=5
- i=3: 3 < 5 → nope
- i=2: 4 < 5 → nope
- i=1: 17 > 5 → leader! max=17
- i=0: 16 < 17 → nope

Leaders: [17, 5, 2] ✅

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1) extra (excluding result)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Right-to-Left Scan

### Track maxRight
Updated whenever a new leader is found.

### Leader condition
    if (arr[i] > maxRight)
Strictly greater than everything to the right.

### Result
Collected in reverse order, reverse before returning.`
    },
];

const DEFAULT = [16, 17, 4, 3, 5, 2];
export default function LeadersInArray() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Leaders in an Array" subtitle="Right-to-left scan · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="16,17,4,3,5,2" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="leaders.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} leaders={step.leaders} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Leaders: [{sess.answer.join(",")}]</span></StepInfo>
        </VizLayout>
    );
}
