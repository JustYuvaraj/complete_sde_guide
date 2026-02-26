import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_STR = "RLRRLLRLRL";

const CODE = [
    { id: 0, text: `int balancedStringSplit(string s) {` },
    { id: 1, text: `    int count = 0, balance = 0;` },
    { id: 2, text: `    for (char c : s) {` },
    { id: 3, text: `        if (c == 'R') balance++;` },
    { id: 4, text: `        else balance--;` },
    { id: 5, text: `        if (balance == 0) count++;` },
    { id: 6, text: `    }` },
    { id: 7, text: `    return count;` },
    { id: 8, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", R: "#3b82f6", L: "#f59e0b", split: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", R: "R → BALANCE++", L: "L → BALANCE--", split: "BALANCED! ✓", done: "DONE ✓",
};

function generateSteps(s) {
    const steps = [];
    let count = 0, balance = 0;

    steps.push({
        cl: 1, phase: "init", chars: [...s], activeIdx: -1, balance: 0, count: 0,
        splits: [],
        msg: `Track balance: R → +1, L → −1. Split when balance = 0`,
        vars: { count: 0, balance: 0 },
    });

    const splits = [];
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "R") balance++;
        else balance--;

        const isSplit = balance === 0;
        if (isSplit) {
            count++;
            splits.push(i);
        }

        steps.push({
            cl: isSplit ? 5 : (c === "R" ? 3 : 4),
            phase: isSplit ? "split" : c,
            chars: [...s], activeIdx: i, balance, count,
            splits: [...splits],
            msg: isSplit
                ? `balance = 0 → SPLIT! count = ${count}`
                : `'${c}' → balance = ${balance}`,
            vars: { i, char: `'${c}'`, balance, count },
        });
    }

    steps.push({
        cl: 7, phase: "done", chars: [...s], activeIdx: -1, balance, count,
        splits: [...splits],
        msg: `🟢 Total balanced splits = ${count}`,
        vars: { "return": count },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 1221 — Split a String in Balanced Strings

**Difficulty:** Easy &nbsp; **Topics:** String, Greedy

---

A **balanced** string has an equal number of \`'L'\` and \`'R'\` characters. Given a balanced string \`s\`, split it into the **maximum number** of balanced substrings.

---

### Examples
\`\`\`
Input:  s = "RLRRLLRLRL"
Output: 4  → "RL", "RRLL", "RL", "RL"
\`\`\`
\`\`\`
Input:  s = "RLRRRLLRLL"
Output: 2  → "RL", "RRRLLRLL"
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Greedy Balance Counter

### Key Insight
Use a **balance counter**: R adds 1, L subtracts 1. Every time balance hits 0, we found a balanced split!

### Why greedy?
Split as **early** as possible. When balance = 0, immediately count a split. This gives the maximum number of splits.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
int balancedStringSplit(string s) {
    int count = 0, balance = 0;
    for (char c : s) {
        if (c == 'R') balance++;
        else balance--;
        if (balance == 0) count++;
    }
    return count;
}
\`\`\`

## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Two variables |`
    }
];

export default function BalancedStringSplit() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_STR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_STR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 900);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const s = inputText.trim().toUpperCase();
        if (!s || s.length > 20 || !/^[RL]+$/.test(s)) return;
        setSteps(generateSteps(s)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_STR);
        setSteps(generateSteps(DEFAULT_STR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Balanced String Split" subtitle="LC #1221 · Greedy Balance Counter">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText} onChange={setInputText}
                onRun={handleRun} onReset={handleReset}
                placeholder="RLRRLLRLRL"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="balanced_string_split.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* String visualization with split markers */}
            <VizCard title={`📊 Balance Tracker · splits = ${step.count}`}>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
                    {step.chars.map((ch, i) => {
                        const isActive = step.activeIdx === i;
                        const isSplitPoint = step.splits.includes(i);
                        const isR = ch === "R";
                        return (
                            <div key={i} style={{ display: "flex", alignItems: "flex-end" }}>
                                <div style={{
                                    width: "42px", display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center", gap: "2px",
                                }}>
                                    <div style={{
                                        width: "42px", height: "52px", borderRadius: "10px",
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                        background: isSplitPoint ? "#10b98118"
                                            : isActive ? `${isR ? "#3b82f6" : "#f59e0b"}15`
                                                : (isDark ? "#0f172a" : "#f1f5f9"),
                                        border: `2px solid ${isSplitPoint ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                        transition: "all 0.3s ease",
                                        transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                        boxShadow: isActive ? `0 4px 12px ${pc}40` : "none",
                                    }}>
                                        <span style={{
                                            fontSize: "1.2rem", fontWeight: "900", fontFamily: "monospace",
                                            color: isR ? "#3b82f6" : "#f59e0b",
                                        }}>{ch}</span>
                                        <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                                    </div>
                                </div>
                                {isSplitPoint && i < step.chars.length - 1 && (
                                    <div style={{
                                        width: "3px", height: "56px", background: "#10b981",
                                        borderRadius: "2px", margin: "0 2px",
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "10px", fontSize: "0.7rem", color: theme.textDim }}>
                    🔵 R (+1) &nbsp; 🟡 L (−1) &nbsp; 🟢 Split point (balance = 0)
                </div>
            </VizCard>

            {/* Balance meter */}
            <VizCard title={`⚖️ Balance = ${step.balance}`}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: "700" }}>L</span>
                    <div style={{
                        width: "200px", height: "24px", borderRadius: "12px",
                        background: isDark ? "#1e293b" : "#e2e8f0",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute",
                            left: "50%", top: "0", height: "100%",
                            width: `${Math.abs(step.balance) * 15}px`,
                            marginLeft: step.balance > 0 ? "0" : `-${Math.abs(step.balance) * 15}px`,
                            background: step.balance === 0 ? "#10b981" : step.balance > 0 ? "#3b82f6" : "#f59e0b",
                            transition: "all 0.3s ease", borderRadius: "12px",
                        }} />
                        <div style={{
                            position: "absolute", left: "50%", top: "0", width: "2px",
                            height: "100%", background: theme.textDim, opacity: 0.5,
                        }} />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "700" }}>R</span>
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
