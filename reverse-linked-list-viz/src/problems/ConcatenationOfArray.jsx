import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, InputSection, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const DEFAULT_ARR = [1, 2, 1];

/* ━━━ C++ Code Lines ━━━ */
const CODE = [
    { id: 0, text: `vector<int> getConcatenation(vector<int>& nums) {` },
    { id: 1, text: `    int n = nums.size();` },
    { id: 2, text: `    vector<int> ans(2 * n);` },
    { id: 3, text: `` },
    { id: 4, text: `    for (int i = 0; i < n; i++) {` },
    { id: 5, text: `        ans[i] = nums[i];` },
    { id: 6, text: `        ans[i + n] = nums[i];` },
    { id: 7, text: `    }` },
    { id: 8, text: `` },
    { id: 9, text: `    return ans;` },
    { id: 10, text: `}` },
];

/* ━━━ Phase Colors & Labels ━━━ */
const PHASE_COLOR = {
    init: "#8b5cf6",
    loop: "#6366f1",
    copy: "#3b82f6",
    mirror: "#f59e0b",
    done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    loop: "LOOP START",
    copy: "COPY →",
    mirror: "MIRROR →",
    done: "COMPLETE ✓",
};

/* ━━━ Step Generator ━━━ */
function generateSteps(nums) {
    const n = nums.length;
    const ans = new Array(2 * n).fill(null);
    const steps = [];

    // Step: get size
    steps.push({
        cl: 1, phase: "init",
        nums: [...nums], ans: [...ans],
        hlNums: [], hlAns: [], filledAns: [],
        activeI: -1, arrowFrom: -1, arrowTo: -1,
        msg: `n = nums.size() → n = ${n}`,
        vars: { n },
    });

    // Step: create ans array
    steps.push({
        cl: 2, phase: "init",
        nums: [...nums], ans: [...ans],
        hlNums: [], hlAns: [], filledAns: [],
        activeI: -1, arrowFrom: -1, arrowTo: -1,
        msg: `Create ans[] with 2×${n} = ${2 * n} empty slots`,
        vars: { n, "2*n": 2 * n },
    });

    const filled = [];

    for (let i = 0; i < n; i++) {
        // Step: loop check
        steps.push({
            cl: 4, phase: "loop",
            nums: [...nums], ans: [...ans],
            hlNums: [i], hlAns: [], filledAns: [...filled],
            activeI: i, arrowFrom: -1, arrowTo: -1,
            msg: `for i = ${i}: i < n (${i} < ${n}) ✓`,
            vars: { i, n },
        });

        // Step: copy first half
        ans[i] = nums[i];
        filled.push(i);
        steps.push({
            cl: 5, phase: "copy",
            nums: [...nums], ans: [...ans],
            hlNums: [i], hlAns: [i], filledAns: [...filled],
            activeI: i, arrowFrom: i, arrowTo: i,
            msg: `ans[${i}] = nums[${i}] = ${nums[i]}`,
            vars: { i, n, [`nums[${i}]`]: nums[i], [`ans[${i}]`]: nums[i] },
        });

        // Step: mirror second half
        ans[i + n] = nums[i];
        filled.push(i + n);
        steps.push({
            cl: 6, phase: "mirror",
            nums: [...nums], ans: [...ans],
            hlNums: [i], hlAns: [i + n], filledAns: [...filled],
            activeI: i, arrowFrom: i, arrowTo: i + n,
            msg: `ans[${i}+${n}] = ans[${i + n}] = nums[${i}] = ${nums[i]}`,
            vars: { i, n, "i+n": i + n, [`nums[${i}]`]: nums[i], [`ans[${i + n}]`]: nums[i] },
        });
    }

    // Step: done
    const allIdx = Array.from({ length: 2 * n }, (_, i) => i);
    steps.push({
        cl: 9, phase: "done",
        nums: [...nums], ans: [...ans],
        hlNums: [], hlAns: allIdx, filledAns: allIdx,
        activeI: -1, arrowFrom: -1, arrowTo: -1,
        msg: `return [${ans.join(", ")}]`,
        vars: { result: `[${ans.join(",")}]`, "Time": "O(n)", "Space": "O(n)" },
    });

    return steps;
}

