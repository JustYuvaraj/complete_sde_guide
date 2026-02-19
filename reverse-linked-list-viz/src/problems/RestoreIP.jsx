import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel, ExplainPanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void restoreIp(string& s, int start, int parts,` },
    { id: 1, text: `    vector<string>& cur, vector<string>& res) {` },
    { id: 2, text: `    if (parts == 4 && start == s.size()) {` },
    { id: 3, text: `        res.push_back(join(cur,".")); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    if (parts == 4 || start >= s.size()) return;` },
    { id: 6, text: `    for (int len = 1; len <= 3; len++) {` },
    { id: 7, text: `        if (start+len > s.size()) break;` },
    { id: 8, text: `        string seg = s.substr(start, len);` },
    { id: 9, text: `        if (!isValid(seg)) continue;` },
    { id: 10, text: `        cur.push_back(seg);` },
    { id: 11, text: `        restoreIp(s, start+len, parts+1, ...);` },
    { id: 12, text: `        cur.pop_back();` },
    { id: 13, text: `    }` },
    { id: 14, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", try: "#3b82f6", invalid: "#f87171", back: "#ec4899", prune: "#f87171", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", try: "🔢 TRY", invalid: "✗ INVALID", back: "↩ BACK", prune: "✂ PRUNE", done: "✅ DONE" };

function isValidSeg(s) {
    if (s.length === 0 || s.length > 3) return false;
    if (s.length > 1 && s[0] === "0") return false;
    const n = parseInt(s);
    return n >= 0 && n <= 255;
}

function gen(s) {
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = []; let nid = 0, cnt = 0; const MAX = 300;
    const push = (cl, ph, v, m) => { if (cnt < MAX) { steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, cur: [...cur], result: [...result], treeNodes: treeNodes.map(t => ({ ...t })), str: s }); cnt++; } };

    function solve(start, parts, parentId) {
        if (cnt >= MAX) return;
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `s=${start} p=${parts}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`ip(s=${start},p=${parts})`);
        push(0, "call", { start, parts, cur: cur.join(".") }, `restoreIp(start=${start}, parts=${parts})`);

        if (parts === 4 && start === s.length) {
            const ip = cur.join(".");
            result.push(ip);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `✓ ${ip}`;
            push(3, "found", { ip }, `🎯 Valid IP: ${ip}`);
            cs.pop(); return;
        }
        if (parts === 4 || start >= s.length) {
            treeNodes.find(t => t.id === `n${myId}`).status = "pruned";
            push(5, "prune", { parts, start }, `Prune: parts=${parts}, start=${start}`);
            cs.pop(); return;
        }

        for (let len = 1; len <= 3; len++) {
            if (cnt >= MAX) break;
            if (start + len > s.length) break;
            const seg = s.substring(start, start + len);
            if (!isValidSeg(seg)) {
                push(9, "invalid", { seg, reason: seg.length > 1 && seg[0] === "0" ? "leading zero" : ">255" }, `"${seg}" invalid`);
                continue;
            }
            cur.push(seg);
            push(10, "try", { seg, cur: cur.join(".") }, `Try "${seg}" → ${cur.join(".")}`);
            solve(start + len, parts + 1, myId);
            cur.pop();
            if (cnt < MAX) { push(12, "back", { removed: seg }, `Remove "${seg}"`); }
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, 0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} valid IPs`);
    return { steps, result };
}

function IPViz({ cur }) {
    const { theme } = useTheme();
    const parts = [...cur];
    while (parts.length < 4) parts.push("___");
    return (
        <VizCard title="🌐 IP Address">
            <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "center", minHeight: "36px" }}>
                {parts.map((p, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{
                            padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 700,
                            background: p === "___" ? theme.cardBg : "#1e3a5f",
                            border: `1.5px solid ${p === "___" ? theme.cardBorder : "#3b82f6"}`,
                            color: p === "___" ? theme.textDim : "#93c5fd",
                            minWidth: "30px", textAlign: "center",
                        }}>{p}</span>
                        {i < 3 && <span style={{ color: theme.textMuted, fontWeight: 800 }}>.</span>}
                    </span>
                ))}
            </div>
        </VizCard>
    );
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given a digit string, return all valid IP addresses. E.g., "25525511135" → ["255.255.11.135","255.255.111.35"]

## How to Think About It
**Split string into 4 parts.** Each part must be a valid octet (0-255, no leading zeros).

### Constraints
- Exactly 4 segments
- Each segment 1-3 digits
- Value 0-255
- No leading zeros ("01" invalid, "0" valid)

**Think of it like:** Placing 3 dots in the string to create 4 valid numbers.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for "25525511135"

1. Segment 1: Try "2", "25", "255"
2. For "255": Segment 2: Try "2", "25", "255"
3. For "255.255": Segment 3: Try "1", "11", "111"
4. Check if remaining forms valid segment 4

Valid results:
- 255.255.11.135 ✅
- 255.255.111.35 ✅

Invalid attempts pruned:
- 2552.5.5.11135 (>255) ✘
- 255.255.1113.5 (>255) ✘`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Function Signature
    void restoreIp(string& s, int start, int parts, vector<string>& cur, vector<string>& res)
start = position in string, parts = segments placed so far.

### Line 2-3: Success — Valid IP!
    if (parts == 4 && start == s.size()) { res.push_back(join(cur,".")); return; }
**WHY both conditions?** We need EXACTLY 4 segments AND ALL digits must be used. One without the other is invalid.

### Line 5: Prune — Dead End
    if (parts == 4 || start >= s.size()) return;
**WHY:** Already 4 parts but digits remain (parts==4) OR no digits left but need more parts (start>=size). Either way, impossible.

### Line 6: Try Segment Lengths 1-3
    for (int len = 1; len <= 3; len++)
**WHY 1 to 3?** Each IP segment is 1-3 digits long (e.g., "0", "25", "255").

### Line 7: Bounds Check
    if (start+len > s.size()) break;
**WHY break?** Not enough digits left for this length — and longer won't work either.

### Line 8-9: Validate Segment
    string seg = s.substr(start, len);
    if (!isValid(seg)) continue;
**WHY validate?** Must check: value 0-255, no leading zeros ("01" invalid, "0" ok).

### Line 10-12: Add → Recurse → Backtrack
    cur.push_back(seg);
    restoreIp(s, start+len, parts+1, ...);
    cur.pop_back();
**WHY parts+1?** We just placed one more segment. Start advances past the digits we used.

## Time & Space Complexity
- **Time:** O(1) — at most 3⁴ = 81 combinations to try
- **Space:** O(1) — at most 4 recursion levels deep`
    },
];

const DS = "25525511135";
export default function RestoreIP() {
    const [sT, setST] = useState(DS);
    const [sess, setSess] = useState(() => gen(DS));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 800);
    const run = () => { const s = sT.replace(/[^0-9]/g, ""); if (s.length < 4 || s.length > 12) return; setSess(gen(s)); setIdx(0); setPlaying(false); };
    const reset = () => { setST(DS); setSess(gen(DS)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Restore IP Addresses" subtitle="Split into 4 valid octets · Backtracking · LC #93">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={sT} onChange={setST} onRun={run} onReset={reset} placeholder="25525511135" label="Digits (4–12):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="restore_ip.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <IPViz cur={step.cur || []} />
                    <VizCard title={`🌐 Valid IPs: ${(step.result || []).length}`}><div style={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "30px" }}>{(step.result || []).map((ip, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80", fontFamily: "monospace" }}>{ip}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🌐 {sess.result.length} IPs</span></StepInfo>
        </VizLayout>
    );
}
