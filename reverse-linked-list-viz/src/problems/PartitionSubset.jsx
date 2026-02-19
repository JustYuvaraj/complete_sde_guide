import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool canPartition(vector<int>& nums, int i, int rem) {` },
    { id: 1, text: `    if (rem == 0) return true;` },
    { id: 2, text: `    if (i >= nums.size() || rem < 0) return false;` },
    { id: 3, text: `    // INCLUDE nums[i]` },
    { id: 4, text: `    if (canPartition(nums, i+1, rem - nums[i]))` },
    { id: 5, text: `        return true;` },
    { id: 6, text: `    // SKIP nums[i]` },
    { id: 7, text: `    return canPartition(nums, i+1, rem);` },
    { id: 8, text: `}` },
    { id: 9, text: `// Initial: canPartition(nums, 0, totalSum/2)` },
];
const PC = { call: "#8b5cf6", found: "#10b981", prune: "#f87171", include: "#3b82f6", skip: "#f59e0b", ret: "#ec4899", done: "#10b981", fail: "#f87171" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", prune: "✂ PRUNE", include: "✅ INCLUDE", skip: "⏭ SKIP", ret: "🟣 RETURN", done: "✅ DONE", fail: "❌ FAIL" };

function gen(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return { steps: [{ cl: 9, phase: "fail", vars: { sum: total, odd: true }, callStack: [], msg: `❌ Sum=${total} is odd`, picked: [], target: total / 2, treeNodes: [] }], answer: false };
    const target = total / 2;
    const steps = [], cs = [], picked = [];
    const treeNodes = []; let nid = 0;
    let found = false;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, picked: [...picked], target, treeNodes: treeNodes.map(t => ({ ...t })) });

    function solve(i, rem, parentId) {
        if (found) return false;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `i=${i},r=${rem}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`cp(i=${i},r=${rem})`);
        push(0, "call", { i, "nums[i]": nums[i] ?? "—", rem, target }, `canPartition(i=${i}, rem=${rem})`);
        if (rem === 0) { found = true; treeNodes.find(t => t.id === `n${myId}`).status = "found"; treeNodes.find(t => t.id === `n${myId}`).label = `✓ r=0`; push(1, "found", { rem: 0, picked: `[${picked}]` }, `🎯 rem=0! [${picked}] = ${target}`); cs.pop(); return true; }
        if (i >= nums.length || rem < 0) { treeNodes.find(t => t.id === `n${myId}`).status = "pruned"; treeNodes.find(t => t.id === `n${myId}`).label = rem < 0 ? `✗ r=${rem}` : `✗ end`; push(2, "prune", { i, rem, reason: i >= nums.length ? "end" : "rem<0" }, `✂ Prune`); cs.pop(); return false; }
        picked.push(nums[i]);
        push(4, "include", { i, "nums[i]": nums[i], "new rem": rem - nums[i], picked: `[${picked}]` }, `Include ${nums[i]} → rem=${rem - nums[i]}`);
        if (solve(i + 1, rem - nums[i], myId)) { treeNodes.find(t => t.id === `n${myId}`).status = "done"; cs.pop(); return true; }
        picked.pop();
        push(7, "skip", { i, "nums[i]": nums[i], rem }, `Skip ${nums[i]}`);
        const r = solve(i + 1, rem, myId);
        treeNodes.find(t => t.id === `n${myId}`).status = r ? "done" : "pruned";
        cs.pop(); return r;
    }
    push(9, "call", { nums: `[${nums}]`, sum: total, target }, `Sum=${total}, target=${target}`);
    const ans = solve(0, target, null);
    push(0, ans ? "done" : "fail", { ANSWER: ans }, ans ? `✅ Can partition` : `❌ Cannot partition`);
    return { steps, answer: ans };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Can the array be split into two subsets with **equal sum**? E.g., [1,5,11,5] → true ([1,5,5] and [11]).

## How to Think About It
1. Calculate total sum. If **odd**, impossible!
2. Find if any subset sums to **sum/2**. If yes, the other half is automatically sum/2.

Reduced to: **Subset Sum** problem with target = totalSum / 2.

**Think of it like:** Dividing a pile of coins into two equal piles. You just need to find one pile that equals half the total.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [1,5,11,5]

1. Total = 22, target = 11
2. Try each element: include or exclude
3. Include 1: target becomes 10
4. Include 5: target becomes 5
5. Include 5: target becomes 0 → **FOUND!** ✅

Subsets: {1,5,5}=11 and {11}=11 ✅

### DP Approach
Boolean dp[j] = can we make sum j using elements so far?`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Quick Check Before Recursion
    if (totalSum % 2 != 0) return false;
**WHY:** If total is odd, it's IMPOSSIBLE to split into two equal halves. Exit immediately!

### Line 2: Set Target
    int target = totalSum / 2;
**WHY:** If we find a subset that sums to half the total, the remaining elements automatically sum to the other half.

### Line 3: Function Signature
    bool canPartition(int[] nums, int i, int rem)
i = current index, rem = remaining target sum to achieve.

### Line 4: Base Case — Found!
    if (rem == 0) return true;
**WHY:** Remaining is 0 → we've found a subset that sums to exactly target. 

### Line 5: Base Case — Failed
    if (i >= n || rem < 0) return false;
**WHY:** No elements left OR we overshot the target → this path failed.

### Line 6: Include Current Element
    bool include = canPartition(nums, i+1, rem - nums[i]);
**WHY rem − nums[i]?** Put this element in the subset. Remaining target decreases by its value.

### Line 7: Exclude Current Element
    bool exclude = canPartition(nums, i+1, rem);
**WHY rem unchanged?** Don't use this element. Target stays same, move to next.

### Line 8: Either Path Works
    return include || exclude;
**WHY ||?** We only need ONE valid subset. If either including or excluding works, answer is true.

## Time & Space Complexity
- **Time:** O(n × sum/2) with memoization
- **Space:** O(n × sum/2) for memo, O(n) recursion depth`
    },
];

const DA = [1, 5, 11, 5];
export default function PartitionSubset() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1100);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0); if (!a.length || a.length > 6) return; setSess(gen(a)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Partition Equal Subset Sum" subtitle="Include/Exclude · Subset sum = half · LC #416">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,5,11,5" label="Array (1–6 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="partition_subset.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.answer ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.answer ? "✅ Partitionable" : "❌ Not partitionable"}</span></StepInfo>
        </VizLayout>
    );
}
