import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, StepInfo, VizLayout, VizCard, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const DEFAULT_ARR = [38, 27, 43, 3, 9, 82, 10];

const CODE = [
    { id: 0, text: `void mergeSort(int arr[], int l, int r) {` },
    { id: 1, text: `    if (l >= r) return; // base case` },
    { id: 2, text: `` },
    { id: 3, text: `    int mid = l + (r - l) / 2;` },
    { id: 4, text: `    mergeSort(arr, l, mid);     // sort left` },
    { id: 5, text: `    mergeSort(arr, mid+1, r);   // sort right` },
    { id: 6, text: `    merge(arr, l, mid, r);       // merge` },
    { id: 7, text: `}` },
    { id: 8, text: `` },
    { id: 9, text: `void merge(int arr[], int l, int m, int r) {` },
    { id: 10, text: `    // copy to temp arrays L[] and R[]` },
    { id: 11, text: `    int i=0, j=0, k=l;` },
    { id: 12, text: `    while (i<nL && j<nR) {` },
    { id: 13, text: `        if (L[i] <= R[j]) arr[k++]=L[i++];` },
    { id: 14, text: `        else              arr[k++]=R[j++];` },
    { id: 15, text: `    }` },
    { id: 16, text: `    // copy remaining` },
    { id: 17, text: `    while (i<nL) arr[k++]=L[i++];` },
    { id: 18, text: `    while (j<nR) arr[k++]=R[j++];` },
    { id: 19, text: `}` },
];

const PHASE_COLOR = { divide: "#8b5cf6", base: "#10b981", merge: "#f59e0b", merged: "#3b82f6", done: "#10b981" };
const PHASE_LABELS = {
    divide: "⬇ DIVIDE", base: "🔵 BASE CASE", merge: "🔀 MERGING", merged: "✓ MERGED", done: "✅ DONE",
};

/* ── Build recursion tree layout from array length ── */
function buildTreeLayout(n) {
    const nodes = [];
    const edges = [];
    let id = 0;

    function build(l, r, depth, xCenter, xSpan) {
        const nodeId = `t${id++}`;
        nodes.push({ id: nodeId, l, r, x: xCenter - 50, y: depth * 44, depth });

        if (l < r) {
            const mid = Math.floor(l + (r - l) / 2);
            const leftId = build(l, mid, depth + 1, xCenter - xSpan / 2, xSpan / 2);
            const rightId = build(mid + 1, r, depth + 1, xCenter + xSpan / 2, xSpan / 2);
            edges.push({ p: nodeId, c: leftId });
            edges.push({ p: nodeId, c: rightId });
        }
        return nodeId;
    }

    const totalWidth = Math.max(400, n * 90);
    build(0, n - 1, 0, totalWidth / 2, totalWidth / 3);
    return { nodes, edges, width: totalWidth };
}

