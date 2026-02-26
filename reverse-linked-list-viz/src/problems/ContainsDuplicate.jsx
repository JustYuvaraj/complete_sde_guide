import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, InputSection, ExplainPanel,
    CodeEditorPanel, ProgressBar, HashSetPanel,
} from "../shared/Components";

const DEFAULT_ARR = [1, 2, 3, 1];

/* ━━━ C++ Code Lines ━━━ */
const CODE = [
    { id: 0, text: `bool containsDuplicate(vector<int>& nums) {` },
    { id: 1, text: `    unordered_set<int> seen;` },
    { id: 2, text: `` },
    { id: 3, text: `    for (int num : nums) {` },
    { id: 4, text: `        if (seen.count(num))` },
    { id: 5, text: `            return true;` },
    { id: 6, text: `        seen.insert(num);` },
    { id: 7, text: `    }` },
    { id: 8, text: `` },
    { id: 9, text: `    return false;` },
    { id: 10, text: `}` },
];

/* ━━━ Phase Colors & Labels ━━━ */
const PHASE_COLOR = {
    init: "#8b5cf6",
    check: "#f59e0b",
    insert: "#3b82f6",
    found: "#ef4444",
    done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    check: "CHECK SET",
    insert: "INSERT →",
    found: "DUPLICATE!",
    done: "NO DUPLICATES ✓",
};

/* ━━━ Step Generator ━━━ */
function generateSteps(nums) {
    const seen = new Set();
    const steps = [];

    // Step: create set
    steps.push({
        cl: 1, phase: "init",
        nums: [...nums], seen: [],
        activeIdx: -1, checkResult: null,
        msg: `Create empty hash set "seen"`,
        vars: { "seen.size": 0 },
    });

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];

        // Step: check if in set
        const exists = seen.has(num);
        steps.push({
            cl: 4, phase: "check",
            nums: [...nums], seen: [...seen],
            activeIdx: i, checkResult: exists,
            msg: `seen.count(${num}) → ${exists ? "FOUND! Return true" : "Not found, continue"}`,
            vars: { num, "seen.count": exists ? 1 : 0, "seen.size": seen.size },
        });

        if (exists) {
            // Step: found duplicate!
            steps.push({
                cl: 5, phase: "found",
                nums: [...nums], seen: [...seen],
                activeIdx: i, checkResult: true,
                msg: `🔴 Duplicate found! ${num} already in set → return true`,
                vars: { num, "return": "true" },
            });
            return steps;
        }

        // Step: insert into set
        seen.add(num);
        steps.push({
            cl: 6, phase: "insert",
            nums: [...nums], seen: [...seen],
            activeIdx: i, checkResult: false,
            msg: `seen.insert(${num}) → set = {${[...seen].join(", ")}}`,
            vars: { num, "seen.size": seen.size, "seen": `{${[...seen].join(",")}}` },
        });
    }

    // Step: no duplicates
    steps.push({
        cl: 9, phase: "done",
        nums: [...nums], seen: [...seen],
        activeIdx: -1, checkResult: null,
        msg: `All elements unique → return false`,
        vars: { "return": "false", "seen.size": seen.size },
    });

    return steps;
}

/* ━━━ Explain Panel Content ━━━ */
const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 217 — Contains Duplicate

**Difficulty:** Easy \u0026nbsp; **Topics:** Array, Hash Table, Sorting

---

Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [1, 2, 3, 1]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input:  nums = [1, 2, 3, 4]
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input:  nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
Output: true
\`\`\`

### Constraints
- \`1 <= nums.length <= 10⁵\`
- \`-10⁹ <= nums[i] <= 10⁹\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — What Are We Really Checking?

We need to know if **any element repeats**. That's a membership question: "Have I seen this number before?"

## Step 2 — What Data Structure Answers "Have I Seen X?"

A **Hash Set** gives O(1) lookup. For each number:
1. **Check**: Is it already in the set?
2. **If yes** → duplicate found, return \`true\`
3. **If no** → add it to the set, continue

## Step 3 — Why Not Sort?

Sorting (O(n log n)) then checking adjacent elements also works, but:
- It modifies the input array
- It's slower than the hash set O(n) approach
- Sorting is overkill for a simple membership check

## Step 4 — Mental Simulation

\`\`\`
nums = [1, 2, 3, 1]
seen = {}

i=0: num=1, 1 in seen? NO  → seen = {1}
i=1: num=2, 2 in seen? NO  → seen = {1, 2}
i=2: num=3, 3 in seen? NO  → seen = {1, 2, 3}
i=3: num=1, 1 in seen? YES → return true! 🔴
\`\`\`

## Key Takeaway
> When checking for **duplicates/membership**, always think **Hash Set**. It gives O(1) lookup and O(n) overall.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num))
            return true;
        seen.insert(num);
    }
    return false;
}
\`\`\`

## Python Solution
\`\`\`python
def containsDuplicate(nums):
    return len(nums) != len(set(nums))
\`\`\`

## Complexity Analysis

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per lookup |
| **Space** | **O(n)** | Hash set stores up to n elements |

## Alternative Approaches
| Approach | Time | Space | Pro/Con |
|---|---|---|---|
| Hash Set | O(n) | O(n) | ✅ Best overall |
| Sort + Check | O(n log n) | O(1) | No extra space, but slower |
| Brute Force | O(n²) | O(1) | Compare every pair — too slow |`
    }
];

