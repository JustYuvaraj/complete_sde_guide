import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, StepInfo, VizLayout, VizCard, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const DEFAULT_ARR = [10, 80, 30, 90, 40, 50, 70];

const CODE = [
    { id: 0, text: `void quickSort(int arr[], int l, int r) {` },
    { id: 1, text: `    if (l >= r) return; // base case` },
    { id: 2, text: `` },
    { id: 3, text: `    int p = partition(arr, l, r);` },
    { id: 4, text: `    quickSort(arr, l, p-1); // sort left` },
    { id: 5, text: `    quickSort(arr, p+1, r); // sort right` },
    { id: 6, text: `}` },
    { id: 7, text: `` },
    { id: 8, text: `int partition(int arr[], int l, int r) {` },
    { id: 9, text: `    int pivot = arr[r]; // last element` },
    { id: 10, text: `    int i = l - 1;      // smaller boundary` },
    { id: 11, text: `    for (int j = l; j < r; j++) {` },
    { id: 12, text: `        if (arr[j] <= pivot) {` },
    { id: 13, text: `            i++;` },
    { id: 14, text: `            swap(arr[i], arr[j]);` },
    { id: 15, text: `        }` },
    { id: 16, text: `    }` },
    { id: 17, text: `    swap(arr[i+1], arr[r]); // place pivot` },
    { id: 18, text: `    return i + 1;` },
    { id: 19, text: `}` },
];

const PHASE_COLOR = {
    call: "#8b5cf6", check: "#3b82f6", partition: "#f59e0b", scan: "#3b82f6",
    compare: "#f59e0b", swap: "#ec4899", pivot: "#ec4899", placed: "#10b981",
    base: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    call: "📞 CALL", check: "🔵 CHECK", partition: "⚙ PARTITION", scan: "🔍 SCAN",
    compare: "⚖ COMPARE", swap: "🔀 SWAP", pivot: "📌 PLACE PIVOT",
    placed: "✅ PLACED", base: "🟢 BASE CASE", done: "✅ SORTED",
};