/* ── Dynamic step generator ── */
function generateSteps(initArr) {
    const arr = [...initArr];
    const steps = [];
    const allIdx = initArr.map((_, i) => i);

    function push(cl, phase, l, r, cs, msg, vars, extra = {}) {
        const hl = [];
        for (let x = l; x <= r; x++) hl.push(x);
        steps.push({
            cl, phase, arr: [...arr], hl,
            cs: cs.map(c => ({ ...c })),
            active: extra.active || null,
            revealed: extra.revealed || [],
            msg, vars,
        });
    }

    const callStack = [];
    const revealedNodes = new Set();

    function nodeKey(l, r) { return `${l},${r}`; }

    function mergeSort(l, r) {
        const key = nodeKey(l, r);
        revealedNodes.add(key);
        callStack.push({ l, r });
        const revealed = [...revealedNodes];

        if (l >= r) {
            // base case
            push(1, "base", l, r, callStack,
                `mergeSort(${l},${l}) → BASE CASE [${arr[l]}]`,
                { l, r, "base": "✓" },
                { active: key, revealed });
            callStack.pop();
            return;
        }

        const mid = Math.floor(l + (r - l) / 2);

        push(0, "divide", l, r, callStack,
            `mergeSort(arr, ${l}, ${r}) — [${arr.slice(l, r + 1).join(",")}]`,
            { l, r, mid },
            { active: key, revealed });

        // recurse left
        push(4, "divide", l, mid, callStack,
            `Recurse LEFT: mergeSort(${l}, ${mid})`,
            { l, r: mid, mid: Math.floor(l + (mid - l) / 2) },
            { active: key, revealed: [...revealedNodes] });

        mergeSort(l, mid);

        // recurse right
        callStack.push({ l, r });
        push(5, "divide", mid + 1, r, callStack,
            `Recurse RIGHT: mergeSort(${mid + 1}, ${r})`,
            { l: mid + 1, r },
            { active: key, revealed: [...revealedNodes] });

        mergeSort(mid + 1, r);

        // merge
        callStack.push({ l, r });
        const leftSlice = arr.slice(l, mid + 1);
        const rightSlice = arr.slice(mid + 1, r + 1);

        push(6, "merge", l, r, callStack,
            `merge [${leftSlice.join(",")}] and [${rightSlice.join(",")}]`,
            { L: `[${leftSlice}]`, R: `[${rightSlice}]` },
            { active: key, revealed: [...revealedNodes] });

        // actual merge
        const L = [...leftSlice], R = [...rightSlice];
        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < L.length) arr[k++] = L[i++];
        while (j < R.length) arr[k++] = R[j++];

        push(6, "merged", l, r, callStack,
            `✓ Merged to [${arr.slice(l, r + 1).join(",")}]`,
            { result: `[${arr.slice(l, r + 1).join(",")}]` },
            { active: key, revealed: [...revealedNodes] });

        callStack.pop();
    }

    mergeSort(0, arr.length - 1);

    steps.push({
        cl: -1, phase: "done", arr: [...arr], hl: allIdx,
        cs: [], active: null, revealed: [...revealedNodes],
        msg: `✅ Fully sorted: [${arr.join(",")}]`,
        vars: { final: `[${arr.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Sort an array using **Merge Sort** — a stable, divide-and-conquer algorithm guaranteed O(n log n).

## Key Insight
1. **Divide** the array in half
2. **Recursively sort** each half
3. **Merge** two sorted halves into one sorted array

## Mental Model
Think of sorting a deck of cards: split it in half, sort each half, then interleave them back together by always picking the smaller card.`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
[5,3,1,4,2]
1. Split: [5,3] and [1,4,2]
2. [5,3] → [5] [3] → merge → [3,5]
3. [1,4,2] → [1] [4,2] → [4] [2] → merge → [2,4] → merge → [1,2,4]
4. Merge [3,5] and [1,2,4] → [1,2,3,4,5]

## Merge Step
Two pointers on sorted halves. Compare, take smaller, advance that pointer. Append remaining.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
mergeSort(arr, lo, hi):
  if lo >= hi: return
  mid = (lo + hi) / 2
  mergeSort(arr, lo, mid)
  mergeSort(arr, mid+1, hi)
  merge(arr, lo, mid, hi)
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(n log n)** — always |
| Space | **O(n)** — temp array for merging |

## vs QuickSort
- Merge Sort: stable, guaranteed O(n log n), uses O(n) space
- QuickSort: unstable, O(n²) worst case, but O(1) extra space`
    }
];

export default function MergeSort() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [arr, setArr] = useState(DEFAULT_ARR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const [treeLayout, setTreeLayout] = useState(() => buildTreeLayout(DEFAULT_ARR.length));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1500);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    const revealedKeys = new Set(step.revealed);

    function handleRun() {
        const nums = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (nums.length < 2 || nums.length > 10) return;
        setArr(nums);
        setSteps(generateSteps(nums));
        setTreeLayout(buildTreeLayout(nums.length));
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setArr(DEFAULT_ARR);
        setSteps(generateSteps(DEFAULT_ARR));
        setTreeLayout(buildTreeLayout(DEFAULT_ARR.length));
        setIdx(0);
        setPlaying(false);
    }

    function treeNodeById(id) { return treeLayout.nodes.find(n => n.id === id); }
    function nodeKey(n) { return `${n.l},${n.r}`; }

    return (
        <VizLayout
            title="Merge Sort — Code ↔ Visual Sync"
            subtitle={`arr = [${arr.join(",")}] · Divide & Conquer · O(n log n)`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="38,27,43,3,9,82,10"
                label="Array:"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="merge_sort.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.cs} renderFrame={(f) => `sort(${f.l},${f.r})`} />
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                {/* Array bars */}
                <VizCard title="📊 Current Array">
                    <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", flexWrap: "wrap" }}>
                        {step.arr.map((val, i) => {
                            const isHl = step.hl.includes(i);
                            const isDone = step.phase === "done";
                            const maxV = Math.max(...arr, ...step.arr);
                            const barH = Math.max(14, Math.round((val / maxV) * 50));
                            return (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                    <span style={{ fontSize: "9px", color: isDone ? "#34d399" : isHl ? pc : theme.textDim, fontWeight: "700" }}>{val}</span>
                                    <div style={{
                                        width: "30px", height: `${barH}px`,
                                        background: isDone ? "#065f46" : isHl ? `${pc}33` : (isDark ? "#1e293b" : "#e2e8f0"),
                                        border: `1.5px solid ${isDone ? "#10b981" : isHl ? pc : theme.cardBorder}`,
                                        borderRadius: "3px 3px 0 0", transition: "all 0.4s",
                                    }} />
                                    <span style={{ fontSize: "7px", color: theme.textDim }}>[{i}]</span>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>

                {/* Recursion tree */}
                <VizCard title="🌳 Recursion Tree">
                    <svg width="100%" viewBox={`0 0 ${treeLayout.width} ${(Math.max(...treeLayout.nodes.map(n => n.depth)) + 1) * 48 + 10}`} style={{ overflow: "visible" }}>
                        {treeLayout.edges.map((e, i) => {
                            const p = treeNodeById(e.p), c = treeNodeById(e.c);
                            if (!revealedKeys.has(nodeKey(p)) || !revealedKeys.has(nodeKey(c))) return null;
                            return <line key={i} x1={p.x + 50} y1={p.y + 16} x2={c.x + 50} y2={c.y}
                                stroke={isDark ? "#1f2937" : "#c7d2fe"} strokeWidth="1.2" />;
                        })}
                        {treeLayout.nodes.filter(n => revealedKeys.has(nodeKey(n))).map(n => {
                            const isActive = step.active === nodeKey(n);
                            const isMerged = !isActive && (step.phase === "merged" || step.phase === "done") && n.l !== n.r;
                            const isBase = n.l === n.r;
                            const bg = isActive ? (step.phase === "merge" || step.phase === "merged"
                                ? (isDark ? "#78350f" : "#fef3c7") : (isDark ? "#1e1b4b" : "#e0e7ff"))
                                : isMerged ? (isDark ? "#0c2a0c" : "#dcfce7")
                                    : isBase ? (isDark ? "#0c1f0c" : "#dcfce7")
                                        : (isDark ? "#111827" : "#f1f5f9");
                            const border = isActive ? pc : isMerged || isBase ? "#16a34a" : theme.cardBorder;
                            const sliceVals = step.arr.slice(n.l, n.r + 1);
                            return (
                                <g key={n.id}>
                                    {isActive && <rect x={n.x - 3} y={n.y - 3} width={106} height={22} rx="6" fill={`${pc}22`} style={{ filter: "blur(5px)" }} />}
                                    <rect x={n.x} y={n.y} width={100} height={18} rx="4" fill={bg} stroke={border} strokeWidth={isActive ? 2 : 1} />
                                    <text x={n.x + 50} y={n.y + 12} textAnchor="middle" fontSize="8"
                                        fontWeight={isActive ? "800" : "500"}
                                        fill={isActive ? (isDark ? "#fff" : "#312e81") : isMerged || isBase ? "#16a34a" : theme.textDim}>
                                        [{sliceVals.join(",")}]
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </VizCard>
            </div>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

            <StepInfo idx={idx} total={steps.length}>
                <span style={{ color: "#8b5cf6" }}>■</span> divide &nbsp;
                <span style={{ color: "#10b981" }}>■</span> base &nbsp;
                <span style={{ color: "#f59e0b" }}>■</span> merge &nbsp;
                <span style={{ color: "#3b82f6" }}>■</span> merged
            </StepInfo>
        </VizLayout>
    );
}