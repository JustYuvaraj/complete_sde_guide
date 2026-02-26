import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_STR = "52";

const CODE = [
    { id: 0, text: `string largestOddNumber(string num) {` },
    { id: 1, text: `    for (int i = num.size()-1; i >= 0; i--) {` },
    { id: 2, text: `        if ((num[i] - '0') % 2 != 0)` },
    { id: 3, text: `            return num.substr(0, i+1);` },
    { id: 4, text: `    }` },
    { id: 5, text: `    return "";` },
    { id: 6, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", checkEven: "#f59e0b", foundOdd: "#10b981", done: "#10b981", empty: "#ef4444",
};
const PHASE_LABELS = {
    init: "INITIALIZE", checkEven: "EVEN → SKIP", foundOdd: "ODD FOUND ✓", done: "DONE ✓", empty: "NO ODD ✗",
};

function generateSteps(num) {
    const steps = [];

    steps.push({
        cl: 0, phase: "init", chars: [...num], activeIdx: -1, result: null,
        msg: `Scan from right to find first odd digit`,
        vars: { "num.size": num.length },
    });

    for (let i = num.length - 1; i >= 0; i--) {
        const d = parseInt(num[i]);
        const isOdd = d % 2 !== 0;

        if (isOdd) {
            steps.push({
                cl: 3, phase: "foundOdd", chars: [...num], activeIdx: i, result: num.substring(0, i + 1),
                msg: `🟢 '${num[i]}' is odd! Return "${num.substring(0, i + 1)}"`,
                vars: { i, digit: num[i], "return": `"${num.substring(0, i + 1)}"` },
            });
            return steps;
        }

        steps.push({
            cl: 2, phase: "checkEven", chars: [...num], activeIdx: i, result: null,
            msg: `'${num[i]}' is even → skip`,
            vars: { i, digit: num[i], odd: "false" },
        });
    }

    steps.push({
        cl: 5, phase: "empty", chars: [...num], activeIdx: -1, result: "",
        msg: `No odd digits found → return ""`,
        vars: { "return": '""' },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 1903 — Largest Odd Number in String

**Difficulty:** Easy &nbsp; **Topics:** String, Math, Greedy

---

Given a string \`num\` representing a large integer, return the **largest-valued odd number** that is a non-empty substring. If no odd number exists, return empty string.

---

### Examples
\`\`\`
Input:  num = "52"
Output: "5"
\`\`\`
\`\`\`
Input:  num = "4206"
Output: ""  (no odd digits)
\`\`\`
\`\`\`
Input:  num = "35427"
Output: "35427"  (already ends with odd)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Scan from Right

### Key Insight
A number is odd if its **last digit is odd**. So we want to find the rightmost odd digit and return everything up to (and including) it.

### Why scan from right?
- We want the **largest** odd number
- A number is larger when it has more digits
- So take as many digits as possible from the left, ending at the rightmost odd digit`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single reverse scan |
| **Space** | **O(1)** | Just return a substring |`
    }
];

export default function LargestOddNumber() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_STR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_STR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const s = inputText.trim();
        if (!s || s.length > 15 || !/^\d+$/.test(s)) return;
        setSteps(generateSteps(s)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_STR);
        setSteps(generateSteps(DEFAULT_STR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Largest Odd Number in String" subtitle="LC #1903 · Greedy Right Scan">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="52" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="largest_odd_number.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`🔢 Number Digits${step.result !== null ? ` · Result: "${step.result}"` : ""}`}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.chars.map((ch, i) => {
                        const isActive = step.activeIdx === i;
                        const d = parseInt(ch);
                        const isOdd = d % 2 !== 0;
                        const inResult = step.result && i < step.result.length;
                        return (
                            <div key={i} style={{
                                width: "48px", height: "58px", borderRadius: "12px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: inResult ? "#10b98118"
                                    : isActive ? `${pc}15`
                                        : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${inResult ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 12px ${pc}40` : "none",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900", fontFamily: "monospace",
                                    color: inResult ? "#10b981" : isActive ? pc : theme.text,
                                }}>{ch}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "700",
                                    color: isOdd ? "#10b981" : "#ef4444",
                                }}>{isOdd ? "odd" : "even"}</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
