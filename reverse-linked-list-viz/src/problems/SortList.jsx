import { useState, useEffect } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel, MessageBar,
    ControlBar, VizLayout, usePlayer, VizCard, StepInfo
} from "../shared/Components";

// ─── Constants ───────────────────────────────────────────────────────────────
const DEFAULT_LIST = [4, 2, 1, 3];

const CODE = [
    { id: 0, text: `ListNode* sortList(ListNode* head) {` },
    { id: 1, text: `    if (!head || !head->next) return head;` },
    { id: 2, text: `` },
    { id: 3, text: `    // Step 1: find middle (slow/fast pointers)` },
    { id: 4, text: `    ListNode* slow = head, *fast = head->next;` },
    { id: 5, text: `    while (fast && fast->next) {` },
    { id: 6, text: `        slow = slow->next;` },
    { id: 7, text: `        fast = fast->next->next;` },
    { id: 8, text: `    }` },
    { id: 9, text: `    ListNode* mid = slow->next;` },
    { id: 10, text: `    slow->next = nullptr;  // split!` },
    { id: 11, text: `` },
    { id: 12, text: `    // Step 2: recurse both halves` },
    { id: 13, text: `    ListNode* left  = sortList(head);` },
    { id: 14, text: `    ListNode* right = sortList(mid);` },
    { id: 15, text: `` },
    { id: 16, text: `    // Step 3: merge sorted halves` },
    { id: 17, text: `    return merge(left, right);` },
    { id: 18, text: `}` },
    { id: 19, text: `` },
    { id: 20, text: `ListNode* merge(ListNode* l1, ListNode* l2) {` },
    { id: 21, text: `    ListNode dummy; auto cur = &dummy;` },
    { id: 22, text: `    while (l1 && l2) {` },
    { id: 23, text: `        if (l1->val <= l2->val) {` },
    { id: 24, text: `            cur->next = l1; l1 = l1->next;` },
    { id: 25, text: `        } else {` },
    { id: 26, text: `            cur->next = l2; l2 = l2->next;` },
    { id: 27, text: `        }` },
    { id: 28, text: `        cur = cur->next;` },
    { id: 29, text: `    }` },
    { id: 30, text: `    cur->next = l1 ? l1 : l2;` },
    { id: 31, text: `    return dummy.next;` },
    { id: 32, text: `}` },
];

const PHASE_COLOR = {
    init: "#6366f1", slow: "#8b5cf6", split: "#f59e0b",
    recurse: "#3b82f6", compare: "#06b6d4", pick: "#ec4899",
    merge: "#a855f7", done: "#10b981",
};
const PHASE_LABEL = {
    init: "🚀 INIT", slow: "🐢 SLOW/FAST", split: "✂️ SPLIT",
    recurse: "↩ RECURSE", compare: "🔍 COMPARE", pick: "👆 PICK NODE",
    merge: "🔀 MERGING", done: "✅ SORTED",
};

