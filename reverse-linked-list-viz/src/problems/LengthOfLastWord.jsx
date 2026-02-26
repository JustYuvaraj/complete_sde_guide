import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_STR = "Hello World";

const CODE = [
    { id: 0, text: `int lengthOfLastWord(string s) {` },
    { id: 1, text: `    int len = 0;` },
    { id: 2, text: `    int i = s.length() - 1;` },
    { id: 3, text: `` },
    { id: 4, text: `    while (i >= 0 && s[i] == ' ')` },
    { id: 5, text: `        i--;` },
    { id: 6, text: `` },
    { id: 7, text: `    while (i >= 0 && s[i] != ' ') {` },
    { id: 8, text: `        len++;` },
    { id: 9, text: `        i--;` },
    { id: 10, text: `    }` },
    { id: 11, text: `` },
    { id: 12, text: `    return len;` },
    { id: 13, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", skipSpace: "#f59e0b", count: "#3b82f6", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", skipSpace: "SKIP TRAILING SPACES", count: "COUNT WORD", done: "DONE ✓",
};

function generateSteps(s) {
    const steps = [];
    let len = 0;
    let i = s.length - 1;

    steps.push({
        cl: 1, phase: "init", chars: [...s], activeIdx: -1, len: 0, i,
        msg: `Start from end: i = ${i}`,
        vars: { len: 0, i, "s.length": s.length },
    });

    // Skip trailing spaces
    while (i >= 0 && s[i] === " ") {
        steps.push({
            cl: 4, phase: "skipSpace", chars: [...s], activeIdx: i, len, i,
            msg: `s[${i}] = ' ' (space) → skip, i--`,
            vars: { len, i, char: "' '" },
        });
        i--;
    }

    // Count last word
    while (i >= 0 && s[i] !== " ") {
        len++;
        steps.push({
            cl: 8, phase: "count", chars: [...s], activeIdx: i, len, i,
            msg: `s[${i}] = '${s[i]}' → len = ${len}`,
            vars: { len, i, char: `'${s[i]}'` },
        });
        i--;
    }

    steps.push({
        cl: 12, phase: "done", chars: [...s], activeIdx: -1, len, i,
        msg: `🟢 Length of last word = ${len}`,
        vars: { "return": len },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 58 — Length of Last Word

**Difficulty:** Easy &nbsp; **Topics:** String

---

Given a string \`s\` consisting of words and spaces, return the **length of the last word** in the string. A word is a maximal substring consisting of non-space characters only.

---

### Examples

**Example 1:**
\`\`\`
Input:  s = "Hello World"
Output: 5  ("World" has length 5)
\`\`\`

**Example 2:**
\`\`\`
Input:  s = "   fly me   to   the moon  "
Output: 4  ("moon" has length 4)
\`\`\`

### Constraints
- \`1 <= s.length <= 10⁴\`
- \`s\` consists of English letters and spaces \`' '\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Scan from the End

### Key Insight
Start from the **end** of the string. First skip any trailing spaces, then count characters until you hit a space or the beginning.

### Algorithm
1. Set pointer \`i\` to last index
2. Skip all trailing spaces
3. Count non-space characters → that's the last word length

### Why from the end?
- We only care about the **last** word
- No need to scan the entire string
- O(n) worst case but often much faster`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
int lengthOfLastWord(string s) {
    int len = 0;
    int i = s.length() - 1;
    while (i >= 0 && s[i] == ' ') i--;
    while (i >= 0 && s[i] != ' ') { len++; i--; }
    return len;
}
\`\`\`

## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single reverse scan |
| **Space** | **O(1)** | Two variables |`
    }
];

export default function LengthOfLastWord() {
    const { theme } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_STR);
    const [str, setStr] = useState(DEFAULT_STR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_STR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        if (!inputText || inputText.length > 40) return;
        setStr(inputText);
        setSteps(generateSteps(inputText)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_STR); setStr(DEFAULT_STR);
        setSteps(generateSteps(DEFAULT_STR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Length of Last Word" subtitle="LC #58 · Reverse Scan">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText} onChange={setInputText}
                onRun={handleRun} onReset={handleReset}
                placeholder="Hello World"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="length_of_last_word.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`📝 String · len = ${step.len}`}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.chars.map((ch, i) => {
                        const isActive = step.activeIdx === i;
                        const isCounted = step.phase === "count" && i > step.i && i <= step.activeIdx;
                        const isDone = step.phase === "done" && i > step.i;
                        return (
                            <div key={i} style={{
                                width: "42px", height: "52px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "10px",
                                background: isDone ? "#10b98118" : isActive ? `${pc}15` : (theme.isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isDone ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 16px ${pc}40` : "none",
                            }}>
                                <span style={{
                                    fontSize: "1.1rem", fontWeight: "900",
                                    color: isDone ? "#10b981" : isActive ? pc : theme.text,
                                    fontFamily: "monospace",
                                }}>{ch === " " ? "␣" : ch}</span>
                                <span style={{ fontSize: "0.45rem", fontWeight: "600", color: theme.textDim }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
