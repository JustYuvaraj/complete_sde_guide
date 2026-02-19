import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `pair<int,int> findRepeatMissing(int a[],int n){` },
    { id: 1, text: `    long S=0, S2=0;` },
    { id: 2, text: `    for(int i=0;i<n;i++){` },
    { id: 3, text: `        S += a[i]; S2 += (long)a[i]*a[i];` },
    { id: 4, text: `    }` },
    { id: 5, text: `    long Sn = n*(n+1)/2;` },
    { id: 6, text: `    long S2n = n*(n+1)*(2*n+1)/6;` },
    { id: 7, text: `    long d1 = S - Sn;  // x - y` },
    { id: 8, text: `    long d2 = S2 - S2n; // x²-y²` },
    { id: 9, text: `    long d3 = d2 / d1;  // x + y` },
    { id: 10, text: `    int x = (d1+d3)/2; // repeating` },
    { id: 11, text: `    int y = x - d1;     // missing` },
    { id: 12, text: `    return {x, y};` },
    { id: 13, text: `}` },
];

function gen(arr) {
    const steps = [];
    const n = arr.length;
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let S = 0, S2 = 0;
    push(1, "init", { n }, "Compute actual sums and squared sums", []);

    for (let i = 0; i < n; i++) {
        S += arr[i]; S2 += arr[i] * arr[i];
        push(3, "sum", { i, "arr[i]": arr[i], S, S2 }, `S += ${arr[i]} → ${S}`, [{ idx: i, color: "#38bdf8" }]);
    }

    const Sn = n * (n + 1) / 2;
    const S2n = n * (n + 1) * (2 * n + 1) / 6;
    push(6, "expected", { Sn, S2n }, `Expected: Sn=${Sn}, S2n=${S2n}`, []);

    const d1 = S - Sn;
    const d2 = S2 - S2n;
    const d3 = d2 / d1;
    push(9, "equations", { "x-y": d1, "x²-y²": d2, "x+y": d3 }, `x-y=${d1}, x+y=${d3}`, []);

    const x = (d1 + d3) / 2;
    const y = x - d1;
    push(12, "done", { "repeating(x)": x, "missing(y)": y, ANSWER: `{${x},${y}}` },
        `✅ Repeating=${x}, Missing=${y}`, []);

    return { steps, repeating: x, missing: y, arr };
}

function ArrayGrid({ arr, highlights = [], repeating, missing }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const isRep = val === repeating;
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: c ? `${c}20` : isRep ? "#ef444418" : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isRep ? "#ef4444" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                color: c || (isRep ? "#ef4444" : (isDark ? "#e2e8f0" : "#1e293b")),
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

const PC = { init: "#8b5cf6", sum: "#38bdf8", expected: "#a78bfa", equations: "#f59e0b", done: "#10b981" };
const PL = { init: "⚙️ INIT", sum: "➕ SUM", expected: "📊 EXPECT", equations: "🧮 SOLVE", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Array 1..n with one number repeating and one missing. Find both.

## Key Insight — Math
Let x = repeating, y = missing.
- S - Sn = x - y (sum difference)
- S² - S²n = x² - y² = (x-y)(x+y) (squared sum difference)

Two equations, two unknowns → solve!`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [3, 1, 2, 5, 3] (n=5)

- S = 14, Sn = 15 → x-y = -1... wait
- Actually [1,2,5,3,3]: S=14, Sn=15, x-y=-1
- Better example: [4, 3, 6, 2, 1, 1] (n=6)
- S=17, Sn=21, S²=67, S²n=91
- x-y=-4, x²-y²=-24, x+y=6
- x=1, y=5 → Repeating=1, Missing=5

### Complexity: O(n) time, O(1) space`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## System of Equations

### From sums:  x - y = d1
### From sqr sums:  x + y = d2/d1

### Solve:
    x = (d1 + d3) / 2
    y = x - d1

### Watch for overflow
Use long long for squared sums!`
    },
];

const DEFAULT = [4, 3, 6, 2, 1, 1];
export default function RepeatingMissing() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v) && v > 0); if (a.length < 2 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Find Repeating & Missing" subtitle="Math (sum + squared sum) · O(n) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="4,3,6,2,1,1" label="Array (1..n, one repeat, one missing):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="repeatingMissing.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} repeating={sess.repeating} missing={sess.missing} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>Repeat: {sess.repeating}</span>
                <span style={{ color: "#22c55e", fontWeight: 700, marginLeft: "12px" }}>Missing: {sess.missing}</span>
            </StepInfo>
        </VizLayout>
    );
}
