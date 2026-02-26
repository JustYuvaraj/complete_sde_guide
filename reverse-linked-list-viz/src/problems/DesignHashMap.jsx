import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VariablesPanel, VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, InputSection, HashMapPanel,
} from "../shared/Components";

const DEFAULT_OPS = "put 1 10, put 2 20, get 1, get 3, put 2 30, get 2, remove 2, get 2";

const CODE = [
    { id: 0, text: `class MyHashMap {` },
    { id: 1, text: `    vector<list<pair<int,int>>> buckets;` },
    { id: 2, text: `    int size;` },
    { id: 3, text: `` },
    { id: 4, text: `    int hash(int key) {` },
    { id: 5, text: `        return key % size;` },
    { id: 6, text: `    }` },
    { id: 7, text: `` },
    { id: 8, text: `    void put(int key, int val) {` },
    { id: 9, text: `        int idx = hash(key);` },
    { id: 10, text: `        // update if exists, else insert` },
    { id: 11, text: `        buckets[idx].push_back({key, val});` },
    { id: 12, text: `    }` },
    { id: 13, text: `` },
    { id: 14, text: `    int get(int key) {` },
    { id: 15, text: `        int idx = hash(key);` },
    { id: 16, text: `        // search bucket, return val or -1` },
    { id: 17, text: `    }` },
    { id: 18, text: `` },
    { id: 19, text: `    void remove(int key) {` },
    { id: 20, text: `        int idx = hash(key);` },
    { id: 21, text: `        // find and erase from bucket` },
    { id: 22, text: `    }` },
    { id: 23, text: `};` },
];

const PHASE_COLOR = {
    init: "#8b5cf6",
    put: "#3b82f6",
    get: "#f59e0b",
    remove: "#ef4444",
    result: "#10b981",
};
const PHASE_LABELS = {
    init: "INITIALIZE",
    put: "PUT",
    get: "GET",
    remove: "REMOVE",
    result: "COMPLETE",
};

function parseOps(text) {
    return text.split(",").map(s => {
        const parts = s.trim().split(/\s+/);
        const op = parts[0].toLowerCase();
        if (op === "put") return { op, key: parseInt(parts[1]), val: parseInt(parts[2]) };
        return { op, key: parseInt(parts[1]) };
    }).filter(o => ["put", "get", "remove"].includes(o.op) && !isNaN(o.key));
}

function generateSteps(ops) {
    const map = new Map();
    const steps = [];

    steps.push({
        cl: 1, phase: "init",
        mapEntries: {}, activeKey: null, highlightKey: null,
        status: null, opResult: null, opIdx: -1,
        msg: `Initialize empty HashMap`,
        vars: { size: 0 },
    });

    ops.forEach((op, oi) => {
        if (op.op === "put") {
            const existed = map.has(op.key);
            map.set(op.key, op.val);
            const entries = {};
            map.forEach((v, k) => { entries[String(k)] = v; });
            steps.push({
                cl: 11, phase: "put",
                mapEntries: entries, activeKey: String(op.key), highlightKey: null,
                status: "inserting", opResult: existed ? `updated ${op.key}→${op.val}` : `inserted ${op.key}→${op.val}`,
                opIdx: oi,
                msg: existed
                    ? `put(${op.key}, ${op.val}) → key exists, update value`
                    : `put(${op.key}, ${op.val}) → new entry`,
                vars: { operation: `put(${op.key},${op.val})`, size: map.size },
            });
        } else if (op.op === "get") {
            const found = map.has(op.key);
            const val = found ? map.get(op.key) : -1;
            const entries = {};
            map.forEach((v, k) => { entries[String(k)] = v; });
            steps.push({
                cl: 16, phase: "get",
                mapEntries: entries, activeKey: null, highlightKey: found ? String(op.key) : null,
                status: "searching", opResult: `get(${op.key}) → ${val}`, opIdx: oi,
                msg: found
                    ? `get(${op.key}) → found value ${val}`
                    : `get(${op.key}) → key not found, return -1`,
                vars: { operation: `get(${op.key})`, result: val, size: map.size },
            });
        } else {
            const existed = map.has(op.key);
            map.delete(op.key);
            const entries = {};
            map.forEach((v, k) => { entries[String(k)] = v; });
            steps.push({
                cl: 21, phase: "remove",
                mapEntries: entries, activeKey: null, highlightKey: null,
                status: existed ? "found" : null, opResult: existed ? `removed ${op.key}` : `${op.key} not found`,
                opIdx: oi,
                msg: existed
                    ? `remove(${op.key}) → found & removed`
                    : `remove(${op.key}) → key not in map`,
                vars: { operation: `remove(${op.key})`, size: map.size },
            });
        }
    });

    const finalEntries = {};
    map.forEach((v, k) => { finalEntries[String(k)] = v; });
    steps.push({
        cl: 0, phase: "result",
        mapEntries: finalEntries, activeKey: null, highlightKey: null,
        status: null, opResult: null, opIdx: ops.length,
        msg: `All operations complete. Final map has ${map.size} entries.`,
        vars: { "final size": map.size },
    });

    return steps;
}

