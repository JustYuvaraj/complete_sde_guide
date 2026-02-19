import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
    RecursionTreePanel, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void subsetsII(vector<int>& nums, int start,` },
    { id: 1, text: `               vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    res.push_back(cur);` },
    { id: 3, text: `    for (int i = start; i < nums.size(); i++) {` },
    { id: 4, text: `        if (i>start && nums[i]==nums[i-1]) continue;` },
    { id: 5, text: `        cur.push_back(nums[i]);` },
    { id: 6, text: `        subsetsII(nums, i+1, cur, res);` },
    { id: 7, text: `        cur.pop_back();` },
    { id: 8, text: `    }` },
    { id: 9, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", skipDup: "#f59e0b", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 ADD", skipDup: "⏭ SKIP DUP", pick: "✅ PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = [];
    let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });

    function solve(start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `[${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`s2(s=${start})`);
        result.push([...cur]);
        treeNodes.find(t => t.id === `n${myId}`).status = "found";
        push(2, "found", { start, cur: `[${cur}]`, "#": result.length }, `Add {${cur}}`);

        for (let i = start; i < sorted.length; i++) {
            if (i > start && sorted[i] === sorted[i - 1]) {
                push(4, "skipDup", { i, "nums[i]": sorted[i] }, `Skip dup ${sorted[i]}`);
                continue;
            }
            cur.push(sorted[i]);
            push(5, "pick", { i, "nums[i]": sorted[i], cur: `[${cur}]` }, `Pick ${sorted[i]}`);
            solve(i + 1, myId);
            cur.pop();
            push(7, "back", { i, cur: `[${cur}]` }, `Backtrack: rm ${sorted[i]}`);
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} subsets`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Like Subsets (LC #78) but the array **may contain duplicates**. Return all unique subsets. E.g., [1,2,2] → 6 unique subsets.

## How to Think About It
**Ask yourself:** "How do I avoid generating duplicate subsets?"

### Sort + Skip Strategy
1. **Sort** the array first → duplicates become adjacent
2. At each level, if nums[i] == nums[i-1] **at the same level**, skip it
3. The skip condition: i > start && nums[i] == nums[i-1]

**Think of it like:** In a sorted array [1,2,2], once you've tried starting a branch with the first 2, starting another branch with the second 2 at the same level would produce identical subsets.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [1, 2, 2]

1. Sort: already [1,2,2]
2. Start: save {} (empty subset)
3. Pick 1 → save {1}, pick 2 → save {1,2}, pick 2 → save {1,2,2}
4. Backtrack, no more → back to {1,2}
5. Backtrack to {1}, skip second 2 (duplicate!) → done with 1
6. Pick first 2 → save {2}, pick second 2 → save {2,2}
7. Skip second 2 at same level as first 2

Result: {}, {1}, {1,2}, {1,2,2}, {2}, {2,2} ✅ (6 unique subsets)

### Key Rule
At the same recursion level (same "start"), never use the same value twice.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2: Add Current Subset
    res.push_back(cur);
**WHY:** Every call represents a valid subset. Add it immediately (unlike Subsets I which adds at leaf).

### Line 3: Loop from start
    for (int i = start; i < nums.size(); i++)
**WHY start?** Only consider elements after the ones we've already decided on.

### Line 4: Skip Duplicates (THE KEY LINE)
    if (i > start && nums[i] == nums[i-1]) continue;
**WHY i > start?** At the same level, if this value was already used, skip it. But the FIRST occurrence (i == start) is always allowed.

### Lines 5-7: Pick + Recurse + Backtrack
Standard backtracking: add element, go deeper, remove element.

## Time & Space Complexity
- **Time:** O(n × 2^n) — at most 2^n unique subsets
- **Space:** O(n) recursion depth + O(n × 2^n) results`
    },
];

const DA = [1, 2, 2];
export default function SubsetsII() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 1 || a.length > 4) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Subsets II" subtitle="Sorted + skip duplicates · LC #90">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,2,2" label="Array (1–4 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="subsets_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`📦 Subsets: ${(step.result || []).length}`}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>
                            {(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}`}</span>))}
                        </div>
                    </VizCard>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📦 {sess.result.length} subsets</span></StepInfo>
        </VizLayout>
    );
}
