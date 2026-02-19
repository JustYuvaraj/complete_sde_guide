import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int targetSum(vector<int>& nums, int t, int i) {` },
    { id: 1, text: `    if (i == nums.size())` },
    { id: 2, text: `        return t == 0 ? 1 : 0;` },
    { id: 3, text: `    // choose + nums[i]` },
    { id: 4, text: `    int add = targetSum(nums, t - nums[i], i+1);` },
    { id: 5, text: `    // choose - nums[i]` },
    { id: 6, text: `    int sub = targetSum(nums, t + nums[i], i+1);` },
    { id: 7, text: `    return add + sub;` },
    { id: 8, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#10b981", baseFail: "#f87171", plus: "#3b82f6", minus: "#f59e0b", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 MATCH", baseFail: "❌ NO MATCH", plus: "➕ ADD", minus: "➖ SUB", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(nums, target) {
    const steps = [], cs = [], exprs = [];
    const treeNodes = []; let nid = 0;
    let ways = 0; const signs = [];
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, exprs: [...exprs], treeNodes: treeNodes.map(t => ({ ...t })) });
    function solve(t, i, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `t=${t},i=${i}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ts(t=${t},i=${i})`);
        push(0, "call", { t, i, "nums[i]": nums[i] ?? "—" }, `targetSum(t=${t}, i=${i})`);
        if (i === nums.length) {
            if (t === 0) {
                ways++; const expr = nums.map((n, j) => `${signs[j] || "+"}${n}`).join(""); exprs.push(expr);
                treeNodes.find(tn => tn.id === `n${myId}`).status = "found";
                treeNodes.find(tn => tn.id === `n${myId}`).label = `✓ t=0`;
                push(2, "base", { t, "✓": "MATCH", ways, expr }, `🟢 t=0! Way #${ways}`);
            } else {
                treeNodes.find(tn => tn.id === `n${myId}`).status = "pruned";
                treeNodes.find(tn => tn.id === `n${myId}`).label = `✗ t=${t}`;
                push(2, "baseFail", { t, "✗": "no match" }, `❌ t=${t}≠0`);
            }
            cs.pop(); return t === 0 ? 1 : 0;
        }
        signs[i] = "+";
        push(4, "plus", { i, "nums[i]": nums[i], "new t": t - nums[i] }, `+${nums[i]} → t=${t - nums[i]}`);
        const a = solve(t - nums[i], i + 1, myId);
        signs[i] = "-";
        push(6, "minus", { i, "nums[i]": nums[i], "new t": t + nums[i] }, `-${nums[i]} → t=${t + nums[i]}`);
        const b = solve(t + nums[i], i + 1, myId);
        treeNodes.find(tn => tn.id === `n${myId}`).status = "done";
        treeNodes.find(tn => tn.id === `n${myId}`).label = `${a + b} ways`;
        push(7, "ret", { add: a, sub: b, total: a + b }, `Return ${a}+${b}=${a + b}`);
        cs.pop(); return a + b;
    }
    const ans = solve(target, 0, null);
    push(0, "done", { ANSWER: ans, ways: ans }, `✅ ${ans} ways to reach ${target}`);
    return { steps, answer: ans };
}

const DA = [1, 1, 1, 1, 1], DT = 3;
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given an array of integers and a target, assign + or − to each element. Count the number of ways to reach the target sum.

## Key Insight
Each element has 2 choices: add or subtract. This creates a binary tree of decisions. Use **DFS/recursion** to try both.

## Mental Model
1. At each element, branch into +num and -num
2. Recurse to the next element with updated sum
3. Base case: all elements used → does sum == target?
4. Count all paths that reach the target`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
nums = [1,1,1,1,1], target = 3
1. Each element: choose + or −
2. Need sum = 3, so need 4 pluses and 1 minus (4−1=3)
3. Choose which element gets −: C(5,1) = 5 ways

## Tree Structure
Each level = one element, branches = +/−. Leaves at depth n, count those with sum == target.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    int dfs(int[] nums, int i, int curSum, int target)
i = current index, curSum = running sum of +/− choices so far.

### Line 2: Base Case
    if (i == nums.length) return curSum == target ? 1 : 0;
**WHY:** We've assigned +/− to ALL elements. If sum equals target → 1 way found! Otherwise → 0.

### Line 3: Add Current Element
    int add = dfs(nums, i+1, curSum + nums[i], target);
**WHY +nums[i]?** Try assigning a **+** sign to this element. Explore all paths where we ADD it.

### Line 4: Subtract Current Element
    int sub = dfs(nums, i+1, curSum - nums[i], target);
**WHY −nums[i]?** Try assigning a **−** sign to this element. Explore all paths where we SUBTRACT it.

### Line 5: Count All Ways
    return add + sub;
**WHY add them?** We want TOTAL number of ways. Each branch finds independent valid assignments.

## Time & Space Complexity
- **Time:** O(2ⁿ) brute force — binary tree of +/− choices
- **Time (memo):** O(n × totalSum) — memo on (index, currentSum)
- **Space:** O(n) recursion depth`
    }
];

export default function TargetSum() {
    const { theme } = useTheme();
    const [aT, setAT] = useState(DA.join(",")), [tT, setTT] = useState(String(DT));
    const [sess, setSess] = useState(() => gen(DA, DT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)), t = parseInt(tT); if (!a.length || a.length > 5 || isNaN(t)) return; setSess(gen(a, t)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setTT(String(DT)); setSess(gen(DA, DT)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Target Sum" subtitle="+/- choices · 2^n paths · LC #494">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>nums:</span>
                <input value={aT} onChange={e => setAT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "100px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>target:</span>
                <input value={tT} onChange={e => setTT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="target_sum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🎯 Expressions: ${(step.exprs || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.exprs || []).map((e, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{e}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎯 {sess.answer} ways</span></StepInfo>
        </VizLayout>
    );
}
