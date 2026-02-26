import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Sorting in Python` },
    { id: 1, text: `nums = [5, 2, 8, 1, 9]` },
    { id: 2, text: `` },
    { id: 3, text: `# In-place sort` },
    { id: 4, text: `nums.sort()              # ascending` },
    { id: 5, text: `` },
    { id: 6, text: `# Descending order` },
    { id: 7, text: `nums.sort(reverse=True)  # descending` },
    { id: 8, text: `` },
    { id: 9, text: `# Non-mutating sort` },
    { id: 10, text: `original = [3, 1, 2]` },
    { id: 11, text: `new_list = sorted(original)` },
    { id: 12, text: `# original unchanged: [3, 1, 2]` },
    { id: 13, text: `# new_list: [1, 2, 3]` },
    { id: 14, text: `` },
    { id: 15, text: `# Custom comparator via key function` },
    { id: 16, text: `words = ["banana", "hi", "app"]` },
    { id: 17, text: `words.sort(key=len)  # sort by length` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", asc: "#3b82f6", desc: "#f59e0b",
    sorted: "#ec4899", custom: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "SORTING", asc: "ASCENDING (Timsort)", desc: "DESCENDING",
    sorted: "sorted() — NON-MUTATING", custom: "CUSTOM KEY", done: "COMPLETE",
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "init", items: [], label: "",
            msg: "Python uses Timsort (hybrid merge sort + insertion sort). O(n log n) worst case, O(n) best case.",
            vars: {}
        },
        {
            cl: 1, phase: "init", items: [5, 2, 8, 1, 9].map((v) => ({ val: v, color: "#64748b" })), label: "nums — unsorted",
            msg: "Original array: [5, 2, 8, 1, 9]. Timsort is adaptive — faster on partially sorted data.",
            vars: { nums: "[5, 2, 8, 1, 9]" }
        },
        {
            cl: 4, phase: "asc", items: [1, 2, 5, 8, 9].map((v) => ({ val: v, color: "#3b82f6" })), label: "nums.sort() — ascending",
            msg: ".sort() mutates the list in-place. Returns None (not the sorted list). O(n log n).",
            vars: { nums: "[1, 2, 5, 8, 9]", "returns": "None" }
        },
        {
            cl: 7, phase: "desc", items: [9, 8, 5, 2, 1].map((v) => ({ val: v, color: "#f59e0b" })), label: "nums.sort(reverse=True) — descending",
            msg: "reverse=True parameter reverses the comparison. Equivalent to sorting then reversing.",
            vars: { nums: "[9, 8, 5, 2, 1]" }
        },
        {
            cl: 11, phase: "sorted",
            items: [3, 1, 2].map((v) => ({ val: v, color: "#64748b" })),
            label: "original = [3, 1, 2] — unchanged",
            msg: "sorted() returns a new sorted list. Original list is not modified — important for preserving input.",
            vars: { original: "[3, 1, 2]", new_list: "[1, 2, 3]" }
        },
        {
            cl: 11, phase: "sorted",
            items: [1, 2, 3].map((v) => ({ val: v, color: "#ec4899" })),
            label: "new_list = sorted(original) → [1, 2, 3]",
            msg: ".sort() is in-place (no extra memory). sorted() allocates a new list — O(n) extra space.",
            vars: { original: "[3, 1, 2]", new_list: "[1, 2, 3]", "space": ".sort() O(1), sorted() O(n)" }
        },
        {
            cl: 17, phase: "custom",
            items: ["hi", "app", "banana"].map((v) => ({ val: `"${v}"`, color: "#10b981", len: v.length })),
            label: 'words.sort(key=len) — sorted by string length',
            msg: 'key=len: each element is compared by len(element). "hi"(2) < "app"(3) < "banana"(6).',
            vars: { words: '["hi", "app", "banana"]', comparator: "len()" }
        },
        {
            cl: 17, phase: "done", items: [], label: "",
            msg: "Summary: .sort() mutates in-place, sorted() creates new list. key= for custom comparators. All O(n log n).",
            vars: { "Key": ".sort() in-place, sorted() new, key= custom" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Sorting", color: "#8b5cf6",
        content: `## Timsort — Python's Sorting Algorithm

Python uses **Timsort** (Tim Peters, 2002) — a hybrid of merge sort and insertion sort.

### Two Interfaces
| Method | Mutates? | Returns | Space |
|---|---|---|---|
| \`list.sort()\` | Yes (in-place) | \`None\` | O(1) |
| \`sorted(iterable)\` | No (new list) | sorted list | O(n) |

### Parameters
\`\`\`python
nums.sort()                    # ascending
nums.sort(reverse=True)        # descending
nums.sort(key=abs)             # by absolute value
nums.sort(key=lambda x: -x)   # custom comparator
\`\`\`

### Complexity
| Case | Time |
|---|---|
| Best | **O(n)** — already sorted |
| Average | **O(n log n)** |
| Worst | **O(n log n)** |

### Stable Sort
Timsort is **stable** — equal elements maintain their relative order. This is guaranteed by Python.`
    }
];

export default function PySorting() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2500);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Sorting" subtitle="Python Refresher · Lesson 9 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="sorting.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={step.label || "Array State"}>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", minHeight: "70px", alignItems: "flex-end" }}>
                    {step.items.length === 0 ? (
                        <span style={{ color: theme.textDim, alignSelf: "center" }}>Step through the code to observe sorting behavior</span>
                    ) : step.items.map((item, i) => {
                        const isNumeric = typeof item.val === "number" || !isNaN(parseInt(String(item.val).replace(/"/g, "")));
                        const numVal = parseInt(String(item.val).replace(/"/g, ""));
                        const h = item.len ? item.len * 20 : (isNumeric ? Math.abs(numVal) * 10 + 15 : 50);
                        return (
                            <div key={i} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                            }}>
                                <span style={{
                                    fontSize: typeof item.val === "string" && item.val.includes('"') ? "0.75rem" : "0.85rem",
                                    fontWeight: "800", fontFamily: "monospace", color: item.color,
                                }}>{item.val}</span>
                                <div style={{
                                    width: "44px", height: `${h}px`, borderRadius: "8px 8px 0 0",
                                    background: `${item.color}30`,
                                    border: `2px solid ${item.color}`,
                                    transition: "all 0.4s ease",
                                }} />
                                {item.len && (
                                    <span style={{ fontSize: "0.5rem", color: theme.textDim, fontFamily: "monospace" }}>len={item.len}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
