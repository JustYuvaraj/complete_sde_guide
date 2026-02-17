import { useState, useEffect, useRef } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel, MessageBar,
    ControlBar, VizLayout, InputSection, usePlayer, VizCard, StepInfo
} from "../shared/Components";

// ── Code lines ────────────────────────────────────────────────────────
const CODE = [
    { id: 0, text: `int findKthLargest(vector<int>& a, int k) {` },
    { id: 1, text: `    return quickSelect(a, 0, n-1, k);` },
    { id: 2, text: `}` },
    { id: 3, text: `` },
    { id: 4, text: `int quickSelect(vector<int>& a, int l, int r, int k){` },
    { id: 5, text: `    if (l == r) return a[l];  // base case` },
    { id: 6, text: `` },
    { id: 7, text: `    int pivot = a[r];` },
    { id: 8, text: `    int p = partition(a, l, r);` },
    { id: 9, text: `` },
    { id: 10, text: `    int rank = r - p + 1;` },
    { id: 11, text: `    if (rank == k)  return a[p];       // ✓` },
    { id: 12, text: `    if (rank >  k)  return qs(a,p+1,r,k);` },
    { id: 13, text: `    else            return qs(a,l,p-1,k-rank);` },
    { id: 14, text: `}` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", pivot: "#f59e0b", compare: "#06b6d4",
    partition: "#a855f7", rank: "#ec4899", recurse: "#3b82f6",
    found: "#10b981", base: "#10b981", done: "#10b981",
};

const PHASE_LABEL = {
    init: "📞 CALL", pivot: "📌 PIVOT", compare: "🔍 COMPARE",
    partition: "⚙ PARTITION", rank: "📊 RANK CHECK",
    recurse: "↩ RECURSE", found: "✅ FOUND", base: "🟢 BASE", done: "✅ DONE",
};

// ── Tree builder ─────────────────────────────────────────────────────
function buildTree(initArr, k) {
    const arr = [...initArr];
    const n = initArr.length;
    let nc = 0;
    const nodes = [];
    const edges = [];
    const liveMap = {};

    function part(a, l, r) {
        const piv = a[r]; let p = l;
        for (let i = l; i < r; i++) if (a[i] >= piv) { [a[p], a[i]] = [a[i], a[p]]; p++; }
        [a[p], a[r]] = [a[r], a[p]]; return p;
    }

    const cx = (l, r) => 8 + ((l + r) / 2 / Math.max(n - 1, 1)) * 184;

    function addNode(l, r, depth, rk, parentId, pruned) {
        const id = `N${nc++}`;
        const sub = initArr.slice(l, r + 1);
        const lbl = sub.length <= 5 ? `[${sub.join(",")}]` : `[${sub.slice(0, 4).join(",")}…]`;
        if (!pruned) liveMap[`${l},${r},${depth}`] = id;
        nodes.push({
            id, l, r, depth, rk, label: lbl, x: cx(l, r), y: 16 + depth * 52,
            pruned: !!pruned, pivotPos: null, rank: null, parentId
        });
        if (parentId !== null) edges.push([parentId, id]);
        return id;
    }

    function build(l, r, rk, depth, parentId) {
        const id = addNode(l, r, depth, rk, parentId, false);
        if (l === r) return;
        const p = part(arr, l, r);
        const rank = r - p + 1;
        const nd = nodes.find(n => n.id === id);
        nd.pivotPos = p; nd.rank = rank;

        if (rank === rk) {
            if (l <= p - 1) addNode(l, p - 1, depth + 1, rk, id, true);
            if (p + 1 <= r) addNode(p + 1, r, depth + 1, rk, id, true);
        } else if (rank > rk) {
            if (l <= p - 1) addNode(l, p - 1, depth + 1, rk, id, true);
            if (p + 1 <= r) build(p + 1, r, rk, depth + 1, id);
        } else {
            if (l <= p - 1) build(l, p - 1, rk - rank, depth + 1, id);
            if (p + 1 <= r) addNode(p + 1, r, depth + 1, rk, id, true);
        }
    }

    build(0, n - 1, k, 0, null);
    return { nodes, edges, liveMap };
}

// ── Step generator ────────────────────────────────────────────────────
function generateAll(initArr, k) {
    const { nodes, edges, liveMap } = buildTree([...initArr], k);
    const arr = [...initArr];
    const steps = [];
    const revealedNodes = new Set();
    const foundNodes = new Set();

    const nid = (l, r, d) => liveMap[`${l},${r},${d}`] ?? null;
    const rng = (l, r) => Array.from({ length: r - l + 1 }, (_, i) => i + l);

    function push(s) {
        steps.push({
            ...s,
            snapRevealed: new Set(revealedNodes),
            snapFound: new Set(foundNodes),
        });
    }

    function doPartition(l, r, cs, activeId) {
        const pivot = arr[r];
        push({
            cl: 7, phase: "pivot", l, r, hl: [r], pivotIdx: r, partHL: [], foundIdx: null,
            activeId, callStack: cs,
            vars: { pivot, "arr[r]": pivot, l, r },
            msg: `Pivot = arr[${r}] = ${pivot}`
        });

        let p = l;
        for (let i = l; i < r; i++) {
            const ge = arr[i] >= pivot;
            push({
                cl: 8, phase: "compare", l, r, hl: [i, r], pivotIdx: r,
                partHL: rng(l, Math.max(l, p - 1)), foundIdx: null,
                activeId, callStack: cs,
                vars: { "arr[i]": arr[i], pivot, "≥pivot?": ge ? "yes → swap" : "no → skip", p },
                msg: `arr[${i}]=${arr[i]} ${ge ? "≥" : "<"} pivot(${pivot}) → ${ge ? "swap into ≥-zone" : "leave"}`
            });
            if (ge) { [arr[p], arr[i]] = [arr[i], arr[p]]; p++; }
        }
        [arr[p], arr[r]] = [arr[r], arr[p]];
        push({
            cl: 8, phase: "partition", l, r, hl: rng(l, r), pivotIdx: p,
            partHL: rng(l, p), foundIdx: null,
            activeId, callStack: cs,
            vars: { pivotAt: p, "arr[p]": arr[p], "≥pivot": `[${l}..${p}]`, "<pivot": `[${p + 1}..${r}]` },
            msg: `Pivot ${arr[p]} placed at [${p}]. Left zone [${l}..${p}] ≥ pivot, right [${p + 1}..${r}] < pivot.`
        });
        return p;
    }

    function qs(l, r, rk, depth, parentStack) {
        const id = nid(l, r, depth);
        if (id) revealedNodes.add(id);
        const cs = [...parentStack, `qs(${l},${r},k=${rk})`];

        push({
            cl: 4, phase: "init", l, r, hl: rng(l, r), pivotIdx: null, partHL: [], foundIdx: null,
            activeId: id, callStack: cs,
            vars: { l, r, k: rk, seg: `[${arr.slice(l, r + 1).join(",")}]` },
            msg: `quickSelect(arr,${l},${r},k=${rk}) — searching in [${arr.slice(l, r + 1).join(",")}]`
        });

        if (l === r) {
            if (id) foundNodes.add(id);
            push({
                cl: 5, phase: "base", l, r, hl: [l], pivotIdx: null, partHL: [], foundIdx: l,
                activeId: id, callStack: cs,
                vars: { "l==r": "BASE CASE ✓", "a[l]": arr[l], return: arr[l] },
                msg: `BASE CASE: single element [${arr[l]}] → return ${arr[l]}`
            });
            return arr[l];
        }

        const p = doPartition(l, r, cs, id);
        const rank = r - p + 1;

        push({
            cl: 10, phase: "rank", l, r, hl: [p], pivotIdx: p, partHL: [], foundIdx: null,
            activeId: id, callStack: cs,
            vars: { rank, k: rk, p, "r-p+1": `${r}-${p}+1=${rank}` },
            msg: `rank = ${rank}. Need k=${rk}. ${rank === rk ? "rank==k → FOUND!" : rank > rk ? "rank>k → recurse RIGHT" : "rank<k → recurse LEFT, k-=rank"}`
        });

        if (rank === rk) {
            if (id) foundNodes.add(id);
            push({
                cl: 11, phase: "found", l, r, hl: [p], pivotIdx: p, partHL: [], foundIdx: p,
                activeId: id, callStack: cs,
                vars: { rank, k: rk, "rank==k": "✓ FOUND!", answer: arr[p] },
                msg: `✅ rank == k! The ${rk}${ord(rk)} largest = arr[${p}] = ${arr[p]}`
            });
            return arr[p];
        } else if (rank > rk) {
            push({
                cl: 12, phase: "recurse", l, r, hl: rng(p + 1, r), pivotIdx: null, partHL: [], foundIdx: null,
                activeId: id, callStack: cs,
                vars: { rank, k: rk, "rank>k": "recurse RIGHT", newL: p + 1, newR: r },
                msg: `rank(${rank}) > k(${rk}) → recurse RIGHT into [${p + 1}..${r}]`
            });
            return qs(p + 1, r, rk, depth + 1, cs);
        } else {
            push({
                cl: 13, phase: "recurse", l, r, hl: rng(l, p - 1), pivotIdx: null, partHL: [], foundIdx: null,
                activeId: id, callStack: cs,
                vars: { rank, k: rk, "rank<k": "recurse LEFT", "new k": rk - rank, newL: l, newR: p - 1 },
                msg: `rank(${rank}) < k(${rk}) → recurse LEFT [${l}..${p - 1}], new k=${rk - rank}`
            });
            return qs(l, p - 1, rk - rank, depth + 1, cs);
        }
    }

    push({
        cl: 0, phase: "init", l: 0, r: initArr.length - 1, hl: rng(0, initArr.length - 1),
        pivotIdx: null, partHL: [], foundIdx: null, activeId: null, callStack: [],
        vars: { k, n: initArr.length, input: `[${initArr.join(",")}]` },
        msg: `findKthLargest(arr, k=${k}) — find the ${k}${ord(k)} largest element`
    });

    const answer = qs(0, initArr.length - 1, k, 0, []);

    push({
        cl: 11, phase: "done", l: 0, r: initArr.length - 1, hl: rng(0, initArr.length - 1),
        pivotIdx: null, partHL: [], foundIdx: null, activeId: null, callStack: [],
        vars: { ANSWER: answer, k, "kth largest": answer },
        msg: `✅ Done! The ${k}${ord(k)} largest element is ${answer}`
    });

    return { steps, nodes, edges, answer };
}

const ord = n => n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";

// ── Recursion Tree SVG ────────────────────────────────────────────────
function RecursionTree({ nodes, edges, activeId, snapRevealed, snapFound }) {
    const { theme } = useTheme();
    if (!nodes.length) return null;

    const maxDepth = Math.max(...nodes.map(n => n.depth), 1);
    const VH = maxDepth * 52 + 56;
    const R = maxDepth >= 4 ? 5 : 6;
    const fz = maxDepth >= 4 ? 4.5 : 5.5;

    const styleOf = nd => {
        if (nd.pruned) return {
            fill: theme.bg, stroke: theme.cardBorder, strokeW: "0.5",
            textC: theme.textDim, op: 0.5, pulse: false,
        };
        if (snapFound.has(nd.id)) return {
            fill: "#052e16", stroke: "#10b981", strokeW: "1.2",
            textC: "#4ade80", op: 1, pulse: false,
        };
        if (nd.id === activeId) return {
            fill: theme.stackActiveBg, stroke: theme.heroAccent, strokeW: "1.5",
            textC: theme.text, op: 1, pulse: true,
        };
        if (snapRevealed.has(nd.id)) return {
            fill: theme.cardBg, stroke: theme.cardBorder, strokeW: "0.8",
            textC: theme.textMuted, op: 1, pulse: false,
        };
        return { fill: theme.bg, stroke: theme.cardBorder, strokeW: "0.5", textC: theme.textDim, op: 0.2, pulse: false };
    };

    const isVisible = nd => {
        if (!nd.pruned) return snapRevealed.has(nd.id) || nd.id === activeId;
        return nd.parentId !== null && snapRevealed.has(nd.parentId);
    };

    return (
        <svg viewBox={`0 0 200 ${VH}`} style={{ width: "100%", height: "100%" }}
            preserveAspectRatio="xMidYMid meet">
            {edges.map(([aid, bid]) => {
                const a = nodes.find(n => n.id === aid);
                const b = nodes.find(n => n.id === bid);
                if (!a || !b || !isVisible(a)) return null;
                const hot = aid === activeId || bid === activeId;
                return (
                    <line key={aid + bid}
                        x1={a.x} y1={a.y + R + 0.5} x2={b.x} y2={b.y - R - 0.5}
                        stroke={b.pruned ? theme.cardBorder : hot ? theme.heroAccent : theme.cardBorder}
                        strokeWidth={hot ? "1.2" : "0.5"}
                        strokeDasharray={b.pruned ? "3,3" : "none"}
                        opacity={b.pruned ? 0.3 : 1}
                    />
                );
            })}
            {nodes.map(nd => {
                if (!isVisible(nd)) return null;
                const s = styleOf(nd);
                return (
                    <g key={nd.id} opacity={s.op}>
                        {s.pulse && (
                            <circle cx={nd.x} cy={nd.y} r={R + 3.5}
                                fill="none" stroke={theme.heroAccent}
                                strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
                        )}
                        <circle cx={nd.x} cy={nd.y} r={R}
                            fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeW} />
                        <text x={nd.x} y={nd.y - R - 2.5}
                            textAnchor="middle" fontSize={fz}
                            fontFamily="'Fira Code',monospace"
                            fill={s.textC} fontWeight={s.pulse ? "700" : "500"}>
                            {nd.label}{nd.pruned ? " ✗" : ""}
                        </text>
                        <text x={nd.x} y={nd.y + fz * 0.38}
                            textAnchor="middle" fontSize={fz - 0.8}
                            fontFamily="'Fira Code',monospace"
                            fill={snapFound.has(nd.id) ? "#4ade80" :
                                nd.rank != null && snapRevealed.has(nd.id) && !nd.pruned ? "#ec4899" : theme.textDim}>
                            {snapFound.has(nd.id) ? "★"
                                : nd.rank != null && snapRevealed.has(nd.id) && !nd.pruned ? `r=${nd.rank}`
                                    : nd.pruned ? "✗"
                                        : `${nd.l}..${nd.r}`}
                        </text>
                    </g>
                );
            })}
            {[
                { x: 2, f: theme.stackActiveBg, s: theme.heroAccent, l: "active" },
                { x: 28, f: "#052e16", s: "#10b981", l: "found ★" },
                { x: 56, f: theme.cardBg, s: theme.cardBorder, l: "visited" },
                { x: 84, f: theme.bg, s: theme.cardBorder, l: "pruned ✗" },
            ].map(d => (
                <g key={d.l}>
                    <circle cx={d.x + 2} cy={VH - 4} r={2}
                        fill={d.f} stroke={d.s} strokeWidth="0.6" />
                    <text x={d.x + 5.5} y={VH - 2.5} fontSize="3.8"
                        fontFamily="'Fira Code',monospace" fill={theme.textDim}>{d.l}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Array Bars (problem-specific) ─────────────────────────────────────
function ArrayBars({ step, inputArr, maxV }) {
    const { theme } = useTheme();

    return (
        <VizCard title="📊 Array — yellow=pivot · purple=≥pivot zone · indigo=active range · green=answer ★">
            <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", marginBottom: "5px" }}>
                {inputArr.map((val, i) => {
                    const isFound = i === step.foundIdx;
                    const isPivot = i === step.pivotIdx;
                    const isPart = (step.partHL || []).includes(i);
                    const inRange = (step.hl || []).includes(i);
                    const isDone = step.phase === "done";
                    const barH = Math.max(16, Math.round((val / maxV) * 66));

                    let bg, border, shadow = "none", textCol = theme.text;
                    if (isDone && isFound) { bg = "#052e16"; border = "#10b981"; textCol = "#4ade80"; shadow = "0 0 10px #10b98155"; }
                    else if (isFound) { bg = "#052e16"; border = "#10b981"; textCol = "#4ade80"; shadow = "0 0 10px #10b98155"; }
                    else if (isPivot) { bg = "#422006"; border = "#f59e0b"; textCol = "#fbbf24"; shadow = "0 0 8px #f59e0b55"; }
                    else if (isPart) { bg = "#2e1065"; border = "#a855f7"; textCol = "#e9d5ff"; }
                    else if (inRange) { bg = theme.stackActiveBg; border = theme.heroAccent; }
                    else { bg = theme.cardHeaderBg; border = theme.cardBorder; textCol = theme.textDim; }

                    return (
                        <div key={i} style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "2px", flex: 1
                        }}>
                            <div style={{
                                height: "13px", display: "flex",
                                alignItems: "flex-end", justifyContent: "center"
                            }}>
                                {isPivot && !isFound &&
                                    <span style={{ fontSize: "7px", color: "#f59e0b", fontWeight: "800" }}>📌</span>}
                                {isFound &&
                                    <span style={{ fontSize: "7px", color: "#10b981", fontWeight: "800" }}>★</span>}
                            </div>
                            <div style={{
                                width: "100%", height: `${barH}px`, background: bg,
                                border: `2px solid ${border}`, borderRadius: "3px 3px 0 0",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.3s", boxShadow: shadow
                            }}>
                                <span style={{ fontSize: "9px", fontWeight: "800", color: textCol }}>{val}</span>
                            </div>
                            <span style={{ fontSize: "7px", color: inRange ? theme.textMuted : theme.textDim }}>[{i}]</span>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
                {[
                    { c: theme.heroAccent, l: "active range" }, { c: "#f59e0b", l: "📌 pivot" },
                    { c: "#a855f7", l: "≥ pivot zone" }, { c: "#10b981", l: "★ answer" },
                ].map(x => (
                    <span key={x.l} style={{
                        display: "flex", alignItems: "center",
                        gap: "3px", fontSize: "0.58rem", color: theme.textMuted
                    }}>
                        <span style={{
                            width: "7px", height: "7px", background: x.c,
                            borderRadius: "2px", display: "inline-block"
                        }} />
                        {x.l}
                    </span>
                ))}
            </div>
        </VizCard>
    );
}

// ── Rank Tracker (problem-specific) ───────────────────────────────────
function RankTracker({ step, k, answer }) {
    const { theme } = useTheme();
    return (
        <VizCard title="📊 Rank Check — rank = how many elements are ≥ pivot (pivot's position from right)">
            <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
                <div style={{
                    padding: "8px 14px", background: theme.bg,
                    border: `2px solid ${step.phase === "done" || step.phase === "found" ? "#10b981" : theme.cardBorder}`,
                    borderRadius: "10px", textAlign: "center", flexShrink: 0, minWidth: "72px",
                    transition: "border 0.3s"
                }}>
                    <div style={{ fontSize: "0.55rem", color: theme.textDim, marginBottom: "2px" }}>
                        {k}{ord(k)} LARGEST
                    </div>
                    <div style={{
                        fontSize: "2rem", fontWeight: "900",
                        color: step.phase === "done" || step.phase === "found" ? "#10b981" : theme.textMuted,
                        textShadow: step.phase === "done" || step.phase === "found" ? "0 0 20px #10b98166" : "none",
                        transition: "all 0.3s"
                    }}>
                        {step.phase === "done" || step.phase === "found" ? answer : "?"}
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    {[
                        { label: "rank", val: step.vars?.rank ?? null, color: "#ec4899" },
                        { label: "k", val: step.vars?.k ?? k, color: "#818cf8" },
                    ].map(c => (
                        <div key={c.label} style={{
                            flex: 1, minWidth: "60px",
                            padding: "6px 10px", borderRadius: "8px",
                            background: theme.bg,
                            border: `1.5px solid ${c.val != null ? c.color : theme.cardBorder}`,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "2px", transition: "all 0.3s"
                        }}>
                            <span style={{
                                fontSize: "0.58rem", color: c.val != null ? c.color : theme.textMuted,
                                fontWeight: "700"
                            }}>{c.label}</span>
                            <span style={{
                                fontSize: "1.4rem", fontWeight: "900",
                                color: c.val != null ? c.color : theme.text
                            }}>
                                {c.val ?? (c.label === "k" ? k : "—")}
                            </span>
                        </div>
                    ))}

                    {step.vars?.rank != null && (
                        <div style={{
                            flex: 1, padding: "6px 10px", borderRadius: "8px",
                            background: step.phase === "found" || step.phase === "base" ? "#052e16" : "#0c1a3a",
                            border: `1.5px solid ${step.phase === "found" || step.phase === "base" ? "#10b981" : "#3b82f6"}`,
                            textAlign: "center", transition: "all 0.35s"
                        }}>
                            <div style={{ fontSize: "0.55rem", color: "#64748b", marginBottom: "2px" }}>
                                decision
                            </div>
                            <div style={{
                                fontSize: "0.72rem", fontWeight: "700",
                                color: step.phase === "found" || step.phase === "base" ? "#4ade80" : "#60a5fa"
                            }}>
                                {step.vars.rank === step.vars.k ? "rank==k ✓ FOUND!"
                                    : step.vars.rank > step.vars.k ? "rank>k → RIGHT"
                                        : "rank<k → LEFT"}
                            </div>
                        </div>
                    )}

                    <div style={{
                        flex: "0 0 110px", fontSize: "0.56rem", color: theme.textMuted,
                        display: "flex", flexDirection: "column", gap: "2px", justifyContent: "center"
                    }}>
                        <div style={{ color: theme.textDim, fontWeight: "700", marginBottom: "1px" }}>
                            QuickSelect insight:
                        </div>
                        <div>Pivot lands at its <span style={{ color: "#f59e0b" }}>final rank</span>.</div>
                        <div>Only recurse <span style={{ color: "#3b82f6" }}>one branch</span>.</div>
                        <div>→ avg <span style={{ color: "#10b981" }}>O(n)</span> time</div>
                    </div>
                </div>
            </div>
        </VizCard>
    );
}

// ── App ───────────────────────────────────────────────────────────────
const DEFAULT_ARR = [3, 2, 1, 5, 6, 4];
const DEFAULT_K = 2;

export default function KthLargest() {
    const { theme } = useTheme();
    const [inputArr, setInputArr] = useState(DEFAULT_ARR);
    const [k, setK] = useState(DEFAULT_K);
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [kText, setKText] = useState(String(DEFAULT_K));
    const [session, setSession] = useState(null);
    const { idx, setIdx, playing, setPlaying } = usePlayer(session?.steps?.length || 1, 1150);

    useEffect(() => {
        try {
            const r = generateAll(inputArr, k);
            setSession(r);
            setIdx(0);
            setPlaying(false);
        } catch (e) { console.error(e); }
    }, [inputArr, k]);

    function handleRun() {
        const nums = inputText.split(/[\s,]+/).map(s => parseInt(s, 10)).filter(n => !isNaN(n));
        const kv = parseInt(kText, 10);
        if (nums.length < 2 || nums.length > 10) return;
        if (isNaN(kv) || kv < 1 || kv > nums.length) return;
        setInputArr(nums);
        setK(kv);
        setInputText(nums.join(","));
        setKText(String(kv));
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setKText(String(DEFAULT_K));
        setInputArr(DEFAULT_ARR);
        setK(DEFAULT_K);
    }

    if (!session) return (
        <div style={{
            background: theme.bg, height: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: theme.heroAccent, fontFamily: "monospace"
        }}>Computing…</div>
    );

    const { steps, nodes, edges, answer } = session;
    const step = steps[Math.min(idx, steps.length - 1)];
    const totalS = steps.length;
    const pc = PHASE_COLOR[step.phase] || theme.heroAccent;
    const maxV = Math.max(...inputArr, 1);

    return (
        <VizLayout title="Kth Largest Element" subtitle="QuickSelect · Average O(n) · LC #215">
            {/* Custom input with k field */}
            <div style={{
                display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap",
                width: "100%", maxWidth: "920px",
            }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>
                    Array:
                </span>
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRun()}
                    placeholder="3,2,1,5,6,4"
                    style={{
                        flex: 1, minWidth: "120px",
                        background: theme.cardBg, color: theme.text,
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "6px", padding: "5px 10px",
                        fontSize: "0.7rem", fontFamily: "inherit", outline: "none",
                    }}
                />
                <span style={{ fontSize: "0.6rem", color: theme.textMuted }}>k =</span>
                <input type="text" value={kText} onChange={e => setKText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRun()}
                    style={{
                        width: "40px",
                        background: theme.cardBg, color: theme.text,
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "6px", padding: "5px 8px",
                        fontSize: "0.7rem", fontFamily: "inherit", outline: "none",
                    }}
                />
                <button onClick={handleRun} style={{
                    background: theme.btnHighlightBg, color: "#fff",
                    border: `1px solid ${theme.btnHighlightBorder}`,
                    borderRadius: "6px", padding: "5px 14px",
                    fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700", cursor: "pointer",
                }}>▶ Run</button>
                <button onClick={handleReset} style={{
                    background: theme.btnBg, color: theme.btnText,
                    border: `1px solid ${theme.btnBorder}`,
                    borderRadius: "6px", padding: "5px 10px",
                    fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600", cursor: "pointer",
                }}>↺ Default</button>
            </div>

            {/* MAIN GRID */}
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "960px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="kth_largest.cpp" />

                <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrayBars step={step} inputArr={inputArr} maxV={maxV} />

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "2 1 300px" }}>
                            <RankTracker step={step} k={k} answer={answer} />
                        </div>
                        <div style={{ flex: "1 1 150px" }}>
                            <VariablesPanel vars={step.vars} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "0 0 175px" }}>
                            <CallStackPanel
                                frames={step.callStack || []}
                                emptyText={step.phase === "done" ? "✅ complete" : "—"}
                            />
                        </div>
                        <VizCard title="🌳 QuickSelect Tree">
                            <div style={{ minHeight: "120px" }}>
                                <RecursionTree nodes={nodes} edges={edges}
                                    activeId={step.activeId}
                                    snapRevealed={step.snapRevealed}
                                    snapFound={step.snapFound} />
                            </div>
                        </VizCard>
                    </div>
                </div>
            </div>

            <MessageBar phase={step.phase}
                phaseLabel={PHASE_LABEL[step.phase] || step.phase}
                msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={totalS} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={totalS}>
                <span style={{ color: "#10b981", fontWeight: 700 }}>🏆 {k}{ord(k)} largest = {answer}</span>
            </StepInfo>
        </VizLayout>
    );
}
