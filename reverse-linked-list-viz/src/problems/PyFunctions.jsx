import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Function definition` },
    { id: 1, text: `def add(a, b):` },
    { id: 2, text: `    result = a + b` },
    { id: 3, text: `    return result` },
    { id: 4, text: `` },
    { id: 5, text: `# Function invocation` },
    { id: 6, text: `answer = add(3, 5)` },
    { id: 7, text: `print(answer)  # 8` },
    { id: 8, text: `` },
    { id: 9, text: `# LeetCode method signature` },
    { id: 10, text: `class Solution:` },
    { id: 11, text: `    def twoSum(self, nums, target):` },
    { id: 12, text: `        mp = {}` },
    { id: 13, text: `        for i, n in enumerate(nums):` },
    { id: 14, text: `            if target - n in mp:` },
    { id: 15, text: `                return [mp[target-n], i]` },
    { id: 16, text: `            mp[n] = i` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", define: "#3b82f6", call: "#f59e0b",
    execute: "#ec4899", ret: "#10b981", lc: "#6366f1", done: "#10b981",
};
const PHASE_LABELS = {
    init: "FUNCTIONS", define: "DEFINITION", call: "INVOCATION",
    execute: "EXECUTION", ret: "RETURN VALUE", lc: "LEETCODE CLASS", done: "COMPLETE",
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "init", callStack: [], currentScope: null,
            msg: "Functions encapsulate reusable logic. Defined with 'def', invoked with parentheses.",
            vars: {}
        },
        {
            cl: 1, phase: "define", callStack: [], currentScope: null,
            msg: "'def add(a, b):' declares a function with two parameters. Body is indented. Not executed until called.",
            vars: { "function": "add(a, b)" }
        },
        {
            cl: 6, phase: "call",
            callStack: [{ name: "add(3, 5)", params: { a: 3, b: 5 } }],
            currentScope: { name: "add", a: 3, b: 5 },
            msg: "Call: add(3, 5) — arguments 3, 5 are bound to parameters a, b. New stack frame created.",
            vars: { a: 3, b: 5 }
        },
        {
            cl: 2, phase: "execute",
            callStack: [{ name: "add(3, 5)", params: { a: 3, b: 5, result: 8 } }],
            currentScope: { name: "add", a: 3, b: 5, result: 8 },
            msg: "Executing function body: result = a + b = 3 + 5 = 8. Local variable in function scope.",
            vars: { a: 3, b: 5, result: 8 }
        },
        {
            cl: 3, phase: "ret",
            callStack: [],
            currentScope: null,
            msg: "'return result' sends value 8 to the caller. Stack frame is destroyed. Control returns to line 6.",
            vars: { answer: 8, "returned": 8 }
        },
        {
            cl: 7, phase: "ret",
            callStack: [],
            currentScope: null,
            msg: "Return value stored in 'answer'. print(answer) outputs 8 to stdout.",
            vars: { answer: 8, "output": 8 }
        },
        {
            cl: 10, phase: "lc", callStack: [], currentScope: null,
            msg: "LeetCode uses class-based structure. 'class Solution:' wraps your methods.",
            vars: { "class": "Solution" }
        },
        {
            cl: 11, phase: "lc", callStack: [], currentScope: null,
            msg: "'self' is the instance reference (similar to 'this' in C++). It is passed automatically — treat remaining parameters as the actual inputs.",
            vars: { "self": "instance ref (ignore)", "nums": "List[int]", "target": "int" }
        },
        {
            cl: 16, phase: "done", callStack: [], currentScope: null,
            msg: "Summary: 'def' to define, parameters in (). Return value via 'return'. On LeetCode, ignore 'self'.",
            vars: { "Key": "def, return, self (ignore)" }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Functions", color: "#8b5cf6",
        content: `## Function Definition & Invocation

### Syntax
\`\`\`python
def function_name(param1, param2):
    # function body (indented)
    return value
\`\`\`

### Key Concepts
- **Parameters**: variables in the definition (formal parameters)
- **Arguments**: values passed during invocation (actual arguments)
- **Return**: sends a value back to the caller; if omitted, returns \`None\`
- **Scope**: local variables exist only within the function

### LeetCode Pattern
\`\`\`python
class Solution:
    def solve(self, nums: List[int]) -> int:
        # self = instance ref (ignore it)
        # code goes here
        return result
\`\`\`

### Default Parameters
\`\`\`python
def greet(name, msg="Hello"):
    return f"{msg}, {name}"
\`\`\``
    }
];

export default function PyFunctions() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2500);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Functions" subtitle="Python Refresher · Lesson 8 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="functions.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="Call Stack">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", minHeight: "80px", justifyContent: "center" }}>
                    {step.callStack.length === 0 && !step.currentScope ? (
                        <span style={{ color: theme.textDim, fontSize: "0.85rem", fontFamily: "monospace" }}>
                            {step.phase === "ret" ? "Stack frame destroyed — value returned to caller" : step.phase === "lc" ? "LeetCode class method structure" : "No active stack frame"}
                        </span>
                    ) : (
                        <>
                            {step.currentScope && (
                                <div style={{
                                    padding: "16px 24px", borderRadius: "14px",
                                    background: isDark ? `${pc}10` : `${pc}08`,
                                    border: `3px solid ${pc}`,
                                    textAlign: "center", minWidth: "200px",
                                }}>
                                    <div style={{ fontSize: "0.65rem", fontWeight: "800", color: pc, marginBottom: "8px", fontFamily: "monospace" }}>
                                        FRAME: {step.currentScope.name}()
                                    </div>
                                    <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                                        {Object.entries(step.currentScope).filter(([k]) => k !== "name").map(([k, v]) => (
                                            <div key={k} style={{ textAlign: "center" }}>
                                                <div style={{ fontSize: "0.6rem", color: theme.textDim, fontWeight: "700", fontFamily: "monospace" }}>{k}</div>
                                                <div style={{ fontSize: "1.3rem", fontWeight: "900", color: pc, fontFamily: "monospace" }}>{v}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {step.phase === "ret" && step.vars.returned !== undefined && (
                        <div style={{
                            padding: "10px 30px", borderRadius: "14px",
                            background: "#10b98118", border: "3px solid #10b981",
                            fontWeight: "900", fontSize: "1.1rem", color: "#10b981", fontFamily: "monospace",
                        }}>
                            return → {step.vars.returned}
                        </div>
                    )}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
