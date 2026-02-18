import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer,
    RecursionTreePanel, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void combSum(vector<int>& c, int t, int start,` },
    { id: 1, text: `             vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    if (t == 0) { res.push_back(cur); return; }` },
    { id: 3, text: `    if (t < 0) return;  // prune` },
    { id: 4, text: `    for (int i = start; i < c.size(); i++) {` },
    { id: 5, text: `        cur.push_back(c[i]);` },
    { id: 6, text: `        combSum(c, t-c[i], i, cur, res);` },
    { id: 7, text: `        cur.pop_back();` },
    { id: 8, text: `    }` },
    { id: 9, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", prune: "#f87171", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", prune: "✂ PRUNE", pick: "✅ PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(cands, target) {
    const sorted = [...cands].sort((a, b) => a - b);
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = [];
    let nid = 0, cnt = 0;
    const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(t, start, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `t=${t},[${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`cs(t=${t},s=${start})`);
        push(0, "call", { target: t, start, cur: `[${cur}]` }, `combSum(t=${t}, start=${start})`);

        if (t === 0) {
            result.push([...cur]);
            treeNodes.find(tn => tn.id === `n${myId}`).status = "found";
            treeNodes.find(tn => tn.id === `n${myId}`).label = `✓{${cur}}`;
            push(2, "found", { cur: `[${cur}]` }, `🎯 Found [${cur}]`);
            cs.pop(); return;
        }
        if (t < 0) {
            treeNodes.find(tn => tn.id === `n${myId}`).status = "pruned";
            treeNodes.find(tn => tn.id === `n${myId}`).label = `✗ t=${t}`;
            push(3, "prune", { t }, `✂ Prune: t=${t} < 0`);
            cs.pop(); return;
        }

        for (let i = start; i < sorted.length; i++) {
            if (cnt >= MAX) break;
            if (sorted[i] > t) break;
            cur.push(sorted[i]);
            push(5, "pick", { i, "c[i]": sorted[i], "new t": t - sorted[i], cur: `[${cur}]` }, `Pick ${sorted[i]} → t=${t - sorted[i]}`);
            solve(t - sorted[i], i, myId);
            cur.pop();
            if (cnt < MAX) { cs.push(`cs(t=${t},s=${start})`); push(7, "back", { i, removed: sorted[i], cur: `[${cur}]` }, `Backtrack: rm ${sorted[i]}`); cs.pop(); }
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
Find all **unique combinations** of candidates that sum to target. Each candidate can be used **unlimited times**. E.g., [2,3,6,7], target=7 → [[2,2,3],[7]]

## How to Think About It
**Ask yourself:** "At each step, which candidates can I try adding?"

### Why Unlimited Reuse?
- When we pick candidate c[i], we recurse with start=**i** (not i+1)
- This means we can pick the same candidate again
- Target decreases by c[i] each time

**Think of it like:** Making change for 7 cents using coins [2,3,6,7]. You can use as many of each coin as needed.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for candidates=[2,3,6,7], target=7

1. Pick 2 (t=5) → Pick 2 (t=3) → Pick 2 (t=1) → Pick 2 (t=-1) → **PRUNE** (t<0)
2. Back, pick 3 (t=-2) → **PRUNE**
3. Back to t=3, pick 3 (t=0) → **FOUND** [2,2,3] ✅
4. Back to t=5, pick 3 (t=2) → pick 3 (t=-1) → **PRUNE**
5. ...eventually pick 7 (t=0) → **FOUND** [7] ✅

### Pruning is Critical
- If target < 0 → overshot, stop
- If candidate > remaining target → skip (sort helps here)
- Sorting candidates lets us break early`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2: Found!
    if (t == 0) { res.push_back(cur); return; }
**WHY:** Target exactly 0 means current combination sums to target. Save it!

### Line 3: Prune
    if (t < 0) return;
**WHY:** Overshot the target. No point exploring further.

### Line 4: Loop from start (not 0)
    for (int i = start; ...)
**WHY start?** To avoid duplicate combinations like [2,3] and [3,2]. Only go forward.

### Line 6: Recurse with i (not i+1)
    combSum(c, t-c[i], i, cur, res);
**WHY i and not i+1?** This allows reusing the same candidate. If you use i+1, each element can only be used once.

## Time & Space Complexity
- **Time:** O(n^(t/min)) where min is smallest candidate
- **Space:** O(t/min) recursion depth`
    },
];

const DC = [2, 3, 6, 7], DT = 7;
export default function CombinationSum() {
    const { theme } = useTheme();
    const [cT, setCT] = useState(DC.join(",")), [tT, setTT] = useState(String(DT));
    const [sess, setSess] = useState(() => gen(DC, DT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 950);
    const run = () => { const c = cT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0), t = parseInt(tT); if (!c.length || c.length > 5 || isNaN(t) || t < 1 || t > 15) return; setSess(gen(c, t)); setIdx(0); setPlaying(false); };
    const reset = () => { setCT(DC.join(",")); setTT(String(DT)); setSess(gen(DC, DT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Combination Sum" subtitle="Unlimited reuse · Include/Skip · LC #39">
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
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="combination_sum.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🎯 Combinations: ${(step.result || []).length}`}>
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
