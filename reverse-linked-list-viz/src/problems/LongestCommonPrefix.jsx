import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_STRS = ["flower", "flow", "flight"];

const CODE = [
    { id: 0, text: `string longestCommonPrefix(vector<string>& strs) {` },
    { id: 1, text: `    if (strs.empty()) return "";` },
    { id: 2, text: `    string prefix = strs[0];` },
    { id: 3, text: `` },
    { id: 4, text: `    for (int i = 1; i < strs.size(); i++) {` },
    { id: 5, text: `        while (strs[i].find(prefix) != 0) {` },
    { id: 6, text: `            prefix = prefix.substr(0, prefix.size()-1);` },
    { id: 7, text: `            if (prefix.empty()) return "";` },
    { id: 8, text: `        }` },
    { id: 9, text: `    }` },
    { id: 10, text: `    return prefix;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", compare: "#3b82f6", shrink: "#f59e0b", match: "#10b981", done: "#10b981", empty: "#ef4444",
};
const PHASE_LABELS = {
    init: "INITIALIZE", compare: "COMPARE", shrink: "SHRINK PREFIX", match: "MATCH ✓", done: "RESULT ✓", empty: "NO MATCH ✗",
};

function generateSteps(strs) {
    const steps = [];
    if (strs.length === 0) {
        steps.push({
            cl: 1, phase: "empty", strs, prefix: "", activeStr: -1, matchLen: 0,
            msg: `Empty input → return ""`, vars: { "return": '""' }
        });
        return steps;
    }

    let prefix = strs[0];
    steps.push({
        cl: 2, phase: "init", strs, prefix, activeStr: 0, matchLen: prefix.length,
        msg: `Start with prefix = "${prefix}" (first string)`, vars: { prefix: `"${prefix}"` }
    });

    for (let i = 1; i < strs.length; i++) {
        // Compare phase
        steps.push({
            cl: 4, phase: "compare", strs, prefix, activeStr: i, matchLen: prefix.length,
            msg: `Compare prefix "${prefix}" with strs[${i}] = "${strs[i]}"`,
            vars: { i, prefix: `"${prefix}"`, [`strs[${i}]`]: `"${strs[i]}"` }
        });

        while (strs[i].indexOf(prefix) !== 0) {
            const oldPrefix = prefix;
            prefix = prefix.substring(0, prefix.length - 1);
            steps.push({
                cl: 6, phase: "shrink", strs, prefix, activeStr: i, matchLen: prefix.length,
                msg: `"${strs[i]}" doesn't start with "${oldPrefix}" → shrink to "${prefix}"`,
                vars: { prefix: `"${prefix}"`, removed: `"${oldPrefix[oldPrefix.length - 1]}"` }
            });

            if (prefix === "") {
                steps.push({
                    cl: 7, phase: "empty", strs, prefix: "", activeStr: i, matchLen: 0,
                    msg: `Prefix empty → no common prefix → return ""`, vars: { "return": '""' }
                });
                return steps;
            }
        }

        // Match found with this string
        steps.push({
            cl: 5, phase: "match", strs, prefix, activeStr: i, matchLen: prefix.length,
            msg: `"${strs[i]}" starts with "${prefix}" ✓`, vars: { prefix: `"${prefix}"` }
        });
    }

    steps.push({
        cl: 10, phase: "done", strs, prefix, activeStr: -1, matchLen: prefix.length,
        msg: `return "${prefix}"`, vars: { "return": `"${prefix}"` }
    });
    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 14 — Longest Common Prefix

**Difficulty:** Easy \u0026nbsp; **Topics:** String, Trie

---

Write a function to find the **longest common prefix** string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.

---

### Examples

**Example 1:**
\`\`\`
Input:  strs = ["flower","flow","flight"]
Output: "fl"
\`\`\`

**Example 2:**
\`\`\`
Input:  strs = ["dog","racecar","car"]
Output: ""
Explanation: No common prefix among input strings.
\`\`\`

### Constraints
- \`1 <= strs.length <= 200\`
- \`0 <= strs[i].length <= 200\`
- \`strs[i]\` consists of only lowercase English letters`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — Start with a Guess

Take the **first string** as the initial prefix. It's the longest possible prefix.

## Step 2 — Shrink Until It Fits

