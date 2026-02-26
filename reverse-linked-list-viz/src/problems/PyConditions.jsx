import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Conditional statements` },
    { id: 1, text: `score = 75` },
    { id: 2, text: `` },
    { id: 3, text: `if score >= 90:` },
    { id: 4, text: `    grade = "A"` },
    { id: 5, text: `elif score >= 70:` },
    { id: 6, text: `    grade = "B"` },
    { id: 7, text: `elif score >= 50:` },
    { id: 8, text: `    grade = "C"` },
    { id: 9, text: `else:` },
    { id: 10, text: `    grade = "F"` },
    { id: 11, text: `` },
    { id: 12, text: `print(grade)  # "B"` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", checkA: "#3b82f6", checkB: "#f59e0b",
    checkC: "#ec4899", failAll: "#ef4444", result: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", checkA: "EVALUATE >= 90", checkB: "EVALUATE >= 70",
    checkC: "EVALUATE >= 50", failAll: "DEFAULT BRANCH", result: "ASSIGNMENT", done: "COMPLETE",
};

function generateSteps() {
    const score = 75;
    return [
        {
            cl: 1, phase: "init", score, branches: [
                { label: "score >= 90 → grade = \"A\"", active: false, passed: false },
                { label: "score >= 70 → grade = \"B\"", active: false, passed: false },
                { label: "score >= 50 → grade = \"C\"", active: false, passed: false },
                { label: "else → grade = \"F\"", active: false, passed: false },
            ], activeBranch: -1, grade: null,
            msg: `score = ${score}. Python evaluates conditions sequentially — first match executes.`,
            vars: { score }
        },
        {
            cl: 3, phase: "checkA", score, branches: [
                { label: "score >= 90 → grade = \"A\"", active: true, passed: false },
                { label: "score >= 70 → grade = \"B\"", active: false, passed: false },
                { label: "score >= 50 → grade = \"C\"", active: false, passed: false },
                { label: "else → grade = \"F\"", active: false, passed: false },
            ], activeBranch: 0, grade: null,
            msg: `Condition: ${score} >= 90 evaluates to False. Branch skipped.`,
            vars: { score, "score >= 90": "False" }
        },
        {
            cl: 5, phase: "checkB", score, branches: [
                { label: "score >= 90 → grade = \"A\"", active: false, passed: false },
                { label: "score >= 70 → grade = \"B\"", active: true, passed: true },
                { label: "score >= 50 → grade = \"C\"", active: false, passed: false },
                { label: "else → grade = \"F\"", active: false, passed: false },
            ], activeBranch: 1, grade: null,
            msg: `Condition: ${score} >= 70 evaluates to True. This branch executes.`,
            vars: { score, "score >= 70": "True" }
        },
        {
            cl: 6, phase: "result", score, branches: [
                { label: "score >= 90 → grade = \"A\"", active: false, passed: false },
                { label: "score >= 70 → grade = \"B\"", active: false, passed: true },
                { label: "score >= 50 → grade = \"C\"", active: false, passed: false },
                { label: "else → grade = \"F\"", active: false, passed: false },
            ], activeBranch: 1, grade: "B",
            msg: `grade = "B" assigned. Remaining elif/else branches are not evaluated (short-circuit).`,
            vars: { score, grade: '"B"' }
        },
        {
            cl: 12, phase: "done", score, branches: [
                { label: "score >= 90 → grade = \"A\"", active: false, passed: false },
                { label: "score >= 70 → grade = \"B\"", active: false, passed: true },
                { label: "score >= 50 → grade = \"C\"", active: false, passed: false },
                { label: "else → grade = \"F\"", active: false, passed: false },
            ], activeBranch: 1, grade: "B",
            msg: 'Output: "B". Key: only the first matching branch executes. Use elif (not multiple ifs) for mutual exclusion.',
            vars: { grade: '"B"', output: '"B"' }
        },
    ];
}

const EXPLAIN = [
    {
        icon: "📋", title: "Conditional Branching", color: "#8b5cf6",
        content: `## if / elif / else

Python evaluates conditions **sequentially**. The first branch whose condition evaluates to \`True\` is executed; all subsequent branches are skipped.

\`\`\`python
if condition1:       # evaluated first
    statement_1
elif condition2:     # only if condition1 was False
    statement_2
else:                # only if all above were False
    default_statement
\`\`\`

### Syntax Rules
- Colon \`:\` terminates each condition
- Body must be **indented** (4 spaces by convention)
- \`elif\` = "else if" — ensures mutual exclusion
- \`==\` for comparison, \`=\` for assignment

### Logical Operators
| Python | C++ Equivalent |
|---|---|
| \`and\` | \`&&\` |
| \`or\` | \`\\|\\|\` |
| \`not\` | \`!\` |`
    }
];

export default function PyConditions() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 2500);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    const BRANCH_COLORS = ["#3b82f6", "#f59e0b", "#ec4899", "#ef4444"];

    return (
        <VizLayout title="Conditional Statements" subtitle="Python Refresher · Lesson 2 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="conditions.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`Branch Evaluation · score = ${step.score}`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    <div style={{
                        padding: "8px 24px", borderRadius: "20px",
                        background: isDark ? "#8b5cf618" : "#f3e8ff",
                        border: "2px solid #8b5cf6", fontWeight: "900", fontSize: "1rem", color: "#8b5cf6", fontFamily: "monospace",
                    }}>
                        score = {step.score}
                    </div>
                    <div style={{ fontSize: "1rem", color: theme.textDim }}>↓</div>
                    {step.branches.map((br, i) => {
                        const bc = BRANCH_COLORS[i];
                        return (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "10px 20px", borderRadius: "12px", width: "320px",
                                background: br.passed ? `${bc}18` : br.active ? `${bc}10` : (isDark ? "#0f172a" : "#f8fafc"),
                                border: `3px solid ${br.passed ? bc : br.active ? bc : theme.cardBorder}`,
                                transition: "all 0.4s ease",
                                transform: br.active ? "scale(1.03)" : "scale(1)",
                            }}>
                                <span style={{
                                    width: "28px", height: "28px", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: br.passed ? bc : "transparent",
                                    border: `2px solid ${bc}`,
                                    fontSize: "0.7rem", fontWeight: "900",
                                    color: br.passed ? "white" : bc,
                                }}>
                                    {br.passed ? "✓" : br.active ? "→" : i + 1}
                                </span>
                                <span style={{
                                    fontFamily: "monospace", fontWeight: "700", fontSize: "0.8rem",
                                    color: br.passed ? bc : br.active ? bc : theme.textDim,
                                }}>{br.label}</span>
                            </div>
                        );
                    })}
                    {step.grade && (
                        <div style={{
                            marginTop: "8px", padding: "10px 30px", borderRadius: "14px",
                            background: isDark ? "#10b98118" : "#dcfce7",
                            border: "3px solid #10b981", fontWeight: "900", fontSize: "1.1rem", color: "#10b981", fontFamily: "monospace",
                        }}>
                            grade = "{step.grade}"
                        </div>
                    )}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
