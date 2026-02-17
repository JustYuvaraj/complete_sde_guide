import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
    RecursionTreePanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int fib(int n) {` },
    { id: 1, text: `    if (n <= 1) return n;  // base` },
    { id: 2, text: `    return fib(n-1) + fib(n-2);` },
    { id: 3, text: `}` },
];

const PC = { call: "#8b5cf6", base: "#10b981", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 BASE", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(n) {
    const steps = [], cs = [];
    const treeNodes = [];
    let nid = 0, cnt = 0;
    const MAX = 300;

    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(val, parentId) {
        if (cnt >= MAX) return 0;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `f(${val})`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`fib(${val})`);
        push(0, "call", { n: val }, `fib(${val})`);

        if (val <= 1) {
            treeNodes.find(t => t.id === `n${myId}`).status = "base";
            treeNodes.find(t => t.id === `n${myId}`).label = `f(${val})=${val}`;
            push(1, "base", { n: val, return: val }, `Base: fib(${val}) = ${val}`);
            cs.pop(); return val;
        }

        const left = solve(val - 1, myId);
        if (cnt >= MAX) { cs.pop(); return 0; }
        cs.push(`fib(${val})`);
        const right = solve(val - 2, myId);
        if (cnt >= MAX) { cs.pop(); return 0; }
        cs.push(`fib(${val})`);

        const result = left + right;
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        treeNodes.find(t => t.id === `n${myId}`).label = `f(${val})=${result}`;
        push(2, "ret", { n: val, left, right, return: result }, `fib(${val}) = ${left} + ${right} = ${result}`);
        cs.pop(); return result;
    }

    const ans = solve(n, null);
    push(0, "done", { ANSWER: ans }, `✅ fib(${n}) = ${ans}`);
    return { steps, answer: ans };
}

const DN = 5;
export default function Fibonacci() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1000);
    const run = () => { const n = parseInt(nT); if (isNaN(n) || n < 0 || n > 7) return; setSess(gen(n)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Fibonacci Number" subtitle="fib(n) = fib(n-1) + fib(n-2) · LC #509">
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="5" label="n (0–7):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="fibonacci.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔢 fib = {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
