import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { VizLayout, VizCard, usePlayer, ExplainPanel, CodeEditorPanel, ProgressBar } from "../shared/Components";

const CODE = [
    { id: 0, text: `# 1. Integer creation` },
    { id: 1, text: `x = 42` },
    { id: 2, text: `` },
    { id: 3, text: `# 2. Multiple references` },
    { id: 4, text: `y = x` },
    { id: 5, text: `` },
    { id: 6, text: `# 3. Immutability (Integers)` },
    { id: 7, text: `x = x + 1` },
    { id: 8, text: `` },
    { id: 9, text: `# 4. Mutability (Lists)` },
    { id: 10, text: `list_a = [1, 2]` },
    { id: 11, text: `list_b = list_a` },
    { id: 12, text: `list_b.append(3)` },
    { id: 13, text: `` },
    { id: 14, text: `# 5. Garbage Collection` },
    { id: 15, text: `y = "hello"` },
];

const PHASE_COLOR = {
    init: "#8b5cf6", alloc1: "#3b82f6", alias1: "#f59e0b",
    immut: "#ec4899", alloc2: "#10b981", mut: "#f59e0b",
    gc: "#ef4444", done: "#10b981"
};

const PHASE_LABELS = {
    init: "MEMORY MODEL", alloc1: "ALLOCATION", alias1: "ALIASING (REFERENCE)",
    immut: "IMMUTABILITY", alloc2: "LIST ALLOCATION", mut: "MUTATION IN-PLACE",
    gc: "GARBAGE COLLECTION", done: "COMPLETE"
};

function generateSteps() {
    return [
        {
            cl: 0, phase: "init", stack: [], heap: [], activeVar: null, activeObj: null,
            msg: "Python Memory Model: Variables live on the Stack (as references). Objects live on the Heap (actual data)."
        },
        {
            cl: 1, phase: "alloc1",
            stack: [{ name: "x", target: "obj-42" }],
            heap: [{ id: "obj-42", type: "int", value: "42", refs: 1, color: "#3b82f6" }],
            activeVar: "x", activeObj: "obj-42",
            msg: "Heap: Integer object '42' created. Stack: Name 'x' created, pointing to the heap object."
        },
        {
            cl: 4, phase: "alias1",
            stack: [{ name: "x", target: "obj-42" }, { name: "y", target: "obj-42" }],
            heap: [{ id: "obj-42", type: "int", value: "42", refs: 2, color: "#3b82f6" }],
            activeVar: "y", activeObj: "obj-42",
            msg: "y = x: No data is copied! Python simply creates a new stack reference 'y' pointing to the same heap object. Ref count = 2."
        },
        {
            cl: 7, phase: "immut",
            stack: [{ name: "x", target: "obj-43" }, { name: "y", target: "obj-42" }],
            heap: [
                { id: "obj-42", type: "int", value: "42", refs: 1, color: "#3b82f6" },
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" }
            ],
            activeVar: "x", activeObj: "obj-43",
            msg: "x = x + 1: Integers are immutable! Python creates a NEW object '43', and moves x's pointer. y still points to '42'."
        },
        {
            cl: 10, phase: "alloc2",
            stack: [
                { name: "x", target: "obj-43" }, { name: "y", target: "obj-42" },
                { name: "list_a", target: "obj-L1" }
            ],
            heap: [
                { id: "obj-42", type: "int", value: "42", refs: 1, color: "#3b82f6" },
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" },
                { id: "obj-L1", type: "list", value: "[1, 2]", refs: 1, color: "#10b981" }
            ],
            activeVar: "list_a", activeObj: "obj-L1",
            msg: "A list object is created on the heap. list_a points to it."
        },
        {
            cl: 11, phase: "mut",
            stack: [
                { name: "x", target: "obj-43" }, { name: "y", target: "obj-42" },
                { name: "list_a", target: "obj-L1" }, { name: "list_b", target: "obj-L1" }
            ],
            heap: [
                { id: "obj-42", type: "int", value: "42", refs: 1, color: "#3b82f6" },
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" },
                { id: "obj-L1", type: "list", value: "[1, 2]", refs: 2, color: "#10b981" }
            ],
            activeVar: "list_b", activeObj: "obj-L1",
            msg: "list_b = list_a: Both variables now point to the EXACT SAME list object. Ref count = 2."
        },
        {
            cl: 12, phase: "mut",
            stack: [
                { name: "x", target: "obj-43" }, { name: "y", target: "obj-42" },
                { name: "list_a", target: "obj-L1" }, { name: "list_b", target: "obj-L1" }
            ],
            heap: [
                { id: "obj-42", type: "int", value: "42", refs: 1, color: "#3b82f6" },
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" },
                { id: "obj-L1", type: "list", value: "[1, 2, 3]", refs: 2, color: "#10b981", updated: true }
            ],
            activeVar: "list_b", activeObj: "obj-L1",
            msg: "Mutation! We appended via list_b. Because list_a points to the same object, list_a ALSO sees [1, 2, 3]."
        },
        {
            cl: 15, phase: "gc",
            stack: [
                { name: "x", target: "obj-43" }, { name: "y", target: "obj-str" },
                { name: "list_a", target: "obj-L1" }, { name: "list_b", target: "obj-L1" }
            ],
            heap: [
                { id: "obj-42", type: "int", value: "42", refs: 0, color: "#64748b", dead: true },
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" },
                { id: "obj-L1", type: "list", value: "[1, 2, 3]", refs: 2, color: "#10b981" },
                { id: "obj-str", type: "str", value: '"hello"', refs: 1, color: "#f59e0b" }
            ],
            activeVar: "y", activeObj: "obj-str",
            msg: "y is reassigned. The object '42' now has 0 references. The Garbage Collector will destroy it."
        },
        {
            cl: 15, phase: "done",
            stack: [
                { name: "x", target: "obj-43" }, { name: "y", target: "obj-str" },
                { name: "list_a", target: "obj-L1" }, { name: "list_b", target: "obj-L1" }
            ],
            heap: [
                { id: "obj-43", type: "int", value: "43", refs: 1, color: "#ec4899" },
                { id: "obj-L1", type: "list", value: "[1, 2, 3]", refs: 2, color: "#10b981" },
                { id: "obj-str", type: "str", value: '"hello"', refs: 1, color: "#f59e0b" }
            ],
            activeVar: null, activeObj: null,
            msg: "Object '42' is freed from heap memory. This is automatic reference counting (ARC)."
        }
    ];
}

