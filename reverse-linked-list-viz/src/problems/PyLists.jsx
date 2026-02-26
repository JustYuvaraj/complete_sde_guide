import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# List operations` },
    { id: 1, text: `nums = [10, 20, 30]` },
    { id: 2, text: `` },
    { id: 3, text: `# Indexing` },
    { id: 4, text: `first = nums[0]     # 10` },
    { id: 5, text: `last = nums[-1]     # 30` },
    { id: 6, text: `` },
    { id: 7, text: `# Mutation` },
    { id: 8, text: `nums.append(40)     # add to end` },
    { id: 9, text: `nums.pop()          # remove last` },
    { id: 10, text: `` },
    { id: 11, text: `# Built-in functions` },
    { id: 12, text: `len(nums)           # 3` },
    { id: 13, text: `nums.sort()         # in-place sort` },
    { id: 14, text: `3 in nums           # membership test` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", create: "#3b82f6", access: "#f59e0b",
    append: "#10b981", pop: "#ef4444", util: "#ec4899", done: "#10b981",
};
const PHASE_LABELS = {
    init: "LISTS", create: "INITIALIZATION", access: "INDEXING",
    append: "APPEND O(1)", pop: "POP O(1)", util: "BUILT-INS", done: "COMPLETE",
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "init", list: [], activeIdx: -1, action: null,
            msg: "Lists are Python's dynamic arrays — mutable, ordered, and support O(1) amortized append.",
            vars: {}
        },
        {
            cl: 1, phase: "create", list: [10, 20, 30], activeIdx: -1, action: null,
            msg: "List literal initialization. Internally backed by a dynamic array (similar to std::vector).",
            vars: { "nums": "[10, 20, 30]", "len": 3 }
        },
        {
            cl: 4, phase: "access", list: [10, 20, 30], activeIdx: 0, action: "first",
            msg: "Positive indexing: nums[0] = 10. Zero-based, same as C/C++ arrays.",
            vars: { "nums[0]": 10, first: 10 }
        },
        {
            cl: 5, phase: "access", list: [10, 20, 30], activeIdx: 2, action: "last",
            msg: "Negative indexing: nums[-1] = 30. Equivalent to nums[len(nums)-1]. Unique to Python.",
            vars: { "nums[-1]": 30, last: 30 }
        },
        {
            cl: 8, phase: "append", list: [10, 20, 30, 40], activeIdx: 3, action: "add",
            msg: "append() adds to the end in O(1) amortized time. Internal array may resize.",
            vars: { "nums": "[10, 20, 30, 40]", "len": 4, "complexity": "O(1) amortized" }
        },
        {
            cl: 9, phase: "pop", list: [10, 20, 30], activeIdx: -1, action: "remove",
            msg: "pop() removes and returns the last element in O(1). pop(i) removes at index i in O(n).",
            vars: { "nums": "[10, 20, 30]", "popped": 40, "len": 3 }
        },
        {
            cl: 12, phase: "util", list: [10, 20, 30], activeIdx: -1, action: "len",
            msg: "len() returns the size in O(1). min(), max(), sum() iterate in O(n).",
            vars: { "len(nums)": 3, "min(nums)": 10, "max(nums)": 30, "sum(nums)": 60 }
        },
        {
            cl: 13, phase: "util", list: [10, 20, 30], activeIdx: -1, action: "sort",
            msg: ".sort() uses Timsort (O(n log n)). Modifies in-place. sorted() returns a new list.",
            vars: { "sorted": "[10, 20, 30]", algorithm: "Timsort", "time": "O(n log n)" }
        },
        {
            cl: 14, phase: "util", list: [10, 20, 30], activeIdx: -1, action: "in",
            msg: "'in' operator performs linear search — O(n). For O(1) lookup, use a set.",
            vars: { "3 in nums": "False", "20 in nums": "True", "complexity": "O(n)" }
        },
        {
            cl: 14, phase: "done", list: [10, 20, 30], activeIdx: -1, action: null,
            msg: "Lists are the primary sequential container. Key operations: indexing O(1), append O(1), search O(n).",
            vars: { "Key": "O(1) index/append, O(n) search" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Python Lists", color: "#8b5cf6",
        content: `## list — Dynamic Array

Python lists are **mutable, ordered sequences** backed by dynamic arrays (similar to \`std::vector<T>\` in C++).

### Time Complexities
| Operation | Method | Complexity |
|---|---|---|
| Index access | \`nums[i]\` | **O(1)** |
| Append | \`nums.append(x)\` | **O(1)** amortized |
| Pop last | \`nums.pop()\` | **O(1)** |
| Pop at index | \`nums.pop(i)\` | **O(n)** |
| Search | \`x in nums\` | **O(n)** |
| Sort | \`nums.sort()\` | **O(n log n)** |
| Length | \`len(nums)\` | **O(1)** |

### Key Features
- **Negative indexing**: \`nums[-1]\` = last element
- **Slicing**: \`nums[1:4]\` returns elements at indices 1, 2, 3
- **Heterogeneous**: can mix types (but rarely done in practice)`
    }
];

export default function PyLists() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Lists (Dynamic Arrays)" subtitle="Python Refresher · Lesson 4 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="lists.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="List State">
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", minHeight: "70px", alignItems: "center" }}>
                    {step.list.length === 0 ? (
                        <span style={{ color: theme.textDim }}>Step through the code to observe list operations</span>
                    ) : step.list.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        const isNew = step.action === "add" && i === step.list.length - 1;
                        return (
                            <div key={i} style={{
                                width: "60px", height: "65px", borderRadius: "12px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: isNew ? "#10b98118" : isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `3px solid ${isNew ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: isActive || isNew ? "scale(1.1) translateY(-4px)" : "scale(1)",
                            }}>
                                <span style={{
                                    fontSize: "1.4rem", fontWeight: "900", fontFamily: "monospace",
                                    color: isNew ? "#10b981" : isActive ? pc : theme.text,
                                }}>{val}</span>
                                <span style={{ fontSize: "0.5rem", fontWeight: "700", color: theme.textDim, fontFamily: "monospace" }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "6px", fontSize: "0.65rem", color: theme.textDim, fontFamily: "monospace" }}>
                    [0] = first element &nbsp;|&nbsp; [-1] = last element
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
