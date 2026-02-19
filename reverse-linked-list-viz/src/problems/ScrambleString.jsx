import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `bool isScramble(string s1, string s2) {` },
    { id: 1, text: `    if (s1 == s2) return true;` },
    { id: 2, text: `    if (sorted(s1) != sorted(s2)) return false;` },
    { id: 3, text: `    int n = s1.size();` },
    { id: 4, text: `    for (int i = 1; i < n; i++) {` },
    { id: 5, text: `        // No swap: s1[..i] vs s2[..i]` },
    { id: 6, text: `        if (isScramble(s1[..i], s2[..i]) &&` },
    { id: 7, text: `            isScramble(s1[i..], s2[i..])) return true;` },
    { id: 8, text: `        // Swap: s1[..i] vs s2[n-i..]` },
    { id: 9, text: `        if (isScramble(s1[..i], s2[n-i..]) &&` },
    { id: 10, text: `            isScramble(s1[i..], s2[..n-i])) return true;` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return false;` },
    { id: 13, text: `}` },
];
const PC = { call: "#8b5cf6", match: "#10b981", mismatch: "#f87171", cut: "#3b82f6", swap: "#f59e0b", done: "#10b981", fail: "#f87171" };
const PL = { call: "📞 CALL", match: "✅ MATCH", mismatch: "✗ CHARS DIFFER", cut: "✂ NO-SWAP", swap: "🔄 SWAP", done: "✅ TRUE", fail: "❌ FALSE" };

function gen(s1, s2) {
    const steps = [], cs = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 200;
    const memo = {};
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(a, b, parentId) {
        if (cnt >= MAX) return false;
        const myId = nid++;
        const key = `${a}|${b}`;
        treeNodes.push({ id: `n${myId}`, label: `"${a}","${b}"`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`sc("${a}","${b}")`);
        push(0, "call", { s1: `"${a}"`, s2: `"${b}"` }, `isScramble("${a}", "${b}")`);

        if (a === b) {
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `"${a}"=✓`;
            push(1, "match", {}, `"${a}" == "${b}" → true`);
            cs.pop(); memo[key] = true; return true;
        }
        const sa = [...a].sort().join(""), sb = [...b].sort().join("");
        if (sa !== sb) {
            treeNodes.find(t => t.id === `n${myId}`).status = "pruned";
            push(2, "mismatch", { sorted_s1: sa, sorted_s2: sb }, `Chars differ → false`);
            cs.pop(); memo[key] = false; return false;
        }
        if (memo[key] !== undefined) { cs.pop(); return memo[key]; }

        const n = a.length;
        for (let i = 1; i < n; i++) {
            if (cnt >= MAX) break;
            push(6, "cut", { i, "s1L": `"${a.substring(0, i)}"`, "s1R": `"${a.substring(i)}"` }, `Cut at ${i}: no-swap check`);
            if (solve(a.substring(0, i), b.substring(0, i), myId) && solve(a.substring(i), b.substring(i), myId)) {
                treeNodes.find(t => t.id === `n${myId}`).status = "found";
                push(7, "done", {}, `No-swap match at i=${i} → true`);
                cs.pop(); memo[key] = true; return true;
            }
            if (cnt >= MAX) break;
            push(9, "swap", { i }, `Cut at ${i}: swap check`);
            if (solve(a.substring(0, i), b.substring(n - i), myId) && solve(a.substring(i), b.substring(0, n - i), myId)) {
                treeNodes.find(t => t.id === `n${myId}`).status = "found";
                push(10, "done", {}, `Swap match at i=${i} → true`);
                cs.pop(); memo[key] = true; return true;
            }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        push(12, "fail", {}, `No cut works → false`);
        cs.pop(); memo[key] = false; return false;
    }
    const res = solve(s1, s2, null);
    push(0, res ? "done" : "fail", { result: res }, res ? `✅ "${s1}" IS a scramble of "${s2}"` : `❌ "${s1}" is NOT a scramble of "${s2}"`);
    return { steps, result: res };
}

const DS1 = "great", DS2 = "rgeat";
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given two strings s1 and s2, determine if s2 is a **scramble** of s1. A scramble is formed by recursively splitting, optionally swapping halves.

## Key Insight
Try every split point. At each split, either the halves match directly (no swap) or cross-matched (swapped). Use **recursion + memoization**.

## Mental Model
1. For each split position i (1 to n-1):
2. **No swap**: left1 matches left2 AND right1 matches right2?
3. **Swap**: left1 matches right2 AND right1 matches left2?
4. If any split works → true`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. isScramble("great", "rgeat")
2. Try split at i=1: "g"|"reat" vs "r"|"geat" → check both orderings
3. Try split at i=2: "gr"|"eat" vs "rg"|"eat" → isScramble("gr","rg") && isScramble("eat","eat")
4. isScramble("gr","rg"): split at 1, swap matches ✔
5. Result: true!

## Pruning
Before recursing, check if both strings have the same character frequencies. If not, immediately return false.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    bool isScramble(string s1, string s2)
Check if s2 is a scrambled version of s1.

### Line 2: Base Case — Equal
    if (s1 == s2) return true;
**WHY:** If strings are identical, trivially a valid scramble (no swaps needed).

### Line 3: Anagram Check (Pruning!)
    if (sorted(s1) != sorted(s2)) return false;
**WHY:** If they don't have the same characters, it's IMPOSSIBLE for one to be a scramble of the other. This prunes most branches early!

### Line 4: Try Every Split Point
    for (int i = 1; i < n; i++)
**WHY 1 to n-1?** Split s1 into left (s1[0..i-1]) and right (s1[i..n-1]). Both halves must be non-empty.

### Line 5-6: No-Swap Check
    if (isScramble(s1[:i], s2[:i]) && isScramble(s1[i:], s2[i:]))
        return true;
**WHY:** If we DON'T swap at this split, left matches left and right matches right.

### Line 7-8: Swap Check (The Key Insight!)
    if (isScramble(s1[:i], s2[n-i:]) && isScramble(s1[i:], s2[:n-i]))
        return true;  
**WHY s2[n-i:]?** If we SWAP the halves, s1's left (length i) should match s2's RIGHT end (last i chars), and s1's right should match s2's LEFT beginning.

### Line 9: No Split Worked
    return false;

## Time & Space Complexity
- **Time:** O(n⁴) with memoization
- **Space:** O(n³) for memo table (all possible s1,s2 substrings)`
    }
];

export default function ScrambleString() {
    const { theme } = useTheme();
    const [s1T, setS1T] = useState(DS1), [s2T, setS2T] = useState(DS2);
    const [sess, setSess] = useState(() => gen(DS1, DS2));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = s1T.trim(), b = s2T.trim(); if (a.length < 1 || a.length > 6 || a.length !== b.length) return; setSess(gen(a, b)); setIdx(0); setPlaying(false); };
    const reset = () => { setS1T(DS1); setS2T(DS2); setSess(gen(DS1, DS2)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Scramble String" subtitle="Cut + Swap + Recurse · LC #87">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>s1:</span>
                <input value={s1T} onChange={e => setS1T(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "60px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>s2:</span>
                <input value={s2T} onChange={e => setS2T(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "60px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontWeight: "600", cursor: "pointer" }}>↺</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="scramble_string.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: sess.result ? "#10b981" : "#f87171", fontWeight: 700 }}>{sess.result ? "✅ Scramble" : "❌ Not scramble"}</span></StepInfo>
        </VizLayout>
    );
}
