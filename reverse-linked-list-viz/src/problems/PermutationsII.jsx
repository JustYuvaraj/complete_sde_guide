import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void permuteUnique(vector<int>& nums, int start,` },
    { id: 1, text: `                   vector<vector<int>>& res) {` },
    { id: 2, text: `    if (start == nums.size()) {` },
    { id: 3, text: `        res.push_back(nums); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    set<int> used;` },
    { id: 6, text: `    for (int i = start; i < nums.size(); i++){` },
    { id: 7, text: `        if (used.count(nums[i])) continue;` },
    { id: 8, text: `        used.insert(nums[i]);` },
    { id: 9, text: `        swap(nums[start], nums[i]);` },
    { id: 10, text: `        permuteUnique(nums, start+1, res);` },
    { id: 11, text: `        swap(nums[start], nums[i]);` },
    { id: 12, text: `    }` },
    { id: 13, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", swap: "#3b82f6", skip: "#f87171", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", swap: "🔄 SWAP", skip: "⏭ SKIP", back: "↩ UNSWAP", done: "✅ DONE" };

function gen(nums) {
    const arr = [...nums].sort((a, b) => a - b), steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, arr: [...arr], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(start, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `[${arr}] s=${start}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`p(s=${start})`);
        push(0, "call", { start, arr: `[${arr}]` }, `permuteUnique(start=${start})`);
        if (start === arr.length) {
            result.push([...arr]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `[${arr}]`;
            push(3, "found", { perm: `[${arr}]`, "#": result.length }, `🎯 Permutation #${result.length}`);
            cs.pop(); return;
        }
        const used = new Set();
        for (let i = start; i < arr.length; i++) {
            if (cnt >= MAX) break;
            if (used.has(arr[i])) {
                push(7, "skip", { i, "nums[i]": arr[i], reason: "duplicate" }, `Skip dup ${arr[i]} at i=${i}`);
                continue;
            }
            used.add(arr[i]);
            [arr[start], arr[i]] = [arr[i], arr[start]];
            push(9, "swap", { i, start, arr: `[${arr}]` }, `swap(${start},${i}) → [${arr}]`);
            solve(start + 1, myId);
            [arr[start], arr[i]] = [arr[i], arr[start]];
            if (cnt < MAX) { push(11, "back", { i, arr: `[${arr}]` }, `unswap(${start},${i})`); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} unique permutations`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Generate all **unique** permutations of an array that may contain **duplicates**. E.g., [1,1,2] → [[1,1,2],[1,2,1],[2,1,1]]

## How to Think About It
Same swap-based approach as Permutations I, but we need to **skip duplicates** at each level.

### The Set Trick
- At each recursion level, use a **set** to track which values we've already placed at position 'start'
- If we've already placed value X at position start, skip any other occurrence of X

**Think of it like:** Arranging letters. In "AAB", once you've put 'A' first, putting the other 'A' first gives the same result. Skip it!`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [1, 1, 2]

1. start=0: Try placing 1 at pos 0 → [1,_,_]
2. start=1: Place 1 at pos 1 → [1,1,2] 🎯 **FOUND**
3. Swap back, place 2 at pos 1 → [1,2,1] 🎯 **FOUND**
4. Back to start=0: Try placing 1 again? **SKIP** (already in set!)
5. Place 2 at pos 0 → [2,1,_]
6. start=1: [2,1,1] 🎯 **FOUND**

Result: 3 unique permutations ✅ (not 6!)

### Without skip: [1,1,2] would give 6 perms (duplicates)
### With skip: Only 3 unique perms`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 5: Create Used Set
    set<int> used;
**WHY:** Track which VALUES have been placed at current position.

### Line 7: Skip Duplicate Values
    if (used.count(nums[i])) continue;
**WHY:** If this value was already placed at 'start' position, skip to avoid duplicate permutations.

### Line 8: Mark as Used
    used.insert(nums[i]);

### Line 9: Swap to Place
    swap(nums[start], nums[i]);
**WHY:** Place nums[i] at position 'start' by swapping.

### Line 11: Unswap (Backtrack)
    swap(nums[start], nums[i]);
**WHY:** Restore original order before trying next candidate.

## Time & Space Complexity
- **Time:** O(n × n!) worst case, fewer with duplicates
- **Space:** O(n) recursion depth + O(n) for set`
    },
];

const DA = [1, 1, 2];
export default function PermutationsII() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 2 || a.length > 5) return; setSess(gen(a)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Permutations II" subtitle="Skip duplicates · Swap-based backtracking · LC #47">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,1,2" label="Array (2–5 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="permutations_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🔢 Unique Perms: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`[${s.join(",")}]`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔢 {sess.result.length} unique perms</span></StepInfo>
        </VizLayout>
    );
}
