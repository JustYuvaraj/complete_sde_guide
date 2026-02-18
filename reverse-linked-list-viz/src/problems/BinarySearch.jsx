import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, StepInfo, VizLayout, VizCard, usePlayer, InputSection,
    ExplainPanel,
} from "../shared/Components";

const DEFAULT_ARR = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const DEFAULT_TARGET = 40;

const CODE = [
    { id: 0, text: `int binarySearch(int arr[], int l, int r, int t) {` },
    { id: 1, text: `    if (l > r) return -1; // base case` },
    { id: 2, text: `` },
    { id: 3, text: `    int mid = l + (r - l) / 2;` },
    { id: 4, text: `` },
    { id: 5, text: `    if (arr[mid] == t)  // found!` },
    { id: 6, text: `        return mid;` },
    { id: 7, text: `` },
    { id: 8, text: `    if (arr[mid] < t)  // target is RIGHT` },
    { id: 9, text: `        return binarySearch(arr, mid+1, r, t);` },
    { id: 10, text: `` },
    { id: 11, text: `    // target is LEFT` },
    { id: 12, text: `    return binarySearch(arr, l, mid-1, t);` },
    { id: 13, text: `}` },
];

const PHASE_COLOR = {
    call: "#8b5cf6", check: "#3b82f6", mid: "#f59e0b", compare: "#f59e0b",
    recurse: "#ec4899", found: "#10b981", return: "#10b981", done: "#10b981",
    notfound: "#ef4444",
};
const PHASE_LABELS = {
    call: "📞 CALL", check: "🔵 CHECK", mid: "📐 MIDPOINT", compare: "⚖ COMPARE",
    recurse: "↩ RECURSE", found: "🎯 FOUND", return: "⬆ RETURN", done: "✅ DONE",
    notfound: "❌ NOT FOUND",
};

