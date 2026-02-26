import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_S = "egg";
const DEFAULT_T = "add";

const CODE = [
    { id: 0, text: `bool isIsomorphic(string s, string t) {` },
    { id: 1, text: `    unordered_map<char,char> s2t, t2s;` },
    { id: 2, text: `    for (int i = 0; i < s.size(); i++) {` },
    { id: 3, text: `        char a = s[i], b = t[i];` },
    { id: 4, text: `        if (s2t.count(a) && s2t[a] != b)` },
    { id: 5, text: `            return false;` },
    { id: 6, text: `        if (t2s.count(b) && t2s[b] != a)` },
    { id: 7, text: `            return false;` },
    { id: 8, text: `        s2t[a] = b;` },
    { id: 9, text: `        t2s[b] = a;` },
    { id: 10, text: `    }` },
    { id: 11, text: `    return true;` },
    { id: 12, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", map: "#3b82f6", conflict: "#ef4444", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", map: "MAP CHARS", conflict: "CONFLICT!", done: "DONE ✓",
};

function generateSteps(s, t) {
    const steps = [];
    const s2t = {}, t2s = {};

    steps.push({
        cl: 1, phase: "init", s: [...s], t: [...t], activeIdx: -1, s2t: {}, t2s: {},
        msg: `Check if "${s}" and "${t}" have same structure`,
        vars: { "s.length": s.length, "t.length": t.length },
    });

    for (let i = 0; i < s.length; i++) {
        const a = s[i], b = t[i];

        if (s2t[a] !== undefined && s2t[a] !== b) {
            steps.push({
                cl: 5, phase: "conflict", s: [...s], t: [...t], activeIdx: i, s2t: { ...s2t }, t2s: { ...t2s },
                msg: `❌ Conflict: '${a}' already maps to '${s2t[a]}', not '${b}'`,
                vars: { i, a, b, [`s2t['${a}']`]: s2t[a], expected: b, "return": "false" },
            });
            return steps;
        }
        if (t2s[b] !== undefined && t2s[b] !== a) {
            steps.push({
                cl: 7, phase: "conflict", s: [...s], t: [...t], activeIdx: i, s2t: { ...s2t }, t2s: { ...t2s },
                msg: `❌ Conflict: '${b}' already maps back to '${t2s[b]}', not '${a}'`,
                vars: { i, a, b, [`t2s['${b}']`]: t2s[b], expected: a, "return": "false" },
            });
            return steps;
        }

        s2t[a] = b;
        t2s[b] = a;
        steps.push({
            cl: 8, phase: "map", s: [...s], t: [...t], activeIdx: i, s2t: { ...s2t }, t2s: { ...t2s },
            msg: `Map: '${a}' ↔ '${b}'`,
            vars: { i, a, b, ...Object.fromEntries(Object.entries(s2t).map(([k, v]) => [`${k}→${v}`, "✓"])) },
        });
    }

    steps.push({
        cl: 11, phase: "done", s: [...s], t: [...t], activeIdx: -1, s2t: { ...s2t }, t2s: { ...t2s },
        msg: `🟢 Isomorphic! All mappings consistent`,
        vars: { "return": "true" },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 205 — Isomorphic Strings

**Difficulty:** Easy &nbsp; **Topics:** Hash Table, String

---

Two strings \`s\` and \`t\` are **isomorphic** if the characters in \`s\` can be replaced to get \`t\`, with one-to-one mapping.

---

### Examples
\`\`\`
Input:  s = "egg", t = "add"
Output: true  (e→a, g→d)
\`\`\`
\`\`\`
Input:  s = "foo", t = "bar"
Output: false  (o maps to both a and r)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Two HashMaps (Bidirectional)

### Key Insight
We need **two maps**: s→t AND t→s. Both must be consistent.

### Why two maps?
- s→t alone fails: "ab" → "aa" would pass (a→a, b→a) but it shouldn't since 'a' maps to both 'a' and 'b' in reverse
- Need bidirectional check for true 1-to-1 mapping`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | At most 26 letters mapped |`
    }
];

export default function IsomorphicStrings() {
    const { theme, isDark } = useTheme();
    const [sText, setSText] = useState(DEFAULT_S);
    const [tText, setTText] = useState(DEFAULT_T);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_S, DEFAULT_T));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const s = sText.trim(), t = tText.trim();
        if (!s || !t || s.length !== t.length || s.length > 15) return;
        setSteps(generateSteps(s, t)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setSText(DEFAULT_S); setTText(DEFAULT_T);
        setSteps(generateSteps(DEFAULT_S, DEFAULT_T)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Isomorphic Strings" subtitle="LC #205 · Bidirectional Mapping">
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "s:", value: sText, onChange: setSText, placeholder: "egg", flex: "1 1 100px" },
                    { label: "t:", value: tText, onChange: setTText, placeholder: "add", flex: "1 1 100px" },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="isomorphic_strings.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Side-by-side strings */}
            <VizCard title="📝 Character Mapping">
                <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap" }}>
                    {["s", "t"].map(which => (
                        <div key={which}>
                            <div style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: "800", color: which === "s" ? "#3b82f6" : "#f59e0b", marginBottom: "6px" }}>
                                {which}
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {step[which].map((ch, i) => {
                                    const isActive = step.activeIdx === i;
                                    const color = which === "s" ? "#3b82f6" : "#f59e0b";
                                    return (
                                        <div key={i} style={{
                                            width: "42px", height: "48px", borderRadius: "10px",
                                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                            background: isActive ? `${color}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                            border: `2px solid ${isActive ? color : theme.cardBorder}`,
                                            transition: "all 0.3s ease",
                                            transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                        }}>
                                            <span style={{ fontSize: "1.1rem", fontWeight: "900", fontFamily: "monospace", color: isActive ? color : theme.text }}>{ch}</span>
                                            <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Mapping arrows */}
                {Object.keys(step.s2t).length > 0 && (
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
                        {Object.entries(step.s2t).map(([k, v]) => (
                            <div key={k} style={{
                                padding: "4px 12px", borderRadius: "20px",
                                background: isDark ? "#10b98115" : "#dcfce7",
                                border: "1px solid #10b98144",
                                fontSize: "0.8rem", fontWeight: "700", fontFamily: "monospace",
                                color: "#10b981",
                            }}>
                                {k} → {v}
                            </div>
                        ))}
                    </div>
                )}
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
