import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const PHONE = { "2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz" };

const CODE = [
    { id: 0, text: `void letterComb(string& digits, int idx,` },
    { id: 1, text: `                string& cur, vector<string>& res){` },
    { id: 2, text: `    if (idx == digits.size()) {` },
    { id: 3, text: `        res.push_back(cur); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    string letters = map[digits[idx]];` },
    { id: 6, text: `    for (char c : letters) {` },
    { id: 7, text: `        cur += c;` },
    { id: 8, text: `        letterComb(digits, idx+1, cur, res);` },
    { id: 9, text: `        cur.pop_back();` },
    { id: 10, text: `    }` },
    { id: 11, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", pick: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", pick: "🔤 PICK", back: "↩ BACK", done: "✅ DONE" };

function gen(digits) {
    const steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    let cur = "";
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, cur, result: [...result], treeNodes: treeNodes.map(t => ({ ...t })) }); cnt++; } };

    function solve(i, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `"${cur}" i=${i}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`lc(i=${i})`);
        push(0, "call", { idx: i, digit: digits[i] || "—", cur: `"${cur}"` }, `letterComb(idx=${i})`);

        if (i === digits.length) {
            result.push(cur);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `"${cur}" ✓`;
            push(3, "found", { cur: `"${cur}"`, "#": result.length }, `🎯 Found "${cur}"`);
            cs.pop(); return;
        }

        const letters = PHONE[digits[i]] || "";
        push(5, "call", { digit: digits[i], letters: `"${letters}"` }, `digit '${digits[i]}' → letters "${letters}"`);

        for (const ch of letters) {
            if (cnt >= MAX) break;
            cur += ch;
            push(7, "pick", { char: ch, cur: `"${cur}"` }, `Pick '${ch}' → "${cur}"`);
            solve(i + 1, myId);
            cur = cur.slice(0, -1);
            if (cnt < MAX) { cs.push(`lc(i=${i})`); push(9, "back", { removed: ch, cur: `"${cur}"` }, `Remove '${ch}' ← "${cur}"`); cs.pop(); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    if (digits.length > 0) solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} combinations`);
    return { steps, result };
}

function PhoneViz({ digits, currentIdx }) {
    const { theme } = useTheme();
    const keys = ["2", "3", "4", "5", "6", "7", "8", "9"];
    return (
        <VizCard title="📱 Phone Keypad">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", maxWidth: "200px" }}>
                {keys.map(k => {
                    const active = digits.includes(k);
                    const isCur = digits[currentIdx] === k;
                    return (
                        <div key={k} style={{
                            padding: "6px 4px", borderRadius: "8px", textAlign: "center",
                            background: isCur ? "#1e3a5f" : active ? "#1a1f3a" : theme.cardBg,
                            border: `1.5px solid ${isCur ? "#3b82f6" : active ? "#6366f1" : theme.cardBorder}`,
                            opacity: active ? 1 : 0.4,
                        }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: 800, color: isCur ? "#93c5fd" : theme.text }}>{k}</div>
                            <div style={{ fontSize: "0.55rem", color: isCur ? "#60a5fa" : theme.textMuted, letterSpacing: "1px" }}>{PHONE[k]}</div>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a digit string (2-9), return all possible letter combinations from a phone keypad. E.g., "23" → ["ad","ae","af","bd","be","bf","cd","ce","cf"]

## How to Think About It
**Ask yourself:** "For each digit, which letters can I choose?"

### It's a Cartesian Product!
- Digit 2 maps to {a,b,c}
- Digit 3 maps to {d,e,f}
- Result = every combination of one letter from each digit

**Think of it like:** A combination lock where each digit has 3-4 options. Try all combinations by choosing one letter per position.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "23"

1. idx=0, digit '2' → letters "abc"
2. Pick 'a', recurse → idx=1, digit '3' → letters "def"
3. Pick 'd' → idx=2 = length → **FOUND** "ad" ✅
4. Back, pick 'e' → **FOUND** "ae" ✅
5. Back, pick 'f' → **FOUND** "af" ✅
6. Back to idx=0, pick 'b' → same: "bd", "be", "bf" ✅
7. Pick 'c' → "cd", "ce", "cf" ✅

Total: 3 × 3 = **9** combinations ✅

### General Formula
Total = product of letter counts for each digit`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2-3: Base Case
    if (idx == digits.size()) { res.push_back(cur); return; }
**WHY:** All digits processed → current string is complete. Save it.

### Line 5: Get Letters for Current Digit
    string letters = map[digits[idx]];
**WHY:** Map digit to its phone letters (e.g., '2' → "abc").

### Line 6-9: Try Each Letter
    for (char c : letters) { cur += c; recurse; cur.pop_back(); }
**WHY:** Standard backtracking — try each letter, recurse, undo.

## Time & Space Complexity
- **Time:** O(4^n × n) — at most 4 letters per digit, n digits
- **Space:** O(n) recursion depth`
    },
];

const DD = "23";
export default function LetterCombinations() {
    const { theme } = useTheme();
    const [dT, setDT] = useState(DD);
    const [sess, setSess] = useState(() => gen(DD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const d = dT.replace(/[^2-9]/g, ""); if (d.length < 1 || d.length > 4) return; setSess(gen(d)); setIdx(0); setPlaying(false); };
    const reset = () => { setDT(DD); setSess(gen(DD)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    const curIdx = step.vars?.idx ?? 0;
    return (
        <VizLayout title="Letter Combinations of Phone" subtitle="Digit→letter mapping · Loop+Recurse · LC #17">
            <ExplainPanel sections={EXPLAIN} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>Digits (2-9):</span>
                <input value={dT} onChange={e => setDT(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} style={{ flex: 1, minWidth: "80px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none" }} />
                <button onClick={run} style={{ background: theme.btnHighlightBg, color: "#fff", border: `1px solid ${theme.btnHighlightBorder}`, borderRadius: "6px", padding: "5px 14px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>▶ Run</button>
                <button onClick={reset} style={{ background: theme.btnBg, color: theme.btnText, border: `1px solid ${theme.btnBorder}`, borderRadius: "6px", padding: "5px 10px", fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}>↺ Default</button>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="letter_combinations.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <PhoneViz digits={dT} currentIdx={curIdx} />
                    <VizCard title={`🔤 Current: "${step.cur || ""}"`}><div style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "monospace", color: "#a5b4fc", minHeight: "24px" }}>{step.cur || ""}</div></VizCard>
                    <VizCard title={`✅ Results: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80", fontFamily: "monospace" }}>{s}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📱 {sess.result.length} combos</span></StepInfo>
        </VizLayout>
    );
}
