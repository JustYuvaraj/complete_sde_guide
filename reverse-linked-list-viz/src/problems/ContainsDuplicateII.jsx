import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection, HashSetPanel,
} from "../shared/Components";

const DEFAULT_ARR = [1, 2, 3, 1];
const DEFAULT_K = 3;

const CODE = [
    { id: 0, text: `bool containsNearbyDuplicate(vector<int>& nums, int k) {` },
    { id: 1, text: `    unordered_set<int> window;` },
    { id: 2, text: `` },
    { id: 3, text: `    for (int i = 0; i < nums.size(); i++) {` },
    { id: 4, text: `        if (window.count(nums[i]))` },
    { id: 5, text: `            return true;` },
    { id: 6, text: `        window.insert(nums[i]);` },
    { id: 7, text: `        if (window.size() > k)` },
    { id: 8, text: `            window.erase(nums[i - k]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `` },
    { id: 11, text: `    return false;` },
    { id: 12, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    check: "#f59e0b",
    insert: "#3b82f6",
    evict: "#ef4444",
    found: "#10b981",
    done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    check: "CHECK WINDOW",
    insert: "INSERT →",
    evict: "EVICT OLD",
    found: "DUPLICATE!",
    done: "NO DUPLICATES ✓",
};

function generateSteps(nums, k) {
    const window = new Set();
    const steps = [];

    steps.push({
        cl: 1, phase: "init",
        nums: [...nums], k, windowVals: [], activeIdx: -1,
        windowStart: 0, windowEnd: -1,
        highlightValue: null, activeValue: null, status: null,
        msg: `Create sliding window hash set (max size k = ${k})`,
        vars: { k, "window.size": 0 },
    });

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const found = window.has(num);

        // Check step
        steps.push({
            cl: 4, phase: "check",
            nums: [...nums], k, windowVals: [...window], activeIdx: i,
            windowStart: Math.max(0, i - k), windowEnd: i - 1,
            highlightValue: found ? num : null, activeValue: null, status: "searching",
            msg: `window.count(${num}) → ${found ? "FOUND! Return true" : "Not found"}`,
            vars: { i, [`nums[${i}]`]: num, "window.size": window.size, found: String(found) },
        });

        if (found) {
            steps.push({
                cl: 5, phase: "found",
                nums: [...nums], k, windowVals: [...window], activeIdx: i,
                windowStart: Math.max(0, i - k), windowEnd: i - 1,
                highlightValue: num, activeValue: null, status: "found",
                msg: `🟢 Duplicate found! nums[${i}] = ${num} exists within distance k = ${k}`,
                vars: { "return": "true", i, duplicate: num },
            });
            return steps;
        }

        // Insert step
        window.add(num);
        steps.push({
            cl: 6, phase: "insert",
            nums: [...nums], k, windowVals: [...window], activeIdx: i,
            windowStart: Math.max(0, i - k + 1), windowEnd: i,
            highlightValue: null, activeValue: num, status: "inserting",
            msg: `window.insert(${num}) → size = ${window.size}`,
            vars: { i, [`nums[${i}]`]: num, "window.size": window.size },
        });

        // Evict step if window too large
        if (window.size > k) {
            const evicted = nums[i - k];
            window.delete(evicted);
            steps.push({
                cl: 8, phase: "evict",
                nums: [...nums], k, windowVals: [...window], activeIdx: i,
                windowStart: i - k + 1, windowEnd: i,
                highlightValue: null, activeValue: null, status: null,
                msg: `Window too large → erase nums[${i - k}] = ${evicted}`,
                vars: { i, evicted, "window.size": window.size },
            });
        }
    }

    steps.push({
        cl: 11, phase: "done",
        nums: [...nums], k, windowVals: [...window], activeIdx: -1,
        windowStart: 0, windowEnd: nums.length - 1,
        highlightValue: null, activeValue: null, status: null,
        msg: `No nearby duplicates found → return false`,
        vars: { "return": "false" },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 219 — Contains Duplicate II

**Difficulty:** Easy &nbsp; **Topics:** Array, Hash Table, Sliding Window

---

Given an integer array \`nums\` and an integer \`k\`, return \`true\` if there are **two distinct indices** \`i\` and \`j\` such that \`nums[i] == nums[j]\` and \`|i - j| <= k\`.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [1,2,3,1], k = 3
Output: true  
\`\`\`
(indices 0 and 3, |0-3| = 3 ≤ 3)

**Example 2:**
\`\`\`
Input:  nums = [1,0,1,1], k = 1
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input:  nums = [1,2,3,1,2,3], k = 2
Output: false
\`\`\`

### Constraints
- \`1 <= nums.length <= 10⁵\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`0 <= k <= 10⁵\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Sliding Window + Hash Set

### Key Insight
We maintain a **window** of size at most \`k\` using a hash set.

### Algorithm
1. For each element, check if it's already in the window (duplicate!)
2. Add it to the window
3. If window size > k, remove the oldest element

### Why a Set?
- O(1) lookup: "Is this number in my window?"
- O(1) insert/delete
- Window size ≤ k at all times → O(k) space

### Mental Simulation
\`\`\`
nums = [1,2,3,1], k = 3
window = {}

i=0: 1 in {}? NO  → window = {1}
i=1: 2 in {1}? NO → window = {1,2}
i=2: 3 in {1,2}? NO → window = {1,2,3}
i=3: 1 in {1,2,3}? YES → return true! ✓
\`\`\``
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_set<int> window;
    for (int i = 0; i < nums.size(); i++) {
        if (window.count(nums[i]))
            return true;
        window.insert(nums[i]);
        if (window.size() > k)
            window.erase(nums[i - k]);
    }
    return false;
}
\`\`\`

## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per op |
| **Space** | **O(k)** | Window set holds ≤ k elements |`
    }
];

