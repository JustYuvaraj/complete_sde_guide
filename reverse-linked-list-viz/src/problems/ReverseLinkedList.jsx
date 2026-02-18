import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
  CodePanel, VariablesPanel, CallStackPanel,
  MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, ExplainPanel,
} from "../shared/Components";

const DEFAULT_LIST = [1, 2, 3, 4, 5];

const CODE = [
  { id: 0, text: `Node* reverse(Node* node) {` },
  { id: 1, text: `  if (node->next == nullptr)  // base case` },
  { id: 2, text: `    return node;              // this is new HEAD` },
  { id: 3, text: `` },
  { id: 4, text: `  Node* newHead = reverse(node->next);` },
  { id: 5, text: `` },
  { id: 6, text: `  node->next->next = node;` },
  { id: 7, text: `  node->next = nullptr;` },
  { id: 8, text: `  return newHead;` },
  { id: 9, text: `}` },
];

const PHASE_LABELS = {
  descend: "⬇ DESCEND", base: "🔵 BASE CASE", ascend: "⬆ ASCEND", done: "✅ DONE",
};

function generateSteps(list) {
  const steps = [];
  const fwdArrows = (upTo) =>
    Array.from({ length: upTo }, (_, i) => ({ from: i, to: i + 1, type: "forward" }));
  const revArrows = (from, to) =>
    Array.from({ length: from - to }, (_, i) => ({ from: from - i, to: from - i - 1, type: "reverse" }));

  // Descend phase
  for (let d = 0; d < list.length; d++) {
    const isBase = d === list.length - 1;
    if (!isBase) {
      steps.push({
        codeLine: 1, activeNode: d,
        callStack: list.slice(0, d + 1).map((v, i) => ({ val: v, line: i === d ? 1 : 4 })),
        arrows: fwdArrows(list.length - 1), newHead: null, reversedFrom: -1,
        vars: { node: list[d], "node->next": list[d + 1] },
        msg: `reverse(${list[d]}) → check: node->next is ${list[d + 1]}, not null → recurse`,
        phase: "descend",
      });
      steps.push({
        codeLine: 4, activeNode: d,
        callStack: list.slice(0, d + 1).map((v) => ({ val: v, line: 4 })),
        arrows: fwdArrows(list.length - 1), newHead: null, reversedFrom: -1,
        vars: { node: list[d], calling: `reverse(${list[d + 1]})` },
        msg: `Calling reverse(${list[d + 1]}) — going deeper...`,
        phase: "descend",
      });
    } else {
      steps.push({
        codeLine: 1, activeNode: d,
        callStack: list.slice(0, d + 1).map((v) => ({ val: v, line: 4 })),
        arrows: fwdArrows(list.length - 1), newHead: d, reversedFrom: -1,
        vars: { node: list[d], "node->next": "nullptr ✓" },
        msg: `reverse(${list[d]}) → node->next is nullptr! BASE CASE!`,
        phase: "base",
      });
      steps.push({
        codeLine: 2, activeNode: d,
        callStack: list.slice(0, d + 1).map((v) => ({ val: v, line: 4 })),
        arrows: fwdArrows(list.length - 1), newHead: d, reversedFrom: -1,
        vars: { returning: `node (${list[d]}) as new HEAD` },
        msg: `return node (${list[d]}) ← this is the new HEAD!`,
        phase: "base",
      });
    }
  }

  // Ascend phase
  for (let d = list.length - 2; d >= 0; d--) {
    const nextVal = list[d + 1];
    const curVal = list[d];
    const revFrom = list.length - 1;

    steps.push({
      codeLine: 6, activeNode: d,
      callStack: list.slice(0, d + 1).map((v, i) => ({ val: v, line: i === d ? 6 : 8 })),
      arrows: [
        ...fwdArrows(d === list.length - 2 ? 0 : d + 0),
        ...revArrows(revFrom, d + 1),
        { from: d + 1, to: d, type: "reverse" },
        ...(d > 0 ? fwdArrows(d).slice(0, d) : []),
      ],
      newHead: list.length - 1, reversedFrom: d,
      vars: { node: curVal, "node->next": nextVal, "node->next->next = node": `${nextVal}->next = ${curVal} ✓` },
      msg: `node->next->next = node → node[${nextVal}].next = node[${curVal}] (link reversed!)`,
      phase: "ascend",
    });

    steps.push({
      codeLine: 7, activeNode: d,
      callStack: list.slice(0, d + 1).map((v, i) => ({ val: v, line: i === d ? 7 : 8 })),
      arrows: [...(d > 0 ? fwdArrows(d) : []), ...revArrows(revFrom, d)],
      newHead: list.length - 1, reversedFrom: d,
      vars: { node: curVal, "node->next = nullptr": `${curVal}->next = nullptr ✓` },
      msg: `node->next = nullptr → node[${curVal}].next = null (old link cut!)`,
      phase: "ascend",
    });

    steps.push({
      codeLine: 8, activeNode: d,
      callStack: list.slice(0, d + 1).map((v, i) => ({ val: v, line: i === d ? 8 : 8 })),
      arrows: [...(d > 0 ? fwdArrows(d) : []), ...revArrows(revFrom, d)],
      newHead: list.length - 1, reversedFrom: d,
      vars: { returning: `newHead (${list[list.length - 1]}) up to caller` },
      msg: `return newHead (${list[list.length - 1]}) — pass the new head up`,
      phase: "ascend",
    });
  }

  steps.push({
    codeLine: -1, activeNode: -1, callStack: [],
    arrows: revArrows(list.length - 1, 0),
    newHead: list.length - 1, reversedFrom: 0, vars: {},
    msg: `✅ Done! List is fully reversed: ${[...list].reverse().join(" → ")}`,
    phase: "done",
  });

  return steps;
}

