import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection, HashMapPanel,
} from "../shared/Components";

const DEFAULT_ARR = [2, 7, 11, 15];
const DEFAULT_TARGET = 9;

/* ━━━ C++ Code ━━━ */
const CODE = [
    { id: 0, text: `vector<int> twoSum(vector<int>& nums, int target) {` },
    { id: 1, text: `    unordered_map<int, int> map;` },
    { id: 2, text: `` },
    { id: 3, text: `    for (int i = 0; i < nums.size(); i++) {` },
    { id: 4, text: `        int complement = target - nums[i];` },
    { id: 5, text: `        if (map.count(complement))` },
    { id: 6, text: `            return {map[complement], i};` },
    { id: 7, text: `        map[nums[i]] = i;` },
    { id: 8, text: `    }` },
    { id: 9, text: `    return {};` },
    { id: 10, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    calc: "#6366f1",
    check: "#f59e0b",
    store: "#3b82f6",
    found: "#10b981",
    done: "#ef4444",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    calc: "COMPLEMENT",
    check: "LOOKUP MAP",
    store: "STORE →",
    found: "PAIR FOUND ✓",
    done: "NO PAIR ✗",
};

/* ━━━ Step Generator ━━━ */
function generateSteps(nums, target) {
    const steps = [];
    const map = {};

    steps.push({
        cl: 1, phase: "init",
        nums: [...nums], map: { ...map },
        activeI: -1, complement: null, foundPair: null,
        checkResult: null,
        msg: `Create empty hash map`,
        vars: { target, "map.size": 0 },
    });

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Calculate complement
        steps.push({
            cl: 4, phase: "calc",
            nums: [...nums], map: { ...map },
            activeI: i, complement, foundPair: null,
            checkResult: null,
            msg: `complement = target - nums[${i}] = ${target} - ${nums[i]} = ${complement}`,
            vars: { i, "nums[i]": nums[i], target, complement },
        });

        // Check map
        const exists = complement in map;
        steps.push({
            cl: 5, phase: "check",
            nums: [...nums], map: { ...map },
            activeI: i, complement, foundPair: null,
            checkResult: exists,
            msg: `map.count(${complement}) → ${exists ? `FOUND at index ${map[complement]}!` : "not found"}`,
            vars: { complement, "in map?": exists ? "YES" : "NO" },
        });

        if (exists) {
            steps.push({
                cl: 6, phase: "found",
                nums: [...nums], map: { ...map },
                activeI: i, complement,
                foundPair: [map[complement], i],
                checkResult: true,
                msg: `🎉 return [${map[complement]}, ${i}] → nums[${map[complement]}] + nums[${i}] = ${nums[map[complement]]} + ${nums[i]} = ${target}`,
                vars: { "return": `[${map[complement]}, ${i}]`, "sum": `${nums[map[complement]]} + ${nums[i]} = ${target}` },
            });
            return steps;
        }

        map[nums[i]] = i;
        steps.push({
            cl: 7, phase: "store",
            nums: [...nums], map: { ...map },
            activeI: i, complement, foundPair: null,
            checkResult: false,
            msg: `map[${nums[i]}] = ${i}`,
            vars: { [`map[${nums[i]}]`]: i, "map.size": Object.keys(map).length },
        });
    }

    steps.push({
        cl: 9, phase: "done",
        nums: [...nums], map: { ...map },
        activeI: -1, complement: null, foundPair: null, checkResult: null,
        msg: `No pair found → return empty`,
        vars: { "return": "[]" },
    });

    return steps;
}

/* ━━━ Explain ━━━ */
const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 1 — Two Sum

**Difficulty:** Easy \u0026nbsp; **Topics:** Array, Hash Table

---

Given an array of integers \`nums\` and an integer \`target\`, return **indices of the two numbers** such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

**Example 2:**
\`\`\`
Input:  nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Constraints
- \`2 <= nums.length <= 10⁴\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- Only **one valid answer** exists`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — Reframe the Problem

Instead of "find two numbers that sum to target", think:
> For each number \`x\`, does \`target - x\` exist in the array?

This transforms from **pair searching** to **single lookup**.

## Step 2 — What Data Structure?

We need O(1) lookup of "has this value been seen?" with its index.
→ **Hash Map** (value → index)

## Step 3 — The Algorithm

For each element:
1. Calculate \`complement = target - nums[i]\`
2. Is \`complement\` in the map? → **Found the pair!**
3. If not → store \`nums[i] → i\` in the map

## Step 4 — Why One Pass Works

We build the map as we go. When we find a complement, we know the complement was stored from an **earlier** index. So we get both indices: \`[map[complement], i]\`.

No need to look ahead — we look **backward** using the map!

## Key Takeaway
> "Find a pair with sum = X" → for each element, check if \`X - element\` is already in a hash map. Converts O(n²) brute force to O(n).`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement))
            return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}
