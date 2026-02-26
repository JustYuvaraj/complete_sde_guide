import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# Dictionary (hash map)` },
    { id: 1, text: `mp = {}` },
    { id: 2, text: `mp["apple"] = 3` },
    { id: 3, text: `mp["mango"] = 5` },
    { id: 4, text: `mp["banana"] = 2` },
    { id: 5, text: `` },
    { id: 6, text: `# Lookup` },
    { id: 7, text: `print(mp["apple"])     # 3` },
    { id: 8, text: `print(mp.get("grape", 0))  # 0` },
    { id: 9, text: `` },
    { id: 10, text: `# Membership test` },
    { id: 11, text: `if "apple" in mp:` },
    { id: 12, text: `    print("found")` },
    { id: 13, text: `` },
    { id: 14, text: `# Frequency counting pattern` },
    { id: 15, text: `nums = [1, 2, 2, 3, 3, 3]` },
    { id: 16, text: `freq = {}` },
    { id: 17, text: `for n in nums:` },
    { id: 18, text: `    freq[n] = freq.get(n, 0) + 1` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", add: "#3b82f6", access: "#f59e0b",
    check: "#ec4899", freq: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "HASH MAP", add: "INSERT O(1)", access: "LOOKUP O(1)",
    check: "MEMBERSHIP O(1)", freq: "FREQUENCY COUNT", done: "COMPLETE",
};

function generateSteps() {
    const steps = [];

    steps.push({
        cl: 0, phase: "init", pairs: [], activeKey: null, freqPairs: [],
        msg: 'dict — Python\'s hash map implementation. Average O(1) for insert, lookup, and delete.',
        vars: {}
    });

    steps.push({
        cl: 1, phase: "init", pairs: [], activeKey: null, freqPairs: [],
        msg: 'Empty dictionary initialization. Internally uses open addressing with hash table.',
        vars: { "mp": "{}" }
    });

    steps.push({
        cl: 2, phase: "add", pairs: [{ k: "apple", v: 3 }], activeKey: "apple", freqPairs: [],
        msg: 'Insert key-value pair: hash("apple") → bucket → store (key, value). O(1) average.',
        vars: { 'mp["apple"]': 3 }
    });

    steps.push({
        cl: 3, phase: "add", pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }], activeKey: "mango", freqPairs: [],
        msg: 'Second insertion. If key already exists, the value is overwritten.',
        vars: { 'mp["mango"]': 5 }
    });

    steps.push({
        cl: 4, phase: "add", pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }, { k: "banana", v: 2 }], activeKey: "banana", freqPairs: [],
        msg: 'Three key-value pairs stored. Keys must be hashable (immutable types).',
        vars: { 'mp["banana"]': 2, "len(mp)": 3 }
    });

    steps.push({
        cl: 7, phase: "access", pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }, { k: "banana", v: 2 }], activeKey: "apple", freqPairs: [],
        msg: 'Direct lookup: mp["apple"] = 3. Raises KeyError if key doesn\'t exist.',
        vars: { 'mp["apple"]': 3 }
    });

    steps.push({
        cl: 8, phase: "access", pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }, { k: "banana", v: 2 }], activeKey: "grape", freqPairs: [],
        msg: 'mp.get(key, default): returns default if key is absent. Avoids KeyError — preferred for safe access.',
        vars: { 'mp.get("grape", 0)': 0 }
    });

    steps.push({
        cl: 11, phase: "check", pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }, { k: "banana", v: 2 }], activeKey: "apple", freqPairs: [],
        msg: '"key in dict" — O(1) membership test on keys (not values).',
        vars: { '"apple" in mp': "True", '"grape" in mp': "False" }
    });

    const nums = [1, 2, 2, 3, 3, 3];
    const freq = {};
    for (let i = 0; i < nums.length; i++) {
        freq[nums[i]] = (freq[nums[i]] || 0) + 1;
        steps.push({
            cl: 18, phase: "freq",
            pairs: [{ k: "apple", v: 3 }, { k: "mango", v: 5 }, { k: "banana", v: 2 }],
            activeKey: String(nums[i]),
            freqPairs: Object.entries({ ...freq }).map(([k, v]) => ({ k, v })),
            msg: `freq[${nums[i]}] = ${freq[nums[i]]}. Pattern: get(key, 0) + 1 handles missing keys.`,
            vars: { n: nums[i], [`freq[${nums[i]}]`]: freq[nums[i]] }
        });
    }

    steps.push({
        cl: 18, phase: "done", pairs: [], activeKey: null,
        freqPairs: Object.entries(freq).map(([k, v]) => ({ k, v })),
        msg: 'dict provides O(1) average for all operations. Frequency counting is the most common pattern in competitive programming.',
        vars: { "Key": "O(1) insert/lookup/delete" }
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Dictionary (Hash Map)", color: "#8b5cf6",
        content: `## dict — Hash Map Implementation

Python's \`dict\` is equivalent to \`std::unordered_map<K,V>\` in C++. Uses hash table with open addressing.

### Time Complexities (Average)
| Operation | Syntax | Complexity |
|---|---|---|
| Insert | \`mp[key] = val\` | **O(1)** |
| Lookup | \`mp[key]\` | **O(1)** |
| Delete | \`del mp[key]\` | **O(1)** |
| Membership | \`key in mp\` | **O(1)** |

### Frequency Counting Pattern
\`\`\`python
freq = {}
for x in array:
    freq[x] = freq.get(x, 0) + 1
\`\`\`
This is the **most common dict pattern** in LeetCode — appears in ~70% of hash map problems.

### Safe Access
- \`mp[key]\` → raises \`KeyError\` if absent
- \`mp.get(key, default)\` → returns default if absent (preferred)`
    }
];