/* ── Dynamic step generator ── */
function generateSteps(arr, target) {
    const steps = [];
    const allIdx = arr.map((_, i) => i);
    let eliminated = [];
    const callStack = [];
    let callCount = 0;

    function recurse(l, r) {
        callCount++;
        callStack.push({ l, r });
        const hl = allIdx.filter(i => !eliminated.includes(i));

        // call
        steps.push({
            cl: 0, l, r, mid: null, phase: "call", hl: [...hl], elim: [...eliminated], found: null,
            cs: callStack.map(c => ({ ...c })),
            vars: { l, r, target },
            msg: `binarySearch(arr, ${l}, ${r}, ${target}) — searching [${arr.slice(l, r + 1).join(",")}]`,
        });

        // base case check
        if (l > r) {
            steps.push({
                cl: 1, l, r, mid: null, phase: "notfound", hl: [...hl], elim: [...eliminated], found: null,
                cs: callStack.map(c => ({ ...c })),
                vars: { l, r, "l > r": "true → return -1" },
                msg: `l=${l} > r=${r} → BASE CASE: element not in this range, return -1`,
            });
            callStack.pop();
            return false;
        }

        steps.push({
            cl: 1, l, r, mid: null, phase: "check", hl: [...hl], elim: [...eliminated], found: null,
            cs: callStack.map(c => ({ ...c })),
            vars: { l, r, "l > r": "false → continue" },
            msg: `l=${l} ≤ r=${r} → not base case, continue searching`,
        });

        // compute mid
        const mid = Math.floor(l + (r - l) / 2);
        steps.push({
            cl: 3, l, r, mid, phase: "mid", hl: [...hl], elim: [...eliminated], found: null,
            cs: callStack.map(c => ({ ...c })),
            vars: { l, r, mid: `${l}+(${r}-${l})/2 = ${mid}`, [`arr[${mid}]`]: arr[mid] },
            msg: `mid = ${mid} → arr[${mid}] = ${arr[mid]}`,
        });

        // check if found
        if (arr[mid] === target) {
            steps.push({
                cl: 5, l, r, mid, phase: "found", hl: [...hl], elim: [...eliminated], found: mid,
                cs: callStack.map(c => ({ ...c })),
                vars: { [`arr[${mid}]`]: arr[mid], target, [`${arr[mid]} == ${target}`]: "✓ FOUND!" },
                msg: `🎯 arr[${mid}] = ${arr[mid]} == target! FOUND at index ${mid}!`,
            });
            steps.push({
                cl: 6, l, r, mid, phase: "return", hl: [...hl], elim: [...eliminated], found: mid,
                cs: callStack.map(c => ({ ...c })),
                vars: { "return mid": mid, result: `index ${mid} returned up the call stack` },
                msg: `Return index ${mid} → unwinds through ${callCount} recursive calls`,
            });
            callStack.pop();
            return true;
        }

        // not found at mid — compare
        steps.push({
            cl: 5, l, r, mid, phase: "compare", hl: [...hl], elim: [...eliminated], found: null,
            cs: callStack.map(c => ({ ...c })),
            vars: { [`arr[${mid}]`]: arr[mid], target, [`${arr[mid]} == ${target}`]: "✗ NO" },
            msg: `arr[${mid}]=${arr[mid]} ≠ ${target} → not found here`,
        });

        if (arr[mid] < target) {
            // target is RIGHT
            steps.push({
                cl: 8, l, r, mid, phase: "compare", hl: [...hl], elim: [...eliminated], found: null,
                cs: callStack.map(c => ({ ...c })),
                vars: { [`arr[${mid}]`]: arr[mid], target, [`${arr[mid]} < ${target}`]: "✓ YES → go RIGHT" },
                msg: `${arr[mid]} < ${target} → target is to the RIGHT!`,
            });
            // eliminate left side + mid
            for (let i = l; i <= mid; i++) if (!eliminated.includes(i)) eliminated.push(i);
            steps.push({
                cl: 9, l, r, mid, phase: "recurse", hl: [...hl], elim: [...eliminated], found: null,
                cs: callStack.map(c => ({ ...c })),
                vars: { decision: "go RIGHT", next: `search(${mid + 1}, ${r})` },
                msg: `Recurse RIGHT: binarySearch(${mid + 1}, ${r}) — indices ${l}–${mid} eliminated`,
            });
            const found = recurse(mid + 1, r);
            if (!found) callStack.pop();
            return found;
        } else {
            // target is LEFT
            steps.push({
                cl: 8, l, r, mid, phase: "compare", hl: [...hl], elim: [...eliminated], found: null,
                cs: callStack.map(c => ({ ...c })),
                vars: { [`arr[${mid}]`]: arr[mid], target, [`${arr[mid]} < ${target}`]: `✗ NO → ${arr[mid]} > ${target}, go LEFT` },
                msg: `${arr[mid]} > ${target} → target is to the LEFT!`,
            });
            // eliminate right side + mid
            for (let i = mid; i <= r; i++) if (!eliminated.includes(i)) eliminated.push(i);
            steps.push({
                cl: 12, l, r, mid, phase: "recurse", hl: [...hl], elim: [...eliminated], found: null,
                cs: callStack.map(c => ({ ...c })),
                vars: { decision: "go LEFT", next: `search(${l}, ${mid - 1})` },
                msg: `Recurse LEFT: binarySearch(${l}, ${mid - 1}) — indices ${mid}–${r} eliminated`,
            });
            const found = recurse(l, mid - 1);
            if (!found) callStack.pop();
            return found;
        }
    }

    const found = recurse(0, arr.length - 1);

    // Final step
    const lastStep = steps[steps.length - 1];
    if (found) {
        steps.push({
            cl: -1, l: 0, r: arr.length - 1, mid: lastStep.found, phase: "done",
            hl: allIdx, elim: [], found: lastStep.found,
            cs: [],
            vars: { result: `index ${lastStep.found}`, target, [`arr[${lastStep.found}]`]: arr[lastStep.found], calls: callCount },
            msg: `✅ Found target=${target} at index ${lastStep.found} in ${callCount} calls. O(log ${arr.length}) ≈ ${Math.log2(arr.length).toFixed(1)}`,
        });
    } else {
        steps.push({
            cl: -1, l: 0, r: arr.length - 1, mid: null, phase: "notfound",
            hl: allIdx, elim: allIdx, found: null,
            cs: [],
            vars: { result: "-1 (not found)", target, calls: callCount },
            msg: `❌ Target ${target} not found in the array after ${callCount} calls.`,
        });
    }

    return steps;
}

