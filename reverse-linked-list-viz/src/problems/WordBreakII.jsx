import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void wordBreak(string s, int start, set<string>& dict,` },
    { id: 1, text: `    vector<string>& cur, vector<string>& res) {` },
    { id: 2, text: `    if (start == s.size()) {` },
    { id: 3, text: `        res.push_back(join(cur)); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    for (int end = start+1; end <= s.size(); end++){` },
    { id: 6, text: `        string sub = s.substr(start, end-start);` },
    { id: 7, text: `        if (!dict.count(sub)) continue;` },
    { id: 8, text: `        cur.push_back(sub);` },
    { id: 9, text: `        wordBreak(s, end, dict, cur, res);` },
    { id: 10, text: `        cur.pop_back();` },
    { id: 11, text: `    }` },
    { id: 12, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", match: "#3b82f6", miss: "#f87171", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", match: "✅ MATCH", miss: "✗ MISS", back: "↩ BACK", done: "✅ DONE" };

function gen(s, dict) {
    const steps = [], cs = [], result = [], cur = [], dictSet = new Set(dict);
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, cur: [...cur], result: [...result], treeNodes: treeNodes.map(t => ({ ...t })), str: s }); cnt++; } };

    function solve(start, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `s=${start}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`wb(s=${start})`);
        push(0, "call", { start, cur: `[${cur.join(" ")}]` }, `wordBreak(start=${start})`);

        if (start === s.length) {
            const sentence = cur.join(" ");
            result.push(sentence);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ "${sentence}"`;
            push(3, "found", { sentence: `"${sentence}"` }, `🎯 "${sentence}"`);
            cs.pop(); return;
        }

        for (let end = start + 1; end <= s.length; end++) {
            if (cnt >= MAX) break;
            const sub = s.substring(start, end);
            if (!dictSet.has(sub)) {
                push(7, "miss", { sub: `"${sub}"` }, `"${sub}" not in dict`);
                continue;
            }
            cur.push(sub);
            push(8, "match", { sub: `"${sub}"`, cur: `[${cur.join(" ")}]` }, `"${sub}" ∈ dict → add`);
            solve(end, myId);
            cur.pop();
            if (cnt < MAX) { cs.push(`wb(s=${start})`); push(10, "back", { removed: `"${sub}"` }, `Remove "${sub}"`); cs.pop(); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} sentences`);
    return { steps, result };
}

const DS = "catsanddog", DD = ["cat", "cats", "and", "sand", "dog"];
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a string s and a dictionary, return **all possible** word break sentences. Unlike Word Break I (true/false), we need every valid segmentation.

## Key Insight
**DFS + Backtracking**: Try each dictionary word as a prefix. If it matches, recurse on the remaining string. Build sentences during backtracking.

## Mental Model
1. At each position, try every word in the dictionary
2. If word matches the current prefix → recurse on remaining
3. When reaching end of string → we found a valid sentence
4. Backtrack to find ALL valid sentences`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
s = "catsanddog", dict = ["cat","cats","and","sand","dog"]
1. Try "cat" → remaining "sanddog" → "sand"+"dog" ✔
2. Try "cats" → remaining "anddog" → "and"+"dog" ✔
3. Results: ["cat sand dog", "cats and dog"]

## Optimization
Use memoization to cache results for each suffix. Avoids recomputing the same subproblem.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
dfs(s, start, path):
  if start == s.length:
    results.add(path.join(" "))
    return
  for each word in dict:
    if s[start..] startsWith word:
      path.push(word)
      dfs(s, start + word.length, path)
      path.pop()  // backtrack
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(2ⁿ)** worst case — exponential sentences |
| Space | **O(n)** — recursion depth |`
    }
];

export default function WordBreakII() {
    const { theme } = useTheme();
    const [sT, setST] = useState(DS), [dT, setDT] = useState(DD.join(","));
    const [sess, setSess] = useState(() => gen(DS, DD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const s = sT.trim(); const d = dT.split(/[\s,]+/).filter(w => w.length > 0); if (!s || s.length > 15 || d.length < 1) return; setSess(gen(s, d)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setDT(DD.join(",")); setSess(gen(DS, DD)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Word Break II" subtitle="Collect all sentences · Backtracking · LC #140">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>String:</span>
                <input value={sT} onChange={e => setST(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Dict:</span>
                <input value={dT} onChange={e => setDT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontWeight: "600", cursor: "pointer" }}>↺</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="word_break_ii.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🔤 Current: [${(step.cur || []).join(" ")}]`}><div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a5b4fc", fontFamily: "monospace", minHeight: "20px" }}>{(step.cur || []).join(" ") || "..."}</div></VizCard>
                    <VizCard title={`🎯 Sentences: ${(step.result || []).length}`}><div style={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>"{s}"</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📝 {sess.result.length} sentences</span></StepInfo>
        </VizLayout>
    );
}