const EXPLAIN = [
    {
        icon: "🧠", title: "Python Memory Model", color: "#8b5cf6",
        content: `## Everything is a Pointer

Unlike C++ where \`int x = 42\` stores 42 directly in the memory allocated for \`x\`, **Python variables are just references (pointers)** living on the Stack, pointing to Objects living on the Heap.

### 1. Variables (Stack)
- A variable is just a **name tag** (reference).
- It has no type. It just points to a memory address.

### 2. Objects (Heap)
- The actual data (integer, string, list) lives on the Heap.
- Every object contains:
  - **Value**: the actual data
  - **Type**: e.g., \`int\`, \`list\` (this is why Python is dynamically typed)
  - **Reference Count**: how many variables point to it

### 3. Garbage Collection
If an object's Reference Count drops to \`0\` (no variables point to it), Python's Reference Counter immediately deletes it from memory.`
    },
    {
        icon: "🔒", title: "Immutability vs Mutability", color: "#ec4899",
        content: `## The Core Concept

Because variables are just pointers, mutability determines whether you can change the object *in-place*.

### Immutable (Locked Box)
\`int\`, \`float\`, \`bool\`, \`str\`, \`tuple\`
- You **cannot** change the value inside the object.
- If you do \`x = x + 1\`, Python MUST create a new object and move the pointer.

### Mutable (Open Box)
\`list\`, \`dict\`, \`set\`
- You **can** change the value inside the object.
- If you have two variables pointing to the same list, and you append to one, **both see the change** because there is only one list in memory!`
    }
];

