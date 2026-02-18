import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void nextPermutation(vector<int>& nums) {` },
    { id: 1, text: `    int i = n - 2;` },
    { id: 2, text: `    // Step 1: find rightmost ascending pair` },
    { id: 3, text: `    while (i >= 0 && nums[i] >= nums[i+1]) i--;` },
    { id: 4, text: `    if (i >= 0) {` },
    { id: 5, text: `        // Step 2: find rightmost successor` },
    { id: 6, text: `        int j = n - 1;` },
    { id: 7, text: `        while (nums[j] <= nums[i]) j--;` },
    { id: 8, text: `        swap(nums[i], nums[j]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `    // Step 3: reverse suffix` },
    { id: 11, text: `    reverse(nums.begin()+i+1, nums.end());` },
    { id: 12, text: `}` },
];
const PC = { scan: "#8b5cf6", pivot: "#f59e0b", findj: "#3b82f6", swap: "#10b981", reverse: "#ec4899", done: "#10b981" };
const PL = { scan: "🔍 SCAN", pivot: "📍 PIVOT", findj: "🔎 FIND J", swap: "🔄 SWAP", reverse: "↩ REVERSE", done: "✅ DONE" };

function gen(nums) {
    const arr = [...nums], n = arr.length, steps = [];
    const snap = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, arr: [...arr], highlights: hl || {} });

    snap(0, "scan", { array: `[${arr}]` }, `Start: [${arr}]`, {});

    let i = n - 2;
    while (i >= 0) {
        if (arr[i] < arr[i + 1]) break;
        snap(3, "scan", { i, "nums[i]": arr[i], "nums[i+1]": arr[i + 1] }, `${arr[i]} ≥ ${arr[i + 1]}, move left`, { [i]: "#f87171" });
        i--;
    }

    if (i >= 0) {
        snap(3, "pivot", { i, "nums[i]": arr[i] }, `Pivot found at i=${i} (val=${arr[i]})`, { [i]: "#f59e0b" });
        let j = n - 1;
        while (arr[j] <= arr[i]) {
            snap(7, "findj", { j, "nums[j]": arr[j], "nums[i]": arr[i] }, `${arr[j]} ≤ ${arr[i]}, move left`, { [i]: "#f59e0b", [j]: "#f87171" });
            j--;
        }
        snap(7, "findj", { j, "nums[j]": arr[j] }, `Successor found at j=${j} (val=${arr[j]})`, { [i]: "#f59e0b", [j]: "#3b82f6" });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snap(8, "swap", { i, j, "swapped": `${arr[j]}↔${arr[i]}` }, `Swap positions ${i} & ${j} → [${arr}]`, { [i]: "#10b981", [j]: "#10b981" });
    } else {
        snap(3, "pivot", { i }, `No pivot — this is the last permutation`, {});
    }

    let lo = i + 1, hi = n - 1;
    const revHL = {};
    for (let k = lo; k <= hi; k++) revHL[k] = "#ec4899";
    snap(11, "reverse", { from: lo, to: hi }, `Reverse suffix [${lo}..${hi}]`, revHL);
    while (lo < hi) { [arr[lo], arr[hi]] = [arr[hi], arr[lo]]; lo++; hi--; }
    snap(11, "done", { result: `[${arr}]` }, `✅ Next permutation: [${arr}]`, {});

    return { steps, result: [...arr] };
}

function ArrayViz({ arr, highlights }) {
    const { theme } = useTheme();
    return (
        <VizCard title="🔢 Array">
            <div style={{ display: "flex", gap: "4px", minHeight: "50px", alignItems: "flex-end" }}>
                {arr.map((v, i) => {
                    const hl = highlights[i];
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                            <div style={{
                                width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: "8px", fontSize: "0.9rem", fontWeight: 800,
                                background: hl ? hl + "22" : theme.cardBg,
                                border: `2px solid ${hl || theme.cardBorder}`,
                                color: hl || theme.text,
                                transition: "all 0.2s",
                            }}>{v}</div>
                            <span style={{ fontSize: "0.5rem", color: theme.textMuted }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Rearrange numbers into the **lexicographically next** permutation. If it's already the largest, return the smallest (sorted). E.g., [1,2,3] → [1,3,2]

## How to Think About It
**Three Steps:**
1. **Find the pivot:** Scan right-to-left for first DECREASE (nums[i] < nums[i+1])
2. **Find the successor:** Rightmost number larger than pivot
3. **Swap + Reverse:** Swap pivot with successor, then reverse the suffix

**Think of it like:** Incrementing a number. Find the rightmost digit you can increment, then make everything after it as small as possible.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [1, 2, 3]

1. **Find pivot:** Scan right→left: 3>2? No, 2<3 ✓ → pivot at i=1 (val=2)
2. **Find successor:** Rightmost > 2 → j=2 (val=3)
3. **Swap:** [1,**3**,**2**]
4. **Reverse suffix after i=1:** [1,3,2] → suffix is just [2], already sorted
5. Result: [1,3,2] ✅

### For [3,2,1] (largest permutation):
1. No pivot found (fully descending)
2. Skip swap
3. Reverse entire array → [1,2,3] (smallest) ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 3: Find Pivot
    while (i >= 0 && nums[i] >= nums[i+1]) i--;
**WHY >=?** We want strictly ascending pair. Equal doesn't count.

### Line 4-8: Swap with Successor
    if (i >= 0) { j = n-1; while(nums[j] <= nums[i]) j--; swap(i,j); }
**WHY rightmost j?** To make the smallest possible increment.

### Line 11: Reverse Suffix
    reverse(nums.begin()+i+1, nums.end());
**WHY reverse?** After swap, suffix is still descending. Reversing makes it ascending (smallest possible).

## Time & Space Complexity
- **Time:** O(n) — at most 2 scans + 1 reverse
- **Space:** O(1) — in-place modification`
    },
];

const DA = [1, 2, 3];
export default function NextPermutation() {
    const { theme } = useTheme();
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 2 || a.length > 8) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Next Permutation" subtitle="Find pivot → Swap successor → Reverse suffix · LC #31">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,2,3" label="Array (2–8):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="next_permutation.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrayViz arr={step.arr} highlights={step.highlights || {}} />
                    <VizCard title="📋 Result"><div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "monospace", color: "#10b981" }}>[{sess.result.join(", ")}]</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📍 Next Perm</span></StepInfo>
        </VizLayout>
    );
}