// ─── Step Generator ──────────────────────────────────────────────────────────
function generateSteps(initVals) {
    const steps = [];
    const callStack = [];
    let nodeIdCounter = 0;

    function makeList(vals) {
        return vals.map(v => ({ val: v, nid: nodeIdCounter++ }));
    }

    function push(cl, phase, lists, msg, vars, extra = {}) {
        steps.push({
            cl, phase,
            lists: lists.map(l => ({ ...l, nodes: l.nodes.map(n => ({ ...n })) })),
            pointers: extra.pointers || {},
            mergedSoFar: extra.mergedSoFar ? [...extra.mergedSoFar] : [],
            callStack: callStack.map(c => c.label),
            msg, vars,
        });
    }

    function sortList(nodes, depth) {
        const label = `sortList([${nodes.map(n => n.val).join("→")}])`;
        callStack.push({ label });

        if (nodes.length <= 1) {
            push(1, "init", [{ id: `base-${depth}`, nodes, label: "base case", color: PHASE_COLOR.done, role: "single" }],
                `Base case: single node [${nodes.map(n => n.val).join()}] — already sorted`,
                { len: nodes.length });
            callStack.pop();
            return nodes;
        }

        push(0, "init",
            [{ id: `sort-${depth}`, nodes, label, color: PHASE_COLOR.init, role: "active" }],
            `sortList([${nodes.map(n => n.val).join("→")}]) called`,
            { len: nodes.length, depth });

        push(4, "slow",
            [{ id: `sort-${depth}`, nodes, label, color: PHASE_COLOR.slow, role: "active" }],
            `Initialize slow=head, fast=head.next to find midpoint`,
            { slow: nodes[0].val, fast: nodes[1]?.val ?? "null" },
            { pointers: { slow: nodes[0].nid, fast: nodes[1]?.nid ?? null } });

        let si = 0, fi = 1;
        while (fi < nodes.length - 1 && fi + 1 < nodes.length) {
            push(5, "slow",
                [{ id: `sort-${depth}`, nodes, label, color: PHASE_COLOR.slow, role: "active" }],
                `Advance: slow→${nodes[si + 1]?.val}, fast→${nodes[fi + 2]?.val ?? "null"}`,
                { slow: nodes[si].val, fast: nodes[fi].val },
                { pointers: { slow: nodes[si].nid, fast: nodes[fi].nid } });
            si++;
            fi += 2;
        }

        const midIdx = si + 1;
        const leftNodes = nodes.slice(0, midIdx);
        const rightNodes = nodes.slice(midIdx);

        push(10, "split",
            [
                { id: `left-${depth}`, nodes: leftNodes, label: "left half", color: PHASE_COLOR.split, role: "left" },
                { id: `right-${depth}`, nodes: rightNodes, label: "right half", color: "#3b82f6", role: "right" },
            ],
            `Split at mid: [${leftNodes.map(n => n.val).join("→")}] | [${rightNodes.map(n => n.val).join("→")}]`,
            { mid: rightNodes[0].val, leftLen: leftNodes.length, rightLen: rightNodes.length });

        push(13, "recurse",
            [
                { id: `left-${depth}`, nodes: leftNodes, label: "→ sort left", color: PHASE_COLOR.recurse, role: "left" },
                { id: `right-${depth}`, nodes: rightNodes, label: "waiting…", color: "current_theme_border", role: "right" },
            ],
            `Recurse: sortList([${leftNodes.map(n => n.val).join("→")}])`,
            { half: "left" });

        const sortedLeft = sortList(leftNodes, depth + "-L");

        push(14, "recurse",
            [
                { id: `left-${depth}`, nodes: sortedLeft, label: "✓ sorted", color: PHASE_COLOR.done, role: "left" },
                { id: `right-${depth}`, nodes: rightNodes, label: "→ sort right", color: PHASE_COLOR.recurse, role: "right" },
            ],
            `Recurse: sortList([${rightNodes.map(n => n.val).join("→")}])`,
            { half: "right" });

        const sortedRight = sortList(rightNodes, depth + "-R");

        push(17, "merge",
            [
                { id: `left-${depth}`, nodes: sortedLeft, label: "sorted left", color: PHASE_COLOR.done, role: "left" },
                { id: `right-${depth}`, nodes: sortedRight, label: "sorted right", color: "#3b82f6", role: "right" },
            ],
            `merge([${sortedLeft.map(n => n.val).join("→")}], [${sortedRight.map(n => n.val).join("→")}])`,
            { l: sortedLeft.map(n => n.val).join("→"), r: sortedRight.map(n => n.val).join("→") });

        const merged = [];
        let li = 0, ri = 0;
        const sl = [...sortedLeft], sr = [...sortedRight];

        while (li < sl.length && ri < sr.length) {
            const lNode = sl[li], rNode = sr[ri];
            push(23, "compare",
                [
                    { id: `left-${depth}`, nodes: sl.slice(li), label: "L pointer", color: PHASE_COLOR.done, role: "left" },
                    { id: `right-${depth}`, nodes: sr.slice(ri), label: "R pointer", color: "#3b82f6", role: "right" },
                    { id: `merged-${depth}`, nodes: [...merged], label: "merged so far", color: PHASE_COLOR.done, role: "merged" },
                ],
                `Compare L[${lNode.val}] vs R[${rNode.val}]`,
                { "L->val": lNode.val, "R->val": rNode.val, pick: lNode.val <= rNode.val ? `L(${lNode.val})` : `R(${rNode.val})` },
                { pointers: { l1: lNode.nid, l2: rNode.nid }, mergedSoFar: merged.map(n => n.nid) });

            if (lNode.val <= rNode.val) {
                push(24, "pick",
                    [
                        { id: `left-${depth}`, nodes: sl.slice(li), label: "L pointer", color: PHASE_COLOR.done, role: "left" },
                        { id: `right-${depth}`, nodes: sr.slice(ri), label: "R pointer", color: "#3b82f6", role: "right" },
                        { id: `merged-${depth}`, nodes: [...merged, lNode], label: "merged so far", color: PHASE_COLOR.done, role: "merged" },
                    ],
                    `Pick L[${lNode.val}] → append to result`,
                    { picked: lNode.val, from: "left" },
                    { pointers: { l1: lNode.nid, l2: rNode.nid }, mergedSoFar: [...merged, lNode].map(n => n.nid) });
                merged.push(lNode); li++;
            } else {
                push(26, "pick",
                    [
                        { id: `left-${depth}`, nodes: sl.slice(li), label: "L pointer", color: PHASE_COLOR.done, role: "left" },
                        { id: `right-${depth}`, nodes: sr.slice(ri), label: "R pointer", color: "#3b82f6", role: "right" },
                        { id: `merged-${depth}`, nodes: [...merged, rNode], label: "merged so far", color: PHASE_COLOR.done, role: "merged" },
                    ],
                    `Pick R[${rNode.val}] → append to result`,
                    { picked: rNode.val, from: "right" },
                    { pointers: { l1: lNode.nid, l2: rNode.nid }, mergedSoFar: [...merged, rNode].map(n => n.nid) });
                merged.push(rNode); ri++;
            }
        }

        const remainder = li < sl.length ? sl.slice(li) : sr.slice(ri);
        if (remainder.length > 0) {
            push(30, "merge",
                [{ id: `merged-${depth}`, nodes: [...merged, ...remainder], label: "final merged", color: PHASE_COLOR.done, role: "merged" }],
                `Append remaining: [${remainder.map(n => n.val).join("→")}]`,
                { remaining: remainder.map(n => n.val).join("→") },
                { mergedSoFar: [...merged, ...remainder].map(n => n.nid) });
        }
        const result = [...merged, ...remainder];

        push(31, "done",
            [{ id: `done-${depth}`, nodes: result, label: `✓ merged [${result.map(n => n.val).join("→")}]`, color: PHASE_COLOR.done, role: "merged" }],
            `✓ Merged result: [${result.map(n => n.val).join("→")}]`,
            { result: result.map(n => n.val).join("→") });

        callStack.pop();
        return result;
    }

    const rootNodes = makeList(initVals);

    push(0, "init",
        [{ id: "root", nodes: rootNodes, label: `Input: [${initVals.join("→")}]`, color: PHASE_COLOR.init, role: "active" }],
        `sortList called on [${initVals.join("→")}] — merge sort on linked list`,
        { n: initVals.length });

    const sorted = sortList(rootNodes, "0");

    steps.push({
        cl: 17, phase: "done",
        lists: [{ id: "final", nodes: sorted, label: `✅ Sorted: [${sorted.map(n => n.val).join("→")}]`, color: PHASE_COLOR.done, role: "merged" }],
        pointers: {}, mergedSoFar: sorted.map(n => n.nid),
        callStack: [],
        msg: `🏁 Fully sorted: [${sorted.map(n => n.val).join("→")}]`,
        vars: { result: sorted.map(n => n.val).join("→") },
    });

    return steps;
}

