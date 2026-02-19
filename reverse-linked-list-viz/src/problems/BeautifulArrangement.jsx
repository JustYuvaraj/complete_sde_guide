import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `int countArrangement(int n, int pos,` },
    { id: 1, text: `                     vector<bool>& used) {` },
    { id: 2, text: `    if (pos > n) return 1;` },
    { id: 3, text: `    int count = 0;` },
    { id: 4, text: `    for (int num = 1; num <= n; num++) {` },
    { id: 5, text: `        if (used[num]) continue;` },
    { id: 6, text: `        if (num % pos != 0 && pos % num != 0)` },
    { id: 7, text: `            continue;  // not beautiful` },
    { id: 8, text: `        used[num] = true;` },
    { id: 9, text: `        count += countArrangement(n, pos+1, used);` },
    { id: 10, text: `        used[num] = false;` },
    { id: 11, text: `    }` },
    { id: 12, text: `    return count;` },
    { id: 13, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", place: "#3b82f6", skip: "#f87171", fail: "#f87171", remove: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", place: "✅ PLACE", skip: "⏭ SKIP", fail: "❌ FAIL", remove: "↩ REMOVE", done: "✅ DONE" };

function gen(n) {
    const steps = [], cs = [], used = new Array(n + 1).fill(false), arr = new Array(n + 1).fill(0);
    const treeNodes = []; let nid = 0, cnt = 0, solCount = 0; const MAX = 400;
    const snap = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, msg: m, callStack: [...cs], arr: arr.slice(1), treeNodes: treeNodes.map(t => ({ ...t })), solCount }); cnt++; } };

    function solve(pos, parentId) {
        if (cnt >= MAX) return 0;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `pos=${pos}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ba(p=${pos})`);
        snap(0, "call", { pos }, `countArrangement(pos=${pos})`);

        if (pos > n) {
            solCount++;
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ #${solCount}`;
            snap(2, "found", { arrangement: `[${arr.slice(1)}]`, count: solCount }, `🎯 Arrangement #${solCount}: [${arr.slice(1)}]`);
            cs.pop(); return 1;
        }
        let count = 0;
        for (let num = 1; num <= n; num++) {
            if (cnt >= MAX) break;
            if (used[num]) { snap(5, "skip", { num, pos, reason: "used" }, `${num} already used`); continue; }
            if (num % pos !== 0 && pos % num !== 0) {
                snap(6, "fail", { num, pos, "num%pos": num % pos, "pos%num": pos % num }, `${num}%${pos}≠0 & ${pos}%${num}≠0 → skip`);
                continue;
            }
            used[num] = true; arr[pos] = num;
            snap(8, "place", { pos, num, "check": `${num}%${pos}=${num % pos} or ${pos}%${num}=${pos % num}` }, `Place ${num} at pos ${pos} ✓`);
            count += solve(pos + 1, myId);
            used[num] = false; arr[pos] = 0;
            if (cnt < MAX) { snap(10, "remove", { pos, num }, `Remove ${num} from pos ${pos}`); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
        return count;
    }
    solve(1, null);
    snap(0, "done", { total: solCount }, `✅ ${solCount} beautiful arrangements`);
    return { steps, total: solCount };
}

function ArrViz({ arr }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📐 Arrangement">
            <div style={{ display: "flex", gap: "4px", minHeight: "40px", alignItems: "flex-end" }}>
                {arr.map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <div style={{
                            width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "6px", fontSize: "0.8rem", fontWeight: 800,
                            background: v ? "#1e3a5f" : theme.cardBg,
                            border: `1.5px solid ${v ? "#3b82f6" : theme.cardBorder}`,
                            color: v ? "#93c5fd" : theme.textDim,
                        }}>{v || "·"}</div>
                        <span style={{ fontSize: "0.5rem", color: theme.textMuted }}>pos {i + 1}</span>
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count arrangements of 1 to n where for every position i, either **num % i == 0** or **i % num == 0**. E.g., n=2 → 2 arrangements.

## How to Think About It
**At each position**, try every unused number. Only place it if the divisibility condition holds.

### Key Constraint
For position i and number num:
- num is divisible by i (num % i == 0), OR
- i is divisible by num (i % num == 0)

**Think of it like:** Seating guests at a round table where each seat has a rule about which guest numbers can sit there.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for n=3

Position 1: Try 1 (1%1=0 ✅), 2 (2%1=0 ✅), 3 (3%1=0 ✅)
Position 2: Try unused that satisfies n%2==0 or 2%n==0
Position 3: Try unused that satisfies n%3==0 or 3%n==0

### All Valid for n=3:
1. [1,2,3]: 1%1✓, 2%2✓, 3%3✓ ✅
2. [2,1,3]: 2%1✓, 1%2? No, 2%1✓ ✅, 3%3✓ ✅
3. [3,2,1]: 3%1✓, 2%2✓, 1%3? No, 3%1✓ ✅

Result: **3** beautiful arrangements ✅`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 2: Base Case
    if (pos > n) return 1;
**WHY:** All positions filled successfully → found 1 valid arrangement.

### Line 5: Skip Used Numbers
    if (used[num]) continue;

### Line 6-7: Divisibility Check
    if (num % pos != 0 && pos % num != 0) continue;
**WHY:** The "beautiful" constraint. Must satisfy at least one condition.

### Lines 8-10: Place + Recurse + Remove
    used[num] = true; count += solve(pos+1); used[num] = false;
**WHY:** Standard backtracking — try placing, count valid continuations, undo.

## Time & Space Complexity
- **Time:** O(k) where k ≪ n! due to heavy pruning
- **Space:** O(n) for used array + recursion depth`
    },
];

const DN = 4;
export default function BeautifulArrangement() {
    const [nT, setNT] = useState(String(DN));
    const [sess, setSess] = useState(() => gen(DN));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const run = () => { const v = parseInt(nT); if (isNaN(v) || v < 1 || v > 6) return; setSess(gen(v)); setIdx(0); setPlaying(false); };
    const reset = () => { setNT(String(DN)); setSess(gen(DN)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Beautiful Arrangement" subtitle="Divisibility constraint · Backtracking · LC #526">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={nT} onChange={setNT} onRun={run} onReset={reset} placeholder="4" label="n (1–6):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="beautiful_arrangement.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrViz arr={step.arr || []} />
                    <VizCard title="📊 Count"><div style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981", textAlign: "center" }}>{step.solCount}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📐 {sess.total} arrangements</span></StepInfo>
        </VizLayout>
    );
}
