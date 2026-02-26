import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Set (hash set)` },
    { id: 1, text: `s = set()` },
    { id: 2, text: `s.add(10)` },
    { id: 3, text: `s.add(20)` },
    { id: 4, text: `s.add(30)` },
    { id: 5, text: `s.add(20)           # no-op (duplicate)` },
    { id: 6, text: `` },
    { id: 7, text: `# O(1) membership test` },
    { id: 8, text: `10 in s             # True` },
    { id: 9, text: `99 in s             # False` },
    { id: 10, text: `` },
    { id: 11, text: `# Deduplication` },
    { id: 12, text: `nums = [1, 2, 2, 3, 3, 3]` },
    { id: 13, text: `unique = list(set(nums))  # [1, 2, 3]` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", add: "#3b82f6", dup: "#ef4444",
    check: "#f59e0b", dedup: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "HASH SET", add: "INSERT O(1)", dup: "DUPLICATE REJECTED",
    check: "LOOKUP O(1)", dedup: "DEDUPLICATION", done: "COMPLETE",
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "init", items: [], rejected: null, checking: null,
            msg: "set — unordered collection of unique elements backed by a hash table. O(1) insert and lookup.",
            vars: {}
        },
        {
            cl: 1, phase: "init", items: [], rejected: null, checking: null,
            msg: "Empty set initialization. Note: {} creates a dict, not a set — use set() for empty sets.",
            vars: { "s": "set()" }
        },
        {
            cl: 2, phase: "add", items: [10], rejected: null, checking: null,
            msg: "s.add(10): hash(10) computed, element stored in hash table bucket. O(1) average.",
            vars: { "s": "{10}", "len(s)": 1 }
        },
        {
            cl: 3, phase: "add", items: [10, 20], rejected: null, checking: null,
            msg: "s.add(20): new element, different hash bucket.",
            vars: { "s": "{10, 20}", "len(s)": 2 }
        },
        {
            cl: 4, phase: "add", items: [10, 20, 30], rejected: null, checking: null,
            msg: "s.add(30): three elements stored.",
            vars: { "s": "{10, 20, 30}", "len(s)": 3 }
        },
        {
            cl: 5, phase: "dup", items: [10, 20, 30], rejected: 20, checking: null,
            msg: "s.add(20): hash(20) found in existing bucket — element already present. No-op, set unchanged.",
            vars: { "s": "{10, 20, 30}", "len(s)": 3, "duplicate": 20 }
        },
        {
            cl: 8, phase: "check", items: [10, 20, 30], rejected: null, checking: 10,
            msg: "10 in s: O(1) average lookup via hash. Compare to list's O(n) linear scan.",
            vars: { "10 in s": "True", "complexity": "O(1)" }
        },
        {
            cl: 9, phase: "check", items: [10, 20, 30], rejected: null, checking: 99,
            msg: "99 in s: hash(99) computed, bucket checked — not found. Returns False in O(1).",
            vars: { "99 in s": "False" }
        },
        {
            cl: 13, phase: "dedup", items: [1, 2, 3], rejected: null, checking: null,
            msg: "set() constructor deduplicates in O(n). Convert back to list with list(). Order not guaranteed.",
            vars: { "input": "[1, 2, 2, 3, 3, 3]", "set()": "{1, 2, 3}", "unique": "[1, 2, 3]" }
        },
        {
            cl: 13, phase: "done", items: [1, 2, 3], rejected: null, checking: null,
            msg: "Use set when you need O(1) membership testing. Equivalent to C++ std::unordered_set.",
            vars: { "Key": "O(1) add/lookup/delete" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Set (Hash Set)", color: "#8b5cf6",
        content: `## set — Unordered Unique Collection

Equivalent to \`std::unordered_set<T>\` in C++. Stores unique elements using a hash table.

### Time Complexities (Average)
| Operation | Syntax | Complexity |
|---|---|---|
| Add | \`s.add(x)\` | **O(1)** |
| Remove | \`s.remove(x)\` | **O(1)** |
| Lookup | \`x in s\` | **O(1)** |
| Length | \`len(s)\` | **O(1)** |

### Set vs List for Membership Testing
| Container | \`x in container\` |
|---|---|
| \`list\` | **O(n)** linear scan |
| \`set\` | **O(1)** hash lookup |

### Deduplication (One-liner)
\`\`\`python
unique = list(set([1, 2, 2, 3]))  # [1, 2, 3]
\`\`\`

### Set Operations
\`\`\`python
a | b    # union
a & b    # intersection
a - b    # difference
\`\`\``
    }
];

export default function PySets() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Sets (Hash Set)" subtitle="Python Refresher · Lesson 7 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="sets.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="Hash Set State">
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", minHeight: "70px", alignItems: "center" }}>
                    {step.items.length === 0 ? (
                        <span style={{ color: theme.textDim }}>Step through the code to observe set operations</span>
                    ) : step.items.map((val, i) => {
                        const isChecking = step.checking === val;
                        return (
                            <div key={i} style={{
                                width: "58px", height: "58px", borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: isChecking ? `${pc}18` : (isDark ? "#3b82f612" : "#dbeafe"),
                                border: `3px solid ${isChecking ? pc : "#3b82f6"}`,
                                fontWeight: "900", fontSize: "1.2rem", fontFamily: "monospace",
                                color: isChecking ? pc : "#3b82f6",
                                transition: "all 0.3s",
                                transform: isChecking ? "scale(1.12)" : "scale(1)",
                            }}>{val}</div>
                        );
                    })}
                    {step.rejected !== null && (
                        <div style={{
                            width: "58px", height: "58px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "#ef444418", border: "3px dashed #ef4444",
                            fontWeight: "900", fontSize: "1.2rem", color: "#ef4444", fontFamily: "monospace",
                            textDecoration: "line-through", opacity: 0.7,
                        }}>{step.rejected}</div>
                    )}
                    {step.checking === 99 && (
                        <div style={{
                            width: "58px", height: "58px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "#ef444418", border: "3px dashed #ef4444",
                            fontWeight: "900", fontSize: "1rem", color: "#ef4444", fontFamily: "monospace",
                        }}>99?</div>
                    )}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
