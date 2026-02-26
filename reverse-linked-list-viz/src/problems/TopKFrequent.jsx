import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
} from "../shared/Components";

const DEFAULT_ARR = [1, 1, 1, 2, 2, 3];
const DEFAULT_K = 2;

const CODE = [
    { id: 0, text: `vector<int> topKFrequent(vector<int>& nums, int k) {` },
    { id: 1, text: `    unordered_map<int, int> freq;` },
    { id: 2, text: `    for (int n : nums) freq[n]++;` },
    { id: 3, text: `    vector<vector<int>> buckets(nums.size()+1);` },
    { id: 4, text: `    for (auto& [val, cnt] : freq)` },
    { id: 5, text: `        buckets[cnt].push_back(val);` },
    { id: 6, text: `    vector<int> result;` },
    { id: 7, text: `    for (int i = buckets.size()-1; i >= 0; i--)` },
    { id: 8, text: `        for (int v : buckets[i]) {` },
    { id: 9, text: `            result.push_back(v);` },
    { id: 10, text: `            if (result.size() == k) return result;` },
    { id: 11, text: `        }` },
    { id: 12, text: `    return result;` },
    { id: 13, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", count: "#3b82f6", bucket: "#f59e0b", pick: "#10b981", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", count: "COUNT FREQ", bucket: "BUCKET SORT", pick: "PICK TOP K", done: "DONE ✓" };

function generateSteps(nums, k) {
    const steps = [];
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;

    steps.push({
        cl: 1, phase: "init", nums, freq: {}, buckets: [], result: [], k, activeVal: null,
        msg: `Find top ${k} most frequent elements`,
        vars: { k, "nums.size": nums.length },
    });

    steps.push({
        cl: 2, phase: "count", nums, freq: { ...freq }, buckets: [], result: [], k, activeVal: null,
        msg: `Frequencies: ${Object.entries(freq).map(([k, v]) => `${k}→${v}`).join(", ")}`,
        vars: Object.fromEntries(Object.entries(freq).map(([k, v]) => [`freq[${k}]`, v])),
    });

    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [val, cnt] of Object.entries(freq)) buckets[cnt].push(Number(val));

    steps.push({
        cl: 5, phase: "bucket", nums, freq: { ...freq }, buckets: buckets.map(b => [...b]), result: [], k, activeVal: null,
        msg: `Bucket by frequency: ${buckets.map((b, i) => b.length ? `[${i}]=${b}` : "").filter(Boolean).join(", ")}`,
        vars: { buckets: "built" },
    });

    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        for (const v of buckets[i]) {
            result.push(v);
            steps.push({
                cl: 9, phase: "pick", nums, freq: { ...freq }, buckets: buckets.map(b => [...b]), result: [...result], k, activeVal: v,
                msg: `Pick ${v} (freq=${i}), result = [${result.join(",")}]`,
                vars: { value: v, freq: i, "result.size": result.length, k },
            });
            if (result.length === k) break;
        }
    }

    steps.push({
        cl: 12, phase: "done", nums, freq: { ...freq }, buckets: buckets.map(b => [...b]), result: [...result], k, activeVal: null,
        msg: `🟢 Top ${k} = [${result.join(",")}]`,
        vars: { "return": `[${result.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 347 — Top K Frequent Elements

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, Bucket Sort

---

Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. Answer may be in any order.

### Examples
\`\`\`
Input:  nums = [1,1,1,2,2,3], k = 2
Output: [1, 2]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Bucket Sort (O(n))

### Key Insight
After counting frequencies, use **bucket sort**: create buckets indexed by frequency, then pick from the highest bucket down.

### Why not heap?
Heap is O(n log k). Bucket sort is O(n) — optimal!`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Count + bucket + pick |
| **Space** | **O(n)** | Freq map + buckets |`
    }
];

export default function TopKFrequent() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [kText, setKText] = useState(String(DEFAULT_K));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_K));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const kv = parseInt(kText);
        if (!parsed.length || parsed.length > 14 || isNaN(kv) || kv < 1) return;
        setSteps(generateSteps(parsed, kv)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(",")); setKText(String(DEFAULT_K));
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_K)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Top K Frequent Elements" subtitle="LC #347 · Bucket Sort">
            <ExplainPanel sections={EXPLAIN} />
            <DualInputSection
                inputs={[
                    { label: "nums:", value: inputText, onChange: setInputText, placeholder: "1,1,1,2,2,3", flex: "1 1 160px" },
                    { label: "k:", value: kText, onChange: setKText, placeholder: "2", flex: "0 0 50px", style: { textAlign: "center" } },
                ]}
                onRun={handleRun} onReset={handleReset}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="top_k_frequent.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Buckets visualization */}
            {step.buckets.length > 0 && (
                <VizCard title="🪣 Frequency Buckets (index = frequency)">
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
                        {step.buckets.map((b, i) => {
                            if (b.length === 0 && i !== 0) return null;
                            return (
                                <div key={i} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                                    padding: "6px 8px", borderRadius: "8px", minWidth: "44px",
                                    background: isDark ? "#1e293b" : "#f1f5f9",
                                    border: `1px solid ${theme.cardBorder}`,
                                }}>
                                    {b.map((v, vi) => (
                                        <div key={vi} style={{
                                            padding: "4px 8px", borderRadius: "6px",
                                            background: step.result.includes(v) ? "#10b98120" : `#3b82f615`,
                                            border: `2px solid ${step.activeVal === v ? pc : step.result.includes(v) ? "#10b981" : "#3b82f644"}`,
                                            fontWeight: "900", fontSize: "0.9rem", fontFamily: "monospace",
                                            color: step.result.includes(v) ? "#10b981" : "#3b82f6",
                                            transform: step.activeVal === v ? "scale(1.15)" : "scale(1)",
                                            transition: "all 0.3s",
                                        }}>{v}</div>
                                    ))}
                                    <span style={{ fontSize: "0.55rem", color: theme.textDim, fontWeight: "700" }}>freq={i}</span>
                                </div>
                            );
                        }).filter(Boolean)}
                    </div>
                </VizCard>
            )}

            <VizCard title={`📤 Result: [${step.result.join(", ")}]`}>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", minHeight: "40px", alignItems: "center" }}>
                    {step.result.length === 0 ? (
                        <span style={{ color: theme.textDim, fontSize: "0.85rem" }}>Empty</span>
                    ) : step.result.map((val, i) => (
                        <div key={i} style={{
                            width: "44px", height: "44px", borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isDark ? "#10b98118" : "#dcfce7",
                            border: "2px solid #10b981", fontWeight: "900", color: "#10b981", fontSize: "1.1rem",
                        }}>{val}</div>
                    ))}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