export default function PyDictionary() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1800);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    const PAIR_COLORS = ["#3b82f6", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6", "#ef4444"];

    return (
        <VizLayout title="Dictionary (Hash Map)" subtitle="Python Refresher · Lesson 6 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="dictionary.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {step.pairs.length > 0 && (
                <VizCard title="Hash Map State (mp)">
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                        {step.pairs.map((p, i) => {
                            const isActive = step.activeKey === p.k;
                            const c = PAIR_COLORS[i % PAIR_COLORS.length];
                            return (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    padding: "10px 14px", borderRadius: "12px",
                                    background: isActive ? `${c}14` : (isDark ? "#0f172a" : "#f8fafc"),
                                    border: `3px solid ${isActive ? c : theme.cardBorder}`,
                                    transition: "all 0.3s",
                                    transform: isActive ? "scale(1.05)" : "scale(1)",
                                }}>
                                    <span style={{ fontFamily: "monospace", fontWeight: "800", color: c, fontSize: "0.85rem" }}>
                                        "{p.k}"
                                    </span>
                                    <span style={{ color: theme.textDim }}>→</span>
                                    <span style={{ fontWeight: "900", fontSize: "1.2rem", color: theme.text, fontFamily: "monospace" }}>{p.v}</span>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>
            )}

            {step.freqPairs.length > 0 && (
                <VizCard title="Frequency Table (freq)">
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                        {step.freqPairs.map((p, i) => {
                            const isActive = step.activeKey === p.k;
                            return (
                                <div key={i} style={{
                                    textAlign: "center", padding: "10px 16px", borderRadius: "12px",
                                    background: isActive ? "#10b98118" : (isDark ? "#0f172a" : "#f8fafc"),
                                    border: `3px solid ${isActive ? "#10b981" : theme.cardBorder}`,
                                    transition: "all 0.3s",
                                    transform: isActive ? "scale(1.08)" : "scale(1)",
                                }}>
                                    <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#10b981", fontFamily: "monospace" }}>{p.v}</div>
                                    <div style={{ fontFamily: "monospace", fontWeight: "700", color: theme.text, fontSize: "0.8rem" }}>key: {p.k}</div>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>
            )}

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