const NODE_SIZE = 52;
const GAP = 72;

function getNodeColor(i, step, isDark) {
  if (step.phase === "done") return "#d97706";
  if (i === step.activeNode) return step.phase === "ascend" ? "#7c3aed" : "#2563eb";
  if (step.reversedFrom >= 0 && i >= step.reversedFrom) return "#b45309";
  if (i === step.newHead) return "#059669";
  return isDark ? "#1e293b" : "#cbd5e1";
}

const EXPLAIN = [
  {
    icon: "🤔", title: "How to Think", color: "#8b5cf6",
    content: `## The Problem
Reverse a singly linked list. 1→2→3→4→5 becomes 5→4→3→2→1.

## Key Insight (Recursive)
Recurse to the **last node** (new head). On the way back (unwinding), reverse each pointer: node->next->next = node, then cut the old forward pointer.

## Mental Model
1. **Descend** to the tail (base case: node->next == null)
2. The tail is the new HEAD
3. **Ascend** back, at each level: flip the pointer and cut the old one
4. Pass newHead all the way up`
  },
  {
    icon: "🔍", title: "Step Walkthrough", color: "#f59e0b",
    content: `## Execution Trace (for [1,2,3,4,5])
1. reverse(1) → reverse(2) → reverse(3) → reverse(4) → reverse(5)
2. 5 has no next → BASE CASE, newHead = 5
3. Back at 4: 4->next->next = 4 → 5→4, then 4->next = null
4. Back at 3: 3->next->next = 3 → 4→3, then 3->next = null
5. Continue unwinding until fully reversed

## The Two Key Lines
- \`node->next->next = node\` → reverses the arrow
- \`node->next = null\` → cuts the old forward link`
  },
  {
    icon: "💡", title: "Code & Complexity", color: "#10b981",
    content: `## Algorithm
\`\`\`
reverse(node):
  if node->next == null: return node  // new head
  newHead = reverse(node->next)
  node->next->next = node  // reverse link
  node->next = null         // cut old link
  return newHead
\`\`\`

## Complexity
| Metric | Value |
|---|---|
| Time | **O(n)** — visit each node once |
| Space | **O(n)** — recursion stack |`
  }
];

