import React from "react";
import { VizLayout } from "../shared/Components";
import { useTheme } from "../shared/ThemeContext";

const PyIntro = () => {
    const { isDark } = useTheme();

    const sections = [
        {
            title: "1. The Engine: How Python Runs",
            icon: "⚙️",
            color: "#3b82f6", // Blue
            concept: "Python is a Hybrid Language (Compiled + Interpreted)",
            description: `Unlike C++ which compiles directly to raw machine code, Python is a two-step process. 
            First, it compiles your code into "Bytecode" (a safer, intermediate format). 
            Then, the Python Virtual Machine (PVM) interprets that Bytecode into machine code on the fly.`,
            dsaRelevance: "Why it matters for DSA: Python is inherently slower than C++ because of this runtime interpretation. However, its expressive syntax allows you to write the exact same algorithm in 1/3rd of the time during an interview.",
        },
        {
            title: "2. The Paradigm: How We Write It",
            icon: "🧩",
            color: "#10b981", // Green
            concept: "Python is Multi-Paradigm (Procedural + OOP)",
            description: `You don't have to force everything into a Class like in Java. You can write simple functions (Procedural) for quick tasks, or complex Classes (Object-Oriented) when you need to group data and behavior tightly.`,
            dsaRelevance: "Why it matters for DSA: Most algorithm solutions (like Binary Search or Two Pointers) will just be simple Procedural functions. But when building Data Structures (like Linked Lists, Trees, or Tries), you will heavily use OOP Classes to define the Nodes.",
        },
        {
            title: "3. The Philosophy: Everything is an Object",
            icon: "📦",
            color: "#8b5cf6", // Purple
            concept: "Variables are just 'Sticky Notes' pointing to Heap Objects",
            description: `In Python, even a simple number like '5' is a full-blown object stored in the Heap. Variables do not store data directly; they are simply references (memory addresses) pointing to where the object lives.`,
            dsaRelevance: "Why it matters for DSA: When you pass a List or a Tree Node into a function, you are passing the reference. Modifying it inside the function modifies the original structure. (We visualize this exact concept in the very next lesson!).",
        },
        {
            title: "4. The Arsenal: Batteries Included",
            icon: "🔋",
            color: "#f59e0b", // Orange
            concept: "Massive Built-in Standard Library",
            description: `Python comes with a massive standard library right out of the box. While learning the 'core language' is step one, knowing which library tools to pull from is step two.`,
            dsaRelevance: "Why it matters for DSA: You never have to build a Queue, a Heap (Priority Queue), or a Hash Map from scratch. Python provides highly optimized built-ins like `collections.deque`, `heapq`, and `dict` that you must memorize for interviews.",
        },
    ];

    return (
        <VizLayout title="Python: Under the Hood" subtitle="Python Refresher · Lesson 0 of 10">
            <div style={{
                width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", gap: "24px",
                padding: "20px 0px"
            }}>
                <div style={{
                    background: isDark ? "#1e293b" : "#f1f5f9",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                    textAlign: "center"
                }}>
                    <h2 style={{ margin: "0 0 10px 0", color: isDark ? "#f8fafc" : "#0f172a" }}>Before We Write Code...</h2>
                    <p style={{ margin: 0, color: isDark ? "#cbd5e1" : "#475569", lineHeight: "1.6" }}>
                        Before jumping straight into coding lists and loops, let's connect the dots.
                        Here are the 4 core concepts of how Python actually works under the hood, and
                        exactly why they matter for cracking Data Structures and Algorithms.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {sections.map((sec, i) => (
                        <div key={i} style={{
                            background: isDark ? "#0f172a" : "#ffffff",
                            padding: "24px",
                            borderRadius: "12px",
                            borderLeft: `6px solid ${sec.color}`,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <span style={{ fontSize: "1.5rem" }}>{sec.icon}</span>
                                <h3 style={{ margin: 0, fontSize: "1.2rem", color: sec.color }}>{sec.title}</h3>
                            </div>

                            <div style={{
                                fontWeight: "bold",
                                color: isDark ? "#f8fafc" : "#1e293b",
                                marginBottom: "8px",
                                fontSize: "1.05rem"
                            }}>
                                Concept: {sec.concept}
                            </div>

                            <p style={{ margin: "0 0 16px 0", color: isDark ? "#94a3b8" : "#475569", lineHeight: "1.6" }}>
                                {sec.description}
                            </p>

                            <div style={{
                                background: isDark ? "rgba(59, 130, 246, 0.1)" : "#eff6ff",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.2)" : "#bfdbfe"}`,
                                color: isDark ? "#bfdbfe" : "#1e40af",
                                fontSize: "0.95rem",
                                lineHeight: "1.5",
                                fontWeight: "500"
                            }}>
                                {sec.dsaRelevance}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: "10px",
                    background: isDark ? "#0f172a" : "#ffffff",
                    padding: "20px",
                    borderRadius: "12px",
                    border: `1px dashed ${isDark ? "#475569" : "#94a3b8"}`,
                    textAlign: "center"
                }}>
                    <p style={{ margin: 0, color: isDark ? "#cbd5e1" : "#475569", fontSize: "1.1rem" }}>
                        Now that you know the rules of the engine, let's look at the <strong style={{ color: "#8b5cf6" }}>Memory Model</strong> in action.
                    </p>
                </div>
            </div>
        </VizLayout>
    );
};

export default PyIntro;