\`\`\`

## Python Solution
\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
\`\`\`

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per lookup |
| **Space** | **O(n)** | Hash map stores up to n entries |

## Why Not Brute Force?
Two nested loops = O(n²). The hash map reduces to O(n) by trading space for time.`
    }
];

/* ━━━ Component ━━━ */
export default function TwoSum() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [targetText, setTargetText] = useState(String(DEFAULT_TARGET));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [target, setTarget] = useState(DEFAULT_TARGET);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_TARGET));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const t = parseInt(targetText);
        if (parsed.length < 2 || parsed.length > 8 || isNaN(t)) return;
        setNums(parsed); setTarget(t);
        setSteps(generateSteps(parsed, t)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(",")); setTargetText(String(DEFAULT_TARGET));
        setNums(DEFAULT_ARR); setTarget(DEFAULT_TARGET);
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_TARGET)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Two Sum"
            subtitle={`LC #1 · nums = [${nums.join(",")}], target = ${target} · O(n) Time`}
        >
            <ExplainPanel sections={EXPLAIN} />

            {/* Dual input */}
            <DualInputSection
                inputs={[
                    { label: "nums:", value: inputText, onChange: setInputText, placeholder: "2,7,11,15", flex: "1 1 140px" },
                    { label: "target:", value: targetText, onChange: setTargetText, placeholder: "9", flex: "0 0 60px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun}
                onReset={handleReset}
            />

            {/* ━━━ Code + Variables ━━━ */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="two_sum.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ nums[] ━━━ */}
            <VizCard title={`📥 nums[]  ·  target = ${target}`}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeI === i;
                        const isInPair = step.foundPair && (step.foundPair[0] === i || step.foundPair[1] === i);
                        const isPast = step.activeI > i && !isInPair;
                        return (
                            <div key={i} style={{
                                width: "60px", height: "68px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isInPair ? (isDark ? "#10b98118" : "#dcfce7")
                                    : isActive ? (isDark ? `${pc}18` : `${pc}10`)
                                        : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isInPair ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isInPair ? "scale(1.15) translateY(-6px)"
                                    : isActive ? "scale(1.1) translateY(-3px)" : "scale(1)",
                                boxShadow: isInPair ? "0 6px 24px #10b98140"
                                    : isActive ? `0 4px 16px ${pc}40` : "none",
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900",
                                    color: isInPair ? "#10b981" : isActive ? pc : theme.text,
                                }}>{val}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600",
                                    color: isActive ? pc : theme.textDim,
                                }}>[{i}]</span>
                                {isActive && step.complement !== null && (
                                    <div style={{
                                        position: "absolute", top: "-10px",
                                        fontSize: "0.5rem", fontWeight: "800",
                                        padding: "1px 6px", borderRadius: "8px",
                                        background: pc, color: "#fff", whiteSpace: "nowrap",
                                    }}>need {step.complement}</div>
                                )}
                                {isInPair && (
                                    <div style={{
                                        position: "absolute", top: "-8px", right: "-8px",
                                        width: "16px", height: "16px", borderRadius: "50%",
                                        background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.5rem", color: "#fff", fontWeight: "900",
                                    }}>✓</div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {step.foundPair && (
                    <div style={{
                        textAlign: "center", marginTop: "12px", fontSize: "0.85rem",
                        fontWeight: "800", color: "#10b981",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        nums[{step.foundPair[0]}] + nums[{step.foundPair[1]}] = {nums[step.foundPair[0]]} + {nums[step.foundPair[1]]} = {target} ✓
                    </div>
                )}
            </VizCard>

            {/* ━━━ Complement indicator ━━━ */}
            {step.complement !== null && !step.foundPair && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "8px", padding: "4px 0",
                }}>
                    <div style={{
                        padding: "4px 14px", borderRadius: "20px",
                        background: step.checkResult ? "#10b98112" : `${pc}10`,
                        border: `1.5px solid ${step.checkResult ? "#10b98144" : `${pc}33`}`,
                        fontSize: "0.75rem", fontWeight: "700",
                        color: step.checkResult ? "#10b981" : pc,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        {target} - {nums[step.activeI]} = {step.complement}
                        {step.phase === "check" && (step.checkResult ? " → IN MAP ✓" : " → NOT in map")}
                    </div>
                </div>
            )}

            {/* ━━━ Hash Map ━━━ */}
            <HashMapPanel
                entries={step.map}
                activeKey={step.phase === "store" ? String(nums[step.activeI]) : null}
                highlightKey={step.checkResult && step.complement != null ? String(step.complement) : null}
                status={step.phase === "store" ? "inserting" : step.phase === "check" ? "searching" : step.phase === "found" ? "found" : null}
                title="Hash Map · value → index"
            />

            {/* ━━━ Progress ━━━ */}
            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "found" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
