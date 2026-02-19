import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void permute(vector<int>& nums, int start,` },
    { id: 1, text: `             vector<vector<int>>& res) {` },
    { id: 2, text: `    if (start == nums.size()) {` },
    { id: 3, text: `        res.push_back(nums); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    for (int i = start; i < nums.size(); i++){` },
    { id: 6, text: `        swap(nums[start], nums[i]);` },
    { id: 7, text: `        permute(nums, start+1, res);` },
    { id: 8, text: `        swap(nums[start], nums[i]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", swap: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", swap: "🔄 SWAP", back: "↩ UNSWAP", done: "✅ DONE" };

function gen(nums) {
    const arr = [...nums], steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, arr: [...arr], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });
    function solve(start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `[${arr}] s=${start}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`p(s=${start})`);
        push(0, "call", { start, arr: `[${arr}]` }, `permute(start=${start})`);
        if (start === arr.length) {
            result.push([...arr]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `[${arr}]`;
            push(3, "found", { perm: `[${arr}]`, "#": result.length }, `🎯 Permutation #${result.length}`);
            cs.pop(); return;
        }
        for (let i = start; i < arr.length; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];
            push(6, "swap", { i, start, "swap": `${arr[i]}↔${arr[start]}`, arr: `[${arr}]` }, `swap(${start},${i})`);
            solve(start + 1, myId);
            [arr[start], arr[i]] = [arr[i], arr[start]];
            push(8, "back", { i, arr: `[${arr}]` }, `unswap(${start},${i})`);
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} permutations`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given an array of **distinct** numbers, return **all possible orderings** (permutations).
For [1,2,3] → 6 permutations: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]

## How to Think About It
**Ask yourself:** "At each position, what choices do I have?"

### Position-by-Position Thinking
- Position 0: I can place **any** of the n numbers → n choices
- Position 1: I can place **any remaining** number → n-1 choices
- Position 2: I can place **any remaining** → n-2 choices
- ...and so on

This gives n × (n-1) × (n-2) × ... × 1 = **n!** total permutations.

### Why Swap-Based?
Instead of using a "used" boolean array (which wastes space), we **swap**:
- Swap the next candidate into the current position
- Recurse to fill the rest
- Swap back (backtrack) to try the next candidate

**Think of it like:** You have cards in a row. For each position, you try placing each remaining card there, fill the rest recursively, then put the card back.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step Algorithm

### Input: [1, 2, 3], start = 0

1. **start=0:** Try each element at position 0
- swap(0,0) → [**1**,2,3] → recurse with start=1
- swap(0,1) → [**2**,1,3] → recurse with start=1
- swap(0,2) → [**3**,2,1] → recurse with start=1

2. **start=1** (after 1 is fixed at position 0): Try remaining
- swap(1,1) → [1,**2**,3] → recurse with start=2
- swap(1,2) → [1,**3**,2] → recurse with start=2

3. **start=2** (which equals array length):
- **BASE CASE** → save [1,2,3] as a permutation! ✅

4. **Backtrack:** unswap, try next candidate

### The Backtracking Template
    function solve(start):
        if start == n: SAVE result
        for i = start to n-1:
            SWAP nums[start] with nums[i]   ← TRY
            solve(start + 1)                 ← RECURSE
            SWAP back                        ← UNDO

### Why It Works
- At each level, we "fix" one position
- The loop tries every remaining element at that position
- After recursing, we undo the swap to restore the original order
- This ensures every possible ordering is explored exactly once`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1-2: Function Signature
    void permute(nums, start, res)
- **nums**: the array (modified in-place via swaps)
- **start**: which position we're currently filling
- **res**: collects all found permutations

### Line 3-4: Base Case
    if (start == nums.size())
        res.push_back(nums); return;
**WHY:** When start reaches the end, ALL positions are filled → we have a complete permutation. Save it!

### Line 5: The Choice Loop
    for (int i = start; i < nums.size(); i++)
**WHY start, not 0?** Elements before position "start" are already fixed. We only consider elements from "start" onwards (the unfixed portion).

### Line 6: Make the Choice (Swap)
    swap(nums[start], nums[i]);
**WHY swap?** This efficiently places nums[i] at position "start" without needing extra arrays. It's like saying "try element i at the current position."

### Line 7: Recurse
    permute(nums, start+1, res);
**WHY start+1?** Position "start" is now filled. Move to the next position.

### Line 8: Undo the Choice (Backtrack)
    swap(nums[start], nums[i]);
**WHY swap back?** We must restore the array to its original state before trying the next candidate. This is the **heart of backtracking** — undo your choice so other branches don't see a corrupted state.

## Common Mistakes
- Forgetting to swap back → array becomes corrupted
- Starting loop from 0 instead of start → duplicates
- Not making a copy when saving result → all entries become the same

## Time & Space Complexity
- **Time:** O(n × n!) — n! permutations, each takes O(n) to copy
- **Space:** O(n) recursion depth + O(n × n!) for storing results
- **Why n!?** Each level has one fewer choice: n × (n-1) × ... × 1`
    },
];

const DA = [1, 2, 3];
export default function Permutations() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 2 || a.length > 4) return; setSess(gen(a)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Permutations" subtitle="Swap-based backtracking · n! paths · LC #46">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,2,3" label="Array (2–4 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="permutations.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🔢 Perms: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`[${s.join(",")}]`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔢 {sess.result.length} perms</span></StepInfo>
        </VizLayout>
    );
}
