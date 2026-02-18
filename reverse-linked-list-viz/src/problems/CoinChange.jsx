import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int coinChange(vector<int>& coins, int amount) {` },
    { id: 1, text: `    if (amount == 0) return 0;` },
    { id: 2, text: `    if (amount < 0) return -1;` },
    { id: 3, text: `    int best = INT_MAX;` },
    { id: 4, text: `    for (int c : coins) {` },
    { id: 5, text: `        int sub = coinChange(coins, amount - c);` },
    { id: 6, text: `        if (sub >= 0)` },
    { id: 7, text: `            best = min(best, sub + 1);` },
    { id: 8, text: `    }` },
    { id: 9, text: `    return best == INT_MAX ? -1 : best;` },
    { id: 10, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#10b981", neg: "#f87171", try: "#3b82f6", better: "#10b981", ret: "#ec4899", done: "#10b981", fail: "#f87171" };
const PL = { call: "📞 CALL", base: "🟢 BASE", neg: "❌ NEG", try: "🪙 TRY", better: "✅ BETTER", ret: "🟣 RETURN", done: "✅ DONE", fail: "❌ FAIL" };

function gen(coins, amount) {
    const steps = [], cs = [], memo = {};
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(amt, parentId) {
        if (cnt >= MAX) return -2;
        if (memo[amt] !== undefined) return memo[amt];
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `cc(${amt})`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`cc(${amt})`);
        push(0, "call", { amount: amt }, `coinChange(${amt})`);
        if (amt === 0) { treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `0`; push(1, "base", { return: 0 }, `Base: 0`); cs.pop(); memo[amt] = 0; return 0; }
        if (amt < 0) { treeNodes.find(t => t.id === `n${myId}`).status = "pruned"; treeNodes.find(t => t.id === `n${myId}`).label = `✗`; push(2, "neg", { amount: amt }, `Negative → -1`); cs.pop(); memo[amt] = -1; return -1; }
        let best = Infinity;
        for (const c of coins) {
            if (cnt >= MAX) break;
            push(5, "try", { coin: c, "amt-c": amt - c }, `Try coin ${c}`);
            const sub = solve(amt - c, myId);
            if (sub >= 0 && sub + 1 < best) { best = sub + 1; push(7, "better", { coin: c, sub, "new best": best }, `best=${best}`); }
        }
        const ret = best === Infinity ? -1 : best;
        treeNodes.find(t => t.id === `n${myId}`).status = ret >= 0 ? "done" : "pruned";
        treeNodes.find(t => t.id === `n${myId}`).label = `${ret}`;
        push(9, "ret", { amount: amt, return: ret }, `cc(${amt})=${ret}`);
        cs.pop(); memo[amt] = ret; return ret;
    }
    const ans = solve(amount, null);
    push(0, ans >= 0 ? "done" : "fail", { ANSWER: ans }, ans >= 0 ? `✅ Min coins = ${ans}` : `❌ Not possible`);
    return { steps, answer: ans };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the **minimum number of coins** to make a target amount. Coins can be used unlimited times. E.g., coins=[1,5,11], amount=15 → 3 coins (5+5+5).

## How to Think About It
**For each amount**, try subtracting each coin. Take the minimum.

### Recursion: coinChange(amount)
- Base: amount=0 → 0 coins needed
- Try each coin c: 1 + coinChange(amount - c)
- Return minimum across all coins

**Think of it like:** Making change at a store. Try each coin denomination and pick the fewest total.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## DP Bottom-Up Approach

    dp[i] = min coins for amount i
    dp[0] = 0
    dp[i] = min(dp[i-c] + 1) for each coin c where c ≤ i

### For coins=[1,5,11], amount=15:
- dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=4
- dp[5]=1 (one 5-coin!)
- dp[10]=2, dp[11]=1 (one 11-coin!)
- dp[15] = min(dp[14]+1, dp[10]+1, dp[4]+1) = min(4, 3, 5) = **3** ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Base Case
    if (amount == 0) return 0;
    if (amount < 0) return -1;

### Recursive Choice
    for each coin: result = min(result, 1 + solve(amount - coin))

### Memoization
Without memo: exponential. With memo/DP: O(amount × coins).

## Time & Space Complexity
- **Time:** O(amount × n) where n = number of coin types
- **Space:** O(amount) for DP array`
    },
];

const DC = [1, 5, 11], DA = 15;
export default function CoinChange() {
    const { theme } = useTheme();
    const [cT, setCT] = useState(DC.join(",")), [aT, setAT] = useState(String(DA));
    const [sess, setSess] = useState(() => gen(DC, DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const c = cT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0), a = parseInt(aT); if (!c.length || c.length > 4 || isNaN(a) || a < 1 || a > 20) return; setSess(gen(c, a)); setIdx(0); setPlaying(false) };
    const reset = () => { setCT(DC.join(",")); setAT(String(DA)); setSess(gen(DC, DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Coin Change" subtitle="Min coins · Try all denominations · LC #322">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Coins:</span>
                <input value={cT} onChange={e => setCT(e.target.value)} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>amount:</span>
                <input value={aT} onChange={e => setAT(e.target.value)} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="coin_change.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.answer >= 0 ? "#10b981" : "#f87171", fontWeight: 700 }}>🪙 {sess.answer >= 0 ? `Min = ${sess.answer}` : "N/A"}</span></StepInfo>
        </VizLayout>
    );
}
