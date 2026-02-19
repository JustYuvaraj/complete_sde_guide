import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int longestConsecutive(vector<int>& nums) {` },
    { id: 1, text: `    unordered_set<int> s(nums.begin(),nums.end());` },
    { id: 2, text: `    int longest = 0;` },
    { id: 3, text: `    for (int n : s) {` },
    { id: 4, text: `        if (!s.count(n - 1)) { // start` },
    { id: 5, text: `            int cur = n, len = 1;` },
    { id: 6, text: `            while (s.count(cur + 1))` },
    { id: 7, text: `                { cur++; len++; }` },
    { id: 8, text: `            longest = max(longest, len);` },
    { id: 9, text: `        }` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return longest;` },
    { id: 12, text: `}` },
];

function gen(arr) {
    const steps = [];
    const s = new Set(arr);
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    push(1, "init", { "set size": s.size }, "Build hash set", []);

    let longest = 0;
    const sorted = [...s].sort((a, b) => a - b);

    for (const n of sorted) {
        if (!s.has(n - 1)) {
            push(4, "start", { n, "n-1 exists": false },
                `${n} has no predecessor → start of sequence!`,
                [{ idx: arr.indexOf(n), color: "#22c55e" }]);

            let cur = n, len = 1;
            const seqIndices = [arr.indexOf(n)];
            while (s.has(cur + 1)) {
                cur++;
                len++;
                seqIndices.push(arr.indexOf(cur));
                push(7, "extend", { cur, len },
                    `Found ${cur} → sequence length = ${len}`,
                    seqIndices.map(idx => ({ idx, color: "#f59e0b" })));
            }

            longest = Math.max(longest, len);
            push(8, "record", { longest, "sequence": `${n}..${cur}`, len },
                `Sequence ${n}..${cur}, len=${len}, longest=${longest}`, []);
        } else {
            push(4, "skip", { n, "n-1 exists": true },
                `${n} has predecessor ${n - 1} → skip (not a start)`,
                [{ idx: arr.indexOf(n), color: "#64748b" }]);
        }
    }

    push(11, "done", { longest, ANSWER: longest }, `✅ Longest consecutive sequence = ${longest}`, []);
    return { steps, answer: longest, arr };
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

const PC = { init: "#8b5cf6", start: "#22c55e", extend: "#f59e0b", record: "#38bdf8", skip: "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", start: "🟢 START", extend: "➡️ EXTEND", record: "📊 RECORD", skip: "⏭️ SKIP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the length of the longest consecutive element sequence. (LC #128)

## Key Insight — HashSet + Start Detection
Put all numbers in a set. A number n is a **sequence start** if (n-1) is NOT in the set.
Only start counting from sequence starts → each element is visited at most twice → O(n)!

## Why Not Sort?
Sorting costs O(n log n). HashSet approach is O(n).`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [100, 4, 200, 1, 3, 2]

Set: {100, 4, 200, 1, 3, 2}

- 1: no 0 in set → START! Count: 1→2→3→4 (1,2,3,4). Len=4
- 2: has 1 → skip
- 3: has 2 → skip
- 4: has 3 → skip
- 100: no 99 → START! Count: 100. Len=1
- 200: no 199 → START! Count: 200. Len=1

**Answer: 4** ✅

### Complexity
- **Time:** O(n) amortized
- **Space:** O(n) — hash set`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Start Detection

### Check if start
    if (!s.count(n - 1))
If n-1 exists, n is part of a longer sequence starting earlier.

### Count forward
    while (s.count(cur + 1)) { cur++; len++; }
Keep extending while next consecutive exists.

### Why O(n)?
Each number is part of exactly ONE sequence. Start numbers begin the count, others are skipped. Total work = n.`
    },
];

const DEFAULT = [100, 4, 200, 1, 3, 2];
export default function LongestConsecutiveSeq() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 1 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Longest Consecutive Sequence" subtitle="HashSet start detection · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="100,4,200,1,3,2" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="longestConsecutive.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Longest: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
