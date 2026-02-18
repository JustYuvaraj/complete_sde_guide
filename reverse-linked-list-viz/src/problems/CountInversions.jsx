import { useState, useEffect, useRef } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel, MessageBar,
    ControlBar, VizLayout, InputSection, usePlayer, VizCard, StepInfo, ExplainPanel
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int countInv(int arr[], int l, int r) {` },
    { id: 1, text: `    if (l >= r) return 0; // base: 1 elem` },
    { id: 2, text: `` },
    { id: 3, text: `    int mid = (l + r) / 2;` },
    { id: 4, text: `    int left  = countInv(arr, l, mid);` },
    { id: 5, text: `    int right = countInv(arr, mid+1, r);` },
    { id: 6, text: `    int split = mergeCount(arr, l, mid, r);` },
    { id: 7, text: `` },
    { id: 8, text: `    return left + right + split;` },
    { id: 9, text: `}` },
    { id: 10, text: `` },
    { id: 11, text: `int mergeCount(int arr[], int l, int m, int r) {` },
    { id: 12, text: `    // merge left[l..m] & right[m+1..r]` },
    { id: 13, text: `    int inv = 0, i = l, j = m+1, k = l;` },
    { id: 14, text: `    while (i<=m && j<=r) {` },
    { id: 15, text: `        if (arr[i] <= arr[j])` },
    { id: 16, text: `            sorted[k++] = arr[i++]; // no inv` },
    { id: 17, text: `        else {` },
    { id: 18, text: `            sorted[k++] = arr[j++];` },
    { id: 19, text: `            inv += (m - i + 1); // inversions!` },
    { id: 20, text: `        }` },
    { id: 21, text: `    }` },
    { id: 22, text: `    // copy remaining, write back` },
    { id: 23, text: `    return inv;` },
    { id: 24, text: `}` },
];

const PHASE_COLOR = {
    call: "#8b5cf6", base: "#10b981", split: "#f59e0b",
    merge: "#ec4899", count: "#ec4899", return: "#10b981", done: "#10b981",
};

const PHASE_LABEL = {
    call: "📞 CALL", base: "🟢 BASE", split: "✂ SPLIT",
    merge: "🔀 MERGE", count: "🔴 INV COUNT", return: "⬆ RETURN", done: "✅ DONE",
};

