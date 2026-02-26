import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_JEWELS = "aA";
const DEFAULT_STONES = "aAAbbbb";

const CODE = [
    { id: 0, text: `int numJewelsInStones(string jewels, string stones) {` },
    { id: 1, text: `    unordered_set<char> jewelSet(` },
    { id: 2, text: `        jewels.begin(), jewels.end());` },
    { id: 3, text: `    int count = 0;` },
    { id: 4, text: `    for (char s : stones) {` },
    { id: 5, text: `        if (jewelSet.count(s))` },
    { id: 6, text: `            count++;` },
    { id: 7, text: `    }` },
    { id: 8, text: `    return count;` },
    { id: 9, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", check: "#f59e0b", jewel: "#10b981", notJewel: "#64748b", done: "#10b981",
};
const PHASE_LABELS = {
    init: "BUILD JEWEL SET", check: "CHECK STONE", jewel: "IS JEWEL ✓", notJewel: "NOT JEWEL", done: "DONE ✓",
};

function generateSteps(jewels, stones) {
    const steps = [];
    const jewelSet = new Set([...jewels]);
    let count = 0;

    steps.push({
        cl: 1, phase: "init", jewels, stones: [...stones], jewelSet: [...jewelSet],
        activeIdx: -1, count: 0, isJewel: null,
        msg: `Build jewel set: {${[...jewelSet].join(", ")}}`,
        vars: { jewelSet: `{${[...jewelSet].join(",")}}`, count: 0 },
    });

    for (let i = 0; i < stones.length; i++) {
        const s = stones[i];
        const found = jewelSet.has(s);
        if (found) count++;

        steps.push({
            cl: found ? 6 : 5, phase: found ? "jewel" : "notJewel",
            jewels, stones: [...stones], jewelSet: [...jewelSet],
            activeIdx: i, count, isJewel: found,
            msg: found ? `'${s}' is a jewel! count = ${count}` : `'${s}' is NOT a jewel`,
            vars: { stone: `'${s}'`, inSet: String(found), count },
        });
    }

    steps.push({
        cl: 8, phase: "done", jewels, stones: [...stones], jewelSet: [...jewelSet],
        activeIdx: -1, count, isJewel: null,
        msg: `🟢 Total jewels in stones = ${count}`,
        vars: { "return": count },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 771 — Jewels and Stones

**Difficulty:** Easy &nbsp; **Topics:** Hash Table, String

---

You're given strings \`jewels\` (types of jewels) and \`stones\` (stones you have). Each character in \`stones\` is a type of stone. Return how many of your stones are also jewels.

---

### Examples
\`\`\`
Input:  jewels = "aA", stones = "aAAbbbb"
Output: 3  (a, A, A are jewels)
\`\`\`

### Constraints
- Letters are case-sensitive: \`a\` ≠ \`A\`
- All chars in \`jewels\` are unique`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## HashSet Lookup

### Key Insight
Put all jewel types into a **HashSet** for O(1) lookup. Then scan each stone and check if it's in the set.

### Why HashSet?
- Building set: O(j) where j = jewels length
- Each lookup: O(1)
- Total: O(j + s) instead of O(j × s) with brute force`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
int numJewelsInStones(string jewels, string stones) {
    unordered_set<char> jewelSet(jewels.begin(), jewels.end());
    int count = 0;
    for (char s : stones)
        if (jewelSet.count(s)) count++;
    return count;
}
\`\`\`

## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(j + s)** | Build set + scan stones |
| **Space** | **O(j)** | Jewel set |`
    }
];

export default function JewelsAndStones() {
    const { theme, isDark } = useTheme();
    const [jewelsText, setJewelsText] = useState(DEFAULT_JEWELS);
    const [stonesText, setStonesText] = useState(DEFAULT_STONES);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_JEWELS, DEFAULT_STONES));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 900);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        if (!jewelsText || !stonesText || stonesText.length > 20) return;
        setSteps(generateSteps(jewelsText, stonesText)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setJewelsText(DEFAULT_JEWELS); setStonesText(DEFAULT_STONES);
        setSteps(generateSteps(DEFAULT_JEWELS, DEFAULT_STONES)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Jewels and Stones" subtitle="LC #771 · HashSet Lookup">
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "jewels:", value: jewelsText, onChange: setJewelsText, placeholder: "aA", flex: "0 0 80px", style: { textAlign: "center" } },
                    { label: "stones:", value: stonesText, onChange: setStonesText, placeholder: "aAAbbbb", flex: "1 1 140px" },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="jewels_and_stones.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Jewel Set */}
            <VizCard title={`💎 Jewel Set: {${step.jewelSet.join(", ")}}`}>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {step.jewelSet.map((j, i) => (
                        <div key={i} style={{
                            width: "48px", height: "48px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isDark ? "#8b5cf618" : "#f3e8ff",
                            border: "2px solid #8b5cf6", fontSize: "1.2rem", fontWeight: "900",
                            color: "#8b5cf6", fontFamily: "monospace",
                        }}>{j}</div>
                    ))}
                </div>
            </VizCard>

            {/* Stones */}
            <VizCard title={`🪨 Stones · count = ${step.count}`}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.stones.map((s, i) => {
                        const isActive = step.activeIdx === i;
                        const isJewel = step.jewelSet.includes(s);
                        const wasChecked = i < step.activeIdx || (step.phase === "done");
                        return (
                            <div key={i} style={{
                                width: "46px", height: "54px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "10px",
                                background: isActive && step.isJewel ? "#10b98118"
                                    : isActive ? `${pc}15`
                                        : wasChecked && isJewel ? "#10b98110"
                                            : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isActive ? pc : wasChecked && isJewel ? "#10b98144" : theme.cardBorder}`,
                                transition: "all 0.3s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 12px ${pc}40` : "none",
                            }}>
                                <span style={{
                                    fontSize: "1.1rem", fontWeight: "900", fontFamily: "monospace",
                                    color: isActive && step.isJewel ? "#10b981"
                                        : isActive ? pc
                                            : wasChecked && isJewel ? "#10b981"
                                                : theme.text,
                                }}>{s}</span>
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>
                                    {wasChecked && isJewel ? "💎" : ""}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