export default function PyMemory() {
    const { theme, isDark } = useTheme();
    const [steps] = useState(() => generateSteps());
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 3000);
    const step = steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    return (
        <VizLayout title="Memory Model (Stack vs Heap)" subtitle="Python Refresher · Lesson 1 of 10">
            <div style={{
                width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", gap: "10px",
                background: isDark ? "#1e293b" : "#f1f5f9", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`
            }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "900", color: "#8b5cf6", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🧠</span> Read This First: What are the Stack and Heap?
                </div>
                <div style={{ fontSize: "0.85rem", color: isDark ? "#cbd5e1" : "#334155", lineHeight: "1.6", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <strong style={{ color: "#3b82f6" }}>1. The Stack (Variables)</strong><br />
                        Variables are just <strong>sticky notes</strong> (references). They are just names pointing to memory addresses. They don't actually hold the data themselves.
                    </div>
                    <div>
                        <strong style={{ color: "#10b981" }}>2. The Heap (Objects)</strong><br />
                        This is the giant warehouse where your actual data (like the number 42 or a list) is stored inside boxes. Python slaps your sticky notes onto these boxes.
                    </div>
                    <div>
                        <strong style={{ color: "#f59e0b" }}>3. Aliasing (y = x)</strong><br />
                        When you copy a variable, Python doesn't copy the giant box. It just creates a second sticky note pointing to the same box! This saves megabytes of RAM.
                    </div>
                    <div>
                        <strong style={{ color: "#ec4899" }}>4. Immutability</strong><br />
                        Some boxes (like Integers or Strings) are locked glass boxes. You cannot change them. To add 1 to a number, Python must build a brand new box.
                    </div>
                </div>
            </div>

            <ExplainPanel sections={EXPLAIN} />

            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap", justifyContent: "center" }}>
                <CodeEditorPanel code={CODE} step={step} phaseLabels={PHASE_LABELS} phaseColors={PHASE_COLOR}
                    fileName="memory.py" idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying} />
            </div>

            <div style={{ display: "flex", gap: "20px", width: "100%", maxWidth: "920px", flexWrap: "wrap", justifyContent: "center" }}>

                {/* STACK PANEL */}
                <VizCard title="Stack (Variables / References)" style={{ flex: "1 1 300px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "200px" }}>
                        <div style={{ fontSize: "0.75rem", color: theme.textDim, textTransform: "uppercase", fontWeight: "800", letterSpacing: "1px", marginBottom: "4px" }}>
                            Names pointing to addresses
                        </div>
                        {step.stack.length === 0 && <span style={{ color: theme.textDim, fontFamily: "monospace" }}>No variables defined</span>}
                        {step.stack.map((v, i) => {
                            const isActive = step.activeVar === v.name;
                            return (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "10px 16px", borderRadius: "8px",
                                    background: isActive ? `${pc}15` : (isDark ? "#1e293b" : "#f8fafc"),
                                    borderLeft: `4px solid ${isActive ? pc : "#64748b"}`,
                                    transition: "all 0.3s"
                                }}>
                                    <span style={{ fontFamily: "monospace", fontWeight: "800", fontSize: "1.1rem", color: isActive ? pc : theme.text }}>
                                        {v.name}
                                    </span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ color: theme.textDim }}>→</span>
                                        <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: theme.textDim, background: isDark ? "#0f172a" : "#e2e8f0", padding: "4px 8px", borderRadius: "4px" }}>
                                            {v.target}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </VizCard>

                {/* HEAP PANEL */}
                <VizCard title="Heap (Actual Objects)" style={{ flex: "1 1 400px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "200px" }}>
                        <div style={{ fontSize: "0.75rem", color: theme.textDim, textTransform: "uppercase", fontWeight: "800", letterSpacing: "1px", marginBottom: "4px" }}>
                            Dynamically allocated memory
                        </div>
                        {step.heap.length === 0 && <span style={{ color: theme.textDim, fontFamily: "monospace" }}>Heap is empty</span>}

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {step.heap.map((obj, i) => {
                                const isActive = step.activeObj === obj.id || obj.updated;
                                return (
                                    <div key={i} style={{
                                        padding: "12px", borderRadius: "12px", width: "160px",
                                        background: obj.dead ? "#ef444410" : isActive ? `${obj.color}15` : (isDark ? "#0f172a" : "#f1f5f9"),
                                        border: `2px dashed ${obj.dead ? "#ef4444" : isActive ? obj.color : theme.cardBorder}`,
                                        opacity: obj.dead ? 0.6 : 1,
                                        transition: "all 0.4s",
                                        transform: isActive && !obj.dead ? "scale(1.05)" : "scale(1)",
                                        textDecoration: obj.dead ? "line-through" : "none"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "0.6rem", color: obj.dead ? "#ef4444" : obj.color, fontWeight: "800", fontFamily: "monospace" }}>
                                                {obj.id}
                                            </span>
                                            <span style={{ fontSize: "0.6rem", color: theme.textDim, fontWeight: "800", fontFamily: "monospace" }}>
                                                refs: {obj.refs}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: "center", marginBottom: "4px" }}>
                                            <span style={{ fontSize: "0.7rem", color: theme.textDim, textTransform: "uppercase", fontWeight: "800" }}>
                                                {obj.type}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "900", color: obj.dead ? "#ef4444" : obj.color, fontFamily: "monospace" }}>
                                            {obj.value}
                                        </div>
                                        {obj.dead && (
                                            <div style={{ textAlign: "center", fontSize: "0.7rem", color: "#ef4444", fontWeight: "800", marginTop: "4px" }}>
                                                GARBAGE COLLECTED
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </VizCard>
            </div>

            <ProgressBar idx={idx} total={steps.length} accentColor={pc} />
        </VizLayout>
    );
}
