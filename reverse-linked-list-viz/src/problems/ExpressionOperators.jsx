import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void addOperators(string num, int idx, long prev,` },
    { id: 1, text: `    long cur, int target, string expr, vector<string>& res){` },
    { id: 2, text: `    if (idx == num.size()) {` },
    { id: 3, text: `        if (cur == target) res.push_back(expr);` },
    { id: 4, text: `        return;` },
    { id: 5, text: `    }` },
    { id: 6, text: `    for (int i = idx; i < num.size(); i++) {` },
    { id: 7, text: `        if (i > idx && num[idx]=='0') break;` },
    { id: 8, text: `        long operand = stol(num.substr(idx, i-idx+1));` },
    { id: 9, text: `        if (idx == 0)` },
    { id: 10, text: `            addOp(num, i+1, op, op, target, str(op), res);` },
    { id: 11, text: `        else {` },
    { id: 12, text: `            /* try +, -, * */` },
    { id: 13, text: `        }` },
    { id: 14, text: `    }` },
    { id: 15, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", try: "#3b82f6", miss: "#f87171", back: "#ec4899", zero: "#f87171", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 MATCH", try: "🔢 TRY", miss: "✗ MISS", back: "↩ BACK", zero: "0️⃣ LEADING ZERO", done: "✅ DONE" };

function gen(num, target) {
    const steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, result: [...result], treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(idx, prev, cur, expr, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `${expr}=${cur}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ao(i=${idx})`);
        push(0, "call", { idx, prev, cur, expr: `"${expr}"` }, `addOp(idx=${idx}, cur=${cur})`);

        if (idx === num.length) {
            if (cur === target) {
                result.push(expr);
                treeNodes.find(t => t.id === `n${myId}`).status = "found";
                treeNodes.find(t => t.id === `n${myId}`).label = `✓ ${expr}`;
                push(3, "found", { expr: `"${expr}"`, value: cur }, `🎯 ${expr} = ${target}`);
            } else {
                treeNodes.find(t => t.id === `n${myId}`).status = "pruned";
                push(3, "miss", { expr: `"${expr}"`, value: cur, target }, `${expr} = ${cur} ≠ ${target}`);
            }
            cs.pop(); return;
        }

        for (let i = idx; i < num.length; i++) {
            if (cnt >= MAX) break;
            if (i > idx && num[idx] === "0") {
                push(7, "zero", { sub: num.substring(idx, i + 1) }, `Leading zero → break`);
                break;
            }
            const operand = parseInt(num.substring(idx, i + 1));
            if (idx === 0) {
                push(10, "try", { operand, expr: `"${operand}"` }, `First num: ${operand}`);
                solve(i + 1, operand, operand, `${operand}`, myId);
            } else {
                // +
                push(12, "try", { op: "+", operand, expr: `"${expr}+${operand}"` }, `Try ${expr}+${operand}`);
                solve(i + 1, operand, cur + operand, `${expr}+${operand}`, myId);
                // -
                if (cnt < MAX) {
                    push(12, "try", { op: "-", operand, expr: `"${expr}-${operand}"` }, `Try ${expr}-${operand}`);
                    solve(i + 1, -operand, cur - operand, `${expr}-${operand}`, myId);
                }
                // *
                if (cnt < MAX) {
                    push(12, "try", { op: "*", operand, expr: `"${expr}*${operand}"` }, `Try ${expr}*${operand}`);
                    solve(i + 1, prev * operand, cur - prev + prev * operand, `${expr}*${operand}`, myId);
                }
            }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, 0, 0, "", null);
    push(0, "done", { total: result.length }, `✅ ${result.length} expressions = ${target}`);
    return { steps, result };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Insert +, -, * between digits of a string to reach a target value. E.g., "123" target=6 → "1+2+3", "1*2*3"

## How to Think About It
**Two decisions at each step:**
1. How many digits to take as the next number (1 digit, 2 digits, etc.)
2. Which operator to place before it (+, -, *)

### The Multiplication Trick
Multiplication has higher precedence. Track the 'last operand' to handle it:
- For a*b, when you see *, undo the last addition/subtraction and apply multiplication instead.

**Think of it like:** Building math expressions by trying every possible number+operator combination.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "123", target=6

1. Take "1" as first number (no operator for first)
2. At position 1: Try +2, -2, *2
   - 1+2=3, then at position 2: +3→6 ✅, -3→0, *3→9
   - 1-2=-1, then: +3→2, -3→-4, *3→-5
   - 1*2=2, then: +3→5, -3→-1, *3→6 ✅
3. Take "12" as first number:
   - 12+3=15, 12-3=9, 12*3=36 (none = 6)

Result: ["1+2+3", "1*2*3"] ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    void addOp(string num, int idx, long prev, long cur, string expr, int target)
- **idx:** current position in digit string
- **cur:** current expression value
- **prev:** last operand (needed for * fix)

### Line 2: Base Case
    if (idx == num.size()) { if (cur == target) result.push(expr); return; }
**WHY:** Used all digits. If current value equals target → valid expression!

### Line 3-4: Extract Next Number
    for (int i = idx; i < num.size(); i++) {
        long operand = stol(num.substr(idx, i - idx + 1));
**WHY loop?** Try all possible next numbers: single digit, two digits, etc. "123" → try "1", "12", "123".

### Line 5: No Leading Zeros
    if (i > idx && num[idx] == '0') break;
**WHY:** "05" is not a valid number. Only "0" alone is allowed.

### Line 6: Addition
    addOp(num, i+1, operand, cur + operand, expr + "+" + str);
**WHY prev=operand?** The operand we just added becomes the "last operand" for potential future * corrections.

### Line 7: Subtraction
    addOp(num, i+1, -operand, cur - operand, expr + "-" + str);
**WHY prev=−operand?** We treat subtraction as adding a negative, so prev is negative for * fix.

### Line 8: Multiplication (The Tricky One!)
    addOp(num, i+1, prev * operand, cur - prev + prev * operand, expr + "*" + str);
**WHY cur − prev + prev * operand?** Multiplication has higher precedence! We must:
1. **Undo** the last operation (subtract prev from cur)
2. **Redo** it with multiplication (add prev × operand)

Example: "2+3*4" → cur was 5 (2+3), prev was 3
→ new cur = 5 − 3 + 3×4 = 5 − 3 + 12 = **14** ✓

## Time & Space Complexity
- **Time:** O(4ⁿ) — 3 operators + variable-length numbers
- **Space:** O(n) recursion depth`
    },
];

const DN = "123", DT = 6;
export default function ExpressionOperators() {
    const { theme } = useTheme();
    const [nT, setNT] = useState(DN), [tT, setTT] = useState(String(DT));
    const [sess, setSess] = useState(() => gen(DN, DT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 700);
    const run = () => { const n = nT.replace(/[^0-9]/g, ""); const t = parseInt(tT); if (n.length < 1 || n.length > 5 || isNaN(t)) return; setSess(gen(n, t)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(DN); setTT(String(DT)); setSess(gen(DN, DT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Expression Add Operators" subtitle="Insert +, -, * between digits · LC #282">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Num:</span>
                <input value={nT} onChange={e => setNT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "60px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Target:</span>
                <input value={tT} onChange={e => setTT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ width: "50px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontWeight: "600", cursor: "pointer" }}>↺</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="expression_operators.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🎯 Expressions = ${DT}`}><div style={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "30px" }}>{(step.result || []).map((e, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80", fontFamily: "monospace" }}>{e}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🧮 {sess.result.length} expressions</span></StepInfo>
        </VizLayout>
    );
}
