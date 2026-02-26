import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_ARR = [100, 4, 200, 1, 3, 2];

const CODE = [
    { id: 0, text: `int longestConsecutive(vector<int>& nums) {` },
    { id: 1, text: `    unordered_set<int> s(nums.begin(), nums.end());` },
    { id: 2, text: `    int longest = 0;` },
    { id: 3, text: `    for (int n : nums) {` },
    { id: 4, text: `        if (!s.count(n - 1)) {` },
    { id: 5, text: `            int len = 1;` },
    { id: 6, text: `            while (s.count(n + len)) len++;` },
    { id: 7, text: `            longest = max(longest, len);` },
    { id: 8, text: `        }` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return longest;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", skip: "#64748b", start: "#3b82f6", extend: "#f59e0b", best: "#10b981", done: "#10b981" };
const PHASE_LABELS = { init: "BUILD SET", skip: "NOT A START", start: "SEQUENCE START", extend: "EXTENDING →", best: "NEW BEST!", done: "DONE ✓" };

function generateSteps(nums) {
    const steps = [];
    const s = new Set(nums);
    let longest = 0;

    steps.push({
        cl: 1, phase: "init", nums, set: [...s].sort((a, b) => a - b), activeNum: null, seqStart: null, seqLen: 0, longest: 0, currentSeq: [],
        msg: `Build set: {${[...s].sort((a, b) => a - b).join(", ")}}`,
        vars: { "set.size": s.size, longest: 0 },
    });

    for (const n of nums) {
        if (s.has(n - 1)) {
            steps.push({
                cl: 4, phase: "skip", nums, set: [...s].sort((a, b) => a - b), activeNum: n, seqStart: null, seqLen: 0, longest, currentSeq: [],
                msg: `${n} has ${n - 1} before it → not a start, skip`,
                vars: { n, [`has(${n - 1})`]: "true", longest },
            });
            continue;
        }

        let len = 1;
        const seq = [n];
        steps.push({
            cl: 5, phase: "start", nums, set: [...s].sort((a, b) => a - b), activeNum: n, seqStart: n, seqLen: 1, longest, currentSeq: [n],
            msg: `${n} is a sequence start! (no ${n - 1} in set)`,
            vars: { n, len: 1, longest },
        });

        while (s.has(n + len)) {
            seq.push(n + len);
            len++;
            steps.push({
                cl: 6, phase: "extend", nums, set: [...s].sort((a, b) => a - b), activeNum: n + len - 1, seqStart: n, seqLen: len, longest, currentSeq: [...seq],
                msg: `${n + len - 1} found → len = ${len}`,
                vars: { next: n + len - 1, len, longest },
            });
        }

        if (len > longest) {
            longest = len;
            steps.push({
                cl: 7, phase: "best", nums, set: [...s].sort((a, b) => a - b), activeNum: n, seqStart: n, seqLen: len, longest, currentSeq: [...seq],
                msg: `New longest! ${len} beats ${longest - len + (longest === len ? 0 : 1)}`,
                vars: { longest, sequence: seq.join("→") },
            });
        }
    }

    steps.push({
        cl: 10, phase: "done", nums, set: [...s].sort((a, b) => a - b), activeNum: null, seqStart: null, seqLen: 0, longest, currentSeq: [],
        msg: `🟢 Longest consecutive sequence = ${longest}`,
        vars: { "return": longest },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 128 — Longest Consecutive Sequence

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, Union Find

---

Given an unsorted array of integers, return the length of the **longest consecutive elements sequence**. Must run in **O(n)** time.

### Examples
\`\`\`
Input:  [100,4,200,1,3,2]
Output: 4  (sequence: 1→2→3→4)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## HashSet + Smart Start

### Key Insight
Only start counting from **sequence beginnings** (numbers with no n-1 in the set). This avoids redundant work.

### Algorithm
1. Put all numbers in a HashSet
2. For each number, check if it's a sequence start (no n-1)
3. If yes, count consecutive numbers forward
4. Track the longest sequence`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each number visited at most twice |
| **Space** | **O(n)** | HashSet |`
    }
];

export default function LongestConsecutiveNC() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 12) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Longest Consecutive Sequence" subtitle="LC #128 · HashSet O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="100,4,200,1,3,2" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="longest_consecutive.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Sorted set visualization */}
            <VizCard title={`📊 Set (sorted) · longest = ${step.longest}`}>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.set.map((val, i) => {
                        const isActive = step.activeNum === val;
                        const inSeq = step.currentSeq.includes(val);
                        return (
                            <div key={i} style={{
                                width: "48px", height: "52px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: inSeq ? "#10b98118" : isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${inSeq ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s",
                                transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                fontWeight: "900", fontSize: "1rem", fontFamily: "monospace",
                                color: inSeq ? "#10b981" : isActive ? pc : theme.text,
                            }}>{val}</div>
                        );
                    })}
                </div>
                {step.currentSeq.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.8rem", fontWeight: "700", color: "#10b981" }}>
                        Current: {step.currentSeq.join(" → ")} (len={step.seqLen})
                    </div>
                )}
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
