import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [3, 4, -1, 1];

const CODE = [
    { id: 0, text: `int firstMissingPositive(vector<int>& nums) {` },
    { id: 1, text: `    int n = nums.size();` },
    { id: 2, text: `    for (int i = 0; i < n; i++)` },
    { id: 3, text: `        while (nums[i] > 0 && nums[i] <= n` },
    { id: 4, text: `               && nums[nums[i]-1] != nums[i])` },
    { id: 5, text: `            swap(nums[i], nums[nums[i]-1]);` },
    { id: 6, text: `    for (int i = 0; i < n; i++)` },
    { id: 7, text: `        if (nums[i] != i + 1)` },
    { id: 8, text: `            return i + 1;` },
    { id: 9, text: `    return n + 1;` },
    { id: 10, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", swap: "#f59e0b", skip: "#64748b", scan: "#3b82f6", found: "#ef4444", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", swap: "CYCLIC SORT", skip: "SKIP", scan: "SCAN FOR MISSING", found: "MISSING!", done: "DONE ✓" };

function generateSteps(nums) {
    const steps = [];
    const a = [...nums];
    const n = a.length;

    steps.push({
        cl: 1, phase: "init", nums: [...a], activeIdx: -1, swapTo: -1, scanPhase: false,
        msg: `Cyclic sort: place each value at its correct index`,
        vars: { n },
    });

    for (let i = 0; i < n; i++) {
        while (a[i] > 0 && a[i] <= n && a[a[i] - 1] !== a[i]) {
            const target = a[i] - 1;
            [a[i], a[target]] = [a[target], a[i]];
            steps.push({
                cl: 5, phase: "swap", nums: [...a], activeIdx: i, swapTo: target, scanPhase: false,
                msg: `swap(${a[target]}, ${a[i]}) → place at index ${target}`,
                vars: { i, [`nums[${i}]`]: a[i], swapTo: target },
            });
        }
    }

    for (let i = 0; i < n; i++) {
        if (a[i] !== i + 1) {
            steps.push({
                cl: 8, phase: "found", nums: [...a], activeIdx: i, swapTo: -1, scanPhase: true,
                msg: `🔴 nums[${i}] = ${a[i]} ≠ ${i + 1} → missing = ${i + 1}`,
                vars: { i, [`nums[${i}]`]: a[i], expected: i + 1, "return": i + 1 },
            });
            return steps;
        }
        steps.push({
            cl: 7, phase: "scan", nums: [...a], activeIdx: i, swapTo: -1, scanPhase: true,
            msg: `nums[${i}] = ${a[i]} = ${i + 1} ✓`,
            vars: { i, [`nums[${i}]`]: a[i] },
        });
    }

    steps.push({
        cl: 9, phase: "done", nums: [...a], activeIdx: -1, swapTo: -1, scanPhase: true,
        msg: `🟢 All present → missing = ${n + 1}`,
        vars: { "return": n + 1 },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 41 — First Missing Positive

**Difficulty:** Hard &nbsp; **Topics:** Array, Hash Table

---

Given an unsorted array, find the **smallest missing positive integer** in O(n) time and O(1) space.

### Examples
\`\`\`
Input:  [3,4,-1,1]
Output: 2
\`\`\`
\`\`\`
Input:  [1,2,0]
Output: 3
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Cyclic Sort (Index Marking)

### Key Insight
Place each number \`x\` at index \`x-1\`. Then scan for the first position where \`nums[i] ≠ i+1\`.

### Algorithm
1. If \`nums[i]\` is between 1 and n, swap it to its correct position
2. Repeat until no more swaps possible
3. Scan array: first position where value ≠ index+1 is the answer`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element moved at most once |
| **Space** | **O(1)** | In-place |`
    }
];

export default function FirstMissingPositive() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 10) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="First Missing Positive" subtitle="LC #41 · Cyclic Sort">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="3,4,-1,1" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="first_missing_positive.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`📦 Array${step.scanPhase ? " (scanning)" : " (cyclic sort)"}`}>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        const isSwapTo = step.swapTo === i;
                        const isCorrect = val === i + 1;
                        return (
                            <div key={i} style={{
                                width: "52px", height: "60px", borderRadius: "10px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: step.phase === "found" && isActive ? "#ef444420"
                                    : isCorrect && step.scanPhase ? "#10b98115"
                                        : isActive || isSwapTo ? `${pc}15`
                                            : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${step.phase === "found" && isActive ? "#ef4444"
                                    : isCorrect && step.scanPhase ? "#10b981"
                                        : isActive || isSwapTo ? pc : theme.cardBorder}`,
                                transition: "all 0.3s",
                                transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                            }}>
                                <span style={{
                                    fontSize: "1.2rem", fontWeight: "900",
                                    color: step.phase === "found" && isActive ? "#ef4444"
                                        : isCorrect ? "#10b981"
                                            : isActive ? pc : theme.text,
                                }}>{val}</span>
                                <span style={{ fontSize: "0.5rem", fontWeight: "700", color: theme.textDim }}>
                                    [{i}] {step.scanPhase ? (isCorrect ? "✓" : "") : `→${i + 1}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