/* ── Dynamic step generator ── */
function generateSteps(initArr) {
    const arr = [...initArr];
    const steps = [];
    const placed = [];

    function push(cl, phase, l, r, pivot, pivotIdx, i, j, swapping, msg, vars) {
        const hl = [];
        for (let x = l; x <= r; x++) hl.push(x);
        steps.push({
            cl, phase, arr: [...arr], l, r, pivot, pivotIdx, i, j,
            hl, swapping: swapping || [], placed: [...placed],
            cs: [...callStack.map(c => ({ ...c }))],
            msg, vars,
        });
    }

    const callStack = [];

    function quickSort(l, r) {
        callStack.push({ l, r });

        if (l >= r) {
            // base case
            if (l === r && !placed.includes(l)) placed.push(l);
            push(1, "base", l, Math.max(l, r), null, -1, -1, null, [],
                l > r ? `quickSort(${l},${r}): l>r → BASE CASE ✓` : `quickSort(${l},${l}): single element [${arr[l]}] → BASE CASE ✓`,
                { l, r, "l>=r": "true → return" });
            callStack.pop();
            return;
        }

        push(0, "call", l, r, null, r, -1, null, [],
            `quickSort(arr,${l},${r}) — sort [${arr.slice(l, r + 1).join(",")}]`,
            { l, r });

        // partition
        const pivot = arr[r];
        push(9, "partition", l, r, pivot, r, l - 1, null, [],
            `partition(${l},${r}): pivot=arr[${r}]=${pivot}`,
            { pivot: `${pivot}=arr[${r}]` });

        let i = l - 1;
        for (let j = l; j < r; j++) {
            if (arr[j] <= pivot) {
                i++;
                push(12, "compare", l, r, pivot, r, i, j, [],
                    `j=${j}: arr[${j}]=${arr[j]} ≤ ${pivot} ✓ → i++=${i}, swap`,
                    { [`arr[${j}]=${arr[j]}`]: `≤ pivot(${pivot}) ✓` });
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    push(14, "swap", l, r, pivot, r, i, j, [i, j],
                        `swap arr[${i}] and arr[${j}] → ${arr[i]} ↔ ${arr[j]}`,
                        { [`swap(${i},${j})`]: `${arr[j]} ↔ ${arr[i]}` });
                }
            } else {
                push(12, "compare", l, r, pivot, r, i, j, [],
                    `j=${j}: arr[${j}]=${arr[j]} > ${pivot} → skip`,
                    { [`arr[${j}]=${arr[j]}`]: `> pivot(${pivot}) ✗` });
            }
        }

        // place pivot
        const pIdx = i + 1;
        if (pIdx !== r) {
            [arr[pIdx], arr[r]] = [arr[r], arr[pIdx]];
        }
        push(17, "pivot", l, r, pivot, pIdx, i, null, [pIdx, r],
            `Place pivot: swap arr[${pIdx}] with arr[${r}] → ${pivot} at index ${pIdx}`,
            { [`swap(i+1=${pIdx},r=${r})`]: "place pivot" });

        placed.push(pIdx);
        push(18, "placed", l, r, pivot, pIdx, i, null, [],
            `✓ Pivot ${pivot} at index ${pIdx}!`,
            { "return": `p=${pIdx}` });

        callStack.pop();

        // recurse left
        quickSort(l, pIdx - 1);
        // recurse right
        callStack.push({ l, r }); // re-push parent context
        quickSort(pIdx + 1, r);
        callStack.pop();
    }

    quickSort(0, arr.length - 1);

    steps.push({
        cl: -1, phase: "done", arr: [...arr], l: 0, r: arr.length - 1,
        pivot: null, pivotIdx: -1, i: -1, j: null,
        hl: arr.map((_, i) => i), swapping: [], placed: [...placed],
        cs: [],
        msg: `✅ Fully sorted: [${arr.join(",")}]`,
        vars: { final: `[${arr.join(",")}]` },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Sort an array in-place. QuickSort is the most commonly used sorting algorithm — average O(n log n) with small constants.

## Key Insight
**Partition**: pick a pivot, rearrange so elements ≤ pivot are left, > pivot are right. Pivot is now in its final position. Recurse on both halves.

## Mental Model
1. Choose pivot (often last element)
2. Partition: scan array, swap elements to correct side
3. Pivot lands at its correct sorted position
4. Recurse on left half and right half
5. Base case: subarray has 0 or 1 elements`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
[3,6,2,8,1,4] pivot=4
1. i scans, swaps smaller elements to front
2. After partition: [3,2,1,**4**,6,8]
3. Recurse on [3,2,1] and [6,8]
4. Each sub-partition puts one more element in final position

## Partition Mechanics
- Maintain boundary i between ≤pivot and >pivot zones
- Scan j from left to right
- If arr[j] ≤ pivot: swap arr[i] and arr[j], advance i`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
quickSort(arr, lo, hi):
  if lo >= hi: return
  p = partition(arr, lo, hi)
  quickSort(arr, lo, p-1)
  quickSort(arr, p+1, hi)

partition(arr, lo, hi):
  pivot = arr[hi], i = lo
  for j = lo to hi-1:
    if arr[j] <= pivot: swap(arr[i], arr[j]), i++
  swap(arr[i], arr[hi])
  return i
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time (avg) | **O(n log n)** |
| Time (worst) | **O(n²)** — already sorted |
| Space | **O(log n)** — recursion stack |`
    }
];

export default function QuickSort() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [arr, setArr] = useState(DEFAULT_ARR);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";
    const placedSet = new Set(step.placed);
    const maxVal = Math.max(...arr);

    function handleRun() {
        const nums = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (nums.length < 2 || nums.length > 10) return;
        setArr(nums);
        setSteps(generateSteps(nums));
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setArr(DEFAULT_ARR);
        setSteps(generateSteps(DEFAULT_ARR));
        setIdx(0);
        setPlaying(false);
    }

    return (
        <VizLayout
            title="Quick Sort — Lomuto Partition"
            subtitle={`arr = [${arr.join(",")}] · Pick pivot → partition → recurse`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="10,80,30,90,40,50,70"
                label="Array:"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="quick_sort.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.cs} renderFrame={(f) => `qSort(${f.l},${f.r})`} />
                </div>
            </div>

            {/* Array bars */}
            <VizCard title="📊 Array — green = pivot in final position">
                <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", marginBottom: "6px" }}>
                    {step.arr.map((val, i) => {
                        const isPlaced = placedSet.has(i);
                        const isPivot = i === step.pivotIdx && step.pivot !== null && !isPlaced;
                        const isSwapping = step.swapping.includes(i);
                        const isJ = i === step.j;
                        const isI = i === step.i && step.i >= 0;
                        const isDone = step.phase === "done";
                        const barH = Math.max(16, Math.round((val / maxVal) * 56));

                        let bg = isDark ? "#1e293b" : "#e2e8f0", border = theme.cardBorder, shadow = "none";
                        if (isDone || isPlaced) { bg = "#065f46"; border = "#10b981"; }
                        else if (isSwapping) { bg = isDark ? "#7c1d4a" : "#fce7f3"; border = "#ec4899"; shadow = `0 0 8px #ec498966`; }
                        else if (isPivot) { bg = isDark ? "#78350f" : "#fef3c7"; border = "#f59e0b"; shadow = `0 0 8px #f59e0b66`; }
                        else if (isJ) { bg = isDark ? "#1e1b4b" : "#e0e7ff"; border = "#8b5cf6"; }
                        else if (isI) { bg = isDark ? "#0c1a3a" : "#dbeafe"; border = "#3b82f6"; }

                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", flex: 1 }}>
                                <div style={{ height: "12px", display: "flex", alignItems: "center" }}>
                                    {isPivot && <span style={{ fontSize: "6px", color: "#f59e0b", fontWeight: "700" }}>PVT</span>}
                                    {isSwapping && <span style={{ fontSize: "6px", color: "#ec4899", fontWeight: "700" }}>SWP</span>}
                                </div>
                                <div style={{
                                    width: "100%", height: `${barH}px`, background: bg,
                                    border: `2px solid ${border}`, borderRadius: "3px 3px 0 0",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.35s", boxShadow: shadow, position: "relative",
                                }}>
                                    <span style={{ fontSize: "9px", fontWeight: "800", color: isDone || isPlaced ? "#34d399" : isPivot ? "#fbbf24" : isSwapping ? "#f9a8d4" : theme.text }}>{val}</span>
                                    {isPlaced && !isDone && (
                                        <div style={{ position: "absolute", top: "-5px", right: "-3px", width: "9px", height: "9px", background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: "5px", color: "#fff" }}>✓</span>
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize: "7px", color: theme.textDim }}>[{i}]</span>
                                <div style={{ height: "10px", display: "flex", gap: "2px" }}>
                                    {isJ && <span style={{ fontSize: "6px", color: "#8b5cf6", fontWeight: "700" }}>j</span>}
                                    {isI && <span style={{ fontSize: "6px", color: "#3b82f6", fontWeight: "700" }}>i</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                        { color: "#f59e0b", label: "pivot" }, { color: "#8b5cf6", label: "j (scan)" },
                        { color: "#3b82f6", label: "i (boundary)" }, { color: "#ec4899", label: "swap" },
                        { color: "#10b981", label: "final ✓" },
                    ].map(l => (
                        <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.58rem", color: theme.textMuted }}>
                            <span style={{ width: "7px", height: "7px", background: l.color, borderRadius: "2px", display: "inline-block" }} />
                            {l.label}
                        </span>
                    ))}
                </div>
            </VizCard>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />

            <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
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
                <span style={{ color: "#f59e0b" }}>■</span> partition &nbsp;
                <span style={{ color: "#ec4899" }}>■</span> swap &nbsp;
                <span style={{ color: "#10b981" }}>■</span> placed
            </StepInfo>
        </VizLayout>
    );
}