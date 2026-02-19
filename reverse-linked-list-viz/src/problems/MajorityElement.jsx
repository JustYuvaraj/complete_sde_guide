import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int majorityElement(int arr[], int n) {` },
    { id: 1, text: `    int count = 0, candidate = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        if (count == 0) candidate = arr[i];` },
    { id: 4, text: `        count += (arr[i]==candidate) ? 1 : -1;` },
    { id: 5, text: `    }` },
    { id: 6, text: `    return candidate;` },
    { id: 7, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let count = 0, candidate = 0;
    push(1, "init", { count, candidate }, "Boyer-Moore Voting starts", []);

    for (let i = 0; i < arr.length; i++) {
        if (count === 0) {
            candidate = arr[i];
            push(3, "new-candidate", { count, candidate, i, "arr[i]": arr[i] },
                `count=0 → new candidate = ${arr[i]}`,
                [{ idx: i, color: "#f59e0b" }]);
        }
        count += (arr[i] === candidate) ? 1 : -1;
        const match = arr[i] === candidate;
        push(4, match ? "vote" : "cancel", { count, candidate, i, "arr[i]": arr[i] },
            match ? `${arr[i]} == candidate → count++ = ${count}` : `${arr[i]} != ${candidate} → count-- = ${count}`,
            [{ idx: i, color: match ? "#22c55e" : "#ef4444" }]);
    }

    push(6, "done", { candidate, ANSWER: candidate }, `✅ Majority element = ${candidate}`, []);
    return { steps, answer: candidate, arr };
}

function ArrayGrid({ arr, highlights = [], candidate }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const isCand = val === candidate && !c;
                    return (
                        <div key={i} style={{ width: "48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.85rem",
                                background: c ? `${c}20` : isCand ? "#f59e0b18" : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isCand ? "#f59e0b44" : (isDark ? "#334155" : "#e2e8f0"))}`,
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

const PC = { init: "#8b5cf6", "new-candidate": "#f59e0b", vote: "#22c55e", cancel: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", "new-candidate": "👑 NEW", vote: "👍 VOTE", cancel: "👎 CANCEL", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find element appearing more than n/2 times. Guaranteed to exist.

## Key Insight — Boyer-Moore Voting
Imagine an election. Each element "votes" for or against the current candidate:
- Same as candidate → count++
- Different → count-- (cancels one vote)
- Count hits 0 → elect new candidate

## Why It Works
The majority element has MORE occurrences than ALL others combined. Even if every minority element cancels a majority vote, the majority still wins.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [2, 2, 1, 1, 1, 2, 2]

1. count=0 → candidate=2, count=1
2. 2==2 → count=2
3. 1!=2 → count=1
4. 1!=2 → count=0
5. count=0 → candidate=1, count=1... wait, 1!=1? No, 1==1 → count=1
6. 2!=1 → count=0
7. count=0 → candidate=2, count=1
**Answer: 2** ✅

### Complexity
- **Time:** O(n) — two passes max
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Boyer-Moore Voting

### Candidate selection
    if (count == 0) candidate = arr[i];
When all votes cancel, start fresh.

### Voting
    count += (arr[i]==candidate) ? 1 : -1;
Same → support. Different → oppose.

### Verification (optional)
If not guaranteed, do a second pass to verify count > n/2.`
    },
];

const DEFAULT = [2, 2, 1, 1, 1, 2, 2];
export default function MajorityElement() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Majority Element (Boyer-Moore)" subtitle="Voting algorithm · O(n) time, O(1) space">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="2,2,1,1,1,2,2" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="majorityElement.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} candidate={step.vars.candidate} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#f59e0b", fontWeight: 700 }}>Majority: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
