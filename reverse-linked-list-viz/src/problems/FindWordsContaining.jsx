import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_WORDS = ["leet", "code", "lee"];
const DEFAULT_CHAR = "e";

const CODE = [
    { id: 0, text: `vector<int> findWordsContaining(vector<string>& words, char x) {` },
    { id: 1, text: `    vector<int> result;` },
    { id: 2, text: `    for (int i = 0; i < words.size(); i++) {` },
    { id: 3, text: `        for (char c : words[i]) {` },
    { id: 4, text: `            if (c == x) {` },
    { id: 5, text: `                result.push_back(i);` },
    { id: 6, text: `                break;` },
    { id: 7, text: `            }` },
    { id: 8, text: `        }` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return result;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", scan: "#f59e0b", found: "#10b981", miss: "#ef4444", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", scan: "SCANNING WORD", found: "CHAR FOUND ✓", miss: "NOT FOUND ✗", done: "DONE ✓",
};

function generateSteps(words, x) {
    const steps = [];
    const result = [];

    steps.push({
        cl: 1, phase: "init", words, x, activeWord: -1, activeChar: -1,
        result: [], foundInWord: null,
        msg: `Find all words containing '${x}'`,
        vars: { x: `'${x}'`, "result.size": 0 },
    });

    for (let i = 0; i < words.length; i++) {
        let found = false;
        for (let j = 0; j < words[i].length; j++) {
            if (words[i][j] === x) {
                found = true;
                result.push(i);
                steps.push({
                    cl: 5, phase: "found", words, x, activeWord: i, activeChar: j,
                    result: [...result], foundInWord: true,
                    msg: `words[${i}] = "${words[i]}" contains '${x}' at pos ${j} → add index ${i}`,
                    vars: { i, word: `"${words[i]}"`, "result": `[${result.join(",")}]` },
                });
                break;
            }
        }
        if (!found) {
            steps.push({
                cl: 9, phase: "miss", words, x, activeWord: i, activeChar: -1,
                result: [...result], foundInWord: false,
                msg: `words[${i}] = "${words[i]}" does NOT contain '${x}'`,
                vars: { i, word: `"${words[i]}"`, "result": `[${result.join(",")}]` },
            });
        }
    }

    steps.push({
        cl: 10, phase: "done", words, x, activeWord: -1, activeChar: -1,
        result: [...result], foundInWord: null,
        msg: `🟢 Result = [${result.join(", ")}]`,
        vars: { "return": `[${result.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 2942 — Find Words Containing Character

**Difficulty:** Easy &nbsp; **Topics:** Array, String

---

Given a **0-indexed** array of strings \`words\` and a character \`x\`, return an array of indices representing the words that contain the character \`x\`.

---

### Examples
\`\`\`
Input:  words = ["leet","code"], x = "e"
Output: [0, 1]  (both contain 'e')
\`\`\`
\`\`\`
Input:  words = ["abc","bcd","aaaa","cbc"], x = "a"
Output: [0, 2]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Simple Scan

### Algorithm
1. For each word, scan its characters
2. If target char found → add word's index to result, break
3. Return result array

### Straightforward but important
This is the basis for string search problems. The "break early" pattern saves time.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
vector<int> findWordsContaining(vector<string>& words, char x) {
    vector<int> result;
    for (int i = 0; i < words.size(); i++)
        for (char c : words[i])
            if (c == x) { result.push_back(i); break; }
    return result;
}
\`\`\`

## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n·m)** | n words, avg m chars each |
| **Space** | **O(1)** | Output not counted |`
    }
];

export default function FindWordsContaining() {
    const { theme, isDark } = useTheme();
    const [wordsText, setWordsText] = useState(DEFAULT_WORDS.join(","));
    const [charText, setCharText] = useState(DEFAULT_CHAR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_WORDS, DEFAULT_CHAR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = wordsText.split(",").map(s => s.trim()).filter(Boolean);
        const ch = charText.trim();
        if (!parsed.length || parsed.length > 8 || ch.length !== 1) return;
        setSteps(generateSteps(parsed, ch)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setWordsText(DEFAULT_WORDS.join(",")); setCharText(DEFAULT_CHAR);
        setSteps(generateSteps(DEFAULT_WORDS, DEFAULT_CHAR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Find Words Containing Character" subtitle="LC #2942 · String Search">
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "words:", value: wordsText, onChange: setWordsText, placeholder: "leet,code,lee", flex: "1 1 180px" },
                    { label: "char:", value: charText, onChange: setCharText, placeholder: "e", flex: "0 0 50px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="find_words_containing.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`📝 Words · Looking for '${step.x}'`}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.words.map((word, i) => {
                        const isActive = step.activeWord === i;
                        const isResult = step.result.includes(i);
                        return (
                            <div key={i} style={{
                                padding: "10px 16px",
                                borderRadius: "12px",
                                background: isResult ? (isDark ? "#10b98118" : "#dcfce7")
                                    : isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isResult ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s ease",
                                transform: isActive ? "scale(1.1) translateY(-3px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 12px ${pc}40` : "none",
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: "1rem", fontWeight: "800", color: isResult ? "#10b981" : isActive ? pc : theme.text, fontFamily: "monospace" }}>
                                    {[...word].map((ch, j) => (
                                        <span key={j} style={{
                                            color: ch === step.x ? (isActive || isResult ? "#10b981" : "#f59e0b") : undefined,
                                            textDecoration: ch === step.x ? "underline" : "none",
                                            fontWeight: ch === step.x ? "900" : "600",
                                        }}>{ch}</span>
                                    ))}
                                </div>
                                <div style={{ fontSize: "0.55rem", color: theme.textDim, marginTop: "4px" }}>
                                    [{i}] {isResult ? "✅" : ""}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <VizCard title={`📤 Result: [${step.result.join(", ")}]`}>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", minHeight: "40px", alignItems: "center" }}>
                    {step.result.length === 0 ? (
                        <span style={{ color: theme.textDim, fontSize: "0.85rem" }}>Empty</span>
                    ) : step.result.map((val, i) => (
                        <div key={i} style={{
                            width: "40px", height: "40px", borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isDark ? "#10b98118" : "#dcfce7",
                            border: "2px solid #10b981", fontWeight: "900", color: "#10b981",
                        }}>{val}</div>
                    ))}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
