import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void partition(string& s, int start,` },
    { id: 1, text: `    vector<string>& cur, vector<vector<string>>& res){` },
    { id: 2, text: `    if (start == s.size()) {` },
    { id: 3, text: `        res.push_back(cur); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    for (int end = start; end < s.size(); end++){` },
    { id: 6, text: `        if (!isPalin(s, start, end)) continue;` },
    { id: 7, text: `        cur.push_back(s.substr(start, end-start+1));` },
    { id: 8, text: `        partition(s, end+1, cur, res);` },
    { id: 9, text: `        cur.pop_back();` },
    { id: 10, text: `    }` },
    { id: 11, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", check: "#f59e0b", cut: "#3b82f6", fail: "#f87171", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", check: "🔍 CHECK", cut: "✂ CUT", fail: "✗ NOT PALINDROME", back: "↩ BACK", done: "✅ DONE" };

function isPalin(s, l, r) { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; }

function gen(s) {
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, cur: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })), str: s }); cnt++; } };

    function solve(start, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `s=${start} [${cur}]`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`p(s=${start})`);
        push(0, "call", { start, cur: `[${cur.join("|")}]` }, `partition(start=${start})`);

        if (start === s.length) {
            result.push([...cur]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ [${cur.join("|")}]`;
            push(3, "found", { partition: `[${cur.join("|")}]` }, `🎯 Found: [${cur.join(" | ")}]`);
            cs.pop(); return;
        }

        for (let end = start; end < s.length; end++) {
            if (cnt >= MAX) break;
            const sub = s.substring(start, end + 1);
            if (!isPalin(s, start, end)) {
                push(6, "fail", { sub: `"${sub}"`, start, end }, `"${sub}" not palindrome`);
                continue;
            }
            cur.push(sub);
            push(7, "cut", { sub: `"${sub}"`, start, end, cur: `[${cur.join("|")}]` }, `✂ Cut "${sub}" (palindrome ✓)`);
            solve(end + 1, myId);
            cur.pop();
            if (cnt < MAX) { push(9, "back", { removed: `"${sub}"`, cur: `[${cur.join("|")}]` }, `Remove "${sub}"`); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} palindrome partitions`);
    return { steps, result };
}

function StringSliceViz({ str, cur }) {
    const { theme } = useTheme();
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f87171"];
    let pos = 0;
    const segments = cur.map((seg, i) => { const s = pos; pos += seg.length; return { text: seg, start: s, color: colors[i % colors.length] }; });
    const remaining = str.substring(pos);
    return (
        <VizCard title="🔤 String Partitioning">
            <div style={{ display: "flex", gap: "2px", minHeight: "36px", alignItems: "center", flexWrap: "wrap" }}>
                {segments.map((seg, i) => (
                    <div key={i} style={{ display: "flex", gap: "1px" }}>
                        {seg.text.split("").map((ch, j) => (
                            <span key={j} style={{ width: "24px", height: "28px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, background: seg.color + "22", border: `1.5px solid ${seg.color}`, color: seg.color }}>{ch}</span>
                        ))}
                        {i < segments.length - 1 && <span style={{ color: theme.textMuted, fontSize: "0.8rem", margin: "0 2px" }}>|</span>}
                    </div>
                ))}
                {remaining && (
                    <>
                        {segments.length > 0 && <span style={{ color: theme.textMuted, fontSize: "0.8rem", margin: "0 2px" }}>|</span>}
                        {remaining.split("").map((ch, j) => (
                            <span key={`r${j}`} style={{ width: "24px", height: "28px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.textDim }}>{ch}</span>
                        ))}
                    </>
                )}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Partition a string so every substring is a palindrome. Return all such partitions. E.g., "aab" → [["a","a","b"],["aa","b"]]

## How to Think About It
**At each position**, try every possible "cut" that creates a palindrome as the first piece.

### The Cut Strategy
From index 'start', try substrings s[start..i] for i = start to end:
- If s[start..i] is a palindrome → take it, recurse on s[i+1..end]
- If not a palindrome → skip this cut

**Think of it like:** Slicing a cake at different positions. Each slice must be a palindrome. Try all valid slicing patterns.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "aab"

1. start=0: Try "a" (palindrome ✓) → recurse on "ab"
2. start=1: Try "a" (palindrome ✓) → recurse on "b"
3. start=2: Try "b" (palindrome ✓) → at end → **FOUND** ["a","a","b"] ✅
4. Backtrack: Try "ab" (not palindrome ✘) → skip
5. Back to start=0: Try "aa" (palindrome ✓) → recurse on "b"
6. "b" is palindrome → **FOUND** ["aa","b"] ✅
7. Try "aab" (not palindrome ✘) → skip

Result: [["a","a","b"], ["aa","b"]] ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    void partition(string& s, int start, vector<string>& cur, vector<vector<string>>& res)
start = current position in string, cur = palindromes collected so far.

### Line 2-3: Base Case
    if (start == s.size()) { res.push_back(cur); return; }
**WHY:** Entire string has been partitioned into palindromes → save this partition!

### Line 5: Try Every Cut Position
    for (int end = start; end < s.size(); end++)
**WHY:** Try cutting at every possible endpoint. s[start..end] is the candidate piece.

### Line 6: Palindrome Check
    if (!isPalin(s, start, end)) continue;
**WHY:** The cut piece MUST be a palindrome. Skip non-palindromes — no point recursing.

### Line 7: Add the Palindrome
    cur.push_back(s.substr(start, end-start+1));
**WHY:** Found a palindrome substring! Add it to our partition.

### Line 8: Recurse on Remaining String
    partition(s, end+1, cur, res);
**WHY end+1?** Start the next piece right after the current one ends.

### Line 9: Backtrack
    cur.pop_back();
**WHY?** Remove the palindrome we just added to try a longer cut at this position.

## Time & Space Complexity
- **Time:** O(n × 2ⁿ) — up to 2ⁿ partitions, O(n) palindrome check each
- **Space:** O(n) recursion depth`
    },
];

const DS = "aab";
export default function PalindromePartition() {
    const { theme } = useTheme();
    const [sT, setST] = useState(DS);
    const [sess, setSess] = useState(() => gen(DS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const s = sT.toLowerCase().replace(/[^a-z]/g, ""); if (s.length < 1 || s.length > 8) return; setSess(gen(s)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setSess(gen(DS)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Palindrome Partitioning" subtitle="Cut at every position · Check palindrome · LC #131">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={sT} onChange={setST} onRun={run} onReset={reset} placeholder="aab" label="String (1–8):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="palindrome_partition.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <StringSliceViz str={step.str} cur={step.cur || []} />
                    <VizCard title={`🎯 Partitions: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((p, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{p.join(" | ")}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>✂ {sess.result.length} partitions</span></StepInfo>
        </VizLayout>
    );
}
