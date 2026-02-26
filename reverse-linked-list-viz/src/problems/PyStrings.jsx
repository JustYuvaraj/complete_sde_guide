import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# String operations` },
    { id: 1, text: `s = "hello"` },
    { id: 2, text: `` },
    { id: 3, text: `# Character access` },
    { id: 4, text: `first = s[0]       # 'h'` },
    { id: 5, text: `last = s[-1]       # 'o'` },
    { id: 6, text: `` },
    { id: 7, text: `# Slicing` },
    { id: 8, text: `part = s[1:4]      # 'ell'` },
    { id: 9, text: `` },
    { id: 10, text: `# String methods` },
    { id: 11, text: `s.upper()          # 'HELLO'` },
    { id: 12, text: `s.lower()          # 'hello'` },
    { id: 13, text: `len(s)             # 5` },
    { id: 14, text: `"ell" in s         # True` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", create: "#3b82f6", access: "#f59e0b",
    slice: "#ec4899", methods: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "STRINGS", create: "INITIALIZATION", access: "CHARACTER ACCESS",
    slice: "SLICING [start:stop]", methods: "STRING METHODS", done: "COMPLETE",
};

function generateSteps() {
    const chars = ["h", "e", "l", "l", "o"];
    return [
        {
            cl: 0, phase: "init", chars: [], activeIdx: -1, sliceRange: null, display: null,
            msg: "Strings are immutable sequences of Unicode characters. Indexed like arrays but cannot be modified in-place.",
            vars: {}
        },
        {
            cl: 1, phase: "create", chars, activeIdx: -1, sliceRange: null, display: null,
            msg: 'String literal with 5 characters. Internally stored as an array of Unicode code points.',
            vars: { s: '"hello"', "len(s)": 5 }
        },
        {
            cl: 4, phase: "access", chars, activeIdx: 0, sliceRange: null, display: "h",
            msg: "s[0] = 'h'. Character access is O(1) — direct offset into the underlying array.",
            vars: { "s[0]": '"h"' }
        },
        {
            cl: 5, phase: "access", chars, activeIdx: 4, sliceRange: null, display: "o",
            msg: "s[-1] = 'o'. Negative indexing: -1 maps to len(s)-1 = index 4.",
            vars: { "s[-1]": '"o"' }
        },
        {
            cl: 8, phase: "slice", chars, activeIdx: -1, sliceRange: [1, 4], display: "ell",
            msg: 's[1:4] = "ell". Slice notation: [start:stop) — includes start, excludes stop. Creates a new string.',
            vars: { "s[1:4]": '"ell"', "range": "[1, 4)" }
        },
        {
            cl: 11, phase: "methods", chars: ["H", "E", "L", "L", "O"], activeIdx: -1, sliceRange: null, display: "HELLO",
            msg: 's.upper() returns a new string with all characters converted to uppercase. Original is unchanged (immutable).',
            vars: { "s.upper()": '"HELLO"' }
        },
        {
            cl: 12, phase: "methods", chars, activeIdx: -1, sliceRange: null, display: "hello",
            msg: 's.lower() returns a new lowercase string. All string methods return new strings.',
            vars: { "s.lower()": '"hello"' }
        },
        {
            cl: 13, phase: "methods", chars, activeIdx: -1, sliceRange: null, display: "5",
            msg: "len(s) = 5. O(1) — length is cached, not computed on each call.",
            vars: { "len(s)": 5 }
        },
        {
            cl: 14, phase: "methods", chars, activeIdx: -1, sliceRange: null, display: "True",
            msg: '"in" operator performs substring search — O(n) time complexity.',
            vars: { '"ell" in s': "True", '"xyz" in s': "False" }
        },
        {
            cl: 14, phase: "done", chars, activeIdx: -1, sliceRange: null, display: null,
            msg: 'Strings are immutable sequences. Key operations: indexing O(1), slicing O(k), search O(n). Concatenation via + creates new objects.',
            vars: { "Key": "Immutable, [i] O(1), [a:b] O(k)" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "String Operations", color: "#8b5cf6",
        content: `## str — Immutable Character Sequence

Strings in Python are **immutable** — once created, individual characters cannot be modified. Any "modification" creates a new string object.

### Key Operations
| Operation | Syntax | Complexity |
|---|---|---|
| Index | \`s[i]\` | **O(1)** |
| Negative index | \`s[-1]\` | **O(1)** |
| Slice | \`s[start:stop]\` | **O(k)** where k = stop - start |
| Length | \`len(s)\` | **O(1)** |
| Search | \`"sub" in s\` | **O(n)** |
| Upper/Lower | \`s.upper()\` | **O(n)** new string |
| Split | \`s.split(",")\` | **O(n)** returns list |
| Join | \`",".join(list)\` | **O(n)** returns string |

### Immutability Consequence
\`\`\`python
s[0] = 'H'           # TypeError! Cannot modify
s = 'H' + s[1:]      # Creates new string instead
\`\`\``
    }
];

export default function PyStrings() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Strings" subtitle="Python Refresher · Lesson 5 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="strings.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="String Character Array">
                <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap", minHeight: "60px", alignItems: "center" }}>
                    {step.chars.length === 0 ? (
                        <span style={{ color: theme.textDim }}>Step through the code to observe string operations</span>
                    ) : step.chars.map((ch, i) => {
                        const isActive = step.activeIdx === i;
                        const inSlice = step.sliceRange && i >= step.sliceRange[0] && i < step.sliceRange[1];
                        return (
                            <div key={i} style={{
                                width: "50px", height: "58px", borderRadius: "10px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: inSlice ? "#ec489918" : isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `3px solid ${inSlice ? "#ec4899" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s",
                                transform: isActive || inSlice ? "scale(1.08) translateY(-3px)" : "scale(1)",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900", fontFamily: "monospace",
                                    color: inSlice ? "#ec4899" : isActive ? pc : theme.text,
                                }}>'{ch}'</span>
                                <span style={{ fontSize: "0.5rem", fontWeight: "700", color: theme.textDim, fontFamily: "monospace" }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
                {step.display && (
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.85rem", fontWeight: "800", color: pc, fontFamily: "monospace" }}>
                        Result: {step.display}
                    </div>
                )}
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
