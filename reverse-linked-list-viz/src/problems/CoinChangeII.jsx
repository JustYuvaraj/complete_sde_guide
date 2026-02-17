import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int change(vector<int>& coins, int amount, int i) {` },
    { id: 1, text: `    if (amount == 0) return 1;` },
    { id: 2, text: `    if (amount < 0 || i >= coins.size()) return 0;` },
    { id: 3, text: `    int skip = change(coins, amount, i+1);` },
    { id: 4, text: `    int take = change(coins, amount-coins[i], i);` },
    { id: 5, text: `    return skip + take;` },
    { id: 6, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", prune: "#f87171", skip: "#f59e0b", take: "#3b82f6", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 WAY!", prune: "✂ PRUNE", skip: "⏭ SKIP", take: "🪙 TAKE", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(coins, amount) {
    const steps = [], cs = [], combos = [], cur = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, combos: [...combos], current: [...cur], treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(amt, i, parentId) {
        if (cnt >= MAX) return 0;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `a=${amt},i=${i}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ch(${amt},i=${i})`);
        push(0, "call", { amount: amt, i, "coin[i]": coins[i] ?? "—" }, `change(${amt}, i=${i})`);
        if (amt === 0) { combos.push([...cur]); treeNodes.find(t => t.id === `n${myId}`).status = "found"; treeNodes.find(t => t.id === `n${myId}`).label = `✓`; push(1, "found", { cur: `[${cur}]` }, `🎯 Way #${combos.length}`); cs.pop(); return 1; }
        if (amt < 0 || i >= coins.length) { treeNodes.find(t => t.id === `n${myId}`).status = "pruned"; treeNodes.find(t => t.id === `n${myId}`).label = `✗`; push(2, "prune", { amt, i }, `✂ ${amt < 0 ? "neg" : "end"}`); cs.pop(); return 0; }
        push(3, "skip", { i, "coin": coins[i] }, `Skip coin ${coins[i]}`);
        const sk = solve(amt, i + 1, myId);
        cs.push(`ch(${amt},i=${i})`);
        cur.push(coins[i]);
        push(4, "take", { i, "coin": coins[i], "new amt": amt - coins[i] }, `Take coin ${coins[i]}`);
        const tk = solve(amt - coins[i], i, myId);
        cur.pop();
        cs.push(`ch(${amt},i=${i})`);
        const r = sk + tk;
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
        push(5, "ret", { skip: sk, take: tk, total: r }, `${sk}+${tk}=${r}`);
        cs.pop(); return r;
    }
    const ans = solve(amount, 0, null);
    push(0, "done", { ANSWER: ans }, `✅ ${ans} ways`);
    return { steps, answer: ans };
}

const DC = [1, 2, 5], DA = 5;
export default function CoinChangeII() {
    const { theme } = useTheme();
    const [cT, setCT] = useState(DC.join(",")), [aT, setAT] = useState(String(DA));
    const [sess, setSess] = useState(() => gen(DC, DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const c = cT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0), a = parseInt(aT); if (!c.length || c.length > 4 || isNaN(a) || a < 1 || a > 12) return; setSess(gen(c, a)); setIdx(0); setPlaying(false) };
    const reset = () => { setCT(DC.join(",")); setAT(String(DA)); setSess(gen(DC, DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Coin Change II" subtitle="Count ways · Unlimited picks · LC #518">
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Coins:</span>
                <input value={cT} onChange={e => setCT(e.target.value)} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>amount:</span>
                <input value={aT} onChange={e => setAT(e.target.value)} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="coin_change_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🪙 Ways: ${(step.combos || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.combos || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🪙 {sess.answer} ways</span></StepInfo>
        </VizLayout>
    );
}