/* ━━━ Explain Panel Content ━━━ */
const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 1929 — Concatenation of Array

**Difficulty:** Easy \u0026nbsp; **Topics:** Array, Simulation

---

Given an integer array \`nums\` of length \`n\`, you want to create an array \`ans\` of length \`2n\` where \`ans[i] == nums[i]\` and \`ans[i + n] == nums[i]\` for \`0 <= i < n\`.

Specifically, \`ans\` is the **concatenation of two \`nums\` arrays**.

Return the array \`ans\`.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [1, 2, 1]
Output: [1, 2, 1, 1, 2, 1]
\`\`\`
Explanation: ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]] = [1,2,1,1,2,1]

**Example 2:**
\`\`\`
Input:  nums = [1, 3, 2, 1]
Output: [1, 3, 2, 1, 1, 3, 2, 1]
\`\`\`

### Constraints
- \`1 <= n <= 1000\`
- \`1 <= nums[i] <= 1000\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — Understand What's Being Asked

Read the problem again: we need \`ans = nums + nums\`. That's it. The output is just the array **repeated twice**.

## Step 2 — Identify the Pattern

For **any** index \`i\` in the original array:
- The value goes to position \`i\` (first copy)
- The **same** value goes to position \`i + n\` (second copy)

This means: **one loop, two writes per iteration**.

## Step 3 — Why This is Optimal

Could we use \`concat()\` or \`push\`? Sure. But those create intermediate copies.

The **cleanest** approach:
1. Create \`ans\` of size \`2n\`
2. Single \`for\` loop: write \`nums[i]\` to **both** \`ans[i]\` and \`ans[i+n]\`

No extra passes, no extra arrays, no edge cases.

## Step 4 — Mental Simulation

\`\`\`
nums = [1, 2, 1]    n = 3
ans  = [_, _, _, _, _, _]   (size 2n = 6)

i=0: ans[0]=1, ans[3]=1  →  [1, _, _, 1, _, _]
i=1: ans[1]=2, ans[4]=2  →  [1, 2, _, 1, 2, _]
i=2: ans[2]=1, ans[5]=1  →  [1, 2, 1, 1, 2, 1]  ✅
\`\`\`

Each iteration fills two cells — the **original position** and the **mirrored position**.

## Key Takeaway
> When you see "repeat" or "concatenate", think: **same value → two positions**. One loop with dual assignment.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
vector<int> getConcatenation(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(2 * n);
    for (int i = 0; i < n; i++) {
        ans[i] = nums[i];
        ans[i + n] = nums[i];
    }
    return ans;
}
\`\`\`

## Python Solution
\`\`\`python
def getConcatenation(nums):
    return nums + nums  # Python makes it easy!
\`\`\`

## Complexity Analysis

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass through nums |
| **Space** | **O(n)** | The ans array of size 2n |

## Common Mistakes
1. **Creating ans of wrong size** → Remember: \`2 * n\`, not \`n\`
2. **Using two loops** → One loop with dual write is cleaner
3. **Off-by-one in mirror index** → \`i + n\`, not \`i + n + 1\``
    }
];