// ─── Linked List Node Renderer (problem-specific) ────────────────────────────
const NODE_W = 36, NODE_H = 28, NODE_GAP = 14;

function LinkedListViz({ lists, pointers, phase }) {
    const { theme } = useTheme();
    const pc = PHASE_COLOR[phase] || PHASE_COLOR.init;

    return (
        <VizCard title="🔗 Linked List State">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {lists.map((list) => {
                    if (!list.nodes || list.nodes.length === 0) return null;
                    const listColor = list.color === "current_theme_border" ? theme.cardBorder : (list.color || pc);
                    const totalW = list.nodes.length * (NODE_W + NODE_GAP) - NODE_GAP + 20;

                    return (
                        <div key={list.id}>
                            <div style={{ fontSize: 10, color: listColor, marginBottom: 5, fontFamily: "monospace", fontWeight: 600 }}>
                                {list.label}
                            </div>
                            <svg width={Math.max(totalW, 40)} height={NODE_H + 14} style={{ overflow: "visible" }}>
                                {list.nodes.map((node, i) => {
                                    const x = i * (NODE_W + NODE_GAP);
                                    const isSlow = pointers.slow === node.nid;
                                    const isFast = pointers.fast === node.nid;
                                    const isL1 = pointers.l1 === node.nid;
                                    const isL2 = pointers.l2 === node.nid;
                                    const isHighlighted = isSlow || isFast || isL1 || isL2;

                                    const nodeFill = isHighlighted
                                        ? (isSlow || isL1 ? `${PHASE_COLOR.slow}33` : `${PHASE_COLOR.compare}33`)
                                        : list.role === "merged" ? "#022c22"
                                            : theme.cardHeaderBg;
                                    const nodeBorder = isHighlighted
                                        ? (isSlow || isL1 ? PHASE_COLOR.slow : PHASE_COLOR.compare)
                                        : list.role === "merged" ? PHASE_COLOR.done
                                            : listColor;

                                    return (
                                        <g key={node.nid}>
                                            <rect x={x} y={2} width={NODE_W} height={NODE_H} rx={5}
                                                fill={nodeFill} stroke={nodeBorder}
                                                strokeWidth={isHighlighted ? 2 : 1.2} />
                                            <text x={x + NODE_W / 2} y={2 + NODE_H / 2 + 4}
                                                textAnchor="middle" fontSize={12}
                                                fontWeight={isHighlighted ? 800 : 600}
                                                fill={isHighlighted
                                                    ? (isSlow || isL1 ? PHASE_COLOR.slow : PHASE_COLOR.compare)
                                                    : list.role === "merged" ? "#34d399" : theme.text}
                                                fontFamily="'JetBrains Mono','Fira Code',monospace">
                                                {node.val}
                                            </text>
                                            {i < list.nodes.length - 1 && (
                                                <g>
                                                    <line x1={x + NODE_W} y1={2 + NODE_H / 2}
                                                        x2={x + NODE_W + NODE_GAP - 4} y2={2 + NODE_H / 2}
                                                        stroke={listColor} strokeWidth={1.2} opacity={0.6} />
                                                    <polygon
                                                        points={`${x + NODE_W + NODE_GAP - 4},${2 + NODE_H / 2 - 3} ${x + NODE_W + NODE_GAP - 4},${2 + NODE_H / 2 + 3} ${x + NODE_W + NODE_GAP + 1},${2 + NODE_H / 2}`}
                                                        fill={listColor} opacity={0.6} />
                                                </g>
                                            )}
                                            {i === list.nodes.length - 1 && (
                                                <text x={x + NODE_W + 4} y={2 + NODE_H / 2 + 4} fontSize={8} fill={theme.textDim} fontFamily="monospace">→∅</text>
                                            )}
                                            {(isSlow || isFast || isL1 || isL2) && (
                                                <text x={x + NODE_W / 2} y={NODE_H + 12}
                                                    textAnchor="middle" fontSize={8} fontWeight={700}
                                                    fill={isSlow || isL1 ? PHASE_COLOR.slow : PHASE_COLOR.compare}
                                                    fontFamily="monospace">
                                                    {isSlow ? "slow" : ""}{isL1 ? "L" : ""}{isFast ? "fast" : ""}{isL2 ? "R" : ""}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {[
                    ["#8b5cf6", "slow ptr"], ["#06b6d4", "L / R ptr"],
                    ["#10b981", "merged"], ["#f59e0b", "split point"],
                ].map(([c, l]) => (
                    <span key={l} style={{ fontSize: 9, color: theme.textDim }}><span style={{ color: c }}>■</span> {l}</span>
                ))}
            </div>
        </VizCard>
    );
}

// ─── Recursion Tree (problem-specific) ────────────────────────────────────────
function buildRecTree(vals) {
    const nodes = [];
    let id = 0;
    function build(arr, depth, xCenter, xSpan, parentId) {
        if (arr.length === 0) return null;
        const nid = id++;
        nodes.push({ id: nid, vals: [...arr], depth, x: xCenter - 60, y: depth * 52, parentId });
        if (arr.length <= 1) return nid;
        const mid = Math.floor(arr.length / 2);
        build(arr.slice(0, mid), depth + 1, xCenter - xSpan / 2, xSpan / 2, nid);
        build(arr.slice(mid), depth + 1, xCenter + xSpan / 2, xSpan / 2, nid);
        return nid;
    }
    const W = Math.max(700, vals.length * 130);
    build(vals, 0, W / 2, W / 2, null);
    const maxD = Math.max(...nodes.map(n => n.depth));
    return { nodes, width: W, height: maxD * 52 + 30 };
}

function treeNodeKey(vals) { return vals.join(","); }

function RecursionTreeViz({ treeLayout, activeVals, doneVals }) {
    const { theme } = useTheme();
    function byId(nid) { return treeLayout.nodes.find(n => n.id === nid); }

    const NW = 120, NH = 26, ROW = 72;
    const maxDepth = Math.max(...treeLayout.nodes.map(n => n.depth), 0);
    const svgW = treeLayout.width;
    const svgH = (maxDepth + 1) * ROW + 16;
    const yScale = ROW / 52;

    return (
        <VizCard title="🌳 Recursion Tree">
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block", overflow: "visible" }}>
                {treeLayout.nodes.map(n => {
                    if (n.parentId == null) return null;
                    const parent = byId(n.parentId);
                    if (!parent) return null;
                    const px = parent.x + NW / 2, py = parent.y * yScale + NH;
                    const cx = n.x + NW / 2, cy = n.y * yScale;
                    const isDoneEdge = doneVals.has(treeNodeKey(n.vals));
                    return (
                        <line key={`e-${n.id}`}
                            x1={px} y1={py} x2={cx} y2={cy}
                            stroke={isDoneEdge ? "#065f46" : theme.cardBorder}
                            strokeWidth={1.8} />
                    );
                })}
                {treeLayout.nodes.map(n => {
                    const key = treeNodeKey(n.vals);
                    const isActive = activeVals.has(key);
                    const isDone = doneVals.has(key);
                    const nx = n.x, ny = n.y * yScale;
                    const rectFill = isDone ? "#022c22" : isActive ? theme.stackActiveBg : theme.cardHeaderBg;
                    const rectStroke = isDone ? "#10b981" : isActive ? "#8b5cf6" : theme.cardBorder;
                    const textFill = isDone ? "#34d399" : isActive ? "#c4b5fd" : theme.textMuted;
                    return (
                        <g key={`n-${n.id}`}>
                            {isActive && (
                                <rect x={nx - 5} y={ny - 5} width={NW + 10} height={NH + 10} rx={10}
                                    fill="#8b5cf622" style={{ filter: "blur(7px)" }} />
                            )}
                            <rect x={nx} y={ny} width={NW} height={NH} rx={6}
                                fill={rectFill} stroke={rectStroke}
                                strokeWidth={isActive ? 2.5 : isDone ? 1.8 : 1} />
                            <text x={nx + NW / 2} y={ny + NH / 2 + 4}
                                textAnchor="middle" fontSize={9}
                                fontWeight={isActive ? 800 : isDone ? 700 : 500}
                                fill={textFill}
                                fontFamily="'JetBrains Mono','Fira Code',monospace">
                                {(isDone ? "✓ " : "") + n.vals.join("→")}
                            </text>
                            {isActive && (
                                <circle cx={nx + NW - 7} cy={ny + 7} r={5} fill="#8b5cf6" />
                            )}
                            {isDone && !isActive && (
                                <circle cx={nx + NW - 7} cy={ny + NH - 7} r={4} fill="#10b981" opacity={0.9} />
                            )}
                        </g>
                    );
                })}
            </svg>
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                {[["#8b5cf6", "● active call"], ["#10b981", "● sorted & returned"], [theme.cardBorder, "● pending"]].map(([c, l]) => (
                    <span key={l} style={{ fontSize: 9, color: theme.textDim }}><span style={{ color: c }}>■</span> {l}</span>
                ))}
            </div>
        </VizCard>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SortList() {
    const { theme } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_LIST.join(","));
    const [listVals, setListVals] = useState(DEFAULT_LIST);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_LIST));
    const [treeLayout, setTreeLayout] = useState(() => buildRecTree(DEFAULT_LIST));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1300);

    const step = steps[Math.min(idx, steps.length - 1)];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    // Compute which tree nodes are active/done from call stack
    const activeVals = new Set((step.callStack || []).map(label => {
        const m = (typeof label === "string" ? label : label?.label || "").match(/\[([^\]]+)\]/);
        return m ? m[1].replace(/→/g, ",") : "";
    }).filter(Boolean));

    const doneVals = new Set();
    step.lists.forEach(l => {
        if (l.role === "merged" || l.role === "single") {
            doneVals.add(l.nodes.map(n => n.val).join(","));
        }
    });

    function handleRun() {
        const nums = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (nums.length < 2 || nums.length > 8) return;
        setListVals(nums);
        setSteps(generateSteps(nums));
        setTreeLayout(buildRecTree(nums));
        setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_LIST.join(","));
        setListVals(DEFAULT_LIST);
        setSteps(generateSteps(DEFAULT_LIST));
        setTreeLayout(buildRecTree(DEFAULT_LIST));
        setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout title="Sort List — Merge Sort on Linked List" subtitle="LC #148 · O(n log n) · Slow/Fast split → Recursive merge">
            {/* Custom input */}
            <div style={{
                display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap",
                width: "100%", maxWidth: "920px",
            }}>
                <span style={{ fontSize: "0.6rem", color: theme.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>
                    List (2–8 nodes):
                </span>
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRun()}
                    placeholder="4,2,1,3"
                    style={{
                        flex: 1, minWidth: "120px",
                        background: theme.cardBg, color: theme.text,
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "6px", padding: "5px 10px",
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
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "960px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="sort_list.cpp" />

                <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel
                        frames={step.callStack || []}
                        emptyText="empty"
                    />
                    <RecursionTreeViz treeLayout={treeLayout} activeVals={activeVals} doneVals={doneVals} />
                </div>
            </div>

            {/* Linked list — full width */}
            <div style={{ width: "100%", maxWidth: "960px" }}>
                <LinkedListViz lists={step.lists} pointers={step.pointers} phase={step.phase} />
            </div>

            <MessageBar phase={step.phase}
                phaseLabel={PHASE_LABEL[step.phase] || step.phase}
                msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={steps.length} />
        </VizLayout>
    );
}
