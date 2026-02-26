import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_ARR = [3, 2, 2, 3];
const DEFAULT_VAL = 3;

const CODE = [
    { id: 0, text: `int removeElement(vector<int>& nums, int val) {` },
    { id: 1, text: `    int k = 0;` },
    { id: 2, text: `` },
    { id: 3, text: `    for (int i = 0; i < nums.size(); i++) {` },
    { id: 4, text: `        if (nums[i] != val) {` },
    { id: 5, text: `            nums[k] = nums[i];` },
    { id: 6, text: `            k++;` },
    { id: 7, text: `        }` },
    { id: 8, text: `    }` },
    { id: 9, text: `` },
    { id: 10, text: `    return k;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    scan: "#f59e0b",
    keep: "#3b82f6",
    skip: "#ef4444",
    done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    scan: "SCANNING",
    keep: "KEEP →",
    skip: "SKIP ✗",
    done: "COMPLETE ✓",
};

function generateSteps(nums, val) {
    const arr = [...nums];
    let k = 0;
    const steps = [];

    steps.push({
        cl: 1, phase: "init",
        arr: [...arr], k, activeI: -1, val,
        msg: `Initialize k = 0 (write pointer)`,
        vars: { k: 0, val },
    });

    for (let i = 0; i < arr.length; i++) {
        const isKeep = arr[i] !== val;
        steps.push({
            cl: 4, phase: "scan",
            arr: [...arr], k, activeI: i, val,
            msg: `nums[${i}] = ${arr[i]} ${isKeep ? "≠" : "=="} ${val} → ${isKeep ? "KEEP" : "SKIP"}`,
            vars: { i, k, [`nums[${i}]`]: arr[i], val },
        });

        if (isKeep) {
            arr[k] = arr[i];
            steps.push({
                cl: 5, phase: "keep",
                arr: [...arr], k, activeI: i, val, writeIdx: k,
                msg: `nums[${k}] = nums[${i}] = ${arr[i]}`,
                vars: { i, k, [`nums[${k}]`]: arr[i] },
            });
            k++;
            steps.push({
                cl: 6, phase: "keep",
                arr: [...arr], k, activeI: i, val,
                msg: `k++ → k = ${k}`,
                vars: { i, k },
            });
        } else {
            steps.push({
                cl: 4, phase: "skip",
                arr: [...arr], k, activeI: i, val,
                msg: `nums[${i}] == ${val} → skip it`,
                vars: { i, k, [`nums[${i}]`]: arr[i] },
            });
        }
    }

    steps.push({
        cl: 10, phase: "done",
        arr: [...arr], k, activeI: -1, val,
        msg: `Done! First ${k} elements are the result → return k = ${k}`,
        vars: { "return": k },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 27 — Remove Element

**Difficulty:** Easy &nbsp; **Topics:** Array, Two Pointers

---

Given an integer array \`nums\` and an integer \`val\`, remove all occurrences of \`val\` **in-place**. The order of the elements may be changed. Return \`k\` — the number of elements not equal to \`val\`.

---

### Examples

**Example 1:**
\`\`\`
Input:  nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
\`\`\`

**Example 2:**
\`\`\`
Input:  nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
\`\`\`

### Constraints
- \`0 <= nums.length <= 100\`
- \`0 <= nums[i] <= 50\`
- \`0 <= val <= 100\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — Two Pointer Approach

Use a **write pointer** \`k\` that only advances when we find a value to keep.

## Step 2 — The Algorithm

\`\`\`
k = 0 (points to next write position)
for each element nums[i]:
    if nums[i] != val:
        nums[k] = nums[i]
        k++
\`\`\`

## Step 3 — Why It Works

- \`k\` always ≤ \`i\`, so we never overwrite unprocessed elements
- Elements equal to \`val\` are simply skipped
- After the loop, the first \`k\` elements contain the result

## Key Takeaway
> Two-pointer "overwrite" pattern: one pointer reads, another writes.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
int removeElement(vector<int>& nums, int val) {
    int k = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}
\`\`\`

## Python Solution
\`\`\`python
def removeElement(nums, val):
    k = 0
    for i in range(len(nums)):
        if nums[i] != val:
            nums[k] = nums[i]
            k += 1
    return k
\`\`\`

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | In-place modification |`
    }
];

export default function RemoveElement() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [valText, setValText] = useState(String(DEFAULT_VAL));
    const [nums, setNums] = useState(DEFAULT_ARR);
    const [val, setVal] = useState(DEFAULT_VAL);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_VAL));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const v = parseInt(valText);
        if (parsed.length < 1 || parsed.length > 10 || isNaN(v)) return;
        setNums(parsed); setVal(v);
        setSteps(generateSteps(parsed, v)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(",")); setValText(String(DEFAULT_VAL));
        setNums(DEFAULT_ARR); setVal(DEFAULT_VAL);
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_VAL)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Remove Element"
            subtitle={`LC #27 · nums = [${nums.join(",")}], val = ${val} · O(n) Time`}
        >
            <ExplainPanel sections={EXPLAIN} />

            <DualInputSection
                inputs={[
                    { label: "nums:", value: inputText, onChange: setInputText, placeholder: "3,2,2,3", flex: "1 1 140px" },
                    { label: "val:", value: valText, onChange: setValText, placeholder: "3", flex: "0 0 60px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun}
                onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="remove_element.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Array Visualization ━━━ */}
            <VizCard title={`📥 nums[]  ·  remove val = ${val}  ·  k = ${step.k}`}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.arr.map((v, i) => {
                        const isActive = step.activeI === i;
                        const isKept = i < step.k;
                        const isWriteTarget = step.writeIdx === i;
                        const isSkipped = step.phase === "skip" && isActive;
                        return (
                            <div key={i} style={{
                                width: "56px", height: "65px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: isWriteTarget ? (isDark ? "#3b82f618" : "#dbeafe")
                                    : isSkipped ? (isDark ? "#ef444418" : "#fee2e2")
                                        : isKept ? (isDark ? "#10b98115" : "#dcfce7")
                                            : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isWriteTarget ? "#3b82f6" : isSkipped ? "#ef4444" : isActive ? pc : isKept ? "#10b98144" : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isActive ? "scale(1.12) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 16px ${pc}40` : "none",
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900",
                                    color: isSkipped ? "#ef4444" : isWriteTarget ? "#3b82f6" : isKept ? "#10b981" : theme.text,
                                    textDecoration: isSkipped ? "line-through" : "none",
                                }}>{v}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600",
                                    color: theme.textDim, marginTop: "1px",
                                }}>[{i}]</span>

                                {/* k boundary marker */}
                                {i === step.k && (
                                    <div style={{
                                        position: "absolute", left: "-6px", top: 0, bottom: 0,
                                        width: "3px", background: "#f59e0b", borderRadius: "2px",
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Legend */}
                <div style={{
                    display: "flex", gap: "16px", justifyContent: "center", marginTop: "10px",
                    fontSize: "0.65rem", color: theme.textDim,
                }}>
                    <span>🟢 kept (i &lt; k)</span>
                    <span>🔵 writing</span>
                    <span>🔴 skipped</span>
                    <span>🟡 k boundary</span>
                </div>
            </VizCard>

            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "done" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
