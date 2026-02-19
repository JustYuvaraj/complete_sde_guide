import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int maxProfit(int prices[], int n) {` },
    { id: 1, text: `    int minPrice = INT_MAX, maxP = 0;` },
    { id: 2, text: `    for (int i = 0; i < n; i++) {` },
    { id: 3, text: `        minPrice = min(minPrice, prices[i]);` },
    { id: 4, text: `        maxP = max(maxP, prices[i]-minPrice);` },
    { id: 5, text: `    }` },
    { id: 6, text: `    return maxP;` },
    { id: 7, text: `}` },
];

function gen(arr) {
    const steps = [];
    const push = (cl, ph, v, m, hl) => steps.push({ cl, phase: ph, vars: { ...v }, msg: m, highlights: hl || [] });

    let minPrice = Infinity, maxP = 0;
    push(1, "init", { minPrice: "∞", maxP }, "Track min price and max profit", []);

    let bestBuy = 0, bestSell = 0;
    for (let i = 0; i < arr.length; i++) {
        const profit = arr[i] - minPrice;
        if (arr[i] < minPrice) {
            minPrice = arr[i];
            push(3, "new-min", { minPrice, maxP, i, "price": arr[i] },
                `New min price = ${arr[i]} (buy day)`,
                [{ idx: i, color: "#22c55e" }]);
        } else if (profit > maxP) {
            maxP = profit;
            bestSell = i;
            push(4, "new-profit", { minPrice, maxP, i, "price": arr[i], "profit": profit },
                `Sell at ${arr[i]} → profit = ${arr[i]} - ${minPrice} = ${profit} (new max!)`,
                [{ idx: i, color: "#f59e0b" }]);
        } else {
            push(2, "scan", { minPrice, maxP, i, "price": arr[i], "profit": profit },
                `Price ${arr[i]}, profit would be ${profit} (not better)`,
                [{ idx: i, color: "#64748b" }]);
        }
    }

    push(6, "done", { maxP, ANSWER: maxP }, `✅ Max profit = ${maxP}`, []);
    return { steps, answer: maxP, arr };
}

function PriceChart({ arr, highlights = [] }) {
    const { isDark } = useTheme();
    const hlMap = {};
    highlights.forEach(h => { hlMap[h.idx] = h.color; });
    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const range = maxVal - minVal || 1;
    return (
        <VizCard title="📈 Price Chart">
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", justifyContent: "center", padding: "8px 0", height: "120px" }}>
                {arr.map((val, i) => {
                    const c = hlMap[i];
                    const h = 20 + ((val - minVal) / range) * 80;
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                            <span style={{ fontSize: "0.55rem", fontWeight: 700, color: c || (isDark ? "#94a3b8" : "#64748b") }}>{val}</span>
                            <div style={{
                                width: "32px", height: `${h}px`, borderRadius: "4px 4px 0 0",
                                background: c ? `${c}` : (isDark ? "#334155" : "#cbd5e1"),
                                transition: "all 0.3s",
                                opacity: c ? 1 : 0.6,
                            }} />
                            <span style={{ fontSize: "0.45rem", color: isDark ? "#475569" : "#94a3b8" }}>d{i + 1}</span>
                        </div>
                    );
                })}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", "new-min": "#22c55e", "new-profit": "#f59e0b", scan: "#64748b", done: "#10b981" };
const PL = { init: "⚙️ INIT", "new-min": "📉 BUY", "new-profit": "📈 SELL", scan: "👀 SCAN", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Buy and sell stock once for maximum profit. (LC #121)

## Key Insight
For each day, the best profit = today's price - minimum price seen so far.
Just track the running minimum and running max profit.

## Why It Works
We must buy before selling. By tracking the minimum price up to today, we always consider the best possible buy price for today's sell price.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: [7, 1, 5, 3, 6, 4]

1. day 1: price=7, min=7, profit=0
2. day 2: price=1, min=1, profit=0
3. day 3: price=5, min=1, profit=4
4. day 4: price=3, min=1, profit=2
5. day 5: price=6, min=1, profit=5 ← max!
6. day 6: price=4, min=1, profit=3

**Answer: 5** (buy at 1, sell at 6)

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1)`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Two Variables

### Track minimum price
    minPrice = min(minPrice, prices[i]);

### Track maximum profit
    maxP = max(maxP, prices[i] - minPrice);

### Why not two nested loops?
Brute force is O(n²). But since we only need the MIN price before day i, one variable suffices.`
    },
];

const DEFAULT = [7, 1, 5, 3, 6, 4];
export default function StockBuySell() {
    const [input, setInput] = useState(DEFAULT.join(","));
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 1200);
    const run = () => { const a = input.split(",").map(Number).filter(v => !isNaN(v) && v >= 0); if (a.length < 2 || a.length > 15) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setInput(DEFAULT.join(",")); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Best Time to Buy & Sell Stock" subtitle="Track min price + max profit · O(n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="7,1,5,3,6,4" label="Prices:" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="stockBuySell.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <PriceChart arr={sess.arr} highlights={step.highlights} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>💰 Profit: {sess.answer}</span></StepInfo>
        </VizLayout>
    );
}
