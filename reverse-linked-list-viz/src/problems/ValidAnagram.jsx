import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_S = "anagram";
const DEFAULT_T = "nagaram";

/* ━━━ C++ Code Lines ━━━ */
const CODE = [
    { id: 0, text: `bool isAnagram(string s, string t) {` },
    { id: 1, text: `    if (s.size() != t.size()) return false;` },
    { id: 2, text: `    int count[26] = {0};` },
    { id: 3, text: `` },
    { id: 4, text: `    for (int i = 0; i < s.size(); i++) {` },
    { id: 5, text: `        count[s[i] - 'a']++;` },
    { id: 6, text: `        count[t[i] - 'a']--;` },
    { id: 7, text: `    }` },
    { id: 8, text: `` },
    { id: 9, text: `    for (int c : count)` },
    { id: 10, text: `        if (c != 0) return false;` },
    { id: 11, text: `    return true;` },
    { id: 12, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    lenCheck: "#6366f1",
    countS: "#3b82f6",
    countT: "#f59e0b",
    verify: "#22d3ee",
    pass: "#10b981",
    fail: "#ef4444",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    lenCheck: "LENGTH CHECK",
    countS: "COUNT s[i]++",
    countT: "COUNT t[i]--",
    verify: "VERIFY COUNTS",
    pass: "ANAGRAM ✓",
    fail: "NOT ANAGRAM ✗",
};

/* ━━━ Step Generator ━━━ */
function generateSteps(s, t) {
    const steps = [];
    const count = new Array(26).fill(0);

    // Length check
    steps.push({
        cl: 1, phase: "lenCheck",
        s, t, count: [...count],
        activeI: -1, activeCharS: null, activeCharT: null,
        hlCount: [],
        msg: `s.size() = ${s.length}, t.size() = ${t.length} → ${s.length === t.length ? "equal, continue" : "NOT equal → return false"}`,
        vars: { "s.size": s.length, "t.size": t.length },
    });

    if (s.length !== t.length) {
        steps.push({
            cl: 1, phase: "fail",
            s, t, count: [...count],
            activeI: -1, activeCharS: null, activeCharT: null, hlCount: [],
            msg: `Different lengths → cannot be anagrams → return false`,
            vars: { "return": "false" },
        });
        return steps;
    }

    // Init count array
    steps.push({
        cl: 2, phase: "init",
        s, t, count: [...count],
        activeI: -1, activeCharS: null, activeCharT: null, hlCount: [],
        msg: `Create count[26] array, all zeros`,
        vars: { "count[]": "all 0s" },
    });

    // Count loop
    for (let i = 0; i < s.length; i++) {
        const sIdx = s.charCodeAt(i) - 97;
        const tIdx = t.charCodeAt(i) - 97;

        // Increment s[i]
        count[sIdx]++;
        steps.push({
            cl: 5, phase: "countS",
            s, t, count: [...count],
            activeI: i, activeCharS: s[i], activeCharT: null,
            hlCount: [sIdx],
            msg: `count['${s[i]}']++ → count[${sIdx}] = ${count[sIdx]}`,
            vars: { i, "s[i]": s[i], [`count['${s[i]}']`]: count[sIdx] },
        });

        // Decrement t[i]
        count[tIdx]--;
        steps.push({
            cl: 6, phase: "countT",
            s, t, count: [...count],
            activeI: i, activeCharS: null, activeCharT: t[i],
            hlCount: [tIdx],
            msg: `count['${t[i]}']-- → count[${tIdx}] = ${count[tIdx]}`,
            vars: { i, "t[i]": t[i], [`count['${t[i]}']`]: count[tIdx] },
        });
    }

    // Verify all zeros
    const allZero = count.every(c => c === 0);
    const nonZero = count.map((c, i) => c !== 0 ? i : -1).filter(i => i >= 0);

    steps.push({
        cl: allZero ? 11 : 10,
        phase: allZero ? "pass" : "fail",
        s, t, count: [...count],
        activeI: -1, activeCharS: null, activeCharT: null,
        hlCount: nonZero,
        msg: allZero
            ? `All counts are 0 → "${s}" is an anagram of "${t}" → return true`
            : `Non-zero counts found → NOT an anagram → return false`,
        vars: { "return": allZero ? "true" : "false" },
    });

    return steps;
}

/* ━━━ Explain Panel ━━━ */
const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 242 — Valid Anagram

**Difficulty:** Easy \u0026nbsp; **Topics:** Hash Table, String, Sorting

---

Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word formed by rearranging the letters of another word, using all the original letters exactly once.

---

### Examples

**Example 1:**
\`\`\`
Input:  s = "anagram", t = "nagaram"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input:  s = "rat", t = "car"
Output: false
\`\`\`

### Constraints
- \`1 <= s.length, t.length <= 5 × 10⁴\`
- \`s\` and \`t\` consist of lowercase English letters`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Step 1 — What Makes Two Strings Anagrams?

Same characters, same frequencies, different order. So the core question is: **do both strings have identical character counts?**

## Step 2 — The Counting Trick

Use a single count array of size 26 (one per letter):
- For each character in \`s\`: **increment** its count
- For each character in \`t\`: **decrement** its count
- If all counts end at 0 → anagram!

## Step 3 — Why One Array is Enough

Instead of two frequency maps, we use **one array with ++ and --**:
- \`s\` adds +1 per char
- \`t\` subtracts -1 per char
- If they cancel out to 0 → same frequencies!

## Step 4 — Edge Case

If \`s.length != t.length\` → immediately \`false\`. Different lengths can never be anagrams.

## Key Takeaway
> For anagram/frequency problems, use a **count array** (size 26 for lowercase). Increment for one input, decrement for the other. All zeros = match.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int count[26] = {0};
    for (int i = 0; i < s.size(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int c : count)
        if (c != 0) return false;
    return true;
}
\`\`\`

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass through both strings |
| **Space** | **O(1)** | Fixed 26-element array |

## Follow-up: Unicode?
If inputs contain unicode, use a **hash map** instead of a fixed array.`
    }
];

