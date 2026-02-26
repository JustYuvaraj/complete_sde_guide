import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_S = "abcdefg";
const DEFAULT_K = 2;

const CODE = [
    { id: 0, text: `string reverseStr(string s, int k) {` },
    { id: 1, text: `    for (int i = 0; i < s.size(); i += 2*k) {` },
    { id: 2, text: `        int left = i;` },
    { id: 3, text: `        int right = min((int)s.size()-1, i+k-1);` },
    { id: 4, text: `        while (left < right) {` },
    { id: 5, text: `            swap(s[left], s[right]);` },
    { id: 6, text: `            left++; right--;` },
    { id: 7, text: `        }` },
    { id: 8, text: `    }` },
    { id: 9, text: `    return s;` },
    { id: 10, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", selectChunk: "#3b82f6", swap: "#f59e0b", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", selectChunk: "SELECT CHUNK", swap: "SWAP", done: "DONE ✓",
};

function generateSteps(s, k) {
    const steps = [];
    const chars = [...s];

    steps.push({
        cl: 0, phase: "init", chars: [...chars], k, left: -1, right: -1, chunkStart: -1,
        msg: `Reverse first ${k} chars of every 2×${k} = ${2 * k} chunk`,
        vars: { k, "2k": 2 * k, "s.length": s.length },
    });

    for (let i = 0; i < chars.length; i += 2 * k) {
        let left = i;
        let right = Math.min(chars.length - 1, i + k - 1);

        steps.push({
            cl: 1, phase: "selectChunk", chars: [...chars], k, left, right, chunkStart: i,
            msg: `Chunk starting at ${i}: reverse chars[${left}..${right}]`,
            vars: { i, left, right },
        });

        while (left < right) {
            [chars[left], chars[right]] = [chars[right], chars[left]];
            steps.push({
                cl: 5, phase: "swap", chars: [...chars], k, left, right, chunkStart: i,
                msg: `swap('${chars[right]}', '${chars[left]}') → left=${left + 1}, right=${right - 1}`,
                vars: { left, right, [`s[${left}]`]: chars[left], [`s[${right}]`]: chars[right] },
            });
            left++;
            right--;
        }
    }

    steps.push({
        cl: 9, phase: "done", chars: [...chars], k, left: -1, right: -1, chunkStart: -1,
        msg: `🟢 Result: "${chars.join("")}"`,
        vars: { "return": `"${chars.join("")}"` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 541 — Reverse String II

**Difficulty:** Easy &nbsp; **Topics:** String, Two Pointers

---

Given a string \`s\` and an integer \`k\`, reverse the first \`k\` characters for every \`2k\` characters counting from the start.

---

### Examples
\`\`\`
Input:  s = "abcdefg", k = 2
Output: "bacdfeg"
\`\`\`
Chunks: [ab]cd[ef]g → reverse first 2 of each group of 4`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Two Pointers per Chunk

### Algorithm
1. Jump through string in steps of 2k
2. For each jump, reverse chars from \`i\` to \`i+k-1\`
3. Use two-pointer swap within the chunk`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each char swapped at most once |
| **Space** | **O(1)** | In-place swaps |`
    }
];

export default function ReverseStringII() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_S);
    const [kText, setKText] = useState(String(DEFAULT_K));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_S, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 900);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const s = inputText.trim();
        const k = parseInt(kText);
        if (!s || s.length > 20 || isNaN(k) || k < 1) return;
        setSteps(generateSteps(s, k)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_S); setKText(String(DEFAULT_K));
        setSteps(generateSteps(DEFAULT_S, DEFAULT_K)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Reverse String II" subtitle={`LC #541 · Two Pointers · k = ${step.k}`}>
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "s:", value: inputText, onChange: setInputText, placeholder: "abcdefg", flex: "1 1 140px" },
                    { label: "k:", value: kText, onChange: setKText, placeholder: "2", flex: "0 0 50px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="reverse_string_ii.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="📝 String Chunks">
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.chars.map((ch, i) => {
                        const isLeft = step.left === i;
                        const isRight = step.right === i;
                        const isActive = isLeft || isRight;
                        const inReverseZone = step.chunkStart >= 0 && i >= step.chunkStart && i < step.chunkStart + step.k;
                        return (
                            <div key={i} style={{
                                width: "42px", height: "52px", borderRadius: "10px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: isActive ? `${pc}18` : inReverseZone ? (isDark ? "#3b82f610" : "#dbeafe") : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isLeft ? "#f59e0b" : isRight ? "#f59e0b" : inReverseZone ? "#3b82f644" : theme.cardBorder}`,
                                transition: "all 0.3s ease",
                                transform: isActive ? "scale(1.15) translateY(-4px)" : "scale(1)",
                                boxShadow: isActive ? `0 4px 12px ${pc}40` : "none",
                            }}>
                                <span style={{
                                    fontSize: "1.1rem", fontWeight: "900", fontFamily: "monospace",
                                    color: isActive ? pc : theme.text,
                                }}>{ch}</span>
                                <span style={{ fontSize: "0.45rem", fontWeight: "600", color: theme.textDim }}>
                                    {isLeft ? "L" : isRight ? "R" : `[${i}]`}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.65rem", color: theme.textDim }}>
                    🔵 Reverse zone &nbsp; 🟡 Swap pointers
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
