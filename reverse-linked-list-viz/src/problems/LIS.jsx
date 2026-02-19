import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int lis(vector<int>& nums, int i, int prevIdx) {` },
    { id: 1, text: `    if (i >= nums.size()) return 0;` },
    { id: 2, text: `    // SKIP nums[i]` },
    { id: 3, text: `    int skip = lis(nums, i+1, prevIdx);` },
    { id: 4, text: `    int take = 0;` },
    { id: 5, text: `    if (prevIdx==-1 || nums[i]>nums[prevIdx])` },
    { id: 6, text: `        take = 1 + lis(nums, i+1, i);` },
    { id: 7, text: `    return max(skip, take);` },
    { id: 8, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#10b981", skip: "#f59e0b", take: "#3b82f6", cant: "#f87171", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🔹 BASE", skip: "⏭ SKIP", take: "✅ TAKE", cant: "❌ CAN'T", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(nums) {
    const steps = [], cs = [], memo = {};
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, nums: [...nums], treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(i, prevIdx, parentId) {
        if (cnt >= MAX) return 0;
        const key = `${i},${prevIdx}`; if (memo[key] !== undefined) return memo[key];
        const myId = nid++;
        const prevLabel = prevIdx === -1 ? "—" : nums[prevIdx];
        treeNodes.push({ id: `n${myId}`, label: `i=${i},p=${prevLabel}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`lis(${i},p=${prevLabel})`);
        push(0, "call", { i, "nums[i]": nums[i] ?? "—", prev: prevLabel }, `lis(${i}, prev=${prevLabel})`);
        if (i >= nums.length) { treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `0`; push(1, "base", { return: 0 }, `End → 0`); cs.pop(); memo[key] = 0; return 0; }
        push(3, "skip", { i, "nums[i]": nums[i] }, `Skip ${nums[i]}`);
        const sk = solve(i + 1, prevIdx, myId);
        let tk = 0;
        if (prevIdx === -1 || nums[i] > nums[prevIdx]) {
            push(6, "take", { i, "nums[i]": nums[i] }, `Take ${nums[i]}`);
            tk = 1 + solve(i + 1, i, myId);
        } else {
            push(5, "cant", { i, "nums[i]": nums[i], "prev": nums[prevIdx] }, `Can't take: ${nums[i]}≤${nums[prevIdx]}`);
        }
        const r = Math.max(sk, tk);
        treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
        push(7, "ret", { skip: sk, take: tk, best: r }, `max(${sk},${tk})=${r}`);
        cs.pop(); memo[key] = r; return r;
    }
    const ans = solve(0, -1, null);
    push(0, "done", { ANSWER: ans }, `✅ LIS = ${ans}`);
    return { steps, answer: ans };
}

function ArrViz({ step }) {
    const { theme } = useTheme();
    const nums = step.nums || []; const i = step.vars?.i;
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {nums.map((v, k) => (<span key={k} style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.7rem", fontWeight: k === i ? 800 : 500, background: k === i ? "#8b5cf622" : theme.cardHeaderBg, border: `1.5px solid ${k === i ? "#8b5cf6" : theme.cardBorder}`, color: k === i ? "#c4b5fd" : theme.textMuted }}>{v}</span>))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the length of the **longest strictly increasing subsequence**. Not contiguous! E.g., [10,9,2,5,3,7,101,18] → 4 ([2,3,7,101]).

## How to Think About It
For each element, **skip it** or **take it** (if greater than previous taken).

### DP Approach
dp[i] = length of LIS ending at index i
For each j < i: if nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1)

**Think of it like:** Building the tallest tower by selecting blocks in order, where each block must be taller than the previous.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [10,9,2,5,3,7,101,18]

- dp[0]=1 (10)
- dp[1]=1 (9 — can't extend any)
- dp[2]=1 (2 — smallest)
- dp[3]=2 (2<5 → extend from 2)
- dp[4]=2 (2<3 → extend from 2)
- dp[5]=3 (2<3<7 → extend from 3)
- dp[6]=4 (2<3<7<101 → extend from 7)
- dp[7]=4 (2<3<7<18 → extend from 7)

Answer: max(dp) = **4** ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    int lis(int[] nums, int i, int prev)
i = current index, prev = last element included in our subsequence.

### Line 2: Base Case
    if (i >= nums.length) return 0;
**WHY:** No more elements to consider → subsequence can't grow further.

### Line 3: Skip Current Element
    int skip = lis(nums, i+1, prev);
**WHY:** Maybe including this element won't lead to the longest result. Move to next element, prev stays same.

### Line 4-5: Take Current Element (if valid)
    int take = 0;
    if (nums[i] > prev) take = 1 + lis(nums, i+1, nums[i]);
**WHY nums[i] > prev?** The subsequence must be **strictly increasing**. We can only include nums[i] if it's larger than the last included element.
**WHY 1 +?** We're including this element, so length increases by 1.
**WHY prev=nums[i]?** This element becomes the new "last included" for future decisions.

### Line 6: Choose the Best
    return max(skip, take);
**WHY max?** We want the LONGEST increasing subsequence, so take whichever path gives more length.

## Time & Space Complexity
- **Time:** O(n²) with memoization — each (i, prev) pair solved once
- **Space:** O(n²) for memo, O(n) recursion depth`
    },
];

const DA = [10, 9, 2, 5, 3, 7, 101, 18];
export default function LIS() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 2 || a.length > 6) return; setSess(gen(a)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Longest Increasing Subsequence" subtitle="Skip / Take · LC #300">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="10,9,2,5,3,7,101,18" label="Array (2–6 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="lis.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrViz step={step} /><VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📈 LIS = {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
