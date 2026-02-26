import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_WORDS = ["Hello", "World"];

const CODE = [
    { id: 0, text: `string encode(vector<string>& strs) {` },
    { id: 1, text: `    string res = "";` },
    { id: 2, text: `    for (auto& s : strs)` },
    { id: 3, text: `        res += to_string(s.size()) + "#" + s;` },
    { id: 4, text: `    return res;` },
    { id: 5, text: `}` },
    { id: 6, text: `` },
    { id: 7, text: `vector<string> decode(string s) {` },
    { id: 8, text: `    vector<string> res;` },
    { id: 9, text: `    int i = 0;` },
    { id: 10, text: `    while (i < s.size()) {` },
    { id: 11, text: `        int j = s.find('#', i);` },
    { id: 12, text: `        int len = stoi(s.substr(i, j-i));` },
    { id: 13, text: `        res.push_back(s.substr(j+1, len));` },
    { id: 14, text: `        i = j + 1 + len;` },
    { id: 15, text: `    }` },
    { id: 16, text: `    return res;` },
    { id: 17, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", encode: "#3b82f6", encoded: "#f59e0b", decode: "#10b981", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", encode: "ENCODING", encoded: "ENCODED ✓", decode: "DECODING", done: "DONE ✓" };

function generateSteps(words) {
    const steps = [];
    let encoded = "";

    steps.push({
        cl: 1, phase: "init", words, encoded: "", decoded: [], activeWord: -1, activeSegment: null,
        msg: `Encode ${words.length} strings using length-prefix`,
        vars: { numWords: words.length },
    });

    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        encoded += `${w.length}#${w}`;
        steps.push({
            cl: 3, phase: "encode", words, encoded, decoded: [], activeWord: i, activeSegment: `${w.length}#${w}`,
            msg: `"${w}" → "${w.length}#${w}"`,
            vars: { word: `"${w}"`, len: w.length, segment: `"${w.length}#${w}"` },
        });
    }

    steps.push({
        cl: 4, phase: "encoded", words, encoded, decoded: [], activeWord: -1, activeSegment: null,
        msg: `Encoded: "${encoded}"`,
        vars: { encoded: `"${encoded}"` },
    });

    // Decode
    const decoded = [];
    let i = 0;
    while (i < encoded.length) {
        const j = encoded.indexOf("#", i);
        const len = parseInt(encoded.substring(i, j));
        const word = encoded.substring(j + 1, j + 1 + len);
        decoded.push(word);
        steps.push({
            cl: 13, phase: "decode", words, encoded, decoded: [...decoded], activeWord: decoded.length - 1, activeSegment: word,
            msg: `Found '#' at ${j}, len=${len} → "${word}"`,
            vars: { i, j, len, word: `"${word}"` },
        });
        i = j + 1 + len;
    }

    steps.push({
        cl: 16, phase: "done", words, encoded, decoded: [...decoded], activeWord: -1, activeSegment: null,
        msg: `🟢 Successfully decoded ${decoded.length} strings!`,
        vars: { "return": `[${decoded.map(w => `"${w}"`).join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 271 — Encode and Decode Strings

**Difficulty:** Medium &nbsp; **Topics:** String, Design

---

Design an algorithm to encode a list of strings to a single string, and decode it back.

### Examples
\`\`\`
Input:  ["Hello","World"]
Encode: "5#Hello5#World"
Decode: ["Hello","World"]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Length-Prefix Encoding

### Key Insight
Prefix each string with its **length + delimiter (#)**. During decode, read the length, then extract exactly that many characters.

### Why this works?
- The length tells us exactly where each string ends
- No ambiguity even if strings contain '#' or digits`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | n = total character count |
| **Space** | **O(1)** | Excluding output |`
    }
];

export default function EncodeDecodeStrings() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_WORDS.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_WORDS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => s.trim()).filter(Boolean);
        if (!parsed.length || parsed.length > 6) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_WORDS.join(","));
        setSteps(generateSteps(DEFAULT_WORDS)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Encode and Decode Strings" subtitle="LC #271 · Length-Prefix">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="Hello,World" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="encode_decode.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Original words */}
            <VizCard title="📝 Input Strings">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.words.map((w, i) => (
                        <div key={i} style={{
                            padding: "8px 14px", borderRadius: "10px", fontFamily: "monospace",
                            background: step.activeWord === i ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                            border: `2px solid ${step.activeWord === i ? pc : theme.cardBorder}`,
                            fontWeight: "700", fontSize: "0.9rem", color: theme.text,
                            transition: "all 0.3s",
                            transform: step.activeWord === i ? "scale(1.1)" : "scale(1)",
                        }}>"{w}"</div>
                    ))}
                </div>
            </VizCard>

            {/* Encoded string */}
            {step.encoded && (
                <VizCard title="🔐 Encoded String">
                    <div style={{
                        textAlign: "center", fontFamily: "monospace", fontSize: "1.1rem",
                        fontWeight: "700", color: "#f59e0b", wordBreak: "break-all",
                        padding: "8px", borderRadius: "8px",
                        background: isDark ? "#f59e0b10" : "#fef3c7",
                    }}>
                        "{step.encoded}"
                    </div>
                </VizCard>
            )}

            {/* Decoded results */}
            {step.decoded.length > 0 && (
                <VizCard title="📤 Decoded Strings">
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        {step.decoded.map((w, i) => (
                            <div key={i} style={{
                                padding: "8px 14px", borderRadius: "10px", fontFamily: "monospace",
                                background: isDark ? "#10b98118" : "#dcfce7",
                                border: "2px solid #10b981", fontWeight: "700", color: "#10b981",
                            }}>"{w}"</div>
                        ))}
                    </div>
                </VizCard>
            )}

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
