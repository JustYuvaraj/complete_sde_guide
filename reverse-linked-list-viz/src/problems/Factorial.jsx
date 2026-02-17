import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
    RecursionTreePanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int factorial(int n) {` },
    { id: 1, text: `    if (n <= 1) return 1;  // base` },
    { id: 2, text: `    return n * factorial(n - 1);` },
    { id: 3, text: `}` },
];

const PC = { call: "#8b5cf6", base: "#10b981", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 BASE", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(n) {
    const steps = [], cs = [];
    const treeNodes = [];
    let nid = 0;

    const push = (cl, ph, v, m) => steps.push({
        cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m,
        treeNodes: treeNodes.map(t => ({ ...t })),
    });

    function solve(val, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `f(${val})`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`f(${val})`);
        push(0, "call", { n: val }, `factorial(${val})`);

        if (val <= 1) {
            treeNodes.find(t => t.id === `n${myId}`).status = "base";
            treeNodes.find(t => t.id === `n${myId}`).label = `f(${val})=1`;
            push(1, "base", { n: val, return: 1 }, `Base: f(${val}) = 1`);
            cs.pop();
            return 1;
        }

        const sub = solve(val - 1, myId);
        cs.push(`f(${val})`);
        const result = val * sub;
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        treeNodes.find(t => t.id === `n${myId}`).label = `f(${val})=${result}`;
        push(2, "ret", { n: val, sub, return: result }, `${val} × ${sub} = ${result}`);
        cs.pop();
        return result;
    }

    const ans = solve(n, null);
    push(0, "done", { ANSWER: ans }, `✅ factorial(${n}) = ${ans}`);
    return { steps, answer: ans };
}

function BoxViz({ step }) {
    const { theme } = useTheme();
    const cs = step.callStack || [];
    return (
        <VizCard title="📦 Call Stack Boxes">
            <div style={{ display: "flex", flexDirection: "column-reverse", gap: "3px", minHeight: "30px" }}>
                {cs.length === 0 ? <span style={{ color: theme.textDim, fontSize: "0.6rem" }}>empty</span> :
                    cs.map((f, i) => (
                        <div key={i} style={{
                            padding: "5px 12px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                            background: i === cs.length - 1 ? "#1e1b4b" : theme.cardHeaderBg,
                            border: `1.5px solid ${i === cs.length - 1 ? "#8b5cf6" : theme.cardBorder}`,
                            color: i === cs.length - 1 ? "#c4b5fd" : theme.textDim,
                        }}>{f}</div>
                    ))}
            </div>
        </VizCard>
    );
}

const DN = 5;
export default function Factorial() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const n = parseInt(nT); if (isNaN(n) || n < 0 || n > 8) return; setSess(gen(n)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Factorial" subtitle="n × (n-1) × … × 1 · Simple recursion">
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="5" label="n (0–8):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="factorial.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                    <BoxViz step={step} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔢 {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
