import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer,
    RecursionTreePanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `double myPow(double x, int n) {` },
    { id: 1, text: `    if (n == 0) return 1;     // base` },
    { id: 2, text: `    if (n < 0)  return 1/myPow(x,-n);` },
    { id: 3, text: `    if (n % 2 == 0) {         // even` },
    { id: 4, text: `        double half = myPow(x, n/2);` },
    { id: 5, text: `        return half * half;` },
    { id: 6, text: `    }` },
    { id: 7, text: `    return x * myPow(x, n-1); // odd` },
    { id: 8, text: `}` },
];

const PC = { call: "#8b5cf6", base: "#10b981", even: "#3b82f6", odd: "#f59e0b", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 BASE", even: "➗ EVEN", odd: "🔢 ODD", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(x, n) {
    const steps = [], cs = [];
    const treeNodes = [];
    let nid = 0;

    const push = (cl, ph, v, m) => steps.push({
        cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m,
        treeNodes: treeNodes.map(t => ({ ...t })),
    });

    function solve(base, exp, parentId) {
        const myId = nid++;
        const label = `pow(${base},${exp})`;
        treeNodes.push({ id: `n${myId}`, label, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`pow(${base},${exp})`);
        push(0, "call", { x: base, n: exp }, `myPow(${base}, ${exp})`);

        if (exp === 0) {
            treeNodes.find(t => t.id === `n${myId}`).status = "base";
            treeNodes.find(t => t.id === `n${myId}`).label = `pow(${base},0)=1`;
            push(1, "base", { return: 1 }, `Base: n=0 → 1`);
            cs.pop(); return 1;
        }

        let result;
        if (exp % 2 === 0) {
            push(3, "even", { n: exp, strategy: "halve" }, `Even: pow(${base},${exp / 2}) then square`);
            const half = solve(base, exp / 2, myId);
            cs.push(`pow(${base},${exp})`);
            result = half * half;
            push(5, "ret", { half, result: +result.toFixed(6) }, `${half} × ${half} = ${+result.toFixed(6)}`);
        } else {
            push(7, "odd", { n: exp, strategy: "subtract 1" }, `Odd: ${base} × pow(${base},${exp - 1})`);
            const sub = solve(base, exp - 1, myId);
            cs.push(`pow(${base},${exp})`);
            result = base * sub;
            push(7, "ret", { x: base, sub: +sub.toFixed(6), result: +result.toFixed(6) }, `${base} × ${+sub.toFixed(6)} = ${+result.toFixed(6)}`);
        }

        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        treeNodes.find(t => t.id === `n${myId}`).label = `${+result.toFixed(4)}`;
        cs.pop(); return result;
    }

    const ans = solve(x, Math.abs(n), null);
    const finalAns = n < 0 ? 1 / ans : ans;
    push(0, "done", { ANSWER: +finalAns.toFixed(6) }, `✅ ${x}^${n} = ${+finalAns.toFixed(6)}`);
    return { steps, answer: +finalAns.toFixed(6) };
}

const DX = 2, DN = 10;
export default function Power() {
    const { theme } = useTheme();
    const [xT, setXT] = useState(String(DX)), [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DX, DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const x = parseFloat(xT), n = parseInt(nT); if (isNaN(x) || isNaN(n) || Math.abs(n) > 20) return; setSess(gen(x, n)); setIdx(0); setPlaying(false); };
    const reset = () => { setXT(String(DX)); setNT(String(DN)); setSess(gen(DX, DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Power of x^n" subtitle="O(log n) fast exponentiation · LC #50">
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>x:</span>
                <input value={xT} onChange={e => setXT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>n:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="power.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>⚡ {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