/* ── Build recursion tree from steps ── */
function buildTree(steps) {
    const calls = [];
    for (const s of steps) {
        if (s.phase === "call") {
            const key = `${s.l},${s.r}`;
            if (!calls.find(c => c.key === key)) {
                calls.push({ key, l: s.l, r: s.r });
            }
        }
    }
    const nodes = calls.map((c, i) => ({
        id: `n${i}`, label: `search(${c.l},${c.r})`, key: c.key,
        x: 60 + i * 130, y: 10 + i * 40,
    }));
    const edges = [];
    for (let i = 1; i < nodes.length; i++) {
        edges.push({ from: nodes[i - 1].id, to: nodes[i].id });
    }
    return { nodes, edges };
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find a target value in a **sorted** array. Return its index, or -1 if not found.

## How to Think About It
**Ask yourself:** "Is the target in the left or right half of the current range?"

### Divide & Conquer
- Look at the **middle** element
- If it's the target → done!
- If target is **smaller** → search LEFT half
- If target is **larger** → search RIGHT half
- Each step eliminates **half** the remaining elements

**Think of it like:** Opening a dictionary to the middle. Is your word before or after this page? Flip to the correct half and repeat.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step for [10,20,30,40,50,60,70,80,90], target=40

1. l=0, r=8: mid=4, arr[4]=50 > 40 → go LEFT
2. l=0, r=3: mid=1, arr[1]=20 < 40 → go RIGHT
3. l=2, r=3: mid=2, arr[2]=30 < 40 → go RIGHT
4. l=3, r=3: mid=3, arr[3]=40 = 40 → **FOUND** at index 3! ✅

Only 4 comparisons for 9 elements!

### Why O(log n)?
Each step halves the search space:
- 16 elements → 4 steps max
- 1000 elements → 10 steps max
- 1,000,000 elements → 20 steps max!`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Line-by-Line Breakdown

### Line 1: Base Case
    if (l > r) return -1;
**WHY:** If left pointer passes right, the search space is empty → element not found.

### Line 3: Compute Mid
    int mid = l + (r - l) / 2;
**WHY l+(r-l)/2 instead of (l+r)/2?** Prevents integer overflow for large arrays.

### Line 5-6: Found!
    if (arr[mid] == t) return mid;

### Line 8-9: Target is RIGHT
    if (arr[mid] < t) return binarySearch(arr, mid+1, r, t);
**WHY mid+1?** We already checked mid, so exclude it.

### Line 12: Target is LEFT
    return binarySearch(arr, l, mid-1, t);

## Time & Space Complexity
- **Time:** O(log n) — halve search space each step
- **Space:** O(log n) recursive, O(1) iterative`
    },
];

