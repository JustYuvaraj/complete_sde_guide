import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `ListNode* merge(ListNode* l1, ListNode* l2) {` },
    { id: 1, text: `    if (!l1) return l2;` },
    { id: 2, text: `    if (!l2) return l1;` },
    { id: 3, text: `` },
    { id: 4, text: `    if (l1->val <= l2->val) {` },
    { id: 5, text: `        l1->next = mergeTwoLists(l2, l1->next);` },
    { id: 6, text: `        return l1;` },
    { id: 7, text: `    } else {` },
    { id: 8, text: `        l2->next = mergeTwoLists(l1, l2->next);` },
    { id: 9, text: `        return l2;` },
    { id: 10, text: `    }` },
    { id: 11, text: `}` },
];

const PHASE_COLOR = { check: "#3b82f6", compare: "#f59e0b", recurse: "#8b5cf6", base: "#10b981", ascend: "#f97316", done: "#10b981" };
const PHASE_LABELS = {
    check: "🔵 CHECK", compare: "🟡 COMPARE", recurse: "🟣 RECURSE",
    base: "🟢 BASE CASE", ascend: "🟠 UNWIND", done: "✅ DONE",
};
const NS = 46;
const NG = 60;

/* ── Dynamic step generator ── */
function generateSteps(list1, list2) {
    const steps = [];
    const merged = [];
    let i1 = 0, i2 = 0;
    const callStack = [];

    function merge(l1Idx, l2Idx) {
        callStack.push({ l1: l1Idx, l2: l2Idx });
        const cs = callStack.map(f => ({ ...f }));

        // check l1 null
        if (l1Idx >= list1.length) {
            steps.push({
                cl: 1, l1: -1, l2: l2Idx < list2.length ? l2Idx : -1, cs: cs.map(f => ({ ...f })),
                mc: [...merged], phase: "base",
                vars: { l1: "null", l2: l2Idx < list2.length ? list2[l2Idx] : "null" },
                msg: `l1 is null → BASE CASE! return l2`,
            });
            // append remaining l2
            for (let j = l2Idx; j < list2.length; j++) {
                merged.push({ val: list2[j], src: "L2" });
            }
            callStack.pop();
            return;
        }
        // check l2 null
        if (l2Idx >= list2.length) {
            steps.push({
                cl: 2, l1: l1Idx, l2: -1, cs: cs.map(f => ({ ...f })),
                mc: [...merged], phase: "base",
                vars: { l1: list1[l1Idx], l2: "null" },
                msg: `l2 is null → BASE CASE! return l1`,
            });
            // append remaining l1
            for (let j = l1Idx; j < list1.length; j++) {
                merged.push({ val: list1[j], src: "L1" });
            }
            callStack.pop();
            return;
        }

        const v1 = list1[l1Idx];
        const v2 = list2[l2Idx];

        steps.push({
            cl: 1, l1: l1Idx, l2: l2Idx, cs: cs.map(f => ({ ...f })),
            mc: [...merged], phase: "check", vars: { l1: v1, l2: v2 },
            msg: `merge(${v1},${v2}) entered → check: l1 == null? No`,
        });
        steps.push({
            cl: 2, l1: l1Idx, l2: l2Idx, cs: cs.map(f => ({ ...f })),
            mc: [...merged], phase: "check", vars: { l1: v1, l2: v2 },
            msg: `check: l2 == null? No`,
        });

        // compare
        steps.push({
            cl: 4, l1: l1Idx, l2: l2Idx, cs: cs.map(f => ({ ...f })),
            mc: [...merged], phase: "compare",
            vars: { l1: v1, l2: v2, [v1 <= v2 ? `${v1}≤${v2}` : `${v1}>${v2}`]: v1 <= v2 ? "true → take l1" : "true → take l2" },
            msg: v1 <= v2 ? `${v1} ≤ ${v2} → take l1 (${v1})` : `${v1} > ${v2} → take l2 (${v2})`,
        });

        if (v1 <= v2) {
            merged.push({ val: v1, src: "L1" });
            steps.push({
                cl: 5, l1: l1Idx + 1 < list1.length ? l1Idx + 1 : -1, l2: l2Idx,
                cs: cs.map(f => ({ ...f })), mc: [...merged], phase: "recurse",
                vars: { calling: `merge(${l1Idx + 1 < list1.length ? list1[l1Idx + 1] : "null"}, ${v2})` },
                msg: `l1->next = merge(l1->next, l2) → recursing...`,
            });
            merge(l1Idx + 1, l2Idx);
        } else {
            merged.push({ val: v2, src: "L2" });
            steps.push({
                cl: 8, l1: l1Idx, l2: l2Idx + 1 < list2.length ? l2Idx + 1 : -1,
                cs: cs.map(f => ({ ...f })), mc: [...merged], phase: "recurse",
                vars: { calling: `merge(${v1}, ${l2Idx + 1 < list2.length ? list2[l2Idx + 1] : "null"})` },
                msg: `l2->next = merge(l1, l2->next) → recursing...`,
            });
            merge(l1Idx, l2Idx + 1);
        }

        callStack.pop();
    }

    merge(0, 0);

    const mergedStr = merged.map(m => m.val).join("→");
    steps.push({
        cl: -1, l1: -1, l2: -1, cs: [], mc: [...merged], phase: "done", vars: {},
        msg: `✅ Done! Fully merged: ${mergedStr}`,
    });

    return { steps, merged, list1, list2 };
}

