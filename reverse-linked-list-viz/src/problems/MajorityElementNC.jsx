import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [2, 2, 1, 1, 1, 2, 2];

const CODE = [
    { id: 0, text: `int majorityElement(vector<int>& nums) {` },
    { id: 1, text: `    int candidate = 0, count = 0;` },
    { id: 2, text: `` },
    { id: 3, text: `    for (int num : nums) {` },
    { id: 4, text: `        if (count == 0)` },
    { id: 5, text: `            candidate = num;` },
    { id: 6, text: `        count += (num == candidate) ? 1 : -1;` },
    { id: 7, text: `    }` },
    { id: 8, text: `` },
    { id: 9, text: `    return candidate;` },
    { id: 10, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    reset: "#f59e0b",
    vote: "#3b82f6",
    cancel: "#ef4444",
    done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    reset: "NEW CANDIDATE",
    vote: "VOTE +1",
    cancel: "CANCEL -1",
    done: "MAJORITY ✓",
};

function generateSteps(nums) {
    let candidate = 0, count = 0;
    const steps = [];

    steps.push({
        cl: 1, phase: "init",
        nums: [...nums], candidate, count, activeI: -1,
        msg: `Initialize candidate = 0, count = 0`,
        vars: { candidate: "—", count: 0 },
    });

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const wasReset = count === 0;

        if (count === 0) {
            candidate = num;
            steps.push({
                cl: 5, phase: "reset",
                nums: [...nums], candidate, count, activeI: i,
                msg: `count == 0 → new candidate = ${num}`,
                vars: { num, candidate, count },
            });
        }

        const isVote = num === candidate;
        count += isVote ? 1 : -1;

        steps.push({
            cl: 6, phase: isVote ? "vote" : "cancel",
            nums: [...nums], candidate, count, activeI: i,
            msg: isVote
                ? `${num} == candidate → count++ → ${count}`
                : `${num} ≠ ${candidate} → count-- → ${count}`,
            vars: { num, candidate, count },
        });
    }

    steps.push({
        cl: 9, phase: "done",
        nums: [...nums], candidate, count, activeI: -1,
        msg: `Majority element = ${candidate}`,
        vars: { "return": candidate, count },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 169 — Majority Element

**Difficulty:** Easy &nbsp; **Topics:** Array, Hash Table, Divide and Conquer, Sorting, Counting

---

Given an array \`nums\` of size \`n\`, return the **majority element** — the element that appears more than \`⌊n/2⌋\` times. You may assume the majority element always exists.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [3,2,3]
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input:  nums = [2,2,1,1,1,2,2]
Output: 2
\`\`\`

### Constraints
- \`n == nums.length\`
- \`1 <= n <= 5 * 10⁴\`
- \`-10⁹ <= nums[i] <= 10⁹\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Boyer-Moore Voting Algorithm

Think of it as an election:

### Step 1 — Pick a Candidate
If count reaches 0, the current element becomes the new candidate.

### Step 2 — Vote
- Same as candidate → count++  (vote FOR)
- Different → count--  (vote AGAINST)

### Step 3 — Why It Works
The majority element appears > n/2 times. Even if every other element votes against it, it will still survive with count > 0 at the end.

### Mental Simulation
\`\`\`
nums = [2, 2, 1, 1, 1, 2, 2]

i=0: count=0 → candidate=2, count=1
i=1: 2==2 → count=2
i=2: 1≠2 → count=1
i=3: 1≠2 → count=0
i=4: count=0 → candidate=1, count=1
i=5: 2≠1 → count=0
i=6: count=0 → candidate=2, count=1

Answer: 2 ✓
\`\`\`

## Key Takeaway
> Boyer-Moore gives O(n) time, O(1) space — perfect for majority element.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int num : nums) {
        if (count == 0)
            candidate = num;
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}
\`\`\`

## Python Solution
\`\`\`python
def majorityElement(nums):
    candidate, count = 0, 0
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    return candidate
\`\`\`

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Two variables |

## Alternative Approaches
| Approach | Time | Space |
|---|---|---|
| Boyer-Moore | O(n) | O(1) ✅ |
| Hash Map | O(n) | O(n) |
| Sort + middle | O(n log n) | O(1) |`
    }
];

export default function MajorityElementNC() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 12) return;
        setNums(parsed);
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setNums(DEFAULT_ARR);
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Majority Element"
            subtitle={`LC #169 · Boyer-Moore Voting · O(n) Time · O(1) Space`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText} onChange={setInputText}
                onRun={handleRun} onReset={handleReset}
                placeholder="2,2,1,1,1,2,2" label="nums:"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="majority_element.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Array + Candidate/Count Card ━━━ */}
            <VizCard title={`🗳️ Boyer-Moore Voting  ·  candidate = ${step.candidate}, count = ${step.count}`}>
                {/* Candidate & Count badges */}
                <div style={{
                    display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px",
                }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "6px 16px", borderRadius: "12px",
                        background: isDark ? "#3b82f615" : "#dbeafe",
                        border: "1.5px solid #3b82f644",
                    }}>
                        <span style={{ fontSize: "0.65rem", color: theme.textDim, fontWeight: "700" }}>CANDIDATE</span>
                        <span style={{
                            fontSize: "1.4rem", fontWeight: "900", color: "#3b82f6",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>{step.candidate}</span>
                    </div>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "6px 16px", borderRadius: "12px",
                        background: step.count > 0
                            ? (isDark ? "#10b98115" : "#dcfce7")
                            : (isDark ? "#ef444415" : "#fee2e2"),
                        border: `1.5px solid ${step.count > 0 ? "#10b98144" : "#ef444444"}`,
                    }}>
                        <span style={{ fontSize: "0.65rem", color: theme.textDim, fontWeight: "700" }}>COUNT</span>
                        <span style={{
                            fontSize: "1.4rem", fontWeight: "900",
                            color: step.count > 0 ? "#10b981" : "#ef4444",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>{step.count}</span>
                    </div>
                </div>

                {/* Array elements */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((v, i) => {
                        const isActive = step.activeI === i;
                        const isPast = step.activeI > i;
                        const isCandidate = v === step.candidate;
                        const isMajority = step.phase === "done" && v === step.candidate;
                        return (
                            <div key={i} style={{
                                width: "52px", height: "58px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isMajority ? (isDark ? "#10b98118" : "#dcfce7")
                                    : isActive ? (isDark ? `${pc}18` : `${pc}10`)
                                        : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isMajority ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : isMajority ? "scale(1.05)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 16px ${pc}40`
                                    : isMajority ? "0 2px 12px #10b98140" : "none",
                                opacity: isPast && !isMajority ? 0.5 : 1,
                            }}>
                                <span style={{
                                    fontSize: "1.2rem", fontWeight: "900",
                                    color: isMajority ? "#10b981" : isActive ? pc : theme.text,
                                }}>{v}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600", color: theme.textDim,
                                }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "done" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
