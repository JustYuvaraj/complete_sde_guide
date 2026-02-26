import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [5, 2, 3, 1];

const CODE = [
    { id: 0, text: `vector<int> sortArray(vector<int>& nums) {` },
    { id: 1, text: `    mergeSort(nums, 0, nums.size()-1);` },
    { id: 2, text: `    return nums;` },
    { id: 3, text: `}` },
    { id: 4, text: `void mergeSort(vector<int>& a, int l, int r) {` },
    { id: 5, text: `    if (l >= r) return;` },
    { id: 6, text: `    int mid = l + (r - l) / 2;` },
    { id: 7, text: `    mergeSort(a, l, mid);` },
    { id: 8, text: `    mergeSort(a, mid+1, r);` },
    { id: 9, text: `    merge(a, l, mid, r);` },
    { id: 10, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", split: "#3b82f6", merge: "#f59e0b", sorted: "#10b981", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", split: "SPLIT", merge: "MERGE", sorted: "MERGED ✓", done: "SORTED ✓" };

function generateSteps(nums) {
    const steps = [];
    const a = [...nums];

    steps.push({
        cl: 1, phase: "init", nums: [...a], lo: 0, hi: a.length - 1, mid: -1, merging: false, left: [], right: [],
        msg: `Merge sort: divide and conquer`,
        vars: { n: a.length },
    });

    function msort(l, r) {
        if (l >= r) return;
        const mid = l + Math.floor((r - l) / 2);

        steps.push({
            cl: 6, phase: "split", nums: [...a], lo: l, hi: r, mid, merging: false, left: [], right: [],
            msg: `Split [${l}..${r}] at mid=${mid}`,
            vars: { l, r, mid },
        });

        msort(l, mid);
        msort(mid + 1, r);

        // Merge
        const left = a.slice(l, mid + 1);
        const right = a.slice(mid + 1, r + 1);
        let i = 0, j = 0, k = l;

        steps.push({
            cl: 9, phase: "merge", nums: [...a], lo: l, hi: r, mid, merging: true, left: [...left], right: [...right],
            msg: `Merge [${left.join(",")}] + [${right.join(",")}]`,
            vars: { l, r, left: `[${left.join(",")}]`, right: `[${right.join(",")}]` },
        });

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) a[k++] = left[i++];
            else a[k++] = right[j++];
        }
        while (i < left.length) a[k++] = left[i++];
        while (j < right.length) a[k++] = right[j++];

        steps.push({
            cl: 9, phase: "sorted", nums: [...a], lo: l, hi: r, mid, merging: false, left: [], right: [],
            msg: `Merged: [${a.slice(l, r + 1).join(",")}]`,
            vars: { range: `[${l}..${r}]`, result: `[${a.slice(l, r + 1).join(",")}]` },
        });
    }

    msort(0, a.length - 1);

    steps.push({
        cl: 2, phase: "done", nums: [...a], lo: 0, hi: a.length - 1, mid: -1, merging: false, left: [], right: [],
        msg: `🟢 Sorted: [${a.join(",")}]`,
        vars: { "return": `[${a.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 912 — Sort an Array

**Difficulty:** Medium &nbsp; **Topics:** Array, Divide & Conquer, Merge Sort

---

Sort an array in ascending order. Implement an O(n log n) algorithm (merge sort preferred).

### Examples
\`\`\`
Input:  [5,2,3,1]
Output: [1,2,3,5]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Merge Sort

### Algorithm
1. **Split** array in half recursively until single elements
2. **Merge** sorted halves back together
3. Each merge produces a sorted result

### Why merge sort?
- Guaranteed O(n log n) — no worst case like quicksort
- Stable sort — equal elements keep their order`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n log n)** | log n levels, O(n) work per level |
| **Space** | **O(n)** | Temporary merge arrays |`
    }
];

export default function SortAnArray() {
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

    const maxVal = Math.max(...step.nums.map(Math.abs), 1);

    return (
        <VizLayout title="Sort an Array" subtitle="LC #912 · Merge Sort">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="5,2,3,1" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="sort_array.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="📊 Array (bar chart)">
                <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", justifyContent: "center", height: "100px" }}>
                    {step.nums.map((val, i) => {
                        const inRange = i >= step.lo && i <= step.hi;
                        const h = (Math.abs(val) / maxVal) * 80 + 10;
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: "800", color: inRange ? pc : theme.text }}>{val}</span>
                                <div style={{
                                    width: "32px", height: `${h}px`, borderRadius: "6px 6px 0 0",
                                    background: step.phase === "done" ? "#10b981"
                                        : step.phase === "sorted" && inRange ? "#10b98180"
                                            : inRange ? `${pc}80`
                                                : (isDark ? "#334155" : "#cbd5e1"),
                                    transition: "all 0.3s",
                                    border: inRange ? `2px solid ${pc}` : "none",
                                }} />
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            {step.left.length > 0 && (
                <VizCard title="🔀 Merging">
                    <div style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.65rem", color: "#3b82f6", fontWeight: "700" }}>Left</div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {step.left.map((v, i) => (
                                    <div key={i} style={{
                                        width: "36px", height: "36px", borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "#3b82f615", border: "2px solid #3b82f644",
                                        fontWeight: "900", color: "#3b82f6", fontSize: "0.9rem",
                                    }}>{v}</div>
                                ))}
                            </div>
                        </div>
                        <span style={{ fontSize: "1.2rem" }}>+</span>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.65rem", color: "#f59e0b", fontWeight: "700" }}>Right</div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {step.right.map((v, i) => (
                                    <div key={i} style={{
                                        width: "36px", height: "36px", borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "#f59e0b15", border: "2px solid #f59e0b44",
                                        fontWeight: "900", color: "#f59e0b", fontSize: "0.9rem",
                                    }}>{v}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </VizCard>
            )}

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