For each subsequent string, check if it starts with the prefix:
- **YES** → move to the next string
- **NO** → remove the last character from prefix and check again

## Step 3 — Why This Works

We start with the maximum possible prefix and **shrink** it. Each string can only make the prefix shorter, never longer. Once we've compared against all strings, what remains IS the longest common prefix.

## Step 4 — Edge Cases

- Empty array → return \`""\`
- Single string → return itself
- No common prefix → prefix shrinks to \`""\`

## Key Takeaway
> Start with the first string as prefix. For each subsequent string, shrink the prefix until it matches. This is the "horizontal scanning" approach.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    string prefix = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.size()-1);
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}
\`\`\`

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(S)** | S = sum of all characters in all strings |
| **Space** | **O(1)** | Only the prefix string |`
    }
];

export default function LongestCommonPrefix() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_STRS.join(","));
    const [strs, setStrs] = useState(DEFAULT_STRS);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_STRS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        if (parsed.length < 1 || parsed.length > 6) return;
        setStrs(parsed); setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_STRS.join(","));
        setStrs(DEFAULT_STRS); setSteps(generateSteps(DEFAULT_STRS)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Longest Common Prefix"
            subtitle={`LC #14 · ${strs.length} strings · O(S) Time`}
        >
            <ExplainPanel sections={EXPLAIN} />

            <DualInputSection
                inputs={[
                    { label: "strs:", value: inputText, onChange: setInputText, placeholder: "flower,flow,flight", flex: "1 1 200px" },
                ]}
                onRun={handleRun}
                onReset={handleReset}
            />

            {/* Code + Variables */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="longest_prefix.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Strings Visualization */}
            <VizCard title="🔤 Strings — Character-by-Character View">
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {strs.map((str, si) => {
                        const isActive = step.activeStr === si;
                        return (
                            <div key={si} style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "4px 8px", borderRadius: "8px",
                                background: isActive ? `${pc}08` : "transparent",
                                border: `1px solid ${isActive ? `${pc}33` : "transparent"}`,
                                transition: "all 0.3s",
                            }}>
                                <span style={{
                                    fontSize: "0.6rem", fontWeight: "700", width: "50px",
                                    color: isActive ? pc : theme.textDim,
                                }}>strs[{si}]</span>
                                <div style={{ display: "flex", gap: "2px" }}>
                                    {str.split("").map((ch, ci) => {
                                        const inPrefix = ci < step.matchLen;
                                        const isEdge = ci === step.matchLen - 1 && step.phase === "shrink";
                                        return (
                                            <div key={ci} style={{
                                                width: "28px", height: "32px",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                borderRadius: "6px",
                                                background: isEdge ? (isDark ? "#f59e0b18" : "#fef3c7")
                                                    : inPrefix ? (isDark ? "#10b98112" : "#dcfce7")
                                                        : (isDark ? "#0f172a" : "#f8fafc"),
                                                border: `1.5px solid ${isEdge ? "#f59e0b" : inPrefix ? "#10b98144" : theme.cardBorder}`,
                                                fontSize: "0.8rem", fontWeight: isActive && inPrefix ? "800" : "500",
                                                color: isEdge ? "#f59e0b" : inPrefix ? "#10b981" : theme.text,
                                                transition: "all 0.3s",
                                            }}>{ch}</div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            {/* Current Prefix */}
            <VizCard title={`📌 Current Prefix: "${step.prefix}"`}>
                <div style={{ display: "flex", gap: "3px", justifyContent: "center", minHeight: "40px", alignItems: "center" }}>
                    {step.prefix ? step.prefix.split("").map((ch, i) => (
                        <div key={i} style={{
                            width: "36px", height: "40px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "8px",
                            background: step.phase === "done" ? (isDark ? "#10b98115" : "#dcfce7") : (isDark ? `${pc}15` : `${pc}10`),
                            border: `2px solid ${step.phase === "done" ? "#10b981" : pc}`,
                            fontSize: "1.1rem", fontWeight: "900",
                            color: step.phase === "done" ? "#10b981" : pc,
                            transition: "all 0.3s",
                        }}>{ch}</div>
                    )) : (
                        <span style={{ fontSize: "0.8rem", color: theme.textDim, fontStyle: "italic" }}>
                            "" (empty)
                        </span>
                    )}
                </div>
            </VizCard>

            {/* Progress */}
            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