export default function ReverseLinkedList() {
  const { theme, isDark } = useTheme();
  const [inputText, setInputText] = useState(DEFAULT_LIST.join(","));
  const [list, setList] = useState(DEFAULT_LIST);
  const [steps, setSteps] = useState(() => generateSteps(DEFAULT_LIST));
  const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1800);
  const step = steps[idx];
  const totalW = list.length * (NODE_SIZE + GAP) - GAP;
  const pc = step.phase === "descend" ? "#3b82f6" : step.phase === "base" ? "#10b981" : step.phase === "ascend" ? "#f59e0b" : "#10b981";

  function handleRun() {
    const nums = inputText.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2 || nums.length > 8) return;
    setList(nums);
    setSteps(generateSteps(nums));
    setIdx(0);
    setPlaying(false);
  }
  function handleReset() {
    setInputText(DEFAULT_LIST.join(","));
    setList(DEFAULT_LIST);
    setSteps(generateSteps(DEFAULT_LIST));
    setIdx(0);
    setPlaying(false);
  }

  return (
    <VizLayout
      title="Reverse Linked List — Code ↔ Visual Sync"
      subtitle="Watch the exact line of code execute while the list transforms"
    >
      <ExplainPanel sections={EXPLAIN} />
      <InputSection
        value={inputText}
        onChange={setInputText}
        onRun={handleRun}
        onReset={handleReset}
        placeholder="1,2,3,4,5"
        label="List values:"
      />

      <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "860px", flexWrap: "wrap" }}>
        <CodePanel code={CODE} activeLineId={step.codeLine} accentColor={pc} fileName="reverse.cpp" />
        <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <VariablesPanel vars={step.vars} title="🔍 Variables (current frame)" />
          <CallStackPanel
            frames={step.callStack}
            renderFrame={(f) => `reverse(${f.val})`}
            emptyText="empty"
          />
        </div>
      </div>

      <VizCard title="Memory / Linked List" maxWidth="860px">
        <svg width="100%" viewBox={`-10 0 ${totalW + 100} 170`} style={{ overflow: "visible" }}>
          <defs>
            <marker id="fwd" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#475569" />
            </marker>
            <marker id="rev" markerWidth="7" markerHeight="7" refX="2" refY="3" orient="auto-start-reverse">
              <path d="M0,3 L7,0 L7,6 z" fill="#f59e0b" />
            </marker>
          </defs>
          {step.arrows.map((a, i) => {
            if (a.type === "forward") {
              const x1 = a.from * (NODE_SIZE + GAP) + NODE_SIZE;
              const x2 = a.to * (NODE_SIZE + GAP);
              return (
                <line key={`f${i}`} x1={x1 + 4} y1={NODE_SIZE / 2} x2={x2 - 4} y2={NODE_SIZE / 2}
                  stroke={isDark ? "#374151" : "#94a3b8"} strokeWidth="2" markerEnd="url(#fwd)" />
              );
            } else {
              const fromX = a.from * (NODE_SIZE + GAP) + NODE_SIZE / 2;
              const toX = a.to * (NODE_SIZE + GAP) + NODE_SIZE / 2;
              const arc = `M ${fromX} ${NODE_SIZE / 2 + 20} Q ${(fromX + toX) / 2} ${NODE_SIZE / 2 + 80} ${toX} ${NODE_SIZE / 2 + 20}`;
              return (
                <path key={`r${i}`} d={arc} fill="none"
                  stroke="#f59e0b" strokeWidth="2.5" markerStart="url(#rev)"
                  style={{ filter: "drop-shadow(0 0 5px #f59e0b66)" }} />
              );
            }
          })}
          <text x={totalW + 14} y={NODE_SIZE / 2 + 5} fontSize="11" fill={isDark ? "#374151" : "#94a3b8"}>NULL</text>
          {list.map((val, i) => {
            const x = i * (NODE_SIZE + GAP);
            const bg = getNodeColor(i, step, isDark);
            const isActive = i === step.activeNode;
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                {isActive && (
                  <rect x="-5" y="-5" width={NODE_SIZE + 10} height={NODE_SIZE + 10} rx="12"
                    fill={step.phase === "ascend" ? "#78350f44" : "#1e3a8a44"}
                    style={{ filter: "blur(10px)" }} />
                )}
                <rect x="0" y="0" width={NODE_SIZE} height={NODE_SIZE} rx="8"
                  fill={bg} stroke={isActive ? "#818cf8" : isDark ? "#1f2937" : "#94a3b8"} strokeWidth={isActive ? 2 : 1}
                  style={{ transition: "fill 0.35s" }} />
                <text x={NODE_SIZE / 2} y={NODE_SIZE / 2 + 7} textAnchor="middle"
                  fontSize="20" fontWeight="800" fill="white">{val}</text>
                <text x={NODE_SIZE / 2} y={NODE_SIZE + 16} textAnchor="middle"
                  fontSize="9" fill={isDark ? "#374151" : "#94a3b8"}>0x{(100 + i * 16).toString(16).toUpperCase()}</text>
                {i === 0 && step.phase !== "done" && (
                  <text x={NODE_SIZE / 2} y="-8" textAnchor="middle" fontSize="9" fill="#60a5fa">HEAD</text>
                )}
                {i === step.newHead && step.phase !== "done" && (
                  <text x={NODE_SIZE / 2} y="-8" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="700">newHEAD</text>
                )}
                {i === step.newHead && step.phase === "done" && (
                  <text x={NODE_SIZE / 2} y="-8" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="700">HEAD</text>
                )}
                {i === step.activeNode && (
                  <text x={NODE_SIZE / 2} y={NODE_SIZE + 28} textAnchor="middle"
                    fontSize="9" fill="#818cf8">↑ node</text>
                )}
              </g>
            );
          })}
        </svg>
      </VizCard>

      <MessageBar
        phase={step.phase}
        phaseLabel={PHASE_LABELS[step.phase] || step.phase}
        msg={step.msg}
        accentColor={pc}
      />

      <ControlBar idx={idx} total={steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

      <StepInfo idx={idx} total={steps.length}>
        <span style={{ color: "#4f46e5" }}>■</span> active &nbsp;
        <span style={{ color: "#059669" }}>■</span> new head &nbsp;
        <span style={{ color: "#b45309" }}>■</span> reversed &nbsp;
        <span style={{ color: "#f59e0b" }}>↩</span> reversed ptr &nbsp;
        <span style={{ color: "#475569" }}>→</span> original ptr
      </StepInfo>
    </VizLayout>
  );
}