const EXPLAIN = [
    {
        icon: "📋", title: "Problem Statement", color: "#ef4444",
        content: `## LeetCode 706 — Design HashMap

**Difficulty:** Easy &nbsp; **Topics:** Array, Hash Table, Design

---

Design a HashMap without using any built-in hash table libraries. Implement:

- \`void put(key, value)\` — Insert/update the key-value pair.
- \`int get(key)\` — Return the value, or -1 if not found.
- \`void remove(key)\` — Remove the key if it exists.

### Example
\`\`\`
MyHashMap map;
map.put(1, 10);   // map = {1→10}
map.put(2, 20);   // map = {1→10, 2→20}
map.get(1);        // 10
map.get(3);        // -1 (not found)
map.put(2, 30);   // map = {1→10, 2→30} (updated)
map.get(2);        // 30
map.remove(2);     // map = {1→10}
map.get(2);        // -1
\`\`\`

### Constraints
- \`0 <= key, value <= 10⁶\`
- At most \`10⁴\` calls`
    },
    {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
        content: `## Bucket-Based Hash Table

Same as HashSet, but each bucket stores **key-value pairs**.

### Operations
- **put**: Hash key → find bucket → update if key exists, else append
- **get**: Hash key → search bucket → return value or -1
- **remove**: Hash key → find & erase pair from bucket

### Key Difference from HashSet
HashSet stores values only. HashMap stores key→value pairs, so each bucket entry is \`{key, value}\`.`
    },
    {
        icon: "⚡", title: "Code & Complexity", color: "#10b981",
        content: `## C++ Solution
\`\`\`cpp
class MyHashMap {
    vector<list<pair<int,int>>> buckets;
    int sz;
    int hash(int key) { return key % sz; }
public:
    MyHashMap() : sz(1009), buckets(1009) {}

    void put(int key, int val) {
        auto& b = buckets[hash(key)];
        for (auto& p : b) {
            if (p.first == key) { p.second = val; return; }
        }
        b.push_back({key, val});
    }
    int get(int key) {
        for (auto& p : buckets[hash(key)])
            if (p.first == key) return p.second;
        return -1;
    }
    void remove(int key) {
        auto& b = buckets[hash(key)];
        b.remove_if([key](auto& p){ return p.first == key; });
    }
};
\`\`\`

## Complexity
| Operation | Average | Worst |
|---|---|---|
| put | O(1) | O(n/k) |
| get | O(1) | O(n/k) |
| remove | O(1) | O(n/k) |`
    }
];

export default function DesignHashMap() {
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
            title="Design HashMap"
            subtitle={`LC #706 · Bucket-based Hash Map · ${ops.length} operations`}
        >
            <ExplainPanel sections={EXPLAIN} />
            <InputSection
                value={inputText} onChange={setInputText}
                onRun={handleRun} onReset={handleReset}
                placeholder="put 1 10, get 1, remove 1" label="ops:"
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="design_hashmap.cpp" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Operation Result */}
            {step.opResult && (
                <VizCard title="🔧 Operation Result">
                    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                        <span style={{
                            padding: "6px 16px", borderRadius: "20px",
                            background: `${pc}15`, border: `1.5px solid ${pc}44`,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.8rem", fontWeight: "800", color: pc,
                        }}>
                            {step.opResult}
                        </span>
                    </div>
                </VizCard>
            )}

            {/* Bucket-style HashMap */}
            <HashMapPanel
                entries={step.mapEntries}
                activeKey={step.activeKey}
                highlightKey={step.highlightKey}
                status={step.status}
                title="MyHashMap · Bucket View"
            />

            {/* Operation Log */}
            <VizCard title="📜 Operation Log">
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {ops.slice(0, (step.opIdx ?? -1) + 1).map((op, i) => {
                        const isCurrent = i === step.opIdx;
                        const label = op.op === "put" ? `put(${op.key}, ${op.val})` : `${op.op}(${op.key})`;
                        return (
                            <div key={i} style={{
                                padding: "3px 10px",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.7rem", fontWeight: isCurrent ? "800" : "500",
                                color: isCurrent ? pc : theme.textDim,
                                background: isCurrent ? `${pc}10` : "transparent",
                                borderRadius: "6px",
                            }}>
                                {label}
                            </div>
                        );
                    })}
                </div>
            </VizCard>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
