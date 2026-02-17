import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int knapsack(int W, vector<int>& wt, vector<int>& val, int i){` },
    { id: 1, text: `    if (i < 0 || W == 0) return 0;` },
    { id: 2, text: `    if (wt[i] > W)` },
    { id: 3, text: `        return knapsack(W, wt, val, i-1);` },
    { id: 4, text: `    int skip = knapsack(W, wt, val, i-1);` },
    { id: 5, text: `    int take = val[i] + knapsack(W-wt[i], wt, val, i-1);` },
    { id: 6, text: `    return max(skip, take);` },
    { id: 7, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#10b981", nofit: "#f59e0b", skip: "#64748b", take: "#3b82f6", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 BASE", nofit: "⚠ NO FIT", skip: "⏭ SKIP", take: "🎒 TAKE", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(W, wts, vals) {
    const n = wts.length, steps = [], cs = [];
    const treeNodes = []; let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, W, treeNodes: treeNodes.map(t => ({ ...t })) });
    function solve(w, i, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `W=${w},i=${i}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ks(W=${w},i=${i})`);
        push(0, "call", { W: w, i, "wt[i]": wts[i] ?? "—", "val[i]": vals[i] ?? "—" }, `knapsack(W=${w}, i=${i})`);
        if (i < 0 || w === 0) { treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `0`; push(1, "base", { W: w, i, return: 0 }, `Base → 0`); cs.pop(); return 0; }
        if (wts[i] > w) { push(2, "nofit", { i, "wt[i]": wts[i], W: w }, `wt=${wts[i]} > W=${w}, skip`); const r = solve(w, i - 1, myId); treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`; push(3, "ret", { return: r }, `Return ${r}`); cs.pop(); return r; }
        push(4, "skip", { i, decision: "SKIP" }, `Try skip item ${i}`);
        const sk = solve(w, i - 1, myId);
        cs.push(`ks(W=${w},i=${i})`);
        push(5, "take", { i, "val[i]": vals[i], decision: "TAKE", "new W": w - wts[i] }, `Try take item ${i}`);
        const tk = vals[i] + solve(w - wts[i], i - 1, myId);
        cs.push(`ks(W=${w},i=${i})`);
        const best = Math.max(sk, tk);
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        treeNodes.find(t => t.id === `n${myId}`).label = `${best}`;
        push(6, "ret", { skip: sk, take: tk, best }, `max(${sk},${tk})=${best}`);
        cs.pop(); return best;
    }
    const ans = solve(W, n - 1, null);
    push(0, "done", { ANSWER: ans }, `✅ Max value = ${ans}`);
    return { steps, answer: ans };
}

const DW = 7, DWT = [1, 3, 4, 5], DV = [1, 4, 5, 7];
export default function Knapsack() {
    const { theme } = useTheme();
    const [wT, setWT] = useState(String(DW)), [wtT, setWtT] = useState(DWT.join(",")), [vT, setVT] = useState(DV.join(","));
    const [sess, setSess] = useState(() => gen(DW, DWT, DV));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const w = parseInt(wT), wt = wtT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0), v = vT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0); if (isNaN(w) || wt.length < 1 || wt.length > 5 || wt.length !== v.length) return; setSess(gen(w, wt, v)); setIdx(0); setPlaying(false) };
    const reset = () => { setWT(String(DW)); setWtT(DWT.join(",")); setVT(DV.join(",")); setSess(gen(DW, DWT, DV)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="0/1 Knapsack" subtitle="Take or skip · Maximize value · Classic DP">
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>W:</span>
                <input value={wT} onChange={e => setWT(e.target.value)} style={{ width: "40px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>wts:</span>
                <input value={wtT} onChange={e => setWtT(e.target.value)} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>vals:</span>
                <input value={vT} onChange={e => setVT(e.target.value)} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="knapsack.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎒 Max = {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
