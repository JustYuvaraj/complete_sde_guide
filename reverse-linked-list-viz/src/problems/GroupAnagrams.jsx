import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_WORDS = ["eat", "tea", "tan", "ate", "nat", "bat"];

const CODE = [
    { id: 0, text: `vector<vector<string>> groupAnagrams(vector<string>& strs) {` },
    { id: 1, text: `    unordered_map<string, vector<string>> mp;` },
    { id: 2, text: `    for (auto& s : strs) {` },
    { id: 3, text: `        string key = s;` },
    { id: 4, text: `        sort(key.begin(), key.end());` },
    { id: 5, text: `        mp[key].push_back(s);` },
    { id: 6, text: `    }` },
    { id: 7, text: `    vector<vector<string>> res;` },
    { id: 8, text: `    for (auto& [k, v] : mp)` },
    { id: 9, text: `        res.push_back(v);` },
    { id: 10, text: `    return res;` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", sort: "#f59e0b", group: "#3b82f6", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", sort: "SORT KEY", group: "GROUP →", done: "DONE ✓" };

const GROUP_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function generateSteps(words) {
    const steps = [];
    const mp = {};
    const wordGroups = new Array(words.length).fill(-1);
    let groupIdx = 0;
    const keyToGroup = {};

    steps.push({
        cl: 1, phase: "init", words, wordGroups: [...wordGroups], groups: {}, activeIdx: -1, currentKey: null,
        msg: `Group ${words.length} words by their sorted key`,
        vars: { "strs.size": words.length },
    });

    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const key = [...w].sort().join("");

        if (!mp[key]) {
            mp[key] = [];
            keyToGroup[key] = groupIdx++;
        }
        mp[key].push(w);
        wordGroups[i] = keyToGroup[key];

        steps.push({
            cl: 5, phase: "group", words, wordGroups: [...wordGroups],
            groups: JSON.parse(JSON.stringify(mp)), activeIdx: i, currentKey: key,
            msg: `"${w}" → sort → "${key}" → group ${keyToGroup[key]}`,
            vars: { word: `"${w}"`, key: `"${key}"`, group: keyToGroup[key] },
        });
    }

    steps.push({
        cl: 10, phase: "done", words, wordGroups: [...wordGroups],
        groups: JSON.parse(JSON.stringify(mp)), activeIdx: -1, currentKey: null,
        msg: `🟢 ${Object.keys(mp).length} groups found`,
        vars: { "return": `${Object.keys(mp).length} groups` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 49 — Group Anagrams

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, String, Sorting

---

Given an array of strings, **group the anagrams** together. You can return the answer in any order.

### Examples
\`\`\`
Input:  ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Sort as Key

### Key Insight
All anagrams, when sorted, produce the **same string**. So use the sorted version as a HashMap key.

### Algorithm
1. For each word, sort its characters → this is the "key"
2. Group all words with the same key together
3. Return all groups`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n·k·log k)** | n words, sorting each of length k |
| **Space** | **O(n·k)** | HashMap storage |`
    }
];

export default function GroupAnagrams() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_WORDS.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_WORDS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        if (!parsed.length || parsed.length > 10) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_WORDS.join(","));
        setSteps(generateSteps(DEFAULT_WORDS)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Group Anagrams" subtitle="LC #49 · Sort-Key HashMap">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="eat,tea,tan,ate,nat,bat" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="group_anagrams.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title="📝 Words (color = group)">
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.words.map((w, i) => {
                        const g = step.wordGroups[i];
                        const gc = g >= 0 ? GROUP_COLORS[g % GROUP_COLORS.length] : theme.cardBorder;
                        const isActive = step.activeIdx === i;
                        return (
                            <div key={i} style={{
                                padding: "8px 14px", borderRadius: "10px", fontFamily: "monospace",
                                background: isActive ? `${pc}15` : g >= 0 ? `${gc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isActive ? pc : gc}`,
                                transition: "all 0.3s", fontWeight: "800", fontSize: "0.95rem",
                                color: g >= 0 ? gc : theme.text,
                                transform: isActive ? "scale(1.1) translateY(-3px)" : "scale(1)",
                            }}>{w}</div>
                        );
                    })}
                </div>
            </VizCard>

            <VizCard title="📦 Groups">
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    {Object.entries(step.groups).map(([key, words], gi) => {
                        const gc = GROUP_COLORS[gi % GROUP_COLORS.length];
                        return (
                            <div key={key} style={{
                                padding: "10px 14px", borderRadius: "12px",
                                background: isDark ? `${gc}10` : `${gc}08`,
                                border: `2px solid ${gc}44`, minWidth: "80px",
                            }}>
                                <div style={{ fontSize: "0.55rem", color: gc, fontWeight: "700", marginBottom: "4px" }}>
                                    key: "{key}"
                                </div>
                                {words.map((w, wi) => (
                                    <div key={wi} style={{ fontFamily: "monospace", fontWeight: "700", color: gc, fontSize: "0.9rem" }}>{w}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
