import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `int climb(int n) {` },
    { id: 1, text: `    if (n == 0) return 1; // base: 1 way` },
    { id: 2, text: `    if (n < 0)  return 0; // base: invalid` },
    { id: 3, text: `` },
    { id: 4, text: `    int left  = climb(n - 1);` },
    { id: 5, text: `    int right = climb(n - 2);` },
    { id: 6, text: `` },
    { id: 7, text: `    return left + right;` },
    { id: 8, text: `}` },
];

const PHASE_COLOR = {
    check: "#3b82f6", recurse: "#8b5cf6", base: "#10b981", return: "#f59e0b", done: "#10b981",
};
const PHASE_LABELS = {
    check: "🔵 CHECK", recurse: "🟣 RECURSE", base: "🟢 BASE CASE", return: "🟡 RETURN", done: "✅ DONE",
};

/* ── Dynamic step + tree generator ── */
function generateAll(N) {
    const steps = [];
    const treeNodes = [];
    const treeEdges = [];
    let nodeCounter = 0;
    let leafX = 0;
    const posMap = {};
    const resolvedVals = {};

    // Build tree structure via DFS
    function buildNode(n, depth, parentId) {
        const id = `n${nodeCounter++}`;
        treeNodes.push({ id, n, depth });
        if (parentId !== null) treeEdges.push({ p: parentId, c: id });

        if (n <= 0) {
            posMap[id] = { leafX: leafX++, depth };
            return id;
        }
        buildNode(n - 1, depth + 1, id);
        buildNode(n - 2, depth + 1, id);
        return id;
    }
    buildNode(N, 0, null);

    // Compute positions
    const totalLeaves = leafX;
    const maxDepth = Math.max(...treeNodes.map(nd => posMap[nd.id]?.depth ?? 0));

    function getLeafCentroid(nodeId) {
        if (posMap[nodeId]) return posMap[nodeId].leafX;
        const children = treeEdges.filter(e => e.p === nodeId).map(e => e.c);
        const cx = children.map(c => getLeafCentroid(c));
        const avg = cx.reduce((a, b) => a + b, 0) / cx.length;
        return avg;
    }

    treeNodes.forEach(nd => {
        const d = posMap[nd.id]?.depth ?? treeEdges.filter(e => e.c === nd.id).length === 0 ? 0 : null;
        // compute depth by traversal
        let depth = 0;
        let cur = nd.id;
        while (true) {
            const edge = treeEdges.find(e => e.c === cur);
            if (!edge) break;
            cur = edge.p;
            depth++;
        }
        const rawX = getLeafCentroid(nd.id);
        const TW = 560, nodeW = 76;
        nd.x = totalLeaves <= 1 ? TW / 2 - nodeW / 2 : 10 + (rawX / Math.max(1, totalLeaves - 1)) * (TW - nodeW - 20);
        nd.y = maxDepth === 0 ? 20 : 6 + (depth / Math.max(1, maxDepth)) * 180;
        nd.depth = depth;
        nd.label = `climb(${nd.n})`;
    });

    const TH = (maxDepth + 1) * 42 + 20;

    // DFS to generate steps
    const revealedNodes = new Set();
    function dfs(nodeId) {
        const nd = treeNodes.find(t => t.id === nodeId);
        const n = nd.n;
        revealedNodes.add(nodeId);

        const childEdges = treeEdges.filter(e => e.p === nodeId);
        const cs = [];
        // build call stack by walking up the tree
        let cur = nodeId;
        while (cur) {
            const cnd = treeNodes.find(t => t.id === cur);
            cs.unshift(cnd.n);
            const parentEdge = treeEdges.find(e => e.c === cur);
            cur = parentEdge ? parentEdge.p : null;
        }

        steps.push({
            cl: 0, an: nodeId, rn: [...revealedNodes], cs: [...cs],
            vars: { n }, msg: `climb(${n}) called`, phase: "check", stairN: n,
        });

        if (n === 0) {
            steps.push({
                cl: 1, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                vars: { n: 0, "n==0": "true ✓" }, msg: `climb(0): n==0 → BASE CASE! return 1`,
                phase: "base", stairN: 0,
            });
            resolvedVals[nodeId] = 1;
            steps.push({
                cl: 1, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                vars: { returning: 1 }, msg: `return 1 ↑`,
                phase: "return", stairN: 0, rv: { id: nodeId, v: 1 },
            });
            return 1;
        }
        if (n < 0) {
            steps.push({
                cl: 2, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                vars: { n, "n<0": "true ✓" }, msg: `climb(${n}): n<0 → BASE CASE! return 0`,
                phase: "base", stairN: n,
            });
            resolvedVals[nodeId] = 0;
            steps.push({
                cl: 2, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                vars: { returning: 0 }, msg: `return 0 ↑`,
                phase: "return", stairN: n, rv: { id: nodeId, v: 0 },
            });
            return 0;
        }

        // Check base cases
        steps.push({
            cl: 1, an: nodeId, rn: [...revealedNodes], cs: [...cs],
            vars: { n, "n==0": "false" }, msg: `n=${n}, not 0 → not base case`,
            phase: "check", stairN: n,
        });
        steps.push({
            cl: 2, an: nodeId, rn: [...revealedNodes], cs: [...cs],
            vars: { n, "n<0": "false" }, msg: `n=${n}, not negative → not base case`,
            phase: "check", stairN: n,
        });

        // Recurse left
        const leftChild = childEdges[0]?.c;
        if (leftChild) {
            revealedNodes.add(leftChild);
            steps.push({
                cl: 4, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                vars: { n, calling: `climb(${n - 1})` }, msg: `left = climb(n-1) → call climb(${n - 1})`,
                phase: "recurse", stairN: n - 1,
            });
            const leftVal = dfs(leftChild);

            // Recurse right
            const rightChild = childEdges[1]?.c;
            if (rightChild) {
                revealedNodes.add(rightChild);
                steps.push({
                    cl: 5, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                    vars: { n, [`left=${leftVal}`]: `climb(${n - 2})?` },
                    msg: `left=${leftVal}. Now right = climb(${n - 2})`,
                    phase: "recurse", stairN: n - 2,
                });
                const rightVal = dfs(rightChild);

                const total = leftVal + rightVal;
                resolvedVals[nodeId] = total;
                steps.push({
                    cl: 7, an: nodeId, rn: [...revealedNodes], cs: [...cs],
                    vars: { left: leftVal, right: rightVal, "return": `${leftVal}+${rightVal}=${total}` },
                    msg: `climb(${n}) = ${leftVal}+${rightVal} = ${total}`,
                    phase: "return", stairN: n, rv: { id: nodeId, v: total },
                });
                return total;
            }
        }
        return 0;
    }

    const answer = dfs(treeNodes[0].id);

    steps.push({
        cl: -1, an: null, rn: [...revealedNodes], cs: [],
        vars: {}, msg: `✅ There are ${answer} distinct ways to climb ${N} stairs!`,
        phase: "done", stairN: N,
    });

    // Build resolved maps per step
    const resolvedMaps = [];
    const cur = {};
    for (const s of steps) {
        if (s.rv) cur[s.rv.id] = s.rv.v;
        resolvedMaps.push({ ...cur });
    }

    return { steps, treeNodes, treeEdges, resolvedMaps, TH, N: N };
}