const DEFAULT_L1 = [1, 3, 5];
const DEFAULT_L2 = [2, 4, 6];

const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Merge two **sorted** linked lists into one sorted list. This is the fundamental building block of merge sort.

## Key Insight
Compare heads of both lists. The smaller head becomes the next node. Recurse on the remaining.

## Mental Model
1. Compare l1->val and l2->val
2. Take the smaller one as current node
3. Its next = merge(remaining of both lists)
4. Base case: if either list is null, return the other`
    },
    {
        icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
        content: `## Execution Trace
1. merge(1,2): 1 ≤ 2 → take 1, next = merge(3,2)
2. merge(3,2): 3 > 2 → take 2, next = merge(3,4)
3. merge(3,4): 3 ≤ 4 → take 3, next = merge(5,4)
4. Continue until one list is null
5. Unwind: build the merged list as recursion returns

## Why Recursion?
Each recursive call handles one comparison and one node. The call stack naturally builds the result during unwinding.`
    },
    {
        icon: "💡", title: "Code & Complexity", color: "#10b981",
        content: `## Algorithm
\`\`\`
merge(l1, l2):
  if !l1: return l2
  if !l2: return l1
  if l1->val <= l2->val:
    l1->next = merge(l1->next, l2)
    return l1
  else:
    l2->next = merge(l1, l2->next)
    return l2
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(m + n)** — visit each node once |
| Space | **O(m + n)** — recursion stack |`
    }
];

