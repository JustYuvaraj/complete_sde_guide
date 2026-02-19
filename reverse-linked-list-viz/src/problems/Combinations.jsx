import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void combine(int n, int k, int start,` },
    { id: 1, text: `             vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    if (cur.size() == k) {` },
    { id: 3, text: `        res.push_back(cur); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    for (int i=start; i<=n; i++) {` },
    { id: 6, text: `        cur.push_back(i);` },
    { id: 7, text: `        combine(n, k, i+1, cur, res);` },
    { id: 8, text: `        cur.pop_back();` },
    { id: 9, text: `    }` },
    { id: 10, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", pick: "✅ PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(n, k) {
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = []; let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });
    function solve(start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `s=${start},[${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`C(s=${start})`);
        push(0, "call", { n, k, start, cur: `[${cur}]`, slots: k - cur.length }, `combine(start=${start})`);
        if (cur.length === k) {
            result.push([...cur]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓{${cur}}`;
            push(3, "found", { cur: `[${cur}]` }, `🎯 Found [${cur}]`); cs.pop(); return;
        }
        for (let i = start; i <= n; i++) {
            if (n - i + 1 < k - cur.length) break;
            cur.push(i);
            push(6, "pick", { i, cur: `[${cur}]` }, `Pick ${i}`);
            solve(i + 1, myId);
            cur.pop();
            push(8, "back", { i, cur: `[${cur}]` }, `Backtrack: rm ${i}`);
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(1, null);
    push(0, "done", { total: result.length }, `✅ C(${n},${k}) = ${result.length} combinations`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Return all combinations of **k** numbers chosen from **1 to n**. Order doesn't matter. E.g., n=4, k=2 → [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

## How to Think About It
This is the classic **nCr** (n choose r) problem.

**Ask yourself:** "For each number, do I include it or not?"

### Why Loop from start?
To avoid duplicates like [1,2] and [2,1], we only pick numbers **greater than** what we've already picked.

**Think of it like:** Picking k players from a team of n. You always pick in ascending order of jersey number to avoid counting the same team twice.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for n=4, k=2

1. Pick 1, then try 2 → [1,2] 🎯 size=k, **FOUND**
2. Back, try 3 → [1,3] 🎯 **FOUND**
3. Back, try 4 → [1,4] 🎯 **FOUND**
4. Back to start, pick 2, try 3 → [2,3] 🎯 **FOUND**
5. Back, try 4 → [2,4] 🎯 **FOUND**
6. Back, pick 3, try 4 → [3,4] 🎯 **FOUND**

Result: C(4,2) = **6** combinations ✅

### Pruning Optimization
If remaining numbers (n-i+1) < remaining slots (k-cur.size), we can't fill the combination. Break early!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2-3: Base Case
    if (cur.size() == k) { res.push_back(cur); return; }
**WHY:** We've picked exactly k numbers. Save this combination.

### Line 5: Loop from start to n
    for (int i = start; i <= n; i++)
**WHY start?** Only pick numbers larger than the last picked. This ensures combinations (not permutations).

### Line 6-8: Pick + Recurse + Backtrack
    cur.push_back(i);
    combine(n, k, i+1, cur, res);
    cur.pop_back();
**WHY i+1?** After picking i, only consider numbers > i to maintain sorted order.

## Time & Space Complexity
- **Time:** O(k × C(n,k)) — C(n,k) combinations, each copied in O(k)
- **Space:** O(k) recursion depth`
    },
];

const DN = 4, DK = 2;
export default function Combinations() {
    const { theme } = useTheme();
    const [nT, setNT] = useState(String(DN)), [kT, setKT] = useState(String(DK));
    const [sess, setSess] = useState(() => gen(DN, DK));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 950);
    const run = () => { const n = parseInt(nT), k = parseInt(kT); if (isNaN(n) || isNaN(k) || n < 1 || n > 6 || k < 1 || k > n) return; setSess(gen(n, k)); setIdx(0); setPlaying(false) };
    const reset = () => { setNT(String(DN)); setKT(String(DK)); setSess(gen(DN, DK)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Combinations (nCr)" subtitle="Pick r from 1..n · LC #77">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>n:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>k:</span>
                <input value={kT} onChange={e => setKT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="combinations.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`📦 Combos: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📦 C({nT},{kT}) = {sess.result.length}</span></StepInfo>
        </VizLayout>
    );
}
