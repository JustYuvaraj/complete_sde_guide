import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [2, 0, 2, 1, 1, 0];

const CODE = [
    { id: 0, text: `void sortColors(vector<int>& nums) {` },
    { id: 1, text: `    int low = 0, mid = 0;` },
    { id: 2, text: `    int high = nums.size() - 1;` },
    { id: 3, text: `    while (mid <= high) {` },
    { id: 4, text: `        if (nums[mid] == 0)` },
    { id: 5, text: `            swap(nums[low++], nums[mid++]);` },
    { id: 6, text: `        else if (nums[mid] == 1)` },
    { id: 7, text: `            mid++;` },
    { id: 8, text: `        else` },
    { id: 9, text: `            swap(nums[mid], nums[high--]);` },
    { id: 10, text: `    }` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", swap0: "#ef4444", skip1: "#f59e0b", swap2: "#3b82f6", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", swap0: "SWAP → LOW", skip1: "SKIP (1)", swap2: "SWAP → HIGH", done: "SORTED ✓" };
const VAL_COLOR = { 0: "#ef4444", 1: "#f59e0b", 2: "#3b82f6" };

function generateSteps(nums) {
    const steps = [];
    const a = [...nums];
    let low = 0, mid = 0, high = a.length - 1;

    steps.push({
        cl: 1, phase: "init", nums: [...a], low, mid, high,
        msg: `Dutch National Flag: low=0, mid=0, high=${high}`,
        vars: { low, mid, high },
    });

    while (mid <= high) {
        if (a[mid] === 0) {
            [a[low], a[mid]] = [a[mid], a[low]];
            steps.push({
                cl: 5, phase: "swap0", nums: [...a], low: low + 1, mid: mid + 1, high,
                msg: `nums[${mid}]=0 → swap(low=${low}, mid=${mid}), low++, mid++`,
                vars: { low: low + 1, mid: mid + 1, high, [`nums[${mid}]`]: 0 },
            });
            low++; mid++;
        } else if (a[mid] === 1) {
            steps.push({
                cl: 7, phase: "skip1", nums: [...a], low, mid: mid + 1, high,
                msg: `nums[${mid}]=1 → already in place, mid++`,
                vars: { low, mid: mid + 1, high, [`nums[${mid}]`]: 1 },
            });
            mid++;
        } else {
            [a[mid], a[high]] = [a[high], a[mid]];
            steps.push({
                cl: 9, phase: "swap2", nums: [...a], low, mid, high: high - 1,
                msg: `nums[${mid}]=2 → swap(mid=${mid}, high=${high}), high--`,
                vars: { low, mid, high: high - 1, [`nums[${mid}]`]: 2 },
            });
            high--;
        }
    }

    steps.push({
        cl: 11, phase: "done", nums: [...a], low, mid, high,
        msg: `🟢 Sorted: [${a.join(",")}]`,
        vars: { "return": `[${a.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 75 — Sort Colors

**Difficulty:** Medium &nbsp; **Topics:** Array, Two Pointers, Sorting

---

Given an array with \`n\` objects colored red (0), white (1), and blue (2), sort them **in-place** so same colors are adjacent.

### Examples
\`\`\`
Input:  [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Dutch National Flag (3 Pointers)

### Key Insight
Use 3 pointers: \`low\`, \`mid\`, \`high\`.
- Everything \`< low\` is 0 (red)
- Everything \`> high\` is 2 (blue)
- \`mid\` scans through, placing each element

### Rules
- \`nums[mid] == 0\` → swap with low, advance both
- \`nums[mid] == 1\` → skip, advance mid
- \`nums[mid] == 2\` → swap with high, shrink high`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | In-place |`
    }
];

export default function SortColors() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => [0, 1, 2].includes(n));
        if (!parsed.length || parsed.length > 14) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Sort Colors" subtitle="LC #75 · Dutch National Flag">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="2,0,2,1,1,0" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="sort_colors.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="🎨 Array">
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isLow = i === step.low;
                        const isMid = i === step.mid;
                        const isHigh = i === step.high;
                        const vc = VAL_COLOR[val];
                        return (
                            <div key={i} style={{
                                width: "50px", height: "62px", borderRadius: "12px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: `${vc}15`,
                                border: `3px solid ${isMid ? pc : vc}`,
                                transition: "all 0.3s ease",
                                transform: isMid ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isMid ? `0 4px 16px ${pc}40` : "none",
                            }}>
                                <span style={{ fontSize: "1.3rem", fontWeight: "900", color: vc }}>{val}</span>
                                <div style={{ display: "flex", gap: "2px", fontSize: "0.45rem", fontWeight: "700" }}>
                                    {isLow && <span style={{ color: "#ef4444" }}>L</span>}
                                    {isMid && <span style={{ color: "#f59e0b" }}>M</span>}
                                    {isHigh && <span style={{ color: "#3b82f6" }}>H</span>}
                                    {!isLow && !isMid && !isHigh && <span style={{ color: theme.textDim }}>[{i}]</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.65rem", color: theme.textDim }}>
                    🔴 0 (red) &nbsp; 🟡 1 (white) &nbsp; 🔵 2 (blue) &nbsp; L=low M=mid H=high
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