export default function MergeSortedLists() {
    const { theme, isDark } = useTheme();
    const [inputL1, setInputL1] = useState(DEFAULT_L1.join(","));
    const [inputL2, setInputL2] = useState(DEFAULT_L2.join(","));
    const [data, setData] = useState(() => generateSteps(DEFAULT_L1, DEFAULT_L2));
    const { idx, setIdx, playing, setPlaying } = usePlayer(data.steps.length, 1700);
    const step = data.steps[idx];
    const pc = PHASE_COLOR[step.phase];
    const L1 = data.list1;
    const L2 = data.list2;

    function handleRun() {
        const l1 = inputL1.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const l2 = inputL2.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (l1.length < 1 || l2.length < 1 || l1.length + l2.length > 10) return;
        setData(generateSteps(l1, l2));
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputL1(DEFAULT_L1.join(","));
        setInputL2(DEFAULT_L2.join(","));
        setData(generateSteps(DEFAULT_L1, DEFAULT_L2));
        setIdx(0);
        setPlaying(false);
    }

    return (
        <VizLayout
            title="Merge Two Sorted Lists — Code ↔ Visual Sync"
            subtitle={`L1: ${L1.join("→")} · L2: ${L2.join("→")} · Recursive approach`}
        >
            <ExplainPanel sections={EXPLAIN} />
            {/* Two separate inputs for L1 and L2 */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "920px" }}>
                <span style={{ fontSize: "0.62rem", color: theme.textMuted, whiteSpace: "nowrap" }}>L1:</span>
                <input value={inputL1} onChange={e => setInputL1(e.target.value)}
                    placeholder="1,3,5"
                    style={{
                        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "6px", color: theme.text, fontFamily: "'Fira Code',monospace",
                        fontSize: "0.68rem", padding: "4px 8px", width: "100px", outline: "none",
                    }} />
                <span style={{ fontSize: "0.62rem", color: theme.textMuted, whiteSpace: "nowrap" }}>L2:</span>
                <input value={inputL2} onChange={e => setInputL2(e.target.value)}
                    placeholder="2,4,6"
                    style={{
                        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                        borderRadius: "6px", color: theme.text, fontFamily: "'Fira Code',monospace",
                        fontSize: "0.68rem", padding: "4px 8px", width: "100px", outline: "none",
                    }} />
                <button onClick={handleRun} style={{
                    background: "#3730a3", color: "#c7d2fe", border: "1px solid #4f46e5",
                    borderRadius: "6px", padding: "4px 12px", fontSize: "0.68rem",
                    fontFamily: "'Fira Code',monospace", fontWeight: "700", cursor: "pointer",
                }}>▶ Run</button>
                <button onClick={handleReset} style={{
                    background: theme.cardBg, color: theme.textMuted, border: `1px solid ${theme.cardBorder}`,
                    borderRadius: "6px", padding: "4px 10px", fontSize: "0.68rem",
                    fontFamily: "'Fira Code',monospace", cursor: "pointer",
                }}>↺ Reset</button>
            </div>

            <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "900px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="merge_sorted.cpp" />
                <div style={{ flex: "1 1 210px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <VariablesPanel vars={step.vars} title="🔍 Variables (current frame)" />
                    <CallStackPanel
                        frames={step.cs}
                        renderFrame={(f) => {
                            const l1v = f.l1 === -1 || f.l1 >= L1.length ? "null" : L1[f.l1];
                            const l2v = f.l2 === -1 || f.l2 >= L2.length ? "null" : L2[f.l2];
                            return `merge(${l1v}, ${l2v})`;
                        }}
                        emptyText="empty — all calls returned"
                    />
                </div>
            </div>

            <VizCard title="Memory Visualization" maxWidth="900px">
                <svg width="100%" viewBox={`0 0 ${Math.max(560, 36 + Math.max(L1.length, L2.length) * (NS + NG))} 260`} style={{ overflow: "visible" }}>
                    <defs>
                        <marker id="ma" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill={isDark ? "#374151" : "#94a3b8"} />
                        </marker>
                        <marker id="ml1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill="#60a5fa" />
                        </marker>
                        <marker id="ml2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill="#f472b6" />
                        </marker>
                        <marker id="mm" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill="#a3e635" />
                        </marker>
                    </defs>

                    {/* L1 row */}
                    <text x="0" y="30" fontSize="11" fill="#60a5fa" fontWeight="700">L1</text>
                    {L1.map((val, i) => {
                        const x = 36 + i * (NS + NG);
                        const y = 8;
                        const isActive = i === step.l1;
                        const isPast = step.l1 !== -1 && i < step.l1;
                        const bg = isActive ? "#1d4ed8" : isPast ? "#1e3a5f" : (isDark ? "#1e293b" : "#cbd5e1");
                        const textC = isActive ? "#fff" : isPast ? "#93c5fd" : (isDark ? "#64748b" : "#475569");
                        return (
                            <g key={i}>
                                {i < L1.length - 1 && (
                                    <line x1={x + NS + 4} y1={y + NS / 2} x2={x + NS + NG - 4} y2={y + NS / 2}
                                        stroke={isActive ? "#60a5fa" : (isDark ? "#1f2937" : "#cbd5e1")} strokeWidth="2" markerEnd={isActive ? "url(#ml1)" : "url(#ma)"} />
                                )}
                                {isActive && <rect x={x - 4} y={y - 4} width={NS + 8} height={NS + 8} rx="10" fill="#1d4ed844" style={{ filter: "blur(8px)" }} />}
                                <rect x={x} y={y} width={NS} height={NS} rx="7"
                                    fill={bg} stroke={isActive ? "#60a5fa" : (isDark ? "#1f2937" : "#94a3b8")} strokeWidth={isActive ? 2.5 : 1.5}
                                    style={{ transition: "fill 0.3s" }} />
                                <text x={x + NS / 2} y={y + NS / 2 + 7} textAnchor="middle" fontSize="18" fontWeight="700" fill={textC}>{val}</text>
                                {i === L1.length - 1 && (
                                    <text x={x + NS + NG / 2} y={y + NS / 2 + 5} textAnchor="middle" fontSize="10" fill={isDark ? "#374151" : "#94a3b8"}>NULL</text>
                                )}
                                {isActive && (
                                    <>
                                        <line x1={x + NS / 2} y1={y + NS + 4} x2={x + NS / 2} y2={y + NS + 18} stroke="#60a5fa" strokeWidth="2" />
                                        <text x={x + NS / 2} y={y + NS + 30} textAnchor="middle" fontSize="9" fill="#60a5fa" fontWeight="700">l1</text>
                                    </>
                                )}
                                {step.l1 === -1 && i === L1.length - 1 && (
                                    <text x={x + NS + NG / 2 + 10} y={y + NS / 2 + 5} textAnchor="middle" fontSize="9" fill="#60a5fa" fontWeight="700">← l1=null</text>
                                )}
                            </g>
                        );
                    })}

                    {/* L2 row */}
                    <text x="0" y="125" fontSize="11" fill="#f472b6" fontWeight="700">L2</text>
                    {L2.map((val, i) => {
                        const x = 36 + i * (NS + NG);
                        const y = 102;
                        const isActive = i === step.l2;
                        const isPast = step.l2 !== -1 && i < step.l2;
                        const bg = isActive ? "#9d174d" : isPast ? "#4c1d3a" : (isDark ? "#1e293b" : "#cbd5e1");
                        const textC = isActive ? "#fff" : isPast ? "#f9a8d4" : (isDark ? "#64748b" : "#475569");
                        return (
                            <g key={i}>
                                {i < L2.length - 1 && (
                                    <line x1={x + NS + 4} y1={y + NS / 2} x2={x + NS + NG - 4} y2={y + NS / 2}
                                        stroke={isActive ? "#f472b6" : (isDark ? "#1f2937" : "#cbd5e1")} strokeWidth="2" markerEnd={isActive ? "url(#ml2)" : "url(#ma)"} />
                                )}
                                {isActive && <rect x={x - 4} y={y - 4} width={NS + 8} height={NS + 8} rx="10" fill="#9d174d44" style={{ filter: "blur(8px)" }} />}
                                <rect x={x} y={y} width={NS} height={NS} rx="7"
                                    fill={bg} stroke={isActive ? "#f472b6" : (isDark ? "#1f2937" : "#94a3b8")} strokeWidth={isActive ? 2.5 : 1.5}
                                    style={{ transition: "fill 0.3s" }} />
                                <text x={x + NS / 2} y={y + NS / 2 + 7} textAnchor="middle" fontSize="18" fontWeight="700" fill={textC}>{val}</text>
                                {i === L2.length - 1 && (
                                    <text x={x + NS + NG / 2} y={y + NS / 2 + 5} textAnchor="middle" fontSize="10" fill={isDark ? "#374151" : "#94a3b8"}>NULL</text>
                                )}
                                {isActive && (
                                    <>
                                        <line x1={x + NS / 2} y1={y + NS + 4} x2={x + NS / 2} y2={y + NS + 18} stroke="#f472b6" strokeWidth="2" />
                                        <text x={x + NS / 2} y={y + NS + 30} textAnchor="middle" fontSize="9" fill="#f472b6" fontWeight="700">l2</text>
                                    </>
                                )}
                                {step.l2 === -1 && i === L2.length - 1 && (
                                    <text x={x + NS + NG / 2 + 10} y={y + NS / 2 + 5} textAnchor="middle" fontSize="9" fill="#f472b6" fontWeight="700">← l2=null</text>
                                )}
                            </g>
                        );
                    })}

                    {/* Compare bracket */}
                    {step.l1 >= 0 && step.l2 >= 0 && step.phase === "compare" && (
                        <g>
                            <line x1={36 + step.l1 * (NS + NG) + NS / 2} y1={54} x2={36 + step.l2 * (NS + NG) + NS / 2} y2={100}
                                stroke={PHASE_COLOR.compare} strokeWidth="2" strokeDasharray="4 3" />
                            <text x={(36 + step.l1 * (NS + NG) + NS / 2 + 36 + step.l2 * (NS + NG) + NS / 2) / 2 + 8}
                                y={78} fontSize="10" fill={PHASE_COLOR.compare} fontWeight="700">compare</text>
                        </g>
                    )}

                    {/* Merged row */}
                    <text x="0" y="215" fontSize="11" fill="#a3e635" fontWeight="700">Merged</text>
                    {step.mc.length === 0
                        ? <text x="36" y="237" fontSize="11" fill={isDark ? "#374151" : "#94a3b8"} fontStyle="italic">— building during unwind —</text>
                        : step.mc.map((node, i) => {
                            const MNS = 38;
                            const MNG = 48;
                            const x = 36 + i * (MNS + MNG);
                            const y = 200;
                            const isL1 = node.src === "L1";
                            const bg = isL1 ? "#1e3a8a" : "#4a1942";
                            const border = isL1 ? "#60a5fa" : "#f472b6";
                            return (
                                <g key={i}>
                                    {i < step.mc.length - 1 && (
                                        <line x1={x + MNS + 4} y1={y + MNS / 2} x2={x + MNS + MNG - 4} y2={y + MNS / 2}
                                            stroke="#a3e635" strokeWidth="2" markerEnd="url(#mm)" />
                                    )}
                                    <rect x={x} y={y} width={MNS} height={MNS} rx="6" fill={bg} stroke={border} strokeWidth="1.5" />
                                    <text x={x + MNS / 2} y={y + MNS / 2 + 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="white">{node.val}</text>
                                    <text x={x + MNS / 2} y={y + MNS + 14} textAnchor="middle" fontSize="8" fill={border}>{node.src}</text>
                                    {i === step.mc.length - 1 && (
                                        <text x={x + MNS + MNG / 2} y={y + MNS / 2 + 5} textAnchor="middle" fontSize="9" fill={isDark ? "#374151" : "#94a3b8"}>NULL</text>
                                    )}
                                </g>
                            );
                        })
                    }
                </svg>
            </VizCard>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase]} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={data.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

            <StepInfo idx={idx} total={data.steps.length}>
                <span style={{ color: "#60a5fa" }}>■</span> L1 active &nbsp;
                <span style={{ color: "#f472b6" }}>■</span> L2 active &nbsp;
                <span style={{ color: "#a3e635" }}>■→</span> merged chain
            </StepInfo>
        </VizLayout>
    );
}
