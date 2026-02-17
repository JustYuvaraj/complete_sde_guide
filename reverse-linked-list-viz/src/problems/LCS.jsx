import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int lcs(string& a, string& b, int i, int j) {` },
    { id: 1, text: `    if (i >= a.size() || j >= b.size()) return 0;` },
    { id: 2, text: `    if (a[i] == b[j])` },
    { id: 3, text: `        return 1 + lcs(a, b, i+1, j+1);` },
    { id: 4, text: `    int skipA = lcs(a, b, i+1, j);` },
    { id: 5, text: `    int skipB = lcs(a, b, i, j+1);` },
    { id: 6, text: `    return max(skipA, skipB);` },
    { id: 7, text: `}` },
];
const PC = { call: "#8b5cf6", base: "#64748b", match: "#10b981", skipA: "#f59e0b", skipB: "#3b82f6", ret: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", base: "🔹 BASE", match: "✅ MATCH", skipA: "⏭ SKIP A", skipB: "⏭ SKIP B", ret: "🟣 RETURN", done: "✅ DONE" };

function gen(a, b) {
    const steps = [], cs = [], memo = {};
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, a, b, treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };
    function solve(i, j, parentId) {
        if (cnt >= MAX) return 0;
        const key = `${i},${j}`; if (memo[key] !== undefined) return memo[key];
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `(${i},${j})`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`lcs(${i},${j})`);
        push(0, "call", { i, j, "a[i]": a[i] ?? "—", "b[j]": b[j] ?? "—" }, `lcs(${i},${j})`);
        if (i >= a.length || j >= b.length) { treeNodes.find(t => t.id === `n${myId}`).status = "base"; treeNodes.find(t => t.id === `n${myId}`).label = `0`; push(1, "base", { return: 0 }, `Base → 0`); cs.pop(); memo[key] = 0; return 0; }
        if (a[i] === b[j]) {
            push(2, "match", { "a[i]": a[i] }, `Match '${a[i]}'`);
            const r = 1 + solve(i + 1, j + 1, myId);
            cs.push(`lcs(${i},${j})`);
            treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
            push(3, "ret", { return: r }, `1+sub=${r}`); cs.pop(); memo[key] = r; return r;
        }
        push(4, "skipA", { "a[i]": a[i], "b[j]": b[j] }, `No match → skip A`);
        const sa = solve(i + 1, j, myId);
        cs.push(`lcs(${i},${j})`);
        push(5, "skipB", {}, `Skip B`);
        const sb = solve(i, j + 1, myId);
        cs.push(`lcs(${i},${j})`);
        const r = Math.max(sa, sb);
        treeNodes.find(t => t.id === `n${myId}`).status = "done"; treeNodes.find(t => t.id === `n${myId}`).label = `${r}`;
        push(6, "ret", { skipA: sa, skipB: sb, best: r }, `max(${sa},${sb})=${r}`); cs.pop(); memo[key] = r; return r;
    }
    const ans = solve(0, 0, null);
    push(0, "done", { ANSWER: ans }, `✅ LCS = ${ans}`);
    return { steps, answer: ans };
}

function StringViz({ step }) {
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
        <VizCard title="🔤 Comparing">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>{renderStr(a, i, "A")}{renderStr(b, j, "B")}</div>
        </VizCard>
    );
}

const DA = "abcde", DB = "ace";
export default function LCS() {
    const { theme } = useTheme();
    const [aT, setAT] = useState(DA), [bT, setBT] = useState(DB);
    const [sess, setSess] = useState(() => gen(DA, DB));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { if (!aT || !bT || aT.length > 6 || bT.length > 6) return; setSess(gen(aT, bT)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA); setBT(DB); setSess(gen(DA, DB)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Longest Common Subsequence" subtitle="Match or skip · LC #1143">
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>A:</span>
                <input value={aT} onChange={e => setAT(e.target.value)} style={{ width: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>B:</span>
                <input value={bT} onChange={e => setBT(e.target.value)} style={{ width: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 8px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="lcs.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <StringViz step={step} /><VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔤 LCS = {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
