import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [3, 2, 3];

const CODE = [
    { id: 0, text: `vector<int> majorityElement(vector<int>& nums) {` },
    { id: 1, text: `    int c1 = 0, c2 = 0, cnt1 = 0, cnt2 = 0;` },
    { id: 2, text: `    for (int n : nums) {` },
    { id: 3, text: `        if (cnt1 == 0 && n != c2)` },
    { id: 4, text: `            { c1 = n; cnt1 = 1; }` },
    { id: 5, text: `        else if (cnt2 == 0 && n != c1)` },
    { id: 6, text: `            { c2 = n; cnt2 = 1; }` },
    { id: 7, text: `        else if (n == c1) cnt1++;` },
    { id: 8, text: `        else if (n == c2) cnt2++;` },
    { id: 9, text: `        else { cnt1--; cnt2--; }` },
    { id: 10, text: `    }` },
    { id: 11, text: `    // Verify candidates` },
    { id: 12, text: `    cnt1 = cnt2 = 0;` },
    { id: 13, text: `    for (int n : nums) {` },
    { id: 14, text: `        if (n == c1) cnt1++;` },
    { id: 15, text: `        else if (n == c2) cnt2++;` },
    { id: 16, text: `    }` },
    { id: 17, text: `    vector<int> res;` },
    { id: 18, text: `    if (cnt1 > nums.size()/3) res.push_back(c1);` },
    { id: 19, text: `    if (cnt2 > nums.size()/3) res.push_back(c2);` },
    { id: 20, text: `    return res;` },
    { id: 21, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", newC1: "#3b82f6", newC2: "#f59e0b", voteC1: "#3b82f6",
    voteC2: "#f59e0b", cancel: "#ef4444", verify: "#8b5cf6", done: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE", newC1: "NEW CANDIDATE 1", newC2: "NEW CANDIDATE 2",
    voteC1: "VOTE C1 +1", voteC2: "VOTE C2 +1", cancel: "CANCEL -1 BOTH",
    verify: "VERIFYING", done: "DONE ✓",
};

function generateSteps(nums) {
    const steps = [];
    let c1 = 0, c2 = 0, cnt1 = 0, cnt2 = 0;

    steps.push({
        cl: 1, phase: "init", nums, activeIdx: -1, c1, c2, cnt1, cnt2, result: [], verifying: false,
        msg: `Extended Boyer-Moore: find elements appearing > n/3 times`,
        vars: { n: nums.length, "n/3": Math.floor(nums.length / 3) },
    });

    for (let i = 0; i < nums.length; i++) {
        const n = nums[i];
        let phase;

        if (cnt1 === 0 && n !== c2) {
            c1 = n; cnt1 = 1; phase = "newC1";
        } else if (cnt2 === 0 && n !== c1) {
            c2 = n; cnt2 = 1; phase = "newC2";
        } else if (n === c1) {
            cnt1++; phase = "voteC1";
        } else if (n === c2) {
            cnt2++; phase = "voteC2";
        } else {
            cnt1--; cnt2--; phase = "cancel";
        }

        const cl = phase === "newC1" ? 4 : phase === "newC2" ? 6 : phase === "voteC1" ? 7 : phase === "voteC2" ? 8 : 9;
        steps.push({
            cl, phase, nums, activeIdx: i, c1, c2, cnt1, cnt2, result: [], verifying: false,
            msg: phase === "cancel" ? `${n} ≠ both → cancel: cnt1=${cnt1}, cnt2=${cnt2}`
                : `${n} → ${phase.includes("C1") ? `c1=${c1}(${cnt1})` : `c2=${c2}(${cnt2})`}`,
            vars: { i, [`nums[${i}]`]: n, c1, cnt1, c2, cnt2 },
        });
    }

    // Verify
    cnt1 = 0; cnt2 = 0;
    for (const n of nums) {
        if (n === c1) cnt1++;
        else if (n === c2) cnt2++;
    }
    const threshold = Math.floor(nums.length / 3);
    const result = [];
    if (cnt1 > threshold) result.push(c1);
    if (cnt2 > threshold) result.push(c2);

    steps.push({
        cl: 18, phase: "verify", nums, activeIdx: -1, c1, c2, cnt1, cnt2, result, verifying: true,
        msg: `Verify: c1=${c1}(${cnt1}×) c2=${c2}(${cnt2}×), threshold > ${threshold}`,
        vars: { c1, cnt1, c2, cnt2, threshold, result: `[${result.join(",")}]` },
    });

    steps.push({
        cl: 20, phase: "done", nums, activeIdx: -1, c1, c2, cnt1, cnt2, result, verifying: true,
        msg: `🟢 Majority elements: [${result.join(", ")}]`,
        vars: { "return": `[${result.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 229 — Majority Element II

**Difficulty:** Medium &nbsp; **Topics:** Array, Hash Table, Sorting, Counting

---

Find all elements that appear **more than ⌊n/3⌋ times**. Must run in O(n) time and O(1) space.

### Examples
\`\`\`
Input:  [3,2,3]
Output: [3]
\`\`\`
\`\`\`
Input:  [1,2]
Output: [1,2]
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Extended Boyer-Moore (2 Candidates)

### Key Insight
At most **2 elements** can appear > n/3 times. Track 2 candidates with counts. Cancel all three when none match.

### Algorithm
1. Boyer-Moore with 2 candidate slots
2. Verify both candidates actually exceed n/3`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Two passes |
| **Space** | **O(1)** | 4 variables |`
    }
];

export default function MajorityElementIINC() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1200);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 1 || parsed.length > 12) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Majority Element II" subtitle="LC #229 · Extended Boyer-Moore">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="3,2,3" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="majority_element_ii.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Array */}
            <VizCard title="📊 Array">
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                    {step.nums.map((val, i) => {
                        const isActive = step.activeIdx === i;
                        const isC1 = val === step.c1 && step.cnt1 > 0;
                        const isC2 = val === step.c2 && step.cnt2 > 0;
                        return (
                            <div key={i} style={{
                                width: "48px", height: "52px", borderRadius: "10px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: isActive ? `${pc}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                border: `2px solid ${isActive ? pc : isC1 ? "#3b82f644" : isC2 ? "#f59e0b44" : theme.cardBorder}`,
                                transition: "all 0.3s",
                                transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                                fontWeight: "900", fontSize: "1.1rem",
                                color: isActive ? pc : isC1 ? "#3b82f6" : isC2 ? "#f59e0b" : theme.text,
                            }}>
                                <span>{val}</span>
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            {/* Candidate trackers */}
            <VizCard title="🎯 Candidates">
                <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                    {[{ label: "C1", val: step.c1, cnt: step.cnt1, color: "#3b82f6" },
                    { label: "C2", val: step.c2, cnt: step.cnt2, color: "#f59e0b" }].map(({ label, val, cnt, color }) => (
                        <div key={label} style={{
                            padding: "12px 20px", borderRadius: "12px", textAlign: "center",
                            background: isDark ? `${color}10` : `${color}08`,
                            border: `2px solid ${color}44`, minWidth: "80px",
                        }}>
                            <div style={{ fontSize: "0.65rem", color, fontWeight: "800" }}>{label}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: "900", color }}>{cnt > 0 ? val : "—"}</div>
                            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.textDim }}>count: {cnt}</div>
                        </div>
                    ))}
                </div>
            </VizCard>

            {step.result.length > 0 && (
                <VizCard title={`📤 Result: [${step.result.join(", ")}]`}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        {step.result.map((v, i) => (
                            <div key={i} style={{
                                width: "50px", height: "50px", borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: isDark ? "#10b98118" : "#dcfce7",
                                border: "3px solid #10b981", fontWeight: "900", fontSize: "1.2rem", color: "#10b981",
                            }}>{v}</div>
                        ))}
                    </div>
                </VizCard>
            )}

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
