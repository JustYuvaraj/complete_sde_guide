import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const VOWELS = new Set("aeiouAEIOU");
const DEFAULT_STR = "successes";

const CODE = [
    { id: 0, text: `int maxFreqSum(string s) {` },
    { id: 1, text: `    int freq[128] = {};` },
    { id: 2, text: `    for (char c : s) freq[c]++;` },
    { id: 3, text: `    int maxV = 0, maxC = 0;` },
    { id: 4, text: `    for (int i = 'a'; i <= 'z'; i++) {` },
    { id: 5, text: `        if (isVowel(i)) maxV = max(maxV, freq[i]);` },
    { id: 6, text: `        else maxC = max(maxC, freq[i]);` },
    { id: 7, text: `    }` },
    { id: 8, text: `    return maxV + maxC;` },
    { id: 9, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", countFreq: "#3b82f6", findMax: "#f59e0b", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", countFreq: "COUNT FREQ", findMax: "FIND MAX", done: "DONE ✓",
};

function generateSteps(s) {
    const steps = [];
    const freq = {};
    for (const c of s) freq[c] = (freq[c] || 0) + 1;

    steps.push({
        cl: 1, phase: "init", chars: [...s], freq: {}, maxV: 0, maxC: 0, activeChar: null,
        msg: `Count frequency of each character`,
        vars: { "s.length": s.length },
    });

    steps.push({
        cl: 2, phase: "countFreq", chars: [...s], freq: { ...freq }, maxV: 0, maxC: 0, activeChar: null,
        msg: `Frequencies: ${Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(", ")}`,
        vars: Object.fromEntries(Object.entries(freq).map(([k, v]) => [`freq['${k}']`, v])),
    });

    let maxV = 0, maxC = 0;
    const sortedKeys = Object.keys(freq).sort();
    for (const ch of sortedKeys) {
        const isVowel = VOWELS.has(ch);
        if (isVowel) maxV = Math.max(maxV, freq[ch]);
        else maxC = Math.max(maxC, freq[ch]);

        steps.push({
            cl: isVowel ? 5 : 6, phase: "findMax",
            chars: [...s], freq: { ...freq }, maxV, maxC, activeChar: ch,
            msg: `'${ch}' (${isVowel ? "vowel" : "consonant"}) freq=${freq[ch]} → max${isVowel ? "V" : "C"} = ${isVowel ? maxV : maxC}`,
            vars: { char: `'${ch}'`, type: isVowel ? "vowel" : "consonant", freq: freq[ch], maxV, maxC },
        });
    }

    steps.push({
        cl: 8, phase: "done", chars: [...s], freq: { ...freq }, maxV, maxC, activeChar: null,
        msg: `🟢 maxVowel(${maxV}) + maxConsonant(${maxC}) = ${maxV + maxC}`,
        vars: { maxV, maxC, "return": maxV + maxC },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 3127 — Find Most Frequent Vowel & Consonant

**Difficulty:** Easy &nbsp; **Topics:** String, Hash Table, Counting

---

Given a string \`s\`, find the **most frequent vowel** and the **most frequent consonant**. Return the **sum** of their frequencies.

---

### Examples
\`\`\`
Input:  s = "successes"
Output: 6  (most freq vowel 'e':2, most freq consonant 's':4 → 6)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Frequency Count

### Algorithm
1. Count frequency of each character
2. Find max frequency among vowels (a, e, i, o, u)
3. Find max frequency among consonants
4. Return sum of both max frequencies`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | One pass to count + one pass over 26 letters |
| **Space** | **O(1)** | Fixed size freq array (26 letters) |`
    }
];

export default function FrequentVowelConsonant() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_STR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_STR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const s = inputText.trim().toLowerCase();
        if (!s || s.length > 30 || !/^[a-z]+$/.test(s)) return;
        setSteps(generateSteps(s)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_STR);
        setSteps(generateSteps(DEFAULT_STR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Most Frequent Vowel & Consonant" subtitle="LC #3127 · Frequency Counting">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="successes" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="freq_vowel_consonant.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="📊 Character Frequencies">
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {Object.entries(step.freq).sort().map(([ch, cnt]) => {
                        const isVowel = VOWELS.has(ch);
                        const isActive = step.activeChar === ch;
                        const isMaxV = isVowel && cnt === step.maxV && step.maxV > 0;
                        const isMaxC = !isVowel && cnt === step.maxC && step.maxC > 0;
                        return (
                            <div key={ch} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                                padding: "8px 6px", borderRadius: "10px",
                                background: isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${(isMaxV || isMaxC) && step.phase === "done" ? "#10b981" : isActive ? pc : theme.cardBorder}`,
                                transition: "all 0.3s", minWidth: "44px",
                                transform: isActive ? "scale(1.1) translateY(-3px)" : "scale(1)",
                            }}>
                                <span style={{
                                    fontSize: "1rem", fontWeight: "900", fontFamily: "monospace",
                                    color: isVowel ? "#8b5cf6" : "#f59e0b",
                                }}>{ch}</span>
                                <div style={{
                                    width: "20px", height: `${cnt * 16}px`, minHeight: "8px",
                                    background: isVowel ? "#8b5cf6" : "#f59e0b",
                                    borderRadius: "4px", transition: "height 0.3s",
                                }} />
                                <span style={{ fontSize: "0.7rem", fontWeight: "800", color: theme.text }}>{cnt}</span>
                                <span style={{ fontSize: "0.5rem", color: theme.textDim }}>{isVowel ? "vowel" : "cons"}</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.65rem", color: theme.textDim }}>
                    🟣 Vowels &nbsp; 🟡 Consonants
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
