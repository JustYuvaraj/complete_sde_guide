import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer,
    RecursionTreePanel, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void combSumII(vector<int>& c, int t, int start,` },
    { id: 1, text: `               vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    if (t == 0) { res.push_back(cur); return; }` },
    { id: 3, text: `    for (int i = start; i < c.size(); i++) {` },
    { id: 4, text: `        if (i>start && c[i]==c[i-1]) continue;` },
    { id: 5, text: `        if (c[i] > t) break;` },
    { id: 6, text: `        cur.push_back(c[i]);` },
    { id: 7, text: `        combSumII(c, t-c[i], i+1, cur, res);` },
    { id: 8, text: `        cur.pop_back();` },
    { id: 9, text: `    }` },
    { id: 10, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", skipDup: "#f59e0b", prune: "#f87171", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", skipDup: "⏭ SKIP DUP", prune: "✂ PRUNE", pick: "✅ PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(cands, target) {
    const sorted = [...cands].sort((a, b) => a - b);
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = [];
    let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), target, treeNodes: treeNodes.map(t => ({ ...t })) });

    function solve(t, start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `t=${t},[${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`cs(t=${t},s=${start})`);
        push(0, "call", { target: t, start, cur: `[${cur}]` }, `combSumII(t=${t}, start=${start})`);
        if (t === 0) {
            result.push([...cur]);
            treeNodes.find(tn => tn.id === `n${myId}`).status = "found";
            treeNodes.find(tn => tn.id === `n${myId}`).label = `✓{${cur}}`;
            push(2, "found", { cur: `[${cur}]` }, `🎯 Found [${cur}]`);
            cs.pop(); return;
        }
        for (let i = start; i < sorted.length; i++) {
            if (i > start && sorted[i] === sorted[i - 1]) { push(4, "skipDup", { i, "c[i]": sorted[i] }, `Skip dup c[${i}]=${sorted[i]}`); continue; }
            if (sorted[i] > t) { push(5, "prune", { i, "c[i]": sorted[i], t }, `Prune: ${sorted[i]} > ${t}`); break; }
            cur.push(sorted[i]);
            push(6, "pick", { i, "c[i]": sorted[i], "new t": t - sorted[i], cur: `[${cur}]` }, `Pick ${sorted[i]} → t=${t - sorted[i]}`);
            solve(t - sorted[i], i + 1, myId);
            cur.pop();
            push(8, "back", { i, removed: sorted[i], cur: `[${cur}]` }, `Backtrack: rm ${sorted[i]}`);
        }
        treeNodes.find(tn => tn.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(target, 0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} combinations`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Like Combination Sum but each number can only be used **once**, and the array may contain **duplicates**. Find unique combos summing to target.

## How to Think About It
This combines TWO techniques:
1. **Use once:** Recurse with i+1 (not i) so each element is picked at most once
2. **Skip duplicates:** Sort + skip same value at same recursion level

**Think of it like:** You have a bag of coins (some identical). Pick coins that sum to target, but you can't use any single coin twice, and don't count the same combination twice.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [10,1,2,7,6,1,5], target=8

1. Sort: [1,1,2,5,6,7,10]
2. Pick 1 → Pick 1 → Pick 2 → t=4, Pick 5 → t=-1 → **PRUNE**
3. Back, Pick 6 → t=-2 → **PRUNE**, try more...
4. Eventually find [1,1,6] (t=0) → **FOUND** ✅
5. Find [1,2,5], [1,7], [2,6] ✅

### Three Pruning Rules
- **t < 0:** Overshot target → prune
- **c[i] > t:** Current candidate too big (sorted) → break
- **i > start && c[i] == c[i-1]:** Duplicate at same level → skip`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2: Found!
    if (t == 0) { res.push_back(cur); return; }

### Line 4: Skip Duplicates
    if (i > start && c[i] == c[i-1]) continue;
**WHY:** Same value already tried at this level. Skip to avoid duplicate combos.

### Line 5: Early Break
    if (c[i] > t) break;
**WHY:** Array is sorted. If current value exceeds remaining target, all later values will too.

### Line 7: Recurse with i+1
    combSumII(c, t-c[i], i+1, cur, res);
**WHY i+1?** Each element can be used only once, so move to next index.

## Time & Space Complexity
- **Time:** O(2^n) in worst case
- **Space:** O(n) recursion depth`
    },
];

const DC = [10, 1, 2, 7, 6, 1, 5], DT = 8;
export default function CombinationSumII() {
    const { theme } = useTheme();
    const [cT, setCT] = useState(DC.join(",")), [tT, setTT] = useState(String(DT));
    const [sess, setSess] = useState(() => gen(DC, DT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 950);
    const run = () => { const c = cT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0), t = parseInt(tT); if (!c.length || c.length > 7 || isNaN(t) || t < 1 || t > 30) return; const s = gen(c, t); setSess(s); setIdx(0); setPlaying(false); };
    const reset = () => { setCT(DC.join(",")); setTT(String(DT)); setSess(gen(DC, DT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Combination Sum II" subtitle="Each element once · Skip duplicates · LC #40">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Cands:</span>
                <input value={cT} onChange={e => setCT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "100px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>target:</span>
                <input value={tT} onChange={e => setTT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="combination_sum_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🎯 Combos: ${(step.result || []).length}`}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>
                            {(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}=${s.reduce((a, b) => a + b, 0)}`}</span>))}
                        </div>
                    </VizCard>
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
