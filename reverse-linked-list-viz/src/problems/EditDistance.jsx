import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int editDist(string& a, string& b, int i, int j) {` },
    { id: 1, text: `    if (i >= a.size()) return b.size() - j;` },
    { id: 2, text: `    if (j >= b.size()) return a.size() - i;` },
    { id: 3, text: `    if (a[i] == b[j])` },
    { id: 4, text: `        return editDist(a, b, i+1, j+1);` },
    { id: 5, text: `    int ins = 1 + editDist(a, b, i, j+1);` },
    { id: 6, text: `    int del = 1 + editDist(a, b, i+1, j);` },
    { id: 7, text: `    int rep = 1 + editDist(a, b, i+1, j+1);` },
    { id: 8, text: `    return min({ins, del, rep});` },
    { id: 9, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#10b981", match: "#10b981", ins: "#3b82f6", del: "#f59e0b", rep: "#ec4899", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🟢 BASE", match: "✅ MATCH", ins: "📥 INSERT", del: "🗑 DELETE", rep: "🔄 REPLACE", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(a, b) {
    const steps = [], cs = [], memo = {};
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, a, b, treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(i, j, parentId) {
        if (cnt >= MAX) return 0;
        const key = `${i},${j}`; if (memo[key] !== undefined) return memo[key];
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `(${i},${j})`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ed(${i},${j})`);
        push(0, "call", { i, j, "a[i]": a[i] ?? "—", "b[j]": b[j] ?? "—" }, `editDist(${i},${j})`);
        if (i >= a.length) { const r = b.length - j; treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`; push(1, "base", { return: r }, `A end → ${r}`); cs.pop(); memo[key] = r; return r; }
        if (j >= b.length) { const r = a.length - i; treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`; push(2, "base", { return: r }, `B end → ${r}`); cs.pop(); memo[key] = r; return r; }
        if (a[i] === b[j]) {
            push(3, "match", { "a[i]": a[i] }, `Match '${a[i]}'`);
            const r = solve(i + 1, j + 1, myId);
            treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
            push(4, "ret", { return: r }, `Match → ${r}`); cs.pop(); memo[key] = r; return r;
        }
        push(5, "ins", { "a[i]": a[i], "b[j]": b[j] }, `Try insert`);
        const ins = 1 + solve(i, j + 1, myId);
        push(6, "del", {}, `Try delete`);
        const del = 1 + solve(i + 1, j, myId);
        push(7, "rep", {}, `Try replace`);
        const rep = 1 + solve(i + 1, j + 1, myId);
        const r = Math.min(ins, del, rep);
        treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
        push(8, "ret", { ins, del, rep, best: r }, `min(${ins},${del},${rep})=${r}`); cs.pop(); memo[key] = r; return r;
    }
    const ans = solve(0, 0, null);
    push(0, "done", { ANSWER: ans }, `✅ Edit distance = ${ans}`);
    return { steps, answer: ans };
}

function PtrViz({ step }) {
    const { theme } = useTheme();
    const a = step.a || "", b = step.b || "";
    const i = step.vars?.i, j = step.vars?.j;
    const renderStr = (s, ptr, label) => (
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "0.6rem", color: theme.textDim, width: "20px" }}>{label}:</span>
            {[...s].map((c, k) => (<span key={k} style={{ width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.7rem", fontWeight: k === ptr ? 800 : 500, background: k === ptr ? "#8b5cf622" : theme.cardHeaderBg, border: `1.5px solid ${k === ptr ? "#8b5cf6" : theme.cardBorder}`, color: k === ptr ? "#c4b5fd" : theme.textMuted, fontFamily: "'Fira Code',monospace" }}>{c}</span>))}
        </div>
    );
    return (
        <VizCard title="🔤 Strings">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>{renderStr(a, i, "A")}{renderStr(b, j, "B")}</div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find minimum operations (insert, delete, replace) to convert word1 to word2. E.g., "horse" → "ros" = 3 edits.

## How to Think About It
Compare characters from the end:
- If chars **match**: no cost, move both pointers
- If chars **differ**: try all 3 operations, take minimum:
  1. **Insert:** add char, advance j
  2. **Delete:** remove char, advance i
  3. **Replace:** change char, advance both

**Think of it like:** Spell-checking — what's the cheapest way to fix misspelled words?`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## DP Table for "horse" → "ros"

|   | "" | r | o | s |
|---|---|---|---|---|
| "" | 0 | 1 | 2 | 3 |
| h | 1 | 1 | 2 | 3 |
| o | 2 | 2 | 1 | 2 |
| r | 3 | 2 | 2 | 2 |
| s | 4 | 3 | 3 | 2 |
| e | 5 | 4 | 4 | **3** |

Answer: **3** operations ✅
(horse → rorse → rose → ros)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    int editDist(string& a, string& b, int i, int j)
Pointers i and j scan strings A and B from left to right.

### Line 2: Base Case — A exhausted
    if (i >= a.size()) return b.size() - j;
**WHY:** If A is done but B still has chars, we need to INSERT all remaining B chars. Cost = (b.size() - j).

### Line 3: Base Case — B exhausted
    if (j >= b.size()) return a.size() - i;
**WHY:** If B is done but A still has chars, we need to DELETE all remaining A chars. Cost = (a.size() - i).

### Line 4-5: Characters Match
    if (a[i] == b[j])
        return editDist(a, b, i+1, j+1);
**WHY 0 cost?** Characters already match — no edit needed! Just advance both pointers.

### Line 6: Try Insert
    int ins = 1 + editDist(a, b, i, j+1);
**WHY i stays, j+1?** We "insert" b[j] into A. A's pointer stays (we haven't consumed a[i] yet), B advances.

### Line 7: Try Delete
    int del = 1 + editDist(a, b, i+1, j);
**WHY i+1, j stays?** We "delete" a[i]. Skip over it, B's pointer stays (b[j] still needs matching).

### Line 8: Try Replace
    int rep = 1 + editDist(a, b, i+1, j+1);
**WHY both advance?** We "replace" a[i] with b[j]. Both chars are handled, advance both.

### Line 9: Take the Best
    return min({ins, del, rep});
**WHY min?** We want the MINIMUM number of operations, so take the cheapest option.

## Time & Space Complexity
- **Time:** O(m × n) with memoization
- **Space:** O(m × n) for memo, O(m+n) recursion depth`
    },
];

const DA = "horse", DB = "ros";
export default function EditDistance() {
    const { theme } = useTheme();
    const [aT, setAT] = useState(DA), [bT, setBT] = useState(DB);
    const [sess, setSess] = useState(() => gen(DA, DB));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { if (!aT || !bT || aT.length > 5 || bT.length > 5) return; setSess(gen(aT, bT)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA); setBT(DB); setSess(gen(DA, DB)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Edit Distance" subtitle="Insert / Delete / Replace · LC #72">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>A:</span>
                <input value={aT} onChange={e => setAT(e.target.value)} style={{ width: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>B:</span>
                <input value={bT} onChange={e => setBT(e.target.value)} style={{ width: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="edit_distance.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <PtrViz step={step} /><VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>✏️ Dist = {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
