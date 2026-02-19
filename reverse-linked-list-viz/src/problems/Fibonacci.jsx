import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
    RecursionTreePanel, ExplainPanel,
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

        // highlight the if-check line
        push(1, val <= 1 ? "base" : "call", { n: val, "n<=1": val <= 1 }, val <= 1 ? `n=${val} ≤ 1 → base!` : `n=${val} > 1 → recurse`);

        if (val <= 1) {
            treeNodes.find(t => t.id === `n${myId}`).status = "base";
            treeNodes.find(t => t.id === `n${myId}`).label = `f(${val})=${val}`;
            push(1, "base", { n: val, return: val }, `Base: fib(${val}) = ${val}`);
            cs.pop(); return val;
        }

        // highlight line 2 before calling fib(n-1)
        push(2, "call", { n: val, "calling": `fib(${val - 1})` }, `Calling fib(${val - 1})…`);
        const left = solve(val - 1, myId);
        if (cnt >= MAX) { cs.pop(); return 0; }
        // highlight line 2 before calling fib(n-2)
        push(2, "call", { n: val, left, "calling": `fib(${val - 2})` }, `Got fib(${val - 1})=${left}, calling fib(${val - 2})…`);
        const right = solve(val - 2, myId);
        if (cnt >= MAX) { cs.pop(); return 0; }

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

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given n, find the **nth Fibonacci number**: 0, 1, 1, 2, 3, 5, 8, 13, 21...
Each number = sum of the **two previous** numbers.

## How to Think About It
**Ask yourself:** "Can I break this problem into smaller identical problems?"

### The Recursive Insight
- To find fib(5), I need fib(4) + fib(3)
- To find fib(4), I need fib(3) + fib(2)
- ...until I hit the base cases: fib(0)=0, fib(1)=1

**Think of it like:** A tree that branches into TWO smaller problems at each level. This is the simplest example of **binary recursion**.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for fib(5)

1. fib(5) calls fib(4) and fib(3)
2. fib(4) calls fib(3) and fib(2)
3. fib(3) calls fib(2) and fib(1)
4. fib(2) calls fib(1) and fib(0)
5. fib(1) → **BASE CASE** returns 1
6. fib(0) → **BASE CASE** returns 0
7. Results bubble up: fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5 ✅

### Why It's Inefficient
- fib(3) is computed **2 times**
- fib(2) is computed **3 times**
- This leads to **O(2^n)** time — exponential!

### How to Fix: Memoization
- Store computed results in a cache
- Before computing, check if answer exists
- Reduces to **O(n)** time`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    int fib(int n)
Takes integer n, returns the nth Fibonacci number.

### Line 2: Base Case
    if (n <= 1) return n;
**WHY:** fib(0)=0, fib(1)=1 — these are defined, not computed. Without base cases, recursion never stops → stack overflow!

### Line 3: Recursive Case
    return fib(n-1) + fib(n-2);
**WHY n-1 and n-2?** By definition, each Fibonacci number is the sum of the two before it. We trust that the recursive calls will return correct values ("leap of faith").

## Time & Space Complexity
- **Time:** O(2^n) — each call branches into 2, creating an exponential tree
- **Space:** O(n) — maximum recursion depth equals n
- **With memoization:** O(n) time, O(n) space`
    },
];

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
            <ExplainPanel sections={EXPLAIN} />
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
