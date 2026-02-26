import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [1, 2, 3, 4];

const CODE = [
    { id: 0, text: `vector<int> productExceptSelf(vector<int>& nums) {` },
    { id: 1, text: `    int n = nums.size();` },
    { id: 2, text: `    vector<int> res(n, 1);` },
    { id: 3, text: `    int prefix = 1;` },
    { id: 4, text: `    for (int i = 0; i < n; i++) {` },
    { id: 5, text: `        res[i] = prefix;` },
    { id: 6, text: `        prefix *= nums[i];` },
    { id: 7, text: `    }` },
    { id: 8, text: `    int suffix = 1;` },
    { id: 9, text: `    for (int i = n-1; i >= 0; i--) {` },
    { id: 10, text: `        res[i] *= suffix;` },
    { id: 11, text: `        suffix *= nums[i];` },
    { id: 12, text: `    }` },
    { id: 13, text: `    return res;` },
    { id: 14, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", prefix: "#3b82f6", suffix: "#f59e0b", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", prefix: "PREFIX PASS →", suffix: "← SUFFIX PASS", done: "DONE ✓" };

function generateSteps(nums) {
    const steps = [];
    const n = nums.length;
    const res = new Array(n).fill(1);

    steps.push({
        cl: 2, phase: "init", nums, res: [...res], activeIdx: -1, prefix: 1, suffix: 1, pass: null,
        msg: `Product of everything except self — NO division!`,
        vars: { n, prefix: 1, suffix: 1 },
    });

    let prefix = 1;
    for (let i = 0; i < n; i++) {
        res[i] = prefix;
        steps.push({
            cl: 5, phase: "prefix", nums, res: [...res], activeIdx: i, prefix, suffix: 1, pass: "prefix",
            msg: `res[${i}] = prefix = ${prefix}, then prefix *= ${nums[i]} = ${prefix * nums[i]}`,
            vars: { i, [`res[${i}]`]: prefix, prefix, [`nums[${i}]`]: nums[i] },
        });
        prefix *= nums[i];
    }

    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        steps.push({
            cl: 10, phase: "suffix", nums, res: [...res], activeIdx: i, prefix, suffix, pass: "suffix",
            msg: `res[${i}] *= suffix(${suffix}) = ${res[i]}, then suffix *= ${nums[i]} = ${suffix * nums[i]}`,
            vars: { i, [`res[${i}]`]: res[i], suffix, [`nums[${i}]`]: nums[i] },
        });
        suffix *= nums[i];
    }

    steps.push({
        cl: 13, phase: "done", nums, res: [...res], activeIdx: -1, prefix, suffix, pass: null,
        msg: `🟢 Result: [${res.join(",")}]`,
        vars: { "return": `[${res.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 238 — Product of Array Except Self

**Difficulty:** Medium &nbsp; **Topics:** Array, Prefix Sum

---

Return an array where \`result[i]\` = product of all elements except \`nums[i]\`. **No division allowed.** Must be O(n).

### Examples
\`\`\`
Input:  [1,2,3,4]
Output: [24,12,8,6]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Two Pass: Prefix × Suffix

### Key Insight
For each position: result = (product of everything LEFT) × (product of everything RIGHT)

### Algorithm
1. **Left→Right pass**: Fill result with prefix products
2. **Right→Left pass**: Multiply each result by suffix product`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Two passes |
| **Space** | **O(1)** | Result array not counted |`
    }
];

export default function ProductExceptSelf() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 2 || parsed.length > 10) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Product of Array Except Self" subtitle="LC #238 · Prefix × Suffix">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="1,2,3,4" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="product_except_self.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* nums[] and res[] side by side */}
            <VizCard title="📊 nums[] → res[]">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                    {[{ label: "nums", arr: step.nums, color: "#3b82f6" }, { label: "res", arr: step.res, color: "#10b981" }].map(({ label, arr, color }) => (
                        <div key={label}>
                            <div style={{ fontSize: "0.7rem", fontWeight: "800", color, marginBottom: "4px", textAlign: "center" }}>{label}[]</div>
                            <div style={{ display: "flex", gap: "5px" }}>
                                {arr.map((val, i) => {
                                    const isActive = step.activeIdx === i;
                                    return (
                                        <div key={i} style={{
                                            width: "52px", height: "52px", borderRadius: "10px",
                                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                            background: isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                            border: `2px solid ${isActive ? pc : theme.cardBorder}`,
                                            transition: "all 0.3s",
                                            transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                        }}>
                                            <span style={{ fontSize: "1.1rem", fontWeight: "900", color: isActive ? pc : color }}>{val}</span>
                                            <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
