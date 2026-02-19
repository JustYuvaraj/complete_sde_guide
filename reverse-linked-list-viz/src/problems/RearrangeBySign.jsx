import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> rearrange(vector<int>& a) {` },
    { id: 1, text: `    vector<int> pos, neg;` },
    { id: 2, text: `    for (int x : a)` },
    { id: 3, text: `        (x >= 0) ? pos.push_back(x)` },
    { id: 4, text: `                 : neg.push_back(x);` },
    { id: 5, text: `    vector<int> res;` },
    { id: 6, text: `    for (int i = 0; i < pos.size(); i++){` },
    { id: 7, text: `        res.push_back(pos[i]);` },
    { id: 8, text: `        res.push_back(neg[i]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return res;` },
    { id: 11, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl, res) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], result: res ? [...res] : [] });

    const pos = [], neg = [];
    push(1, "init", {}, "Separate positives and negatives", [], []);

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= 0) { pos.push(arr[i]); push(3, "positive", { i, "val": arr[i], "pos.size": pos.length }, `${arr[i]} → positives`, [{ idx: i, color: "#22c55e" }], []); }
        else { neg.push(arr[i]); push(4, "negative", { i, "val": arr[i], "neg.size": neg.length }, `${arr[i]} → negatives`, [{ idx: i, color: "#ef4444" }], []); }
    }

    const res = [];
    for (let i = 0; i < pos.length; i++) {
        res.push(pos[i]);
        res.push(neg[i]);
        push(8, "interleave", { i, "pos[i]": pos[i], "neg[i]": neg[i] },
            `Place +${pos[i]}, ${neg[i]}`, [], [...res]);
    }

    push(10, "done", { RESULT: `[${res.join(",")}]` }, `✅ Rearranged: [${res.join(",")}]`, [], res);
    return { steps, answer: res, arr };
}

function ArrayGrid({ arr, highlights = [], result = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Original → Result">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
                <div>
                    <div style={{ fontSize: "0.55rem", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "3px", fontWeight: 700 }}>Original</div>
                    <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                        {arr.map((val, i) => {
                            const c = hlMap[i] || (val >= 0 ? "#22c55e" : "#ef4444");
                            return (
                                <div key={i} style={{
                                    width: "38px", height: "38px", borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.75rem",
                                    background: `${c}15`, border: `2px solid ${c}44`, color: c,
                                    transition: "all 0.3s",
                                }}>{val}</div>
                            );
                        })}
                    </div>
                </div>
                {result.length > 0 && (
                    <div>
                        <div style={{ fontSize: "0.55rem", color: "#f59e0b", marginBottom: "3px", fontWeight: 700 }}>Result</div>
                        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                            {result.map((val, i) => {
                                const c = val >= 0 ? "#22c55e" : "#ef4444";
                                return (
                                    <div key={i} style={{
                                        width: "38px", height: "38px", borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 800, fontSize: "0.75rem",
                                        background: `${c}20`, border: `2px solid ${c}`, color: c,
                                    }}>{val}</div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", positive: "#22c55e", negative: "#ef4444", interleave: "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", positive: "➕ POS", negative: "➖ NEG", interleave: "🔀 MIX", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Rearrange array so positives and negatives alternate. Start with positive.

## Approach
1. Separate into pos[] and neg[] arrays
2. Interleave: pos[0], neg[0], pos[1], neg[1], ...

## Assumption
Equal number of positives and negatives (as per problem constraints).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [3, 1, -2, -5, 2, -4]

pos = [3, 1, 2]
neg = [-2, -5, -4]
Result = [3, -2, 1, -5, 2, -4] ✅

### Complexity
- **Time:** O(n)
- **Space:** O(n)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Two Passes

### Pass 1: Separate
Scan and bucket elements by sign.

### Pass 2: Interleave
Alternate between pos and neg arrays.

### Variant: In-place
For O(1) space, use index-based placement: even indices → positive, odd → negative.`
    },
];

const DEFAULT = [3, 1, -2, -5, 2, -4];
export default function RearrangeBySign() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 2 || a.length > 14) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Rearrange Array by Sign" subtitle="Alternate positive & negative · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="3,1,-2,-5,2,-4" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="rearrangeBySign.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} result={step.result} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length} />
        </VizLayout>
    );
}