export default function ContainsDuplicateII() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [kText, setKText] = useState(String(DEFAULT_K));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [k, setK] = useState(DEFAULT_K);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const kv = parseInt(kText);
        if (parsed.length < 1 || parsed.length > 12 || isNaN(kv) || kv < 0) return;
        setNums(parsed); setK(kv);
        setSteps(generateSteps(parsed, kv)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(",")); setKText(String(DEFAULT_K));
        setNums(DEFAULT_ARR); setK(DEFAULT_K);
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_K)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Contains Duplicate II"
            subtitle={`LC #219 · Sliding Window Hash Set · k = ${k}`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "nums:", value: inputText, onChange: setInputText, placeholder: "1,2,3,1", flex: "1 1 140px" },
                    { label: "k:", value: kText, onChange: setKText, placeholder: "3", flex: "0 0 50px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun}
                onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="contains_duplicate_ii.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Array with sliding window highlight ━━━ */}
            <VizCard title={`📥 nums[]  ·  window size ≤ ${k}  ·  ${step.windowVals.length} in window`}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        const inWindow = i >= step.windowStart && i <= step.windowEnd;
                        const isFound = step.phase === "found" && val === step.highlightValue;
                        return (
                            <div key={i} style={{
                                width: "54px", height: "62px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isFound ? (isDark ? "#10b98120" : "#dcfce7")
                                    : isActive ? (isDark ? `${pc}18` : `${pc}10`)
                                        : inWindow ? (isDark ? "#3b82f610" : "#dbeafe")
                                            : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isFound ? "#10b981" : isActive ? pc : inWindow ? "#3b82f644" : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 16px ${pc}40`
                                    : isFound ? "0 4px 16px #10b98140" : "none",
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.2rem", fontWeight: "900",
                                    color: isFound ? "#10b981" : isActive ? pc : inWindow ? "#3b82f6" : theme.text,
                                }}>{val}</span>
                                <span style={{ fontSize: "0.5rem", fontWeight: "600", color: theme.textDim }}>[{i}]</span>
                                {inWindow && !isActive && (
                                    <div style={{
                                        position: "absolute", bottom: "-8px",
                                        width: "100%", height: "3px",
                                        background: "#3b82f6", borderRadius: "2px",
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "16px", fontSize: "0.65rem", color: theme.textDim }}>
                    <span>🔵 in window</span>
                    <span>🟡 checking</span>
                    <span>🟢 duplicate found</span>
                </div>
            </VizCard>

            {/* ━━━ Hash Set (bucket-style window) ━━━ */}
            <HashSetPanel
                values={step.windowVals}
                activeValue={step.activeValue}
                highlightValue={step.highlightValue}
                status={step.status}
                title={`Sliding Window Set · max size ${k}`}
            />

            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "found" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
