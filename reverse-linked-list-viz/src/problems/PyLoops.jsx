import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `# for loop — iterate over range` },
    { id: 1, text: `for i in range(5):` },
    { id: 2, text: `    print(i)` },
    { id: 3, text: `` },
    { id: 4, text: `# for loop — iterate over collection` },
    { id: 5, text: `fruits = ["apple", "mango", "banana"]` },
    { id: 6, text: `for fruit in fruits:` },
    { id: 7, text: `    print(fruit)` },
    { id: 8, text: `` },
    { id: 9, text: `# while loop` },
    { id: 10, text: `count = 3` },
    { id: 11, text: `while count > 0:` },
    { id: 12, text: `    print(count)` },
    { id: 13, text: `    count -= 1` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", forRange: "#3b82f6", forList: "#f59e0b", whileLoop: "#10b981", done: "#10b981",
};
const PHASE_LABELS = {
    init: "START", forRange: "for + range()", forList: "for + ITERABLE", whileLoop: "while LOOP", done: "COMPLETE",
};

function generateSteps() {
    const steps = [];
    steps.push({
        cl: 0, phase: "init", loopType: null, counter: null, items: [], currentItem: null, output: [],
        msg: "Python provides two loop constructs: for (definite iteration) and while (indefinite iteration).",
        vars: {}
    });

    for (let i = 0; i < 5; i++) {
        steps.push({
            cl: 2, phase: "forRange", loopType: "for", counter: i, items: [0, 1, 2, 3, 4], currentItem: i,
            output: Array.from({ length: i + 1 }, (_, j) => j),
            msg: `range(5) generates sequence [0,1,2,3,4]. Current iteration: i = ${i}`,
            vars: { i, "range(5)": "[0, 1, 2, 3, 4]" }
        });
    }

    const fruits = ["apple", "mango", "banana"];
    for (let i = 0; i < fruits.length; i++) {
        steps.push({
            cl: 7, phase: "forList", loopType: "for-list", counter: i, items: fruits, currentItem: fruits[i],
            output: fruits.slice(0, i + 1),
            msg: `Iterating over list directly — no index required. Current element: "${fruits[i]}"`,
            vars: { fruit: `"${fruits[i]}"`, index: i }
        });
    }

    for (let c = 3; c > 0; c--) {
        steps.push({
            cl: 12, phase: "whileLoop", loopType: "while", counter: c, items: [], currentItem: c,
            output: [c],
            msg: `Condition: count(${c}) > 0 is True → execute body, then decrement. count becomes ${c - 1}.`,
            vars: { count: c, "count > 0": "True" }
        });
    }

    steps.push({
        cl: 13, phase: "done", loopType: null, counter: null, items: [], currentItem: null, output: [],
        msg: "Summary: 'for' for known iteration count (range/collection), 'while' for condition-based termination.",
        vars: { "Key": "for = definite, while = indefinite" }
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Iteration Constructs", color: "#8b5cf6",
        content: `## for and while Loops

### for loop — Definite Iteration
\`\`\`python
for i in range(n):      # i = 0, 1, ..., n-1
    process(i)

for item in collection:  # iterates over each element
    process(item)
\`\`\`

### while loop — Indefinite Iteration
\`\`\`python
while condition:         # runs until condition is False
    process()
    update_condition()   # must ensure termination
\`\`\`

### Control Flow
- \`break\` — exit loop immediately
- \`continue\` — skip to next iteration
- \`range(start, stop, step)\` — generates arithmetic sequence

### Key Difference from C++
Python \`for\` iterates over **iterables** (lists, ranges, strings), not loop counters. There is no \`for(int i=0; i<n; i++)\` syntax.`
    }
];

export default function PyLoops() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1800);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Loops (for / while)" subtitle="Python Refresher · Lesson 3 of 9">
            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="loops.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {step.loopType && (
                <VizCard title={step.loopType === "for" ? "range(5) Iteration" : step.loopType === "for-list" ? "Collection Iteration" : "while Loop State"}>
                    {step.loopType === "for" && (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            {step.items.map((item, i) => (
                                <div key={i} style={{
                                    width: "50px", height: "50px", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: step.currentItem === item ? "#3b82f620" : (isDark ? "#0f172a" : "#f1f5f9"),
                                    border: `3px solid ${step.currentItem === item ? "#3b82f6" : i < step.counter ? "#10b98144" : theme.cardBorder}`,
                                    fontWeight: "900", fontSize: "1.2rem",
                                    color: step.currentItem === item ? "#3b82f6" : i < step.counter ? "#10b981" : theme.textDim,
                                    transition: "all 0.3s",
                                    transform: step.currentItem === item ? "scale(1.15)" : "scale(1)",
                                    fontFamily: "monospace",
                                }}>{item}</div>
                            ))}
                        </div>
                    )}
                    {step.loopType === "for-list" && (
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            {step.items.map((item, i) => (
                                <div key={i} style={{
                                    padding: "10px 18px", borderRadius: "12px",
                                    background: step.currentItem === item ? "#f59e0b18" : (isDark ? "#0f172a" : "#f1f5f9"),
                                    border: `3px solid ${step.currentItem === item ? "#f59e0b" : i < step.counter ? "#10b98144" : theme.cardBorder}`,
                                    fontWeight: "800", fontSize: "0.9rem", fontFamily: "monospace",
                                    color: step.currentItem === item ? "#f59e0b" : theme.text,
                                    transition: "all 0.3s",
                                    transform: step.currentItem === item ? "scale(1.08)" : "scale(1)",
                                }}>"{item}"</div>
                            ))}
                        </div>
                    )}
                    {step.loopType === "while" && (
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                display: "inline-flex", padding: "14px 30px", borderRadius: "16px",
                                background: "#10b98118", border: "3px solid #10b981",
                                fontSize: "2rem", fontWeight: "900", color: "#10b981", fontFamily: "monospace",
                            }}>{step.counter}</div>
                            <div style={{ marginTop: "6px", fontSize: "0.7rem", color: theme.textDim, fontFamily: "monospace" }}>
                                count (decremented each iteration)
                            </div>
                        </div>
                    )}
                </VizCard>
            )}

            {step.output.length > 0 && (
                <VizCard title="Output (stdout)">
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                        {step.output.map((val, i) => (
                            <div key={i} style={{
                                padding: "6px 14px", borderRadius: "8px",
                                background: isDark ? "#10b98115" : "#dcfce7",
                                border: "1px solid #10b98144",
                                fontFamily: "monospace", fontWeight: "700", color: "#10b981",
                            }}>{typeof val === "string" ? `"${val}"` : val}</div>
                        ))}
                    </div>
                </VizCard>
            )}

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