/* ━━━ Main Component ━━━ */
export default function ContainsDuplicate() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 10) return;
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

    return (
        <VizLayout
            title="Contains Duplicate"
            subtitle={`LC #217 · nums = [${nums.join(",")}] · O(n) Time · O(n) Space`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="1,2,3,1"
                label="nums:"
            />

            {/* ━━━ Code Panel + Variables ━━━ */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="contains_duplicate.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Visual: nums[] Array ━━━ */}
            <VizCard title={`📥 Input: nums[]  —  ${nums.length} elements`}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        const isDup = step.phase === "found" && i === step.activeIdx;
                        const isPast = step.activeIdx > i;
                        return (
                            <div key={i} style={{
                                width: "56px", height: "62px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isDup
                                    ? (isDark ? "#ef444425" : "#fee2e2")
                                    : isActive
                                        ? (isDark ? `${pc}18` : `${pc}10`)
                                        : isPast
                                            ? (isDark ? "#10b98110" : "#dcfce7")
                                            : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isDup ? "#ef4444" : isActive ? pc : isPast ? "#10b98144" : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isDup ? "0 4px 20px #ef444440"
                                    : isActive ? `0 4px 20px ${pc}40` : "none",
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900",
                                    color: isDup ? "#ef4444" : isActive ? pc : isPast ? "#10b981" : theme.text,
                                }}>{val}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600",
                                    color: isActive ? pc : theme.textDim, marginTop: "1px",
                                }}>[{i}]</span>
                                {isActive && (
                                    <div style={{
                                        position: "absolute", top: "-8px", right: "-8px",
                                        width: "16px", height: "16px", borderRadius: "50%",
                                        background: isDup ? "#ef4444" : pc,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.5rem", color: "#fff", fontWeight: "900",
                                        boxShadow: `0 2px 8px ${isDup ? "#ef4444" : pc}66`,
                                    }}>{isDup ? "!" : "i"}</div>
                                )}
                                {isPast && !isActive && (
                                    <div style={{
                                        position: "absolute", top: "-4px", right: "-4px",
                                        fontSize: "0.6rem",
                                    }}>✓</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            {/* ━━━ Check Result Indicator ━━━ */}
            {step.activeIdx >= 0 && step.phase !== "init" && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "10px", padding: "6px 0", width: "100%",
                }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "5px 16px", borderRadius: "20px",
                        background: step.checkResult
                            ? (isDark ? "#ef444412" : "#fee2e2")
                            : (isDark ? `${pc}12` : `${pc}08`),
                        border: `1.5px solid ${step.checkResult ? "#ef444444" : `${pc}44`}`,
                    }}>
                        <span style={{
                            fontSize: "0.8rem", fontWeight: "800",
                            color: step.checkResult ? "#ef4444" : pc,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            {step.checkResult
                                ? `${nums[step.activeIdx]} in seen? YES → DUPLICATE!`
                                : `${nums[step.activeIdx]} in seen? NO → insert`
                            }
                        </span>
                        <span style={{ fontSize: "1rem" }}>
                            {step.checkResult ? "🔴" : step.phase === "insert" ? "✅" : "🔍"}
                        </span>
                    </div>
                </div>
            )}

            {/* ━━━ Hash Set (bucket-style) ━━━ */}
            <HashSetPanel
                values={step.seen}
                activeValue={step.phase === "insert" ? nums[step.activeIdx] : null}
                highlightValue={step.phase === "found" ? nums[step.activeIdx] : null}
                status={step.phase === "insert" ? "inserting" : step.phase === "check" ? "searching" : step.phase === "found" ? "found" : null}
                title="Hash Set · seen"
            />

            {/* ━━━ Iteration Trace ━━━ */}
            {step.activeIdx >= 0 && (
                <VizCard title="📊 Iteration Trace">
                    <div style={{ overflowX: "auto" }}>
                        <table style={{
                            width: "100%", borderCollapse: "collapse",
                            fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${theme.cardBorder}` }}>
                                    {["i", "num", "In Set?", "Action", "Set After"].map(h => (
                                        <th key={h} style={{
                                            padding: "4px 8px", textAlign: "center",
                                            color: theme.textDim, fontWeight: "700", fontSize: "0.6rem",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {nums.slice(0, step.activeIdx + 1).map((num, i) => {
                                    const isCurrentRow = i === step.activeIdx;
                                    const seenBefore = new Set();
                                    for (let j = 0; j < i; j++) seenBefore.add(nums[j]);
                                    const wasFound = seenBefore.has(num);
                                    seenBefore.add(num);
                                    return (
                                        <tr key={i} style={{
                                            background: isCurrentRow ? `${pc}10` : "transparent",
                                            borderBottom: `1px solid ${theme.cardBorder}`,
                                        }}>
                                            <td style={{ padding: "3px 8px", textAlign: "center", color: theme.textDim }}>{i}</td>
                                            <td style={{ padding: "3px 8px", textAlign: "center", fontWeight: "800", color: isCurrentRow ? pc : theme.text }}>{num}</td>
                                            <td style={{ padding: "3px 8px", textAlign: "center", color: wasFound ? "#ef4444" : "#10b981" }}>
                                                {wasFound ? "YES 🔴" : "NO ✓"}
                                            </td>
                                            <td style={{ padding: "3px 8px", textAlign: "center", color: wasFound ? "#ef4444" : "#3b82f6" }}>
                                                {wasFound ? "return true" : "insert"}
                                            </td>
                                            <td style={{ padding: "3px 8px", textAlign: "center", color: theme.textDim }}>
                                                {`{${[...seenBefore].join(",")}}`}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </VizCard>
            )}

            {/* ━━━ Progress Bar ━━━ */}
            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "found" ? "#f59e0b" : undefined}
            />

        </VizLayout>
    );
}
