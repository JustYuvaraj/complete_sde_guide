import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection, HashSetPanel,
} from "../shared/Components";

const DEFAULT_OPS = "add 1, add 2, contains 1, contains 3, add 2, contains 2, remove 2, contains 2";

const CODE = [
    { id: 0, text: `class MyHashSet {` },
    { id: 1, text: `    vector<list<int>> buckets;` },
    { id: 2, text: `    int size;` },
    { id: 3, text: `` },
    { id: 4, text: `    int hash(int key) {` },
    { id: 5, text: `        return key % size;` },
    { id: 6, text: `    }` },
    { id: 7, text: `` },
    { id: 8, text: `    void add(int key) {      // O(1) avg` },
    { id: 9, text: `        int idx = hash(key);` },
    { id: 10, text: `        if (!contains(key))` },
    { id: 11, text: `            buckets[idx].push_back(key);` },
    { id: 12, text: `    }` },
    { id: 13, text: `` },
    { id: 14, text: `    void remove(int key) {   // O(1) avg` },
    { id: 15, text: `        int idx = hash(key);` },
    { id: 16, text: `        buckets[idx].remove(key);` },
    { id: 17, text: `    }` },
    { id: 18, text: `` },
    { id: 19, text: `    bool contains(int key) { // O(1) avg` },
    { id: 20, text: `        int idx = hash(key);` },
    { id: 21, text: `        // search bucket[idx] for key` },
    { id: 22, text: `    }` },
    { id: 23, text: `};` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    add: "#3b82f6",
    remove: "#ef4444",
    contains: "#f59e0b",
    result: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    add: "ADD",
    remove: "REMOVE",
    contains: "CONTAINS?",
    result: "RESULT",
};

function parseOps(text) {
    return text.split(",").map(s => {
        const parts = s.trim().split(/\s+/);
        return { op: parts[0].toLowerCase(), val: parseInt(parts[1]) };
    }).filter(o => ["add", "remove", "contains"].includes(o.op) && !isNaN(o.val));
}

function generateSteps(ops) {
    const set = new Set();
    const steps = [];

    steps.push({
        cl: 1, phase: "init",
        setValues: [], activeValue: null, highlightValue: null,
        status: null, opResult: null, opIdx: -1,
        msg: `Initialize empty HashSet`,
        vars: { size: 0 },
    });

    ops.forEach((op, oi) => {
        if (op.op === "add") {
            const already = set.has(op.val);
            set.add(op.val);
            steps.push({
                cl: already ? 10 : 11, phase: "add",
                setValues: [...set], activeValue: op.val, highlightValue: null,
                status: "inserting", opResult: already ? "already exists" : "added", opIdx: oi,
                msg: already
                    ? `add(${op.val}) → already exists, skip`
                    : `add(${op.val}) → inserted into bucket`,
                vars: { operation: `add(${op.val})`, size: set.size },
            });
        } else if (op.op === "remove") {
            const existed = set.has(op.val);
            set.delete(op.val);
            steps.push({
                cl: 16, phase: "remove",
                setValues: [...set], activeValue: null, highlightValue: existed ? op.val : null,
                status: "found", opResult: existed ? "removed" : "not found", opIdx: oi,
                msg: existed
                    ? `remove(${op.val}) → found & removed`
                    : `remove(${op.val}) → not in set, no-op`,
                vars: { operation: `remove(${op.val})`, size: set.size },
            });
        } else {
            const found = set.has(op.val);
            steps.push({
                cl: 20, phase: "contains",
                setValues: [...set], activeValue: null, highlightValue: found ? op.val : null,
                status: "searching", opResult: found ? "true" : "false", opIdx: oi,
                msg: `contains(${op.val}) → ${found}`,
                vars: { operation: `contains(${op.val})`, result: String(found), size: set.size },
            });
        }
    });

    steps.push({
        cl: 0, phase: "result",
        setValues: [...set], activeValue: null, highlightValue: null,
        status: null, opResult: null, opIdx: ops.length,
        msg: `All operations complete. Final set = {${[...set].join(", ")}}`,
        vars: { "final size": set.size },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 705 — Design HashSet

**Difficulty:** Easy &nbsp; **Topics:** Array, Hash Table, Design

---

Design a HashSet without using any built-in hash table libraries. Implement:

- \`void add(key)\` — Insert \`key\` into the HashSet.
- \`bool contains(key)\` — Check if \`key\` exists.
- \`void remove(key)\` — Remove \`key\` from the HashSet.

### Example
\`\`\`
MyHashSet set;
set.add(1);      // set = {1}
set.add(2);      // set = {1, 2}
set.contains(1); // true
set.contains(3); // false
set.add(2);      // set = {1, 2} (already exists)
set.contains(2); // true
set.remove(2);   // set = {1}
set.contains(2); // false
\`\`\`

### Constraints
- \`0 <= key <= 10⁶\`
- At most \`10⁴\` calls to add, remove, contains`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Bucket-Based Hash Table

### Core Idea
1. Create an array of **buckets** (linked lists)
2. Use \`hash(key) = key % numBuckets\` to determine which bucket
3. Each bucket handles **collisions** via chaining

### Operations
- **add**: Hash → check bucket → append if not present
- **contains**: Hash → search bucket
- **remove**: Hash → find & remove from bucket

### Why Chaining?
Multiple keys can map to the same bucket. Linked lists allow O(1) average insert/delete.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
class MyHashSet {
    vector<list<int>> buckets;
    int sz;
    int hash(int key) { return key % sz; }
public:
    MyHashSet() : sz(1009), buckets(1009) {}

    void add(int key) {
        if (!contains(key))
            buckets[hash(key)].push_back(key);
    }
    void remove(int key) {
        buckets[hash(key)].remove(key);
    }
    bool contains(int key) {
        auto& b = buckets[hash(key)];
        return find(b.begin(), b.end(), key) != b.end();
    }
};
\`\`\`

## Complexity
| Operation | Average | Worst |
|---|---|---|
| add | O(1) | O(n/k) |
| remove | O(1) | O(n/k) |
| contains | O(1) | O(n/k) |
| **Space** | **O(n + k)** | k = bucket count |`
    }
];

export default function DesignHashSet() {
    const { theme } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_OPS);
    const [ops, setOps] = useState(() => parseOps(DEFAULT_OPS));
    const [steps, setSteps] = useState(() => generateSteps(parseOps(DEFAULT_OPS)));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    function handleRun() {
        const parsed = parseOps(inputText);
        if (parsed.length < 1 || parsed.length > 15) return;
        setOps(parsed);
        setSteps(generateSteps(parsed)); setIdx(0); setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_OPS);
        setOps(parseOps(DEFAULT_OPS));
        setSteps(generateSteps(parseOps(DEFAULT_OPS))); setIdx(0); setPlaying(false);
    }

    return (
        <VizLayout
            title="Design HashSet"
            subtitle={`LC #705 · Bucket-based Hash Set · ${ops.length} operations`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText} onChange={setInputText}
                onRun={handleRun} onReset={handleReset}
                placeholder="add 1, add 2, contains 1, remove 2" label="ops:"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="design_hashset.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* ━━━ Operation Result ━━━ */}
            {step.opResult && (
                <VizCard title={`🔧 Operation Result`}>
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "12px", padding: "6px 0",
                    }}>
                        <span style={{
                            padding: "6px 16px", borderRadius: "20px",
                            background: step.phase === "remove" ? "#ef444415" : step.phase === "contains" ? "#f59e0b15" : "#3b82f615",
                            border: `1.5px solid ${pc}44`,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.8rem", fontWeight: "800", color: pc,
                        }}>
                            {step.opResult}
                        </span>
                    </div>
                </VizCard>
            )}

            {/* ━━━ Hash Set Visualization ━━━ */}
            <HashSetPanel
                values={step.setValues}
                activeValue={step.activeValue}
                highlightValue={step.highlightValue}
                status={step.status}
                title="MyHashSet · Bucket View"
            />

            {/* ━━━ Operation Log ━━━ */}
            <VizCard title="📜 Operation Log">
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {ops.slice(0, (step.opIdx ?? -1) + 1).map((op, i) => {
                        const isCurrent = i === step.opIdx;
                        return (
                            <div key={i} style={{
                                padding: "3px 10px",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.7rem", fontWeight: isCurrent ? "800" : "500",
                                color: isCurrent ? pc : theme.textDim,
                                background: isCurrent ? `${pc}10` : "transparent",
                                borderRadius: "6px",
                            }}>
                                {op.op}({op.val})
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