/* ━━━ Main Component ━━━ */
export default function ValidAnagram() {
    const { theme, isDark } = useTheme();
    const [inputS, setInputS] = useState(DEFAULT_S);
    const [inputT, setInputT] = useState(DEFAULT_T);
    const [s, setS] = useState(DEFAULT_S);
    const [t, setT] = useState(DEFAULT_T);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_S, DEFAULT_T));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const sv = inputS.trim().toLowerCase();
        const tv = inputT.trim().toLowerCase();
        if (!sv || !tv || sv.length > 12 || tv.length > 12) return;
        setS(sv); setT(tv);
        const st = generateSteps(sv, tv);
        setSteps(st); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputS(DEFAULT_S); setInputT(DEFAULT_T);
        setS(DEFAULT_S); setT(DEFAULT_T);
        setSteps(generateSteps(DEFAULT_S, DEFAULT_T));
        setIdx(0); setPlaying(false);
    }

    /* Which letters are used */
    const usedLetters = new Set();
    for (const c of s) usedLetters.add(c.charCodeAt(0) - 97);
    for (const c of t) usedLetters.add(c.charCodeAt(0) - 97);
    const Letters = [...usedLetters].sort((a, b) => a - b);

    return (
        <VizLayout
            title="Valid Anagram"
            subtitle={`LC #242 · s = "${s}", t = "${t}" · O(n) Time · O(1) Space`}
        >
            <ExplainPanel sections={EXPLAIN} />

            {/* Dual input */}
            <DualInputSection
                inputs={[
                    { label: "s:", value: inputS, onChange: setInputS, placeholder: "anagram" },
                    { label: "t:", value: inputT, onChange: setInputT, placeholder: "nagaram" },
                ]}
                onRun={handleRun}
                onReset={handleReset}
            />

            {/* ━━━ Code Panel + Variables ━━━ */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="valid_anagram.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Strings: s and t ━━━ */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                {/* String s */}
                <VizCard title={`🔤 String s = "${s}"`}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                        {s.split("").map((ch, i) => {
                            const isActive = step.activeI === i && step.activeCharS;
                            const isPast = step.activeI > i;
                            return (
                                <div key={i} style={{
                                    width: "38px", height: "44px",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    borderRadius: "8px",
                                    background: isActive ? (isDark ? "#3b82f618" : "#dbeafe") : (isDark ? "#0f172a" : "#f1f5f9"),
                                    border: `2px solid ${isActive ? "#3b82f6" : isPast ? "#3b82f633" : theme.cardBorder}`,
                                    transition: "all 0.3s",
                                    transform: isActive ? "scale(1.15) translateY(-3px)" : "scale(1)",
                                    boxShadow: isActive ? "0 4px 16px #3b82f640" : "none",
                                }}>
                                    <span style={{
                                        fontSize: "1rem", fontWeight: "900",
                                        color: isActive ? "#3b82f6" : theme.text,
                                    }}>{ch}</span>
                                    <span style={{ fontSize: "0.4rem", color: theme.textDim }}>[{i}]</span>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>

                {/* String t */}
                <VizCard title={`🔤 String t = "${t}"`}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                        {t.split("").map((ch, i) => {
                            const isActive = step.activeI === i && step.activeCharT;
                            const isPast = step.activeI > i;
                            return (
                                <div key={i} style={{
                                    width: "38px", height: "44px",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    borderRadius: "8px",
                                    background: isActive ? (isDark ? "#f59e0b18" : "#fef3c7") : (isDark ? "#0f172a" : "#f1f5f9"),
                                    border: `2px solid ${isActive ? "#f59e0b" : isPast ? "#f59e0b33" : theme.cardBorder}`,
                                    transition: "all 0.3s",
                                    transform: isActive ? "scale(1.15) translateY(-3px)" : "scale(1)",
                                    boxShadow: isActive ? "0 4px 16px #f59e0b40" : "none",
                                }}>
                                    <span style={{
                                        fontSize: "1rem", fontWeight: "900",
                                        color: isActive ? "#f59e0b" : theme.text,
                                    }}>{ch}</span>
                                    <span style={{ fontSize: "0.4rem", color: theme.textDim }}>[{i}]</span>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>
            </div>

            {/* ━━━ Count Array ━━━ */}
            <VizCard title="📊 Frequency Count Array (only used letters shown)">
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                    {Letters.map(letterIdx => {
                        const val = step.count[letterIdx];
                        const isHl = step.hlCount.includes(letterIdx);
                        const isZero = val === 0;
                        const isPositive = val > 0;
                        const isNegative = val < 0;
                        const isDone = step.phase === "pass";
                        const isFail = step.phase === "fail" && !isZero;
                        return (
                            <div key={letterIdx} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                            }}>
                                <div style={{
                                    width: "40px", height: "44px",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    borderRadius: "8px",
                                    background: isDone ? (isDark ? "#10b98112" : "#dcfce7")
                                        : isFail ? (isDark ? "#ef444412" : "#fee2e2")
                                            : isHl ? (isDark ? `${pc}18` : `${pc}10`)
                                                : (isDark ? "#0f172a" : "#f8fafc"),
                                    border: `2px solid ${isDone ? "#10b981"
                                        : isFail ? "#ef4444"
                                            : isHl ? pc
                                                : isPositive ? "#3b82f644"
                                                    : isNegative ? "#ef444444"
                                                        : theme.cardBorder
                                        }`,
                                    transition: "all 0.3s",
                                    transform: isHl ? "scale(1.15)" : "scale(1)",
                                    boxShadow: isHl ? `0 4px 12px ${pc}40` : "none",
                                }}>
                                    <span style={{
                                        fontSize: "1rem", fontWeight: "900",
                                        color: isDone ? "#10b981"
                                            : isFail ? "#ef4444"
                                                : isHl ? pc
                                                    : isPositive ? "#3b82f6"
                                                        : isNegative ? "#ef4444"
                                                            : theme.textDim,
                                    }}>{val}</span>
                                </div>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "700",
                                    color: isHl ? pc : theme.textDim,
                                }}>{String.fromCharCode(97 + letterIdx)}</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{
                    display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px",
                    fontSize: "0.6rem", fontWeight: "700",
                }}>
                    <span style={{ color: "#3b82f6" }}>🔵 +1 from s</span>
                    <span style={{ color: "#f59e0b" }}>🟡 -1 from t</span>
                    <span style={{ color: "#10b981" }}>✓ = 0 balanced</span>
                </div>
            </VizCard>

            {/* ━━━ Progress Bar ━━━ */}
            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "fail" ? "#f59e0b" : step.phase === "pass" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
