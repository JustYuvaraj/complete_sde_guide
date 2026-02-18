import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `string getPermutation(int n, int k) {` },
    { id: 1, text: `    string result;` },
    { id: 2, text: `    vector<int> nums = {1,2,...,n};` },
    { id: 3, text: `    k--;  // 0-indexed` },
    { id: 4, text: `    int fact = (n-1)!;` },
    { id: 5, text: `    for (int i = 0; i < n; i++) {` },
    { id: 6, text: `        int idx = k / fact;` },
    { id: 7, text: `        result += nums[idx];` },
    { id: 8, text: `        nums.erase(nums.begin()+idx);` },
    { id: 9, text: `        k %= fact;` },
    { id: 10, text: `        if (nums.size() > 0) fact /= nums.size();` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return result;` },
    { id: 13, text: `}` },
];
const PC = { init: "#8b5cf6", pick: "#3b82f6", erase: "#ec4899", done: "#10b981" };
const PL = { init: "🔧 INIT", pick: "🎯 PICK", erase: "✂ ERASE", done: "✅ DONE" };

function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

function gen(n, k) {
    const steps = [];
    const nums = Array.from({ length: n }, (_, i) => i + 1);
    let kk = k - 1;
    let fact = factorial(n - 1);
    let result = "";

    steps.push({ cl: 0, phase: "init", vars: { n, k, "k(0-idx)": kk, "fact": fact, nums: `[${nums}]` }, msg: `Start: n=${n}, k=${k}`, result: "", nums: [...nums], pickedIdx: -1 });

    for (let i = 0; i < n; i++) {
        const idx = Math.floor(kk / fact);
        const picked = nums[idx];
        result += picked;
        steps.push({ cl: 6, phase: "pick", vars: { i, "k/fact": `${kk}/${fact}=${idx}`, "picked": picked, result: `"${result}"` }, msg: `k/${fact} = ${idx} → pick ${picked}`, result, nums: [...nums], pickedIdx: idx });
        nums.splice(idx, 1);
        kk = kk % fact;
        if (nums.length > 0) fact = Math.floor(fact / nums.length);
        steps.push({ cl: 8, phase: "erase", vars: { "remaining": `[${nums}]`, "new k": kk, "new fact": fact, result: `"${result}"` }, msg: `Remove ${picked}, k=${kk}, fact=${fact}`, result, nums: [...nums], pickedIdx: -1 });
    }
    steps.push({ cl: 12, phase: "done", vars: { result: `"${result}"` }, msg: `✅ ${k}-th permutation: "${result}"`, result, nums: [], pickedIdx: -1 });
    return { steps, result };
}

function NumsViz({ nums, pickedIdx }) {
    const { theme } = useTheme();
    return (
        <VizCard title="🔢 Available Numbers">
            <div style={{ display: "flex", gap: "4px", minHeight: "36px", alignItems: "center" }}>
                {nums.length === 0 ? <span style={{ color: theme.textDim, fontSize: "0.65rem" }}>empty</span> :
                    nums.map((v, i) => (
                        <div key={i} style={{
                            width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px", fontSize: "0.9rem", fontWeight: 800,
                            background: i === pickedIdx ? "#1e3a5f" : theme.cardBg,
                            border: `2px solid ${i === pickedIdx ? "#3b82f6" : theme.cardBorder}`,
                            color: i === pickedIdx ? "#93c5fd" : theme.text,
                        }}>{v}</div>
                    ))}
            </div>
        </VizCard>
    );
}

function ResultViz({ result }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📋 Result">
            <div style={{ display: "flex", gap: "3px", minHeight: "36px", alignItems: "center" }}>
                {result.length === 0 ? <span style={{ color: theme.textDim, fontSize: "0.65rem" }}>building...</span> :
                    result.split("").map((ch, i) => (
                        <div key={i} style={{
                            width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px", fontSize: "0.9rem", fontWeight: 800,
                            background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80",
                        }}>{ch}</div>
                    ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the **k-th** permutation of numbers 1 to n, without generating all permutations. E.g., n=3, k=3 → "213"

## How to Think About It
**Key insight:** Use the **factorial number system** to directly compute each digit.

Permutations of [1,2,3] group into blocks:
- Starting with 1: 2! = 2 permutations (123, 132)
- Starting with 2: 2! = 2 permutations (213, 231)
- Starting with 3: 2! = 2 permutations (312, 321)

k=3 → which block? 3/2 = 1 → second block (starts with 2)

**Think of it like:** Converting k to a factorial-base number, where each digit tells you which number to pick next.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for n=3, k=3

1. nums = [1,2,3], k = 3-1 = 2 (0-indexed), fact = 2! = 2
2. **Pick 1st digit:** idx = 2/2 = 1 → pick nums[1] = **2**, result = "2"
3. Remove 2 → nums = [1,3], k = 2%2 = 0, fact = 1!/1 = 1
4. **Pick 2nd digit:** idx = 0/1 = 0 → pick nums[0] = **1**, result = "21"
5. Remove 1 → nums = [3], k = 0%1 = 0, fact = 0
6. **Pick 3rd digit:** idx = 0 → pick nums[0] = **3**, result = "213"

Result: "213" ✅ — the 3rd permutation!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 3: Convert to 0-indexed
    k--;
**WHY:** Math works easier with 0-based indexing.

### Line 4: Initial Factorial
    int fact = (n-1)!;
**WHY (n-1)!?** Each "group" of permutations has (n-1)! items.

### Line 6: Which Group?
    int idx = k / fact;
**WHY:** Determines which number to pick from remaining pool.

### Line 9: Update k
    k %= fact;
**WHY:** k becomes the position within the selected group.

### Line 10: Update factorial
    if (nums.size() > 0) fact /= nums.size();
**WHY:** Next level has smaller groups.

## Time & Space Complexity
- **Time:** O(n²) — n iterations × O(n) to erase from vector
- **Space:** O(n) for the numbers array`
    },
];

const DN = 3, DK = 3;
export default function PermutationSequence() {
    const { theme } = useTheme();
    const [nT, setNT] = useState(String(DN)), [kT, setKT] = useState(String(DK));
    const [sess, setSess] = useState(() => gen(DN, DK));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const n = parseInt(nT), k = parseInt(kT); if (isNaN(n) || n < 1 || n > 6 || isNaN(k) || k < 1 || k > factorial(n)) return; setSess(gen(n, k)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setKT(String(DK)); setSess(gen(DN, DK)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Permutation Sequence" subtitle="k-th permutation · Factorial number system · LC #60">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>n:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>k:</span>
                <input value={kT} onChange={e => setKT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="permutation_sequence.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <NumsViz nums={step.nums} pickedIdx={step.pickedIdx} />
                    <ResultViz result={step.result} />
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📋 "{sess.result}"</span></StepInfo>
        </VizLayout>
    );
}
