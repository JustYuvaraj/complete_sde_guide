import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `vector<int> spiral(vector<vector<int>>& m) {` },
    { id: 1, text: `    vector<int> res;` },
    { id: 2, text: `    int top=0,bot=m.size()-1;` },
    { id: 3, text: `    int left=0,right=m[0].size()-1;` },
    { id: 4, text: `    while(top<=bot && left<=right){` },
    { id: 5, text: `        for(int i=left;i<=right;i++) //→` },
    { id: 6, text: `            res.push_back(m[top][i]);` },
    { id: 7, text: `        top++;` },
    { id: 8, text: `        for(int i=top;i<=bot;i++) //↓` },
    { id: 9, text: `            res.push_back(m[i][right]);` },
    { id: 10, text: `        right--;` },
    { id: 11, text: `        if(top<=bot)` },
    { id: 12, text: `            for(int i=right;i>=left;i--) //←` },
    { id: 13, text: `                res.push_back(m[bot][i]);` },
    { id: 14, text: `        bot--;` },
    { id: 15, text: `        if(left<=right)` },
    { id: 16, text: `            for(int i=bot;i>=top;i--) //↑` },
    { id: 17, text: `                res.push_back(m[i][left]);` },
    { id: 18, text: `        left++;` },
    { id: 19, text: `    }` },
    { id: 20, text: `    return res;` },
    { id: 21, text: `}` },
];

function gen(matrix) {
    const steps = [];
    const m = matrix.map(r => [...r]);
    const R = m.length, C = m[0].length;
    const res = [];
    const visited = Array.from({ length: R }, () => Array(C).fill(false));
    const push = (cl, ph, v, msg, hlCells) => steps.push({
        cl, phase: ph, vars: { ...v }, msg, hlCells: hlCells || [],
        matrix: m, visited: visited.map(r => [...r]), result: [...res]
    });

    let top = 0, bot = R - 1, left = 0, right = C - 1;
    push(2, "init", { top, bot, left, right }, "Set boundaries", []);

    while (top <= bot && left <= right) {
        // Right
        for (let i = left; i <= right; i++) {
            res.push(m[top][i]); visited[top][i] = true;
            push(6, "right", { top, bot, left, right, "→": m[top][i] },
                `→ m[${top}][${i}] = ${m[top][i]}`, [{ r: top, c: i, color: "#22c55e" }]);
        }
        top++;

        // Down
        for (let i = top; i <= bot; i++) {
            res.push(m[i][right]); visited[i][right] = true;
            push(9, "down", { top, bot, left, right, "↓": m[i][right] },
                `↓ m[${i}][${right}] = ${m[i][right]}`, [{ r: i, c: right, color: "#38bdf8" }]);
        }
        right--;

        // Left
        if (top <= bot) {
            for (let i = right; i >= left; i--) {
                res.push(m[bot][i]); visited[bot][i] = true;
                push(13, "left", { top, bot, left, right, "←": m[bot][i] },
                    `← m[${bot}][${i}] = ${m[bot][i]}`, [{ r: bot, c: i, color: "#f59e0b" }]);
            }
        }
        bot--;

        // Up
        if (left <= right) {
            for (let i = bot; i >= top; i--) {
                res.push(m[i][left]); visited[i][left] = true;
                push(17, "up", { top, bot, left, right, "↑": m[i][left] },
                    `↑ m[${i}][${left}] = ${m[i][left]}`, [{ r: i, c: left, color: "#a78bfa" }]);
            }
        }
        left++;
    }

    push(20, "done", { "total": res.length }, `✅ Spiral: [${res.join(",")}]`, []);
    return { steps, answer: res, matrix: m };
}

function MatrixGrid({ matrix, hlCells = [], visited }) {
    const { isDark } = useTheme();
    const hlMap = {};
    hlCells.forEach(h => { hlMap[`${h.r},${h.c}`] = h.color; });
    return (
        <VizCard title="🌀 Spiral Traverse">
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "center", padding: "8px 0" }}>
                {matrix.map((row, i) => (
                    <div key={i} style={{ display: "flex", gap: "3px" }}>
                        {row.map((val, j) => {
                            const c = hlMap[`${i},${j}`];
                            const vis = visited && visited[i] && visited[i][j];
                            return (
                                <div key={j} style={{
                                    width: "40px", height: "40px", borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.8rem",
                                    background: c ? `${c}20` : vis ? "#22c55e12" : (isDark ? "#1e293b" : "#f1f5f9"),
                                    border: `2px solid ${c || (vis ? "#22c55e44" : (isDark ? "#334155" : "#e2e8f0"))}`,
                                    color: c || (vis ? "#22c55e" : (isDark ? "#e2e8f0" : "#1e293b")),
                                    transition: "all 0.3s",
                                    opacity: vis && !c ? 0.5 : 1,
                                }}>{val}</div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </VizCard>
    );
}

const PC = { init: "#8b5cf6", right: "#22c55e", down: "#38bdf8", left: "#f59e0b", up: "#a78bfa", done: "#10b981" };
const PL = { init: "⚙️ INIT", right: "→ RIGHT", down: "↓ DOWN", left: "← LEFT", up: "↑ UP", done: "✅ DONE" };

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Traverse matrix in spiral order: right → down → left → up → repeat. (LC #54)

## Key Insight — Four Boundaries
Maintain four boundaries: top, bottom, left, right.
After completing each direction, shrink the corresponding boundary.

## The Four Steps per Layer
1. → Go right along top row, then top++
2. ↓ Go down along right col, then right--
3. ← Go left along bottom row, then bot--
4. ↑ Go up along left col, then left++`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Example: 3×3 matrix
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]

→ 1,2,3 | ↓ 6,9 | ← 8,7 | ↑ 4 | → 5
Result: [1,2,3,6,9,8,7,4,5] ✅

### Complexity
- **Time:** O(R × C)
- **Space:** O(1) extra`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Boundary Checks

### Why check top<=bot before left pass?
After going right and down, the top boundary moved. If top > bot, there's no bottom row to traverse.

### Same for left<=right before up pass
After right--, if left > right, no left column exists.

### Termination
    while(top<=bot && left<=right)
When boundaries cross, all cells have been visited.`
    },
];

const DEFAULT = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
export default function SpiralMatrix() {
    const [input, setInput] = useState("1,2,3;4,5,6;7,8,9");
    const [sess, setSess] = useState(() => gen(DEFAULT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 600);
    const run = () => {
        const rows = input.split(";").map(r => r.split(",").map(Number));
        if (rows.length < 1 || rows.some(r => r.some(v => isNaN(v)))) return;
        setSess(gen(rows)); setIdx(0); setPlaying(false);
    };
    const reset = () => { setInput("1,2,3;4,5,6;7,8,9"); setSess(gen(DEFAULT)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)];
    const pc = PC[step.phase] || "#8b5cf6";

    return (
        <VizLayout title="Spiral Matrix" subtitle="Boundary shrinking · O(R×C)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={input} onChange={setInput} onRun={run} onReset={reset} placeholder="1,2,3;4,5,6;7,8,9" label="Matrix (;-sep rows):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="spiralMatrix.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>
            <MatrixGrid matrix={step.matrix} hlCells={step.hlCells} visited={step.visited} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#22c55e", fontWeight: 700 }}>Result: [{sess.answer.join(",")}]</span></StepInfo>
        </VizLayout>
    );
}