const DEFAULT_N = 5;

export default function ClimbingStairs() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(String(DEFAULT_N));
    const [data, setData] = useState(() => generateAll(DEFAULT_N));
    const { idx, setIdx, playing, setPlaying } = usePlayer(data.steps.length, 1600);
    const step = data.steps[idx];
    const resolved = data.resolvedMaps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";
    const revealedSet = new Set(step.rn);
    const stairs = Array.from({ length: data.N }, (_, i) => i + 1);

    function handleRun() {
        const n = parseInt(inputText);
        if (isNaN(n) || n < 1 || n > 8) return;
        setData(generateAll(n));
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(String(DEFAULT_N));
        setData(generateAll(DEFAULT_N));
        setIdx(0);
        setPlaying(false);
    }

    return (
        <VizLayout
            title="Climbing Stairs — Code ↔ Visual Sync"
            subtitle={`n = ${data.N} stairs · Take 1 or 2 steps at a time · How many ways?`}
        >
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="e.g. 5"
                label="n (stairs):"
            />

            <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="climbing_stairs.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel
                        frames={step.cs}
                        renderFrame={(n) => `climb(${n})`}
                    />
                    {/* Staircase visual */}
                    <div style={{
                        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "14px", overflow: "hidden",
                    }}>
                        <div style={{
                            background: theme.cardHeaderBg, padding: "9px 16px",
                            fontSize: "0.68rem", color: theme.textMuted,
                            borderBottom: `1px solid ${theme.cardHeaderBorder}`,
                        }}>
                            🪜 Staircase (n={data.N})
                        </div>
                        <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "flex-end", gap: "4px", justifyContent: "center" }}>
                            {stairs.map(s => {
                                const active = step.stairN === s;
                                const done = step.phase === "done";
                                return (
                                    <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                                        <div style={{
                                            width: "30px", height: `${s * 10}px`,
                                            background: done ? "#d97706" : active ? pc : s < (step.stairN || 0) ? "#1e3a8a" : (isDark ? "#1e293b" : "#cbd5e1"),
                                            border: `1px solid ${done ? "#f59e0b" : active ? pc : (isDark ? "#1f2937" : "#94a3b8")}`,
                                            borderRadius: "3px 3px 0 0", transition: "all 0.3s",
                                            display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "3px",
                                        }}>
                                            <span style={{ fontSize: "9px", color: active || done ? "#fff" : theme.textMuted, fontWeight: "700" }}>{s}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{ width: "30px", textAlign: "center" }}>
                                <div style={{
                                    width: "30px", height: "10px",
                                    background: step.phase === "done" ? "#10b981" : "#0f4c31",
                                    border: "1px solid #065f46", borderRadius: "3px 3px 0 0",
                                }} />
                                <div style={{ fontSize: "8px", color: "#10b981", marginTop: "2px" }}>🏁</div>
                            </div>
                        </div>
                        <div style={{ textAlign: "center", fontSize: "0.68rem", color: theme.textMuted, paddingBottom: "8px" }}>
                            currently at step: <span style={{ color: pc, fontWeight: "700" }}>{step.stairN >= 0 ? step.stairN : "−"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recursion Tree */}
            <VizCard title="🌳 Recursion Tree (reveals as calls are made)" maxWidth="920px">
                <svg width="100%" viewBox={`0 0 560 ${data.TH}`} style={{ overflow: "visible" }}>
                    {data.treeEdges.map((e, i) => {
                        const p = data.treeNodes.find(n => n.id === e.p);
                        const c = data.treeNodes.find(n => n.id === e.c);
                        if (!revealedSet.has(e.p) || !revealedSet.has(e.c)) return null;
                        return (
                            <line key={i}
                                x1={p.x + 38} y1={p.y + 13}
                                x2={c.x + 38} y2={c.y}
                                stroke={isDark ? "#1f2937" : "#cbd5e1"} strokeWidth="1.5"
                            />
                        );
                    })}
                    {data.treeNodes.filter(n => revealedSet.has(n.id)).map(nd => {
                        const isActive = step.an === nd.id;
                        const res = resolved[nd.id];
                        const isNeg = nd.n < 0;
                        const bg = isActive ? pc
                            : res !== undefined ? (isNeg ? (isDark ? "#1f2937" : "#e2e8f0") : "#1a3a1a")
                                : (isDark ? "#111827" : "#e2e8f0");
                        const border = isActive ? pc
                            : res !== undefined ? (isNeg ? (isDark ? "#374151" : "#94a3b8") : "#16a34a")
                                : (isDark ? "#1f2937" : "#cbd5e1");

                        return (
                            <g key={nd.id}>
                                {isActive && (
                                    <rect x={nd.x - 3} y={nd.y - 3} width={80} height={22} rx="6"
                                        fill={`${pc}33`} style={{ filter: "blur(6px)" }} />
                                )}
                                <rect x={nd.x} y={nd.y} width={76} height={18} rx="4"
                                    fill={bg} stroke={border} strokeWidth={isActive ? 2 : 1}
                                    style={{ transition: "fill 0.3s, stroke 0.3s" }} />
                                <text x={nd.x + 38} y={nd.y + 13} textAnchor="middle"
                                    fontSize="8.5" fontWeight={isActive ? "800" : "500"}
                                    fill={isActive ? "#fff" : res !== undefined ? "#86efac" : theme.textMuted}>
                                    {nd.label}{res !== undefined ? ` = ${res}` : ""}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </VizCard>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={data.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

            <StepInfo idx={idx} total={data.steps.length}>
                <span style={{ color: "#3b82f6" }}>■</span> checking &nbsp;
                <span style={{ color: "#8b5cf6" }}>■</span> recursing &nbsp;
                <span style={{ color: "#10b981" }}>■</span> base case &nbsp;
                <span style={{ color: "#f59e0b" }}>■</span> returning &nbsp;
                <span style={{ color: "#86efac" }}>■</span> resolved node
            </StepInfo>
        </VizLayout>
    );
}
