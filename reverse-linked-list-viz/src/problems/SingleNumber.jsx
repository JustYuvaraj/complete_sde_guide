import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int singleNumber(int arr[], int n) {` },
    { id: 1, text: `    int xorVal = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        xorVal ^= arr[i];` },
    { id: 4, text: `    }` },
    { id: 5, text: `    return xorVal;` },
    { id: 6, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });
    let xorVal = 0;
    push(1, "init", { xorVal }, "Initialize xorVal = 0", []);

    for (let i = 0; i < arr.length; i++) {
        const prev = xorVal;
        xorVal ^= arr[i];
        push(3, "xor", { xorVal, i, "arr[i]": arr[i], "prev⊕arr[i]": `${prev}⊕${arr[i]}=${xorVal}` },
            `${prev} ⊕ ${arr[i]} = ${xorVal}`,
            [{ idx: i, color: "#38bdf8" }]);
    }

    push(5, "done", { xorVal, ANSWER: xorVal }, `✅ Single number = ${xorVal}`, []);
    return { steps, answer: xorVal, arr };
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

const PC = { init: "#8b5cf6", xor: "#38bdf8", done: "#10b981" };
const PL = { init: "⚙️ INIT", xor: "⊕ XOR", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Every element appears **twice** except one. Find the single one.

## Key Insight — XOR Magic
- a ⊕ a = 0 (same number cancels itself)
- a ⊕ 0 = a (XOR with 0 gives itself)
- XOR is commutative and associative

So XOR ALL elements together → pairs cancel → only the single number remains!

## Why Not HashSet?
HashSet works but uses O(n) space. XOR uses O(1).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 3, 5, 3, 2]

0 ⊕ 2 = 2
2 ⊕ 3 = 1
1 ⊕ 5 = 4
4 ⊕ 3 = 7
7 ⊕ 2 = 5 ✅

The 2s and 3s cancel out, leaving 5!

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1) — one variable`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Beautifully Simple

### The Entire Algorithm
    int xorVal = 0;
    for (int i = 0; i < n; i++)
        xorVal ^= arr[i];
    return xorVal;

That's it! Three lines of pure elegance.

### Why It's Correct
Every number that appears twice gets XORed an even number of times → cancels to 0. The single number gets XORed once → remains.`
    },
];

const DEFAULT = [2, 3, 5, 3, 2];
export default function SingleNumber() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Single Number (XOR)" subtitle="Every element twice except one · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,3,5,3,2" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="singleNumber.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#f59e0b", fontWeight: 700 }}>Single: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
