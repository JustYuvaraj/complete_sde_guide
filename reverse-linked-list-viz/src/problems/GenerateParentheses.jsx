import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void generate(int open, int close, int n,` },
    { id: 1, text: `              string& cur, vector<string>& res){` },
    { id: 2, text: `    if (cur.size() == 2*n) {` },
    { id: 3, text: `        res.push_back(cur); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    if (open < n) {` },
    { id: 6, text: `        cur += '(';` },
    { id: 7, text: `        generate(open+1, close, n, cur, res);` },
    { id: 8, text: `        cur.pop_back();` },
    { id: 9, text: `    }` },
    { id: 10, text: `    if (close < open) {` },
    { id: 11, text: `        cur += ')';` },
    { id: 12, text: `        generate(open, close+1, n, cur, res);` },
    { id: 13, text: `        cur.pop_back();` },
    { id: 14, text: `    }` },
    { id: 15, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", addOpen: "#3b82f6", addClose: "#f59e0b", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", addOpen: "( OPEN", addClose: ") CLOSE", back: "↩ BACK", done: "✅ DONE" };

function gen(n) {
    const steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    let cur = "";
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, cur, result: [...result], treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(open, close, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `"${cur}" o=${open} c=${close}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`g(o=${open},c=${close})`);
        push(0, "call", { open, close, cur: `"${cur}"` }, `generate(open=${open}, close=${close})`);

        if (cur.length === 2 * n) {
            result.push(cur);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `"${cur}" ✓`;
            push(3, "found", { cur: `"${cur}"`, "#": result.length }, `🎯 Found "${cur}"`);
            cs.pop(); return;
        }

        if (open < n) {
            cur += "(";
            push(6, "addOpen", { open, close, cur: `"${cur}"` }, `Add '(' → "${cur}"`);
            solve(open + 1, close, myId);
            cur = cur.slice(0, -1);
            if (cnt < MAX) { push(8, "back", { cur: `"${cur}"` }, `Remove '(' ← "${cur}"`); }
        }

        if (close < open) {
            cur += ")";
            push(11, "addClose", { open, close, cur: `"${cur}"` }, `Add ')' → "${cur}"`);
            solve(open, close + 1, myId);
            cur = cur.slice(0, -1);
            if (cnt < MAX) { push(13, "back", { cur: `"${cur}"` }, `Remove ')' ← "${cur}"`); }
        }

        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, 0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} valid combinations`);
    return { steps, result };
}

function ParenViz({ cur }) {
    const { theme } = useTheme();
    return (
        <VizCard title="🔤 Current String">
            <div style={{ display: "flex", gap: "3px", minHeight: "36px", alignItems: "center", flexWrap: "wrap" }}>
                {cur.length === 0 ? <span style={{ color: theme.textDim, fontSize: "0.65rem" }}>empty</span> :
                    cur.split("").map((ch, i) => (
                        <span key={i} style={{
                            width: "28px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px", fontSize: "1rem", fontWeight: 800,
                            background: ch === "(" ? "#1e3a5f" : "#3d2e0a",
                            border: `1.5px solid ${ch === "(" ? "#3b82f6" : "#f59e0b"}`,
                            color: ch === "(" ? "#93c5fd" : "#fcd34d",
                        }}>{ch}</span>
                    ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Generate all valid combinations of **n** pairs of parentheses. E.g., n=3 → ["((()))","(()())","(())()","()(())","()()()"]

## How to Think About It
**Two counters:** open and close. At each step, decide: add '(' or add ')'?

### Rules:
1. Can add '(' if open < n (haven't used all opening parens)
2. Can add ')' if close < open (can't close what isn't opened)

**Think of it like:** A stack. '(' pushes, ')' pops. You can never pop from an empty stack, and you must use exactly n of each.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for n=3

1. "" → add '(' → "("
2. "(" → add '(' → "(("
3. "((" → add '(' → "((("
4. "(((" → can't add more '(', add ')' → "((()" → "(()" → "((()))"
5. 🎯 Found "((()))" ✅
6. Backtrack... try ')' earlier → "(()" → "(()())"
7. 🎯 Found "(()())" ✅
8. Continue exploring all valid paths...

Result: 5 valid combinations for n=3 ✅

### Count = Catalan Number
C(3) = 5, C(4) = 14, C(5) = 42`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2-3: Base Case
    if (cur.size() == 2*n) { res.push_back(cur); return; }
**WHY 2*n?** We need exactly n '(' and n ')' = 2n total characters.

### Line 5-8: Add Open Paren
    if (open < n) { cur += '('; generate(open+1, close, ...); cur.pop_back(); }
**WHY open < n?** We can only use n opening parentheses total.

### Line 10-13: Add Close Paren
    if (close < open) { cur += ')'; generate(open, close+1, ...); cur.pop_back(); }
**WHY close < open?** Every ')' must match an earlier '('. Can't close more than opened.

## Time & Space Complexity
- **Time:** O(4^n / √n) — Catalan number growth
- **Space:** O(n) recursion depth`
    },
];

const DN = 3;
export default function GenerateParentheses() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const n = parseInt(nT); if (isNaN(n) || n < 1 || n > 4) return; setSess(gen(n)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Generate Parentheses" subtitle="Open/Close counters · Backtracking · LC #22">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="3" label="n (1–4):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="generate_parentheses.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ParenViz cur={step.cur || ""} />
                    <VizCard title={`✅ Results: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80", fontFamily: "monospace" }}>{s}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🎯 {sess.result.length} combos</span></StepInfo>
        </VizLayout>
    );
}
