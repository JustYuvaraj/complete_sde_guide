import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int merge(int a[],int t[],int l,int m,int r){` },
    { id: 1, text: `    int cnt = 0, j = m + 1;` },
    { id: 2, text: `    // Count reverse pairs` },
    { id: 3, text: `    for(int i=l; i<=m; i++){` },
    { id: 4, text: `        while(j<=r && a[i]>2LL*a[j]) j++;` },
    { id: 5, text: `        cnt += j - (m+1);` },
    { id: 6, text: `    }` },
    { id: 7, text: `    // Normal merge` },
    { id: 8, text: `    /* ... standard merge sort merge ... */` },
    { id: 9, text: `    return cnt;` },
    { id: 10, text: `}` },
    { id: 11, text: `int mergeSort(int a[],int t[],int l,int r){` },
    { id: 12, text: `    if(l>=r) return 0;` },
    { id: 13, text: `    int m=(l+r)/2;` },
    { id: 14, text: `    return mergeSort(a,t,l,m)` },
    { id: 15, text: `         + mergeSort(a,t,m+1,r)` },
    { id: 16, text: `         + merge(a,t,l,m,r);` },
    { id: 17, text: `}` },
];

function countRP(arr) {
    const steps = [];
    const a = [...arr];
    let totalCnt = 0;
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [], arr: [...a] });

    push(11, "init", { n: a.length }, "Modified merge sort: count pairs where a[i] > 2*a[j]", []);

    function msort(l, r) {
        if (l >= r) return 0;
        const m = Math.floor((l + r) / 2);
        let cnt = msort(l, m) + msort(m + 1, r);

        // Count reverse pairs
        let j = m + 1, pairsCnt = 0;
        for (let i = l; i <= m; i++) {
            while (j <= r && a[i] > 2 * a[j]) j++;
            pairsCnt += j - (m + 1);
        }
        if (pairsCnt > 0) {
            cnt += pairsCnt;
            totalCnt += pairsCnt;
            push(5, "count", { l, m, r, "pairs in merge": pairsCnt, "total": totalCnt },
                `Merge [${l}..${m}]&[${m + 1}..${r}]: ${pairsCnt} reverse pairs`,
                Array.from({ length: r - l + 1 }, (_, idx) => ({ idx: l + idx, color: "#ef4444" })));
        }

        // Normal merge
        const left = a.slice(l, m + 1);
        const right = a.slice(m + 1, r + 1);
        let ii = 0, jj = 0, k = l;
        while (ii < left.length && jj < right.length) {
            if (left[ii] <= right[jj]) a[k++] = left[ii++];
            else a[k++] = right[jj++];
        }
        while (ii < left.length) a[k++] = left[ii++];
        while (jj < right.length) a[k++] = right[jj++];

        return cnt;
    }

    const total = msort(0, a.length - 1);
    push(16, "done", { ANSWER: total }, `✅ Total reverse pairs = ${total}`, []);
    return { steps, answer: total, arr, sorted: a };
}

function ArrayGrid({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    return (
        <VizCard title="📊 Array">
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    return (
                        <div key={i} style={{ width: "44px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.8rem",
                                background: c ? `${c}20` : (isDark ? "#1e293b" : "#f1f5f9"),
                                border: `2px solid ${c || (isDark ? "#334155" : "#e2e8f0")}`,
                                color: c || (isDark ? "#e2e8f0" : "#1e293b"),
                                transition: "all 0.3s",
                            }}>{val}</div>
                            <span style={{ fontSize: "0.45rem", color: isDark ? "#64748b" : "#94a3b8" }}>{i}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", count: "#ef4444", done: "#10b981" };
const PL = { init: "⚙️ INIT", count: "🔢 COUNT", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Count "reverse pairs": pairs (i,j) where i < j and nums[i] > 2 * nums[j]. (LC #493)

## Key Insight
Same as count inversions, but condition is a[i] > 2*a[j]. Use modified merge sort.

## Important Difference
Count step is SEPARATE from merge step! First count pairs, THEN merge normally.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [1, 3, 2, 3, 1]

During merge sort:
- Count pairs where left[i] > 2 * right[j]
- 3 > 2*1=2? Yes. That's a pair.
- All other: 3 > 2*1? Yes. etc.

**Answer: 2** pairs

### Complexity: O(n log n) time`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Two-Phase Merge

### Phase 1: Count
    for(int i=l; i<=m; i++)
        while(j<=r && a[i]>2LL*a[j]) j++;
        cnt += j - (m+1);

### Phase 2: Standard merge
Normal merge sort merge (no counting).

### Why 2LL?
Prevent integer overflow: 2 * a[j] could overflow int.`
    },
];

const DEFAULT = [1, 3, 2, 3, 1];
export default function ReversePairs() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => countRP(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v)); if (a.length < 2 || a.length > 12) return; setSess(countRP(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(countRP(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Reverse Pairs" subtitle="Modified merge sort · O(n log n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,3,2,3,1" label="Array:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="reversePairs.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <ArrayGrid arr={step.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#ef4444", fontWeight: 700 }}>Reverse Pairs: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