// ────────────────────────────────────────────────────────────────────
// Step + Tree Generator
// ────────────────────────────────────────────────────────────────────
function generateAll(inputArr) {
    const n = inputArr.length;
    const steps = [];
    const invPairs = [];
    let nodeCounter = 0;
    const treeNodes = [];
    const treeEdges = [];
    const nodeMap = {};
    const posMap = {};
    let leafX = 0;
    const doneSnap = {};

    function buildTree(l, r, depth, parentId) {
        const key = `${l},${r}`;
        const id = `N${nodeCounter++}`;
        nodeMap[key] = id;
        const sub = inputArr.slice(l, r + 1);
        treeNodes.push({ id, label: `[${sub.join(",")}]`, sub: `${l},${r}`, l, r });
        if (parentId !== null) treeEdges.push([parentId, id]);
        if (l >= r) {
            posMap[id] = { leafX: leafX++, depth };
            return;
        }
        const mid = Math.floor((l + r) / 2);
        buildTree(l, mid, depth + 1, id);
        buildTree(mid + 1, r, depth + 1, id);
    }
    buildTree(0, n - 1, 0, null);

    const totalLeaves = leafX;
    const maxDepth = Math.max(...treeNodes.map(nd => posMap[nd.id]?.depth ?? 0));

    function getLeafCentroid(l, r) {
        if (l >= r) return posMap[nodeMap[`${l},${r}`]].leafX;
        const mid = Math.floor((l + r) / 2);
        return (getLeafCentroid(l, mid) + getLeafCentroid(mid + 1, r)) / 2;
    }
    treeNodes.forEach(nd => {
        const rawX = nd.l >= nd.r ? posMap[nd.id].leafX : getLeafCentroid(nd.l, nd.r);
        let depth = 0, walk = nd.id;
        while (true) {
            const edge = treeEdges.find(e => e[1] === walk);
            if (!edge) break;
            walk = edge[0]; depth++;
        }
        nd.x = totalLeaves <= 1 ? 50 : 4 + (rawX / (totalLeaves - 1)) * 92;
        nd.y = maxDepth === 0 ? 50 : 6 + (depth / maxDepth) * 76;
    });

    const nid = (l, r) => nodeMap[`${l},${r}`];
    const range = (l, r) => Array.from({ length: r - l + 1 }, (_, i) => i + l);

    function pushStep(s) {
        steps.push({ ...s, doneNodes: { ...doneSnap }, invPairs: [...invPairs] });
    }

    function countInv(wa, l, r, stack, runInv) {
        const id = nid(l, r);
        const hl = range(l, r);
        const cs = [...stack, { label: `countInv(${l},${r})` }];

        pushStep({
            cl: 0, arr: [...wa], l, r, mid: null, phase: "call", hl, inv: runInv,
            activeNode: id, callStack: cs, merge: null,
            vars: { l, r, call: `countInv(${l},${r})` },
            msg: `countInv(arr,${l},${r}) — checking [${wa.slice(l, r + 1).join(",")}]`
        });

        if (l >= r) {
            doneSnap[id] = 0;
            pushStep({
                cl: 1, arr: [...wa], l, r, mid: null, phase: "base", hl: [l], inv: runInv,
                activeNode: id, callStack: cs, merge: null,
                vars: { l, r, "l>=r": "true → BASE CASE", return: 0 },
                msg: `countInv(${l},${r}): [${wa[l]}] single element → BASE CASE, 0 inversions`
            });
            return 0;
        }

        const mid = Math.floor((l + r) / 2);
        pushStep({
            cl: 3, arr: [...wa], l, r, mid, phase: "split", hl, inv: runInv,
            activeNode: id, callStack: cs, merge: null,
            vars: { l, r, mid, left: `[${wa.slice(l, mid + 1).join(",")}]`, right: `[${wa.slice(mid + 1, r + 1).join(",")}]` },
            msg: `mid=${mid}. Split → left=[${wa.slice(l, mid + 1).join(",")}]  right=[${wa.slice(mid + 1, r + 1).join(",")}]`
        });

        pushStep({
            cl: 4, arr: [...wa], l, r: mid, mid: null, phase: "call", hl: range(l, mid), inv: runInv,
            activeNode: nid(l, mid), callStack: [...cs, { label: `countInv(${l},${mid})` }], merge: null,
            vars: { "recurse left": `countInv(${l},${mid})` },
            msg: `Recurse LEFT → countInv(arr,${l},${mid})`
        });
        const li = countInv(wa, l, mid, cs, runInv);
        runInv += li;

        pushStep({
            cl: 5, arr: [...wa], l: mid + 1, r, mid: null, phase: "call", hl: range(mid + 1, r), inv: runInv,
            activeNode: nid(mid + 1, r), callStack: [...cs, { label: `countInv(${mid + 1},${r})` }], merge: null,
            vars: { "recurse right": `countInv(${mid + 1},${r})` },
            msg: `Recurse RIGHT → countInv(arr,${mid + 1},${r})`
        });
        const ri = countInv(wa, mid + 1, r, cs, runInv);
        runInv += ri;

        pushStep({
            cl: 6, arr: [...wa], l, r, mid, phase: "merge", hl, inv: runInv,
            activeNode: id, callStack: cs,
            merge: { left: range(l, mid), right: range(mid + 1, r), comparing: [], picked: null, isInv: false },
            vars: { l, mid, r, merge: `[${wa.slice(l, mid + 1).join(",")}] vs [${wa.slice(mid + 1, r + 1).join(",")}]` },
            msg: `mergeCount(${l},${mid},${r}): merging & counting split inversions`
        });

        const si = mergeCount(wa, l, mid, r, cs, id, runInv);
        runInv += si;

        doneSnap[id] = li + ri + si;
        pushStep({
            cl: 8, arr: [...wa], l, r, mid, phase: "return", hl, inv: runInv,
            activeNode: id, callStack: cs, merge: null,
            vars: {
                [`left=${li}`]: `right=${ri}`, [`split=${si}`]: `total=${li + ri + si}`,
                return: String(li + ri + si), sorted: `[${wa.slice(l, r + 1).join(",")}]`
            },
            msg: `countInv(${l},${r}) = ${li}+${ri}+${si} = ${li + ri + si}  →  sorted to [${wa.slice(l, r + 1).join(",")}]`
        });

        return li + ri + si;
    }

    function mergeCount(wa, l, mid, r, cs, id, runInv) {
        const left = wa.slice(l, mid + 1);
        const right = wa.slice(mid + 1, r + 1);
        const leftIdx = range(l, mid);
        const rightIdx = range(mid + 1, r);
        let i = 0, j = 0, k = l, split = 0;

        while (i < left.length && j < right.length) {
            const isInv = left[i] > right[j];
            pushStep({
                cl: 15, arr: [...wa], l, r, mid, phase: "count", hl: range(l, r), inv: runInv + split,
                activeNode: id, callStack: cs,
                merge: {
                    left: leftIdx.slice(i), right: rightIdx.slice(j),
                    comparing: [l + i, mid + 1 + j], picked: null, isInv
                },
                vars: {
                    [`arr[i]=${left[i]}`]: isInv ? `> arr[j]=${right[j]} → INVERSION!` : `≤ arr[j]=${right[j]} → no inv`,
                    i: l + i, j: mid + 1 + j
                },
                msg: isInv
                    ? `${left[i]} > ${right[j]} → take ${right[j]} from RIGHT! +${left.length - i} inversions`
                    : `${left[i]} ≤ ${right[j]} → take ${left[i]} from LEFT. No inversion.`
            });

            if (!isInv) {
                wa[k++] = left[i++];
            } else {
                const cnt = left.length - i;
                for (let x = i; x < left.length; x++) invPairs.push({ a: left[x], b: right[j] });
                split += cnt;
                wa[k++] = right[j++];
                pushStep({
                    cl: 19, arr: [...wa], l, r, mid, phase: "count", hl: range(l, r), inv: runInv + split,
                    activeNode: id, callStack: cs,
                    merge: { left: leftIdx.slice(i), right: rightIdx.slice(j), comparing: [], picked: null, isInv: false },
                    vars: {
                        [`inv +=`]: `${cnt} (${cnt} left element${cnt > 1 ? "s" : ""} > right[j])`,
                        "split so far": split, "running": runInv + split
                    },
                    msg: `+${cnt} inversion${cnt > 1 ? "s" : ""}! Running total = ${runInv + split}`
                });
            }
        }
        while (i < left.length) wa[k++] = left[i++];
        while (j < right.length) wa[k++] = right[j++];
        return split;
    }

    const wa = [...inputArr];
    const total = countInv(wa, 0, n - 1, [], 0);

    pushStep({
        cl: -1, arr: [...wa], l: 0, r: n - 1, mid: null, phase: "done",
        hl: range(0, n - 1), inv: total, activeNode: null, callStack: [], merge: null,
        vars: {
            "TOTAL INVERSIONS": total, original: `[${inputArr.join(",")}]`,
            sorted: `[${wa.join(",")}]`, "pairs found": invPairs.length
        },
        msg: `✅ Done! ${total} inversion${total !== 1 ? "s" : ""} in [${inputArr.join(",")}] → sorted [${wa.join(",")}]`
    });

    return { steps, treeNodes, treeEdges, invPairs, total };
}

// ── Recursion Tree SVG ───────────────────────────────────────────────
function RecursionTree({ treeNodes, treeEdges, activeNode, doneNodes }) {
    const { theme, isDark } = useTheme();
    const nodeStyle = (id) => {
        if (id === activeNode) return { fill: "#3730a3", stroke: "#818cf8", text: "#c7d2fe" };
        if (doneNodes[id] !== undefined) return doneNodes[id] > 0
            ? { fill: "#7c1d4a", stroke: "#ec4899", text: "#fbcfe8" }
            : { fill: isDark ? "#065f46" : "#dcfce7", stroke: "#10b981", text: isDark ? "#a7f3d0" : "#065f46" };
        return { fill: isDark ? "#0d1117" : "#f1f5f9", stroke: isDark ? "#1e293b" : "#cbd5e1", text: isDark ? "#374151" : "#94a3b8" };
    };
    const clip = (s) => s.length > 13 ? s.slice(0, 11) + "…]" : s;

    return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
            {treeEdges.map(([a, b]) => {
                const na = treeNodes.find(n => n.id === a);
                const nb = treeNodes.find(n => n.id === b);
                if (!na || !nb) return null;
                const hot = activeNode === a || activeNode === b;
                return <line key={a + b} x1={na.x} y1={na.y + 3.5} x2={nb.x} y2={nb.y - 3.5}
                    stroke={hot ? "#4f46e5" : doneNodes[a] !== undefined && doneNodes[b] !== undefined ? (isDark ? "#1e3a2e" : "#86efac") : (isDark ? "#1e293b" : "#cbd5e1")}
                    strokeWidth={hot ? "0.8" : "0.5"} />;
            })}
            {treeNodes.map(nd => {
                const s = nodeStyle(nd.id);
                const active = nd.id === activeNode;
                const done = doneNodes[nd.id] !== undefined;
                return (
                    <g key={nd.id}>
                        {active && <circle cx={nd.x} cy={nd.y} r={6} fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.7" />}
                        <circle cx={nd.x} cy={nd.y} r={3.5 + (active ? 0.8 : 0)} fill={s.fill} stroke={s.stroke} strokeWidth={active ? "1.2" : "0.7"} />
                        <text x={nd.x} y={nd.y - 5} textAnchor="middle" fontSize="2.5" fontFamily="'Fira Code',monospace" fill={s.text} fontWeight={active ? "700" : "400"}>
                            {clip(nd.label)}
                        </text>
                        <text x={nd.x} y={nd.y + 7} textAnchor="middle" fontSize="2.1" fontFamily="'Fira Code',monospace"
                            fill={done ? (doneNodes[nd.id] > 0 ? "#f9a8d4" : "#6ee7b7") : (isDark ? "#374151" : "#94a3b8")}>
                            {done ? `inv=${doneNodes[nd.id]}` : nd.sub}
                        </text>
                    </g>
                );
            })}
            {[{ x: 1, f: "#3730a3", s: "#818cf8", l: "active" }, { x: 21, f: "#7c1d4a", s: "#ec4899", l: "inv>0" },
            { x: 40, f: isDark ? "#065f46" : "#dcfce7", s: "#10b981", l: "inv=0" }, { x: 58, f: isDark ? "#0d1117" : "#f1f5f9", s: isDark ? "#1e293b" : "#cbd5e1", l: "pending" }
            ].map(d => (
                <g key={d.l}>
                    <circle cx={d.x + 2} cy={96.5} r={1.5} fill={d.f} stroke={d.s} strokeWidth="0.5" />
                    <text x={d.x + 4.5} y={97.3} fontSize="2.2" fontFamily="'Fira Code',monospace" fill={isDark ? "#475569" : "#64748b"}>{d.l}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Array Bars ───────────────────────────────────────────────────────
function ArrayBars({ step, inputArr, maxV }) {
    const { theme, isDark } = useTheme();
    return (
        <VizCard title="📊 Array State — pink=inversion, indigo=active range, green=sorted ✓">
            <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", marginBottom: "6px" }}>
                {step.arr.map((val, i) => {
                    const inR = step.hl.includes(i);
                    const done = step.phase === "done";
                    const isML = step.merge?.left?.includes(i);
                    const isMR = step.merge?.right?.includes(i);
                    const isCmp = step.merge?.comparing?.includes(i);
                    const isInv = step.merge?.isInv && isCmp;
                    const barH = Math.max(18, Math.round((val / maxV) * 65));

                    let bg, border, shadow = "none";
                    if (done) { bg = isDark ? "#065f46" : "#dcfce7"; border = "#10b981"; }
                    else if (isInv) { bg = "#7c1d4a"; border = "#ec4899"; shadow = "0 0 10px #ec498966"; }
                    else if (isCmp) { bg = isDark ? "#2d1a00" : "#fef3c7"; border = "#f59e0b"; shadow = "0 0 8px #f59e0b44"; }
                    else if (isML) { bg = isDark ? "#0c1a3a" : "#dbeafe"; border = "#1d4ed8"; }
                    else if (isMR) { bg = isDark ? "#1a0d2e" : "#ede9fe"; border = "#7c3aed"; }
                    else if (inR) { bg = isDark ? "#1e1b4b" : "#e0e7ff"; border = "#4f46e5"; }
                    else { bg = isDark ? "#111827" : "#f1f5f9"; border = isDark ? "#1f2937" : "#e2e8f0"; }

                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", flex: 1 }}>
                            <div style={{ height: "13px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                {isInv && <span style={{ fontSize: "7px", color: "#ec4899", fontWeight: "700" }}>INV!</span>}
                                {isCmp && !isInv && <span style={{ fontSize: "7px", color: "#fbbf24", fontWeight: "700" }}>CMP</span>}
                            </div>
                            <div style={{
                                width: "100%", height: `${barH}px`, background: bg, border: `2px solid ${border}`,
                                borderRadius: "4px 4px 0 0", display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.3s", boxShadow: shadow
                            }}>
                                <span style={{
                                    fontSize: "10px", fontWeight: "800",
                                    color: done ? "#34d399" : isInv ? "#f9a8d4" : isCmp ? "#fbbf24" : theme.text
                                }}>{val}</span>
                            </div>
                            <span style={{ fontSize: "8px", color: theme.textMuted }}>[{i}]</span>
                            <div style={{ height: "11px", display: "flex", gap: "2px", alignItems: "center" }}>
                                {isML && <span style={{ fontSize: "6px", color: "#3b82f6", fontWeight: "700" }}>L</span>}
                                {isMR && <span style={{ fontSize: "6px", color: "#8b5cf6", fontWeight: "700" }}>R</span>}
                                {i === step.l && inR && !step.merge && <span style={{ fontSize: "6px", color: "#60a5fa", fontWeight: "700" }}>l</span>}
                                {i === step.r && inR && !step.merge && <span style={{ fontSize: "6px", color: "#f472b6", fontWeight: "700" }}>r</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[{ c: "#4f46e5", l: "active range" }, { c: "#1d4ed8", l: "left (L)" }, { c: "#7c3aed", l: "right (R)" },
                { c: "#f59e0b", l: "comparing" }, { c: "#ec4899", l: "inversion!" }, { c: "#10b981", l: "sorted ✓" }
                ].map(x => (
                    <span key={x.l} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.6rem", color: theme.textMuted }}>
                        <span style={{ width: "8px", height: "8px", background: x.c, borderRadius: "2px", display: "inline-block" }} />
                        {x.l}
                    </span>
                ))}
            </div>
        </VizCard>
    );
}

// ── Inversion Tracker ────────────────────────────────────────────────
function InversionTracker({ step, pc }) {
    const { theme, isDark } = useTheme();
    return (
        <VizCard title="🔴 Inversion Tracker — (a,b) is inversion if a > b but a comes before b">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{
                    padding: "8px 14px", background: isDark ? "#0f172a" : "#f8fafc",
                    border: `2px solid ${step.inv > 0 ? "#ec4899" : theme.cardBorder}`,
                    borderRadius: "10px", textAlign: "center", flexShrink: 0, transition: "border 0.3s"
                }}>
                    <div style={{ fontSize: "0.56rem", color: theme.textMuted, marginBottom: "2px" }}>TOTAL INV</div>
                    <div style={{
                        fontSize: "2rem", fontWeight: "900",
                        color: step.phase === "done" ? "#10b981" : step.inv > 0 ? "#ec4899" : theme.textDim,
                        textShadow: step.inv > 0 ? "0 0 20px #ec498966" : "none", transition: "all 0.3s"
                    }}>
                        {step.inv}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.6rem", color: theme.textMuted, marginBottom: "4px" }}>Discovered pairs:</div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", maxHeight: "44px", overflowY: "auto" }}>
                        {step.invPairs.length === 0 && <span style={{ fontSize: "0.6rem", color: theme.textDim }}>none yet…</span>}
                        {step.invPairs.map((p, pi) => (
                            <div key={pi} style={{
                                padding: "3px 7px", borderRadius: "5px",
                                background: "#7c1d4a", border: "1px solid #ec4899",
                                fontSize: "0.65rem", fontWeight: "700", color: "#fbcfe8",
                                boxShadow: "0 0 6px #ec498833", whiteSpace: "nowrap"
                            }}>
                                ({p.a},{p.b})
                            </div>
                        ))}
                        {step.phase === "done" && (
                            <div style={{
                                padding: "3px 7px", borderRadius: "5px",
                                background: isDark ? "#065f46" : "#dcfce7", border: "1px solid #10b981",
                                fontSize: "0.65rem", fontWeight: "700", color: "#34d399"
                            }}>✅ Complete!</div>
                        )}
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "0.56rem", color: theme.textDim }}>
                        When right[j] &lt; left[i]: all remaining left elements form inversions with right[j] → +(mid−i+1)
                    </div>
                </div>
            </div>
        </VizCard>
    );
}

// ── App ──────────────────────────────────────────────────────────────
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Given an array, count the number of **inversions** — pairs (i, j) where i < j but arr[i] > arr[j].

## Key Insight
A brute-force O(n²) check compares every pair. But during **merge sort**, whenever a right-half element is smaller than a left-half element, ALL remaining left elements form inversions with it.

## Mental Model
1. **Divide** the array in half recursively
2. **Count** inversions within each half (recursive calls)
3. **Count split inversions** during the merge step
4. When right[j] < left[i]: inv += (mid − i + 1) — all remaining left elements are greater

## Why Merge Sort?
Merge sort naturally compares elements from sorted halves. The "split inversions" are exactly the cross-half pairs that are out of order. This gives us O(n log n) instead of O(n²).`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. **Recursively split** the array until base cases (single elements)
2. **Merge pairs** back up, counting inversions during each merge
3. When merging [1,4] with [2,3]: 4 > 2 → +1 inv, 4 > 3 → +1 inv

## During Merge
| Comparison | Result | Inversions Added |
|---|---|---|
| left[i] ≤ right[j] | Take left, no inversion | 0 |
| left[i] > right[j] | Take right, all remaining left elements are inversions | mid - i + 1 |

## Key Observation
The total inversions = left inversions + right inversions + split inversions (counted during merge).`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
countInv(arr, l, r):
  if l >= r: return 0
  mid = (l+r)/2
  left  = countInv(arr, l, mid)
  right = countInv(arr, mid+1, r)
  split = mergeCount(arr, l, mid, r)
  return left + right + split
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(n log n)** — merge sort |
| Space | **O(n)** — temp array for merging |

## Key Detail
The merge step is standard merge sort, but we add \`inv += (mid - i + 1)\` every time right[j] < left[i]. This counts ALL remaining left elements as inversions with right[j].`
    }
];

const DEFAULT = [2, 4, 1, 3, 5];

export default function CountInversions() {
    const { theme, isDark } = useTheme();
    const [inputArr, setInputArr] = useState(DEFAULT);
    const [inputText, setInputText] = useState(DEFAULT.join(","));
    const [data, setData] = useState(null);
    const { idx, setIdx, playing, setPlaying } = usePlayer(data?.steps?.length || 1, 1300);

    useEffect(() => {
        try {
            const result = generateAll(inputArr);
            setData(result);
            setIdx(0);
            setPlaying(false);
        } catch (e) { console.error(e); }
    }, [inputArr]);

    function handleRun() {
        const nums = inputText.split(/[\s,]+/).map(s => parseInt(s, 10)).filter(n => !isNaN(n));
        if (nums.length < 2 || nums.length > 8) return;
        setInputArr(nums);
        setInputText(nums.join(","));
    }
    function handleReset() {
        setInputText(DEFAULT.join(","));
        setInputArr(DEFAULT);
    }

    if (!data) return (
        <div style={{
            background: theme.bg, height: "100vh", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#818cf8", fontFamily: "'Fira Code',monospace"
        }}>
            Computing…
        </div>
    );

    const { steps, treeNodes, treeEdges } = data;
    const step = steps[Math.min(idx, steps.length - 1)];
    const total = steps.length;
    const pc = PHASE_COLOR[step.phase] || "#6366f1";
    const maxV = Math.max(...inputArr);

    return (
        <VizLayout title="Count Inversions" subtitle="Merge Sort · O(n log n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset}
                placeholder="e.g. 5,3,1,4,2" label="Array:" />

            {/* Main grid */}
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Code Panel */}
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="count_inversions.cpp" />

                {/* Right side */}
                <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrayBars step={step} inputArr={inputArr} maxV={maxV} />

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "2 1 200px" }}>
                            <InversionTracker step={step} pc={pc} />
                        </div>
                        <div style={{ flex: "1 1 150px" }}>
                            <VariablesPanel vars={step.vars} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "0 0 175px" }}>
                            <CallStackPanel
                                frames={step.callStack || []}
                                renderFrame={f => f.label}
                                emptyText={step.phase === "done" ? "✅ returned" : "—"}
                            />
                        </div>
                        <VizCard title="🌳 Live Recursion Tree">
                            <div style={{ minHeight: "120px" }}>
                                <RecursionTree treeNodes={treeNodes} treeEdges={treeEdges}
                                    activeNode={step.activeNode} doneNodes={step.doneNodes} />
                            </div>
                        </VizCard>
                    </div>
                </div>
            </div>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABEL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={total} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={total}>
                {step.inv > 0 && <span style={{ color: "#ec4899", fontWeight: 700 }}>🔴 inv={step.inv}</span>}
            </StepInfo>
        </VizLayout>
    );
}