export default function BinarySearch() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(`[${DEFAULT_ARR.join(",")}], ${DEFAULT_TARGET}`);
    const [arr, setArr] = useState(DEFAULT_ARR);
    const [target, setTarget] = useState(DEFAULT_TARGET);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR, DEFAULT_TARGET));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";
    const elimSet = new Set(step.elim);

    const tree = buildTree(steps);
    // figure out which tree nodes are revealed up to current step
    const revealedCalls = new Set();
    for (let i = 0; i <= idx; i++) {
        if (steps[i].phase === "call") revealedCalls.add(`${steps[i].l},${steps[i].r}`);
    }
    const activeCall = step.phase !== "done" && step.phase !== "notfound" ? `${step.l},${step.r}` : null;

    function handleRun() {
        try {
            const parts = inputText.split("],");
            const arrStr = parts[0].replace("[", "").trim();
            const nums = arrStr.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const t = parseInt((parts[1] || "").trim());
            if (nums.length === 0 || isNaN(t)) return;
            const sorted = [...nums].sort((a, b) => a - b);
            if (sorted.length > 10) return;
            setArr(sorted);
            setTarget(t);
            const newSteps = generateSteps(sorted, t);
            setSteps(newSteps);
            setIdx(0);
            setPlaying(false);
        } catch { /* ignore parse errors */ }
    }

    function handleReset() {
        setInputText(`[${DEFAULT_ARR.join(",")}], ${DEFAULT_TARGET}`);
        setArr(DEFAULT_ARR);
        setTarget(DEFAULT_TARGET);
        setSteps(generateSteps(DEFAULT_ARR, DEFAULT_TARGET));
        setIdx(0);
        setPlaying(false);
    }

    return (
        <VizLayout
            title="Binary Search — Recursive"
            subtitle={`arr = [${arr.join(",")}] · target = ${target} · O(log n)`}
        >
            <ExplainPanel sections={EXPLAIN} />
            {/* Input section */}
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="[10,20,30,40,50], 30"
                label="Array, Target:"
            />

            {/* Code + Variables + Call Stack */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="binary_search.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel
                        frames={step.cs}
                        renderFrame={(f) => `bSearch(${f.l},${f.r})`}
                    />
                </div>
            </div>

            {/* Array + Recursion Tree side by side */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                {/* Array visualization */}
                <VizCard title={`📊 Array — target = ${target}`}>
                    <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", marginBottom: "6px" }}>
                        {arr.map((val, i) => {
                            const isElim = elimSet.has(i);
                            const inRange = step.hl.includes(i);
                            const isMid = i === step.mid && step.mid !== null;
                            const isFound = i === step.found && step.found !== null;
                            const isDone = step.phase === "done";

                            let bg = isDark ? "#1e293b" : "#e2e8f0", border = theme.cardBorder, shadow = "none";
                            if (isDone && isFound) { bg = "#065f46"; border = "#10b981"; shadow = "0 0 10px #10b98166"; }
                            else if (isFound) { bg = "#065f46"; border = "#10b981"; shadow = "0 0 10px #10b98166"; }
                            else if (isMid) { bg = isDark ? "#78350f" : "#fef3c7"; border = "#f59e0b"; shadow = "0 0 8px #f59e0b66"; }
                            else if (isElim) { bg = isDark ? "#0c0c0e" : "#f1f5f9"; border = isDark ? "#1a1a24" : "#e2e8f0"; }
                            else if (inRange) { bg = isDark ? "#1e1b4b" : "#e0e7ff"; border = "#4f46e5"; }

                            return (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", flex: 1 }}>
                                    <div style={{ height: "12px", display: "flex", alignItems: "center" }}>
                                        {isMid && !isFound && <span style={{ fontSize: "6px", color: "#f59e0b", fontWeight: "700" }}>MID</span>}
                                        {isFound && <span style={{ fontSize: "6px", color: "#10b981", fontWeight: "700" }}>FOUND</span>}
                                    </div>
                                    <div style={{
                                        width: "100%", height: "44px", background: bg,
                                        border: `2px solid ${border}`, borderRadius: "4px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.35s", boxShadow: shadow,
                                        opacity: isElim ? 0.25 : 1,
                                    }}>
                                        <span style={{
                                            fontSize: "10px", fontWeight: "800",
                                            color: isFound ? "#34d399" : isMid ? "#fbbf24" : isElim ? (isDark ? "#374151" : "#94a3b8") : theme.text,
                                        }}>{val}</span>
                                    </div>
                                    <span style={{ fontSize: "7px", color: isElim ? (isDark ? "#1f2937" : "#cbd5e1") : theme.textDim }}>[{i}]</span>
                                    <div style={{ height: "10px", display: "flex", gap: "2px" }}>
                                        {isMid && !isFound && <span style={{ fontSize: "6px", color: "#f59e0b", fontWeight: "700" }}>m</span>}
                                        {i === step.l && inRange && <span style={{ fontSize: "6px", color: "#60a5fa", fontWeight: "700" }}>l</span>}
                                        {i === step.r && inRange && <span style={{ fontSize: "6px", color: "#f472b6", fontWeight: "700" }}>r</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[
                            { color: "#4f46e5", label: "active range" }, { color: "#f59e0b", label: "mid" },
                            { color: "#60a5fa", label: "l" }, { color: "#f472b6", label: "r" },
                            { color: "#10b981", label: "found ✓" }, { color: isDark ? "#374151" : "#94a3b8", label: "eliminated" },
                        ].map(l => (
                            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.55rem", color: theme.textMuted }}>
                                <span style={{ width: "7px", height: "7px", background: l.color, borderRadius: "2px", display: "inline-block" }} />
                                {l.label}
                            </span>
                        ))}
                    </div>
                </VizCard>

                {/* Recursion tree */}
                <VizCard title="🌳 Recursion Tree">
                    <svg width="100%" viewBox={`0 0 ${Math.max(560, tree.nodes.length * 140)} ${tree.nodes.length * 45 + 20}`} style={{ overflow: "visible" }}>
                        {tree.edges.map((e, i) => {
                            const from = tree.nodes.find(n => n.id === e.from);
                            const to = tree.nodes.find(n => n.id === e.to);
                            if (!revealedCalls.has(from.key) || !revealedCalls.has(to.key)) return null;
                            return (
                                <line key={i} x1={from.x + 60} y1={from.y + 20} x2={to.x + 60} y2={to.y}
                                    stroke={isDark ? "#334155" : "#c7d2fe"} strokeWidth="1.5" />
                            );
                        })}
                        {tree.nodes.filter(n => revealedCalls.has(n.key)).map(n => {
                            const isActive = activeCall === n.key;
                            const isFoundNode = step.found !== null && (step.phase === "found" || step.phase === "return" || step.phase === "done") && n === tree.nodes[tree.nodes.length - 1];
                            const bg = isFoundNode ? (isDark ? "#065f46" : "#dcfce7")
                                : isActive ? (isDark ? "#1e1b4b" : "#e0e7ff")
                                    : (isDark ? "#111827" : "#f1f5f9");
                            const border = isFoundNode ? "#10b981" : isActive ? pc : (isDark ? "#334155" : "#c7d2fe");
                            const textColor = isFoundNode ? "#34d399" : isActive ? (isDark ? "#fff" : "#312e81") : (isDark ? "#64748b" : "#6366f1");

                            return (
                                <g key={n.id}>
                                    {(isActive || isFoundNode) && (
                                        <rect x={n.x - 3} y={n.y - 3} width={126} height={26} rx="8"
                                            fill={isFoundNode ? "#10b98133" : `${pc}22`} style={{ filter: "blur(5px)" }} />
                                    )}
                                    <rect x={n.x} y={n.y} width={120} height={20} rx="6"
                                        fill={bg} stroke={border} strokeWidth={isActive || isFoundNode ? 2 : 1} />
                                    <text x={n.x + 60} y={n.y + 13} textAnchor="middle"
                                        fontSize="8" fontWeight="700" fill={textColor}>
                                        {isFoundNode ? `✓ FOUND ${target}!` : n.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </VizCard>
            </div>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                {[
                    { label: "↺ Reset", onClick: () => { setPlaying(false); setIdx(0); }, dis: false, hl: false },
                    { label: "‹ Prev", onClick: () => setIdx(i => Math.max(0, i - 1)), dis: idx === 0, hl: false },
                    { label: playing ? "⏸ Pause" : "▶ Play", onClick: () => setPlaying(p => !p), dis: false, hl: true },
                    { label: "Next ›", onClick: () => setIdx(i => Math.min(steps.length - 1, i + 1)), dis: idx === steps.length - 1, hl: false },
                ].map(b => (
                    <button key={b.label} onClick={b.onClick} disabled={b.dis} style={{
                        background: b.hl ? theme.btnHighlightBg : theme.btnBg,
                        color: b.dis ? theme.btnDisabledText : b.hl ? "#fff" : theme.btnText,
                        border: `1px solid ${b.hl ? theme.btnHighlightBorder : theme.btnBorder}`,
                        borderRadius: "8px", padding: "7px 16px",
                        fontSize: "0.72rem", fontFamily: "inherit", fontWeight: "700",
                        cursor: b.dis ? "not-allowed" : "pointer", opacity: b.dis ? 0.4 : 1,
                    }}>{b.label}</button>
                ))}
            </div>

            <StepInfo idx={idx} total={steps.length}>
                <span style={{ color: "#8b5cf6" }}>■</span> call &nbsp;
                <span style={{ color: "#f59e0b" }}>■</span> mid/compare &nbsp;
                <span style={{ color: "#ec4899" }}>■</span> recurse &nbsp;
                <span style={{ color: "#10b981" }}>■</span> found
            </StepInfo>
        </VizLayout>
    );
}