/* ━━━ Main Component ━━━ */
export default function ConcatenationOfArray() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 8) return;
        setNums(parsed);
        const s = generateSteps(parsed);
        setSteps(s);
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setNums(DEFAULT_ARR);
        setSteps(generateSteps(DEFAULT_ARR));
        setIdx(0);
        setPlaying(false);
    }

    const n = nums.length;

    /* ── Inline Arrow SVG between nums and ans ── */
    function renderArrow() {
        if (step.arrowFrom < 0 || step.arrowTo < 0) return null;
        const isCopy = step.phase === "copy";
        const color = isCopy ? "#3b82f6" : "#f59e0b";
        const label = isCopy
            ? `nums[${step.arrowFrom}] → ans[${step.arrowTo}]`
            : `nums[${step.arrowFrom}] → ans[${step.arrowTo}]`;
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", padding: "6px 0", width: "100%",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "5px 14px", borderRadius: "20px",
                    background: `${color}12`, border: `1.5px solid ${color}44`,
                }}>
                    <span style={{
                        fontSize: "0.8rem", fontWeight: "800", color,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}>{label}</span>
                    <span style={{ fontSize: "1rem", color }}>{isCopy ? "📋" : "🪞"}</span>
                </div>
            </div>
        );
    }

    return (
        <VizLayout
            title="Concatenation of Array"
            subtitle={`LC #1929 · nums = [${nums.join(",")}] · O(n) Time · O(n) Space`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="1,2,1"
                label="nums:"
            />

            {/* ━━━ Code Panel + Variables ━━━ */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="concatenation.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Visual: nums[] Source Array ━━━ */}
            <VizCard title={`📥 Source: nums[]  —  ${n} elements`}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.hlNums.includes(i);
                        const isSource = step.arrowFrom === i;
                        return (
                            <div key={i} style={{
                                width: "56px", height: "60px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isSource
                                    ? (isDark ? `${pc}18` : `${pc}10`)
                                    : isActive
                                        ? (isDark ? "#ffffff08" : "#f8fafc")
                                        : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isSource ? pc : isActive ? pc + "55" : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isSource ? "scale(1.15)" : "scale(1)",
                                boxShadow: isSource ? `0 4px 20px ${pc}40` : "none",
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900",
                                    color: isSource ? pc : theme.text,
                                    transition: "all 0.3s",
                                }}>{val}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600",
                                    color: isSource ? pc : theme.textDim,
                                    marginTop: "1px",
                                }}>[{i}]</span>
                                {isSource && (
                                    <div style={{
                                        position: "absolute", top: "-6px", right: "-6px",
                                        width: "14px", height: "14px", borderRadius: "50%",
                                        background: pc, display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.5rem", color: "#fff", fontWeight: "900",
                                        boxShadow: `0 2px 8px ${pc}66`,
                                    }}>i</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            {/* ━━━ Arrow Indicator ━━━ */}
            {renderArrow()}

            {/* ━━━ Visual: ans[] Output Array ━━━ */}
            <VizCard title={`📤 Result: ans[]  —  ${2 * n} elements`}>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
                    {step.ans.map((val, i) => {
                        const isTarget = step.hlAns.includes(i);
                        const isFilled = val !== null;
                        const isFirstHalf = i < n;
                        const isDone = step.phase === "done";

                        const bg = isDone
                            ? (isDark ? "#052e16" : "#dcfce7")
                            : isTarget
                                ? (isDark ? `${pc}20` : `${pc}12`)
                                : isFilled
                                    ? (isDark ? (isFirstHalf ? "#172554" : "#422006") : (isFirstHalf ? "#eff6ff" : "#fffbeb"))
                                    : (isDark ? "#0c0c14" : "#f8fafc");

                        const border = isDone ? "#22c55e"
                            : isTarget ? pc
                                : isFilled ? (isFirstHalf ? "#3b82f640" : "#f59e0b40")
                                    : (isDark ? "#1e293b" : "#e2e8f0");

                        return (
                            <div key={i} style={{ position: "relative" }}>
                                <div style={{
                                    width: "50px", height: "64px",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    borderRadius: "10px",
                                    background: bg,
                                    border: `2px solid ${border}`,
                                    transition: "all 0.4s ease",
                                    transform: isTarget ? "scale(1.15) translateY(-6px)" : "scale(1)",
                                    boxShadow: isTarget ? `0 8px 24px ${pc}44` : "none",
                                }}>
                                    <span style={{
                                        fontSize: isFilled ? "1.2rem" : "0.8rem",
                                        fontWeight: "900",
                                        color: isDone ? "#22c55e"
                                            : isTarget ? pc
                                                : isFilled ? (isFirstHalf ? "#60a5fa" : "#fbbf24")
                                                    : theme.textDim,
                                        opacity: isFilled ? 1 : 0.25,
                                        transition: "all 0.3s",
                                    }}>
                                        {isFilled ? val : "—"}
                                    </span>
                                    <span style={{
                                        fontSize: "0.48rem", fontWeight: "600",
                                        color: isTarget ? pc : theme.textDim,
                                        marginTop: "1px",
                                    }}>[{i}]</span>
                                </div>

                                {/* Divider between halves */}
                                {i === n - 1 && (
                                    <div style={{
                                        position: "absolute", right: "-3px", top: "4px", bottom: "4px",
                                        width: "3px", borderRadius: "2px",
                                        background: isDark
                                            ? "linear-gradient(180deg, #3b82f6, #f59e0b)"
                                            : "linear-gradient(180deg, #2563eb, #d97706)",
                                        opacity: 0.6,
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Half labels */}
                <div style={{
                    display: "flex", justifyContent: "space-around", marginTop: "10px",
                    fontSize: "0.62rem", fontWeight: "800", letterSpacing: "0.5px",
                }}>
                    <div style={{
                        padding: "3px 12px", borderRadius: "12px",
                        background: isDark ? "#172554" : "#dbeafe",
                        color: "#3b82f6", border: "1px solid #3b82f633",
                    }}>FIRST COPY [0..{n - 1}]</div>
                    <div style={{
                        padding: "3px 12px", borderRadius: "12px",
                        background: isDark ? "#422006" : "#fef3c7",
                        color: "#f59e0b", border: "1px solid #f59e0b33",
                    }}>MIRROR [{n}..{2 * n - 1}]</div>
                </div>
            </VizCard>

            {/* ━━━ Mapping Diagram ━━━ */}
            {step.phase !== "init" && step.phase !== "done" && (
                <VizCard title="🔗 Index Mapping — Where Each Element Goes">
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`,
                        gap: "4px", maxWidth: `${n * 100}px`, margin: "0 auto",
                    }}>
                        {nums.map((val, i) => {
                            const isActive = step.activeI === i;
                            const isPast = step.activeI > i || (step.activeI === i && step.phase === "mirror");
                            const opacity = isActive ? 1 : isPast ? 0.6 : 0.25;
                            return (
                                <div key={i} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                                    opacity, transition: "all 0.4s",
                                    transform: isActive ? "scale(1.08)" : "scale(1)",
                                }}>
                                    {/* Source */}
                                    <div style={{
                                        width: "44px", height: "36px", display: "flex", alignItems: "center",
                                        justifyContent: "center", borderRadius: "8px",
                                        background: isActive ? `${pc}15` : (isDark ? "#1e293b" : "#f1f5f9"),
                                        border: `1.5px solid ${isActive ? pc : theme.cardBorder}`,
                                        fontWeight: "900", fontSize: "0.9rem",
                                        color: isActive ? pc : theme.text,
                                    }}>{val}</div>

                                    {/* Arrows */}
                                    <div style={{ display: "flex", gap: "12px", fontSize: "0.55rem", fontWeight: "700" }}>
                                        <div style={{ textAlign: "center", color: "#3b82f6" }}>
                                            ↓<br />
                                            <span style={{
                                                padding: "1px 4px", borderRadius: "4px",
                                                background: isPast || isActive ? "#3b82f615" : "transparent",
                                                border: isPast || isActive ? "1px solid #3b82f633" : "1px solid transparent",
                                            }}>[{i}]</span>
                                        </div>
                                        <div style={{ textAlign: "center", color: "#f59e0b" }}>
                                            ↓<br />
                                            <span style={{
                                                padding: "1px 4px", borderRadius: "4px",
                                                background: isPast ? "#f59e0b15" : "transparent",
                                                border: isPast ? "1px solid #f59e0b33" : "1px solid transparent",
                                            }}>[{i + n}]</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>
            )}

            {/* ━━━ Progress Bar ━━━ */}
            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />

        </VizLayout>
    );
}
