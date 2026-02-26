import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_ARR = [1, 1, 1, 3, 3, 2, 2, 2];
const DEFAULT_K = 2;

const CODE = [
    { id: 0, text: `int subarraySum(vector<int>& nums, int k) {` },
    { id: 1, text: `    unordered_map<int, int> prefixCount;` },
    { id: 2, text: `    prefixCount[0] = 1;` },
    { id: 3, text: `    int sum = 0, count = 0;` },
    { id: 4, text: `    for (int n : nums) {` },
    { id: 5, text: `        sum += n;` },
    { id: 6, text: `        if (prefixCount.count(sum - k))` },
    { id: 7, text: `            count += prefixCount[sum - k];` },
    { id: 8, text: `        prefixCount[sum]++;` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return count;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", add: "#3b82f6", found: "#10b981", notFound: "#64748b", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", add: "ADD TO SUM", found: "SUBARRAY FOUND ✓", notFound: "NO MATCH", done: "DONE ✓" };

function generateSteps(nums, k) {
    const steps = [];
    const prefixCount = { 0: 1 };
    let sum = 0, count = 0;

    steps.push({
        cl: 2, phase: "init", nums, k, activeIdx: -1, sum: 0, count: 0, target: null, prefixMap: { ...prefixCount },
        msg: `Count subarrays with sum = ${k} using prefix sum + HashMap`,
        vars: { k, sum: 0, count: 0, "map[0]": 1 },
    });

    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        const target = sum - k;
        const found = prefixCount[target] !== undefined;

        if (found) {
            count += prefixCount[target];
            steps.push({
                cl: 7, phase: "found", nums, k, activeIdx: i, sum, count, target, prefixMap: { ...prefixCount },
                msg: `sum=${sum}, need ${target} → found ${prefixCount[target]}× → count=${count}`,
                vars: { i, [`nums[${i}]`]: nums[i], sum, [`sum-k`]: target, [`map[${target}]`]: prefixCount[target], count },
            });
        } else {
            steps.push({
                cl: 6, phase: "notFound", nums, k, activeIdx: i, sum, count, target, prefixMap: { ...prefixCount },
                msg: `sum=${sum}, need ${target} → not in map`,
                vars: { i, [`nums[${i}]`]: nums[i], sum, [`sum-k`]: target, count },
            });
        }

        prefixCount[sum] = (prefixCount[sum] || 0) + 1;
    }

    steps.push({
        cl: 10, phase: "done", nums, k, activeIdx: -1, sum, count, target: null, prefixMap: { ...prefixCount },
        msg: `🟢 Total subarrays with sum ${k} = ${count}`,
        vars: { "return": count },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 560 — Subarray Sum Equals K

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, Prefix Sum

---

Given an array and integer \`k\`, return the **total number of subarrays** whose sum equals \`k\`.

### Examples
\`\`\`
Input:  nums = [1,1,1], k = 2
Output: 2  ([1,1] at index 0-1 and 1-2)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Prefix Sum + HashMap

### Key Insight
If \`prefixSum[j] - prefixSum[i] = k\`, then subarray \`[i+1..j]\` sums to k. So for each position, check if \`sum - k\` exists as a previous prefix sum.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(n)** | Prefix count map |`
    }
];

export default function SubarraySumK() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [kText, setKText] = useState(String(DEFAULT_K));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const kv = parseInt(kText);
        if (parsed.length < 1 || parsed.length > 12 || isNaN(kv)) return;
        setSteps(generateSteps(parsed, kv)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(",")); setKText(String(DEFAULT_K));
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_K)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Subarray Sum Equals K" subtitle="LC #560 · Prefix Sum + HashMap">
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "nums:", value: inputText, onChange: setInputText, placeholder: "1,1,1,3,3,2", flex: "1 1 160px" },
                    { label: "k:", value: kText, onChange: setKText, placeholder: "2", flex: "0 0 50px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="subarray_sum_k.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`📊 Array · sum=${step.sum} · count=${step.count}`}>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        return (
                            <div key={i} style={{
                                width: "48px", height: "52px", borderRadius: "10px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s",
                                transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                fontWeight: "900", fontSize: "1.1rem", color: isActive ? pc : theme.text,
                            }}>
                                <span>{val}</span>
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
