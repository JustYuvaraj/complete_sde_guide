import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer,
    RecursionTreePanel, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void combIII(int k, int n, int start,` },
    { id: 1, text: `             vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    if (cur.size()==k && n==0){res.push_back(cur);return;}` },
    { id: 3, text: `    if (cur.size()==k || n<0) return;` },
    { id: 4, text: `    for (int i=start; i<=9; i++) {` },
    { id: 5, text: `        cur.push_back(i);` },
    { id: 6, text: `        combIII(k, n-i, i+1, cur, res);` },
    { id: 7, text: `        cur.pop_back();` },
    { id: 8, text: `    }` },
    { id: 9, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", prune: "#f87171", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", prune: "✂ PRUNE", pick: "✅ PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(k, n) {
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = [];
    let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });

    function solve(rem, start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `r=${rem},[${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`c3(rem=${rem},s=${start})`);
        push(0, "call", { k, rem, start, cur: `[${cur}]`, slots: k - cur.length }, `combIII(rem=${rem}, start=${start})`);
        if (cur.length === k && rem === 0) {
            result.push([...cur]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓{${cur}}`;
            push(2, "found", { cur: `[${cur}]` }, `🎯 Found [${cur}]`);
            cs.pop(); return;
        }
        if (cur.length === k || rem < 0) {
            treeNodes.find(t => t.id === `n${myId}`).status = "pruned";
            push(3, "prune", { cur: `[${cur}]`, rem, reason: cur.length === k ? "k full" : "rem<0" }, `✂ Prune`);
            cs.pop(); return;
        }
        for (let i = start; i <= 9; i++) {
            if (i > rem) break;
            cur.push(i);
            push(5, "pick", { i, "new rem": rem - i, cur: `[${cur}]` }, `Pick ${i} → rem=${rem - i}`);
            solve(rem - i, i + 1, myId);
            cur.pop();
            push(7, "back", { i, cur: `[${cur}]` }, `Backtrack: rm ${i}`);
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(n, 1, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} combinations`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find all combinations of **k numbers** from 1-9 that sum to **n**. Each number used at most once.

## How to Think About It
This is a **constrained subset** problem with TWO conditions:
1. Exactly **k** numbers in the combination
2. They must sum to exactly **n**

### Fixed Candidate Pool: {1, 2, 3, 4, 5, 6, 7, 8, 9}
No duplicates possible since candidates are 1-9. Just pick k of them that sum to n.

**Think of it like:** Choosing k playing cards (numbered 1-9) whose values add up to n.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for k=3, n=7

1. Pick 1, Pick 2, Pick 3: sum=6 ≠ 7, need 1 more but next is 4 (too big)
2. Pick 1, Pick 2, Pick 4: sum=7 = n → **FOUND** [1,2,4] ✅
3. Pick 1, Pick 2, Pick 5: sum=8 > 7 → **PRUNE**
4. Pick 1, Pick 3, Pick 3: can't (start from 4), Pick 4: sum=8 → skip
5. ...no more valid combos

Result: [[1,2,4]] ✅

### Pruning Conditions
- **cur.size() == k && n == 0:** Found valid combo!
- **cur.size() == k:** Already have k numbers but sum ≠ n, stop
- **n < 0:** Sum exceeded target, stop
- **i > remaining:** Number too big for remaining sum`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2: Found!
    if (cur.size()==k && n==0) { res.push_back(cur); return; }
**WHY both conditions?** We need exactly k numbers AND they must sum to exactly n.

### Line 3: Prune
    if (cur.size()==k || n<0) return;
**WHY:** Either we've picked k numbers (but sum wasn't right) or exceeded target.

### Line 4: Loop 1 to 9
    for (int i = start; i <= 9; i++)
**WHY start to 9?** Candidates are always 1-9. Start prevents reusing earlier numbers.

### Line 6: Recurse with i+1
    combIII(k, n-i, i+1, cur, res);
**WHY n-i?** Subtract the picked number from remaining target. i+1 ensures no reuse.

## Time & Space Complexity
- **Time:** O(C(9,k)) — at most C(9,k) combinations to explore
- **Space:** O(k) recursion depth`
    },
];

const DK = 3, DN = 7;
export default function CombinationSumIII() {
    const { theme } = useTheme();
    const [kT, setKT] = useState(String(DK)), [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DK, DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 950);
    const run = () => { const k = parseInt(kT), n = parseInt(nT); if (isNaN(k) || isNaN(n) || k < 1 || k > 4 || n < 1 || n > 30) return; setSess(gen(k, n)); setIdx(0); setPlaying(false); };
    const reset = () => { setKT(String(DK)); setNT(String(DN)); setSess(gen(DK, DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Combination Sum III" subtitle="Pick k from 1–9, sum=n · LC #216">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>k:</span>
                <input value={kT} onChange={e => setKT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>n:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="comb_sum_iii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🎯 Combos: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}=${s.reduce((a, b) => a + b, 0)}`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎯 {sess.result.length} combos</span></StepInfo>
        </VizLayout>
    );
}
