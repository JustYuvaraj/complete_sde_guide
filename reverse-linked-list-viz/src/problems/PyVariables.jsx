import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Variable declarations` },
    { id: 1, text: `name = "Alice"` },
    { id: 2, text: `age = 21` },
    { id: 3, text: `height = 5.8` },
    { id: 4, text: `is_student = True` },
    { id: 5, text: `` },
    { id: 6, text: `# Arithmetic operations` },
    { id: 7, text: `a = 10` },
    { id: 8, text: `b = 3` },
    { id: 9, text: `total = a + b      # 13` },
    { id: 10, text: `diff = a - b       # 7` },
    { id: 11, text: `product = a * b    # 30` },
    { id: 12, text: `div = a / b        # 3.33` },
    { id: 13, text: `floor = a // b     # 3` },
    { id: 14, text: `mod = a % b        # 1` },
    { id: 15, text: `power = a ** b     # 1000` },
];

const PHASE_COLOR = {
    intro: "#8b5cf6", string: "#3b82f6", integer: "#10b981",
    float: "#f59e0b", boolean: "#ef4444", math: "#ec4899", done: "#10b981",
};
const PHASE_LABELS = {
    intro: "DECLARATION", string: "TYPE: str", integer: "TYPE: int",
    float: "TYPE: float", boolean: "TYPE: bool", math: "ARITHMETIC", done: "COMPLETE",
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "intro", boxes: [], msg: "Python is dynamically typed — the interpreter infers the type from the assigned value.",
            vars: {}
        },
        {
            cl: 1, phase: "string", boxes: [{ name: "name", value: '"Alice"', type: "str", color: "#3b82f6" }],
            msg: 'String literal assigned using double or single quotes. Type: str.',
            vars: { name: '"Alice"', type: "str" }
        },
        {
            cl: 2, phase: "integer", boxes: [
                { name: "name", value: '"Alice"', type: "str", color: "#3b82f6" },
                { name: "age", value: "21", type: "int", color: "#10b981" },
            ], msg: "Integer assignment — no type annotation required. Python infers int from the literal.",
            vars: { name: '"Alice"', age: 21, type: "int" }
        },
        {
            cl: 3, phase: "float", boxes: [
                { name: "name", value: '"Alice"', type: "str", color: "#3b82f6" },
                { name: "age", value: "21", type: "int", color: "#10b981" },
                { name: "height", value: "5.8", type: "float", color: "#f59e0b" },
            ], msg: "Floating-point number — any numeric literal with a decimal point is inferred as float.",
            vars: { name: '"Alice"', age: 21, height: 5.8, type: "float" }
        },
        {
            cl: 4, phase: "boolean", boxes: [
                { name: "name", value: '"Alice"', type: "str", color: "#3b82f6" },
                { name: "age", value: "21", type: "int", color: "#10b981" },
                { name: "height", value: "5.8", type: "float", color: "#f59e0b" },
                { name: "is_student", value: "True", type: "bool", color: "#ef4444" },
            ], msg: "Boolean type — only two values: True and False (capitalized). Used in control flow.",
            vars: { name: '"Alice"', age: 21, height: 5.8, is_student: "True", type: "bool" }
        },
        {
            cl: 7, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
            ], msg: "Arithmetic operations: Python supports standard operators and two division types.",
            vars: { a: 10, b: 3 }
        },
        {
            cl: 9, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "total", value: "13", type: "int", color: "#ec4899" },
            ], msg: "Addition operator (+): a + b = 10 + 3 = 13",
            vars: { a: 10, b: 3, "a + b": 13 }
        },
        {
            cl: 10, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "diff", value: "7", type: "int", color: "#ec4899" },
            ], msg: "Subtraction operator (-): a - b = 10 - 3 = 7",
            vars: { a: 10, b: 3, "a - b": 7 }
        },
        {
            cl: 12, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "div", value: "3.33", type: "float", color: "#ec4899" },
            ], msg: "True division (/): Always returns float. 10 / 3 = 3.333... (even if both operands are int).",
            vars: { a: 10, b: 3, "a / b": "3.33" }
        },
        {
            cl: 13, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "floor", value: "3", type: "int", color: "#ec4899" },
            ], msg: "Floor division (//): Truncates toward negative infinity. 10 // 3 = 3.",
            vars: { a: 10, b: 3, "a // b": 3 }
        },
        {
            cl: 14, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "mod", value: "1", type: "int", color: "#ec4899" },
            ], msg: "Modulo operator (%): Returns the remainder. 10 % 3 = 1.",
            vars: { a: 10, b: 3, "a % b": 1 }
        },
        {
            cl: 15, phase: "math", boxes: [
                { name: "a", value: "10", type: "int", color: "#ec4899" },
                { name: "b", value: "3", type: "int", color: "#ec4899" },
                { name: "power", value: "1000", type: "int", color: "#ec4899" },
            ], msg: "Exponentiation operator (**): 10 ** 3 = 10³ = 1000. (C++ equivalent: pow(10, 3)).",
            vars: { a: 10, b: 3, "a ** b": 1000 }
        },
        {
            cl: 15, phase: "done", boxes: [], msg: "Summary: Python uses dynamic typing (no explicit type declarations) and supports // for floor division, ** for exponentiation.",
            vars: { "Key": "Dynamic typing, /  vs //, **" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Variables & Data Types", color: "#8b5cf6",
        content: `## Dynamic Typing

Python is **dynamically typed** — variables do not require explicit type declarations. The interpreter determines the type at runtime based on the assigned value.

\`\`\`python
name = "Alice"    # type: str
age = 21          # type: int
height = 5.8      # type: float
flag = True       # type: bool
\`\`\`

### Primitive Types
| Type | Description | Example |
|---|---|---|
| \`str\` | String (text) | \`"hello"\` |
| \`int\` | Integer | \`42\` |
| \`float\` | Floating-point | \`3.14\` |
| \`bool\` | Boolean | \`True\` / \`False\` |

> Note: Python has arbitrary precision integers — no overflow.`
    },
    {
        icon: "🧮", title: "Arithmetic Operators", color: "#ec4899",
        content: `## Operators
| Operator | Operation | Example | Note |
|---|---|---|---|
| \`+\` | Addition | \`10 + 3 = 13\` | |
| \`-\` | Subtraction | \`10 - 3 = 7\` | |
| \`*\` | Multiplication | \`10 * 3 = 30\` | |
| \`/\` | True division | \`10 / 3 = 3.33\` | Always returns float |
| \`//\` | Floor division | \`10 // 3 = 3\` | Truncates decimal |
| \`%\` | Modulo | \`10 % 3 = 1\` | Remainder |
| \`**\` | Exponentiation | \`10 ** 3 = 1000\` | Replaces pow() |

> Key difference from C++: \`/\` always returns float; use \`//\` for integer division.`
    }
];

export default function PyVariables() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Variables & Data Types" subtitle="Python Refresher · Lesson 1 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="variables.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="Memory State">
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.boxes.map((box, i) => (
                        <div key={i} style={{
                            padding: "12px 18px", borderRadius: "14px", textAlign: "center",
                            background: isDark ? `${box.color}12` : `${box.color}08`,
                            border: `3px solid ${box.color}`,
                            transition: "all 0.4s ease",
                            minWidth: "90px",
                        }}>
                            <div style={{ fontSize: "0.6rem", fontWeight: "700", color: box.color, textTransform: "uppercase", marginBottom: "4px" }}>
                                {box.type}
                            </div>
                            <div style={{ fontSize: "1.4rem", fontWeight: "900", color: box.color, fontFamily: "monospace" }}>
                                {box.value}
                            </div>
                            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.text, marginTop: "4px", fontFamily: "monospace" }}>
                                {box.name}
                            </div>
                        </div>
                    ))}
                    {step.boxes.length === 0 && (
                        <div style={{ color: theme.textDim, fontSize: "0.9rem", padding: "20px" }}>
                            Step through the code to observe variable allocation
                        </div>
                    )}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
