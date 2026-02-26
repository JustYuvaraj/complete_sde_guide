import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection,
} from "../shared/Components";

const DEFAULT_ARR = [7, 1, 5, 3, 6, 4];

const CODE = [
    { id: 0, text: `int maxProfit(vector<int>& prices) {` },
    { id: 1, text: `    int profit = 0;` },
    { id: 2, text: `    for (int i = 1; i < prices.size(); i++) {` },
    { id: 3, text: `        if (prices[i] > prices[i-1])` },
    { id: 4, text: `            profit += prices[i] - prices[i-1];` },
    { id: 5, text: `    }` },
    { id: 6, text: `    return profit;` },
    { id: 7, text: `}` },
];

const PHASE_COLOR = { init: "#8b5cf6", up: "#10b981", down: "#ef4444", done: "#10b981" };
const PHASE_LABELS = { init: "INITIALIZE", up: "PROFIT ✓", down: "SKIP", done: "DONE ✓" };

function generateSteps(prices) {
    const steps = [];
    let profit = 0;

    steps.push({
        cl: 1, phase: "init", prices, activeIdx: -1, profit: 0, gain: 0,
        msg: `Buy&sell multiple times — capture every upslope`,
        vars: { profit: 0, "prices.size": prices.length },
    });

    for (let i = 1; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        const isUp = diff > 0;
        if (isUp) profit += diff;

        steps.push({
            cl: isUp ? 4 : 3, phase: isUp ? "up" : "down",
            prices, activeIdx: i, profit, gain: isUp ? diff : 0,
            msg: isUp ? `${prices[i]} > ${prices[i - 1]} → gain ${diff}, total = ${profit}` : `${prices[i]} ≤ ${prices[i - 1]} → skip`,
            vars: { i, [`prices[${i}]`]: prices[i], [`prices[${i - 1}]`]: prices[i - 1], diff, profit },
        });
    }

    steps.push({
        cl: 6, phase: "done", prices, activeIdx: -1, profit, gain: 0,
        msg: `🟢 Max profit = ${profit}`,
        vars: { "return": profit },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 122 — Best Time to Buy & Sell Stock II

**Difficulty:** Medium &nbsp; **Topics:** Array, Greedy, DP

---

You can buy and sell a stock **multiple times** (but must sell before buying again). Find maximum profit.

### Examples
\`\`\`
Input:  [7,1,5,3,6,4]
Output: 7  (buy@1 sell@5=4, buy@3 sell@6=3 → total 7)
\`\`\``
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Greedy: Capture Every Rise

### Key Insight
Add up **every positive difference** between consecutive days. This is equivalent to buying at every valley and selling at every peak.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | One variable |`
    }
];

export default function BestTimeToBuyII() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_ARR.join(","));
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_ARR));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length < 2 || parsed.length > 14) return;
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_ARR.join(","));
        setSteps(generateSteps(DEFAULT_ARR)); setIdx(0); setPlaying(false);
    }

    const maxP = Math.max(...step.prices, 1);

    return (
        <VizLayout title="Best Time to Buy & Sell Stock II" subtitle="LC #122 · Greedy">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset} placeholder="7,1,5,3,6,4" />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="stock_buy_sell_ii.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            <VizCard title={`📈 Stock Prices · profit = ${step.profit}`}>
                <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", justifyContent: "center", height: "120px" }}>
                    {step.prices.map((p, i) => {
                        const isActive = step.activeIdx === i;
                        const isPrev = step.activeIdx === i + 1;
                        const h = (p / maxP) * 100;
                        const isUp = i > 0 && step.prices[i] > step.prices[i - 1];
                        return (
                            <div key={i} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                            }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: "800", color: isActive ? pc : theme.text }}>{p}</span>
                                <div style={{
                                    width: "36px", height: `${h}px`, borderRadius: "6px 6px 0 0",
                                    background: isActive && step.phase === "up" ? "#10b981"
                                        : isActive && step.phase === "down" ? "#ef444480"
                                            : (isDark ? "#3b82f640" : "#93c5fd"),
                                    border: `2px solid ${isActive ? pc : "transparent"}`,
                                    transition: "all 0.3s",
                                }} />
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
