// ═══════════════════════════════════════════════════════════════════
//  Array Visualization Engine — Data-driven renderer
//  Takes a problem config and renders full step-by-step visualization
// ═══════════════════════════════════════════════════════════════════

import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
    VariablesPanel, HashMapPanel, HashSetPanel,
} from "../shared/Components";
import { SplitVizLayout } from "../shared/SplitVizLayout";
import PracticeEditor from "../components/PracticeEditor";

// ═══════════════════════════════════════════════════════════════════
//  Default Array Cell Renderer
// ═══════════════════════════════════════════════════════════════════

function ArrayCells({ step, theme, isDark, pc }) {
    const arr = step.array || step.arr || step.nums || [];
    const pointers = step.pointers || step.ptrs || {};       // { i: 2, j: 5, left: 0, right: 7 }
    const highlights = step.highlights || {};   // { 0: "active", 2: "comparing", 5: "sorted" }
    const labels = step.labels || {};           // { 0: "min", 3: "max" }

    const CELL_COLORS = {
        active: {
            bg: isDark ? `${pc}22` : `${pc}10`,
            border: pc,
            text: pc,
            scale: "scale(1.1) translateY(-6px)",
            shadow: `0 12px 24px ${pc}40, 0 4px 8px ${pc}20`
        },
        comparing: {
            bg: isDark ? "#f59e0b22" : "#fffbeb",
            border: "#f59e0b",
            text: "#f59e0b",
            scale: "scale(1.08) translateY(-4px)",
            shadow: "0 8px 20px rgba(245, 158, 11, 0.3)"
        },
        swapped: {
            bg: isDark ? "#10b98122" : "#f0fdf4",
            border: "#10b981",
            text: "#10b981",
            scale: "scale(1.12) translateY(-8px)",
            shadow: "0 14px 28px rgba(16, 185, 129, 0.4)"
        },
        sorted: {
            bg: isDark ? "rgba(16, 185, 129, 0.08)" : "#ecfdf5",
            border: "rgba(16, 185, 129, 0.4)",
            text: "#10b981",
            scale: "scale(1)",
            shadow: "none"
        },
        found: {
            bg: isDark ? "#10b98122" : "#f0fdf4",
            border: "#10b981",
            text: "#10b981",
            scale: "scale(1.15) translateY(-10px)",
            shadow: "0 18px 36px rgba(16, 185, 129, 0.5)"
        },
        removed: {
            bg: isDark ? "#ef444418" : "#fef2f2",
            border: "#ef4444",
            text: "#ef4444",
            scale: "scale(0.85)",
            shadow: "none"
        },
        inserted: {
            bg: isDark ? "#3b82f622" : "#eff6ff",
            border: "#3b82f6",
            text: "#3b82f6",
            scale: "scale(1.1) translateY(-6px)",
            shadow: "0 12px 24px rgba(59, 130, 246, 0.3)"
        },
        dimmed: {
            bg: isDark ? "#0f172a" : "#f1f5f9",
            border: theme.cardBorder,
            text: theme.textDim,
            scale: "scale(0.95)",
            opacity: 0.5,
            shadow: "none"
        },
    };
    const DEFAULT_CELL = {
        bg: isDark ? "rgba(30, 41, 59, 0.5)" : "#ffffff",
        border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        text: theme.text,
        scale: "scale(1)",
        shadow: isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.03)"
    };

    // Map pointer positions for quick lookup (Supports both {i: 2} and {2: "i"})
    const pointerAtIdx = {};
    Object.entries(pointers).forEach(([key, val]) => {
        let idx, name;
        if (!isNaN(key) && isNaN(val)) {
            idx = parseInt(key);
            name = val;
        } else {
            name = key;
            idx = val;
        }

        if (idx >= 0 && idx < arr.length) {
            if (!pointerAtIdx[idx]) pointerAtIdx[idx] = [];
            pointerAtIdx[idx].push(name);
        }
    });

    const POINTER_COLORS = {
        i: "#6366f1", j: "#f59e0b", left: "#3b82f6", right: "#ef4444",
        k: "#10b981", slow: "#3b82f6", fast: "#ef4444", lo: "#3b82f6", hi: "#ef4444",
        start: "#3b82f6", end: "#ef4444", p1: "#6366f1", p2: "#f59e0b",
        write: "#10b981", read: "#f59e0b",
    };

    return (
        <div style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {arr.map((val, i) => {
                    const state = highlights[i] || null;
                    const cs = (state && CELL_COLORS[state]) || DEFAULT_CELL;
                    const ptrs = pointerAtIdx[i] || [];
                    const label = labels[i] || null;

                    const valStr = String(val);
                    let fontSize = "1.3rem";
                    if (valStr.length > 5) fontSize = "1rem";
                    if (valStr.length > 10) fontSize = "0.85rem";
                    if (valStr.length > 15) fontSize = "0.75rem";

                    return (
                        <div key={i} style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                        }}>
                            {/* Label above */}
                            {label && (
                                <div style={{
                                    fontSize: "0.5rem", fontWeight: "800",
                                    padding: "1px 6px", borderRadius: "8px",
                                    background: cs.border, color: "#fff", whiteSpace: "nowrap",
                                }}>{label}</div>
                            )}

                            {/* Cell */}
                            <div style={{
                                minWidth: "56px",
                                width: "fit-content",
                                height: "62px",
                                padding: "0 12px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: cs.bg,
                                border: `2px solid ${cs.border}`,
                                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                transform: cs.scale,
                                opacity: cs.opacity !== undefined ? cs.opacity : 1,
                                boxShadow: cs.shadow,
                                position: "relative",
                                boxSizing: "border-box",
                                backdropFilter: isDark ? "blur(8px)" : "none",
                            }}>
                                <span style={{
                                    fontSize: fontSize,
                                    fontWeight: "900",
                                    color: cs.text,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    whiteSpace: "nowrap",
                                    lineHeight: 1,
                                    textShadow: isDark && cs.text !== theme.text ? `0 0 8px ${cs.text}40` : "none"
                                }}>{valStr}</span>
                                <span style={{
                                    fontSize: "0.55rem", fontWeight: "700",
                                    color: state ? cs.text : theme.textDim,
                                    marginTop: "4px",
                                    opacity: 0.6
                                }}>[{i}]</span>

                                {/* Glow effect for active/found */}
                                {(state === "active" || state === "found" || state === "swapped") && (
                                    <div style={{
                                        position: "absolute", inset: "-4px",
                                        borderRadius: "14px",
                                        border: `2px solid ${cs.border}`,
                                        opacity: 0.3,
                                        filter: "blur(4px)",
                                        animation: "pulse-glow 2s infinite"
                                    }} />
                                )}

                                {/* Checkmark for found/sorted */}
                                {(state === "found" || state === "swapped") && (
                                    <div style={{
                                        position: "absolute", top: "-10px", right: "-10px",
                                        width: "20px", height: "20px", borderRadius: "50%",
                                        background: cs.border, display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.6rem", color: "#fff", fontWeight: "900",
                                        boxShadow: `0 4px 8px ${cs.border}60`,
                                        zIndex: 10
                                    }}>✓</div>
                                )}
                            </div>

                            {/* Pointer arrows below */}
                            {ptrs.length > 0 && (
                                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                                    {ptrs.map(name => (
                                        <span key={name} style={{
                                            fontSize: "0.85rem", fontWeight: "850",
                                            color: POINTER_COLORS[name] || pc,
                                            display: "flex", flexDirection: "column", alignItems: "center",
                                            lineHeight: 1,
                                            textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.5)" : "none"
                                        }}>
                                            <span style={{ fontSize: "1.1rem", marginBottom: "-2px" }}>↑</span>
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Secondary array (e.g. output array) */}
            {step.secondaryArray && (
                <div style={{ marginTop: "12px" }}>
                    <div style={{
                        fontSize: "0.55rem", color: theme.textDim, fontWeight: "700",
                        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px", textAlign: "center",
                    }}>{step.secondaryLabel || "Output"}</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                        {step.secondaryArray.map((val, i) => (
                            <div key={i} style={{
                                width: "50px", height: "52px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "10px",
                                background: isDark ? "#1e293b" : "#f8fafc",
                                border: `1.5px solid ${theme.cardBorder}`,
                            }}>
                                <span style={{ fontSize: "1rem", fontWeight: "800", color: "#10b981" }}>{String(val)}</span>
                                <span style={{ fontSize: "0.45rem", color: theme.textDim }}>[{i}]</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
//  Main Engine Component
// ═══════════════════════════════════════════════════════════════════

export default function ArrayVizEngine({ config, headerRightItem, isPracticeMode, setIsPracticeMode, problemConfig }) {
    const { theme, isDark } = useTheme();

    // Parse config
    const {
        title, subtitle, code, explain, defaults,
        inputs: inputDefs, phases,
        panels = [], fileName = "solution.py", speed = 1400,
        arrayTitle,
    } = config;

    // Convert generator* to standard generateSteps array if needed.
    const generateSteps = config.generateSteps || function (...args) {
        const steps = [];
        if (config.generator) {
            const gen = config.generator(args);
            for (let val of gen) {
                steps.push(val);
            }
        }
        return steps;
    };

    // Input state — one state per input field
    const [inputValues, setInputValues] = useState(() =>
        (inputDefs || []).map(inp => inp.default || "")
    );
    const [parsedArgs, setParsedArgs] = useState(() => {
        if (defaults) return Object.values(defaults);
        return [];
    });
    const [steps, setSteps] = useState(() => generateSteps(...Object.values(defaults || {})));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, speed);
    const step = steps[idx];
    const pc = (phases && phases[step.phase]?.color) || "#6366f1";

    // Build phase maps for CodeEditorPanel
    const phaseColors = {};
    const phaseLabels = {};
    if (phases) {
        Object.entries(phases).forEach(([key, val]) => {
            phaseColors[key] = val.color;
            phaseLabels[key] = val.label;
        });
    }

    function handleRun() {
        const parsed = (inputDefs || []).map((inp, i) => {
            const raw = inputValues[i];
            if (inp.type === "array") {
                return raw.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            }
            if (inp.type === "number") return parseInt(raw);
            return raw;
        });
        // Validate
        const valid = (inputDefs || []).every((inp, i) => {
            if (inp.type === "array") return parsed[i].length >= (inp.minLen || 1) && parsed[i].length <= (inp.maxLen || 15);
            if (inp.type === "number") return !isNaN(parsed[i]);
            return true;
        });
        if (!valid) return;
        setParsedArgs(parsed);
        setSteps(generateSteps(...parsed));
        setIdx(0); setPlaying(false);
    }

    function handleReset() {
        const defaultVals = Object.values(defaults || {});
        setInputValues((inputDefs || []).map(inp => inp.default || ""));
        setParsedArgs(defaultVals);
        setSteps(generateSteps(...defaultVals));
        setIdx(0); setPlaying(false);
    }

    const subtitleText = typeof subtitle === "function" ? subtitle(parsedArgs) : subtitle;

    return (
        <SplitVizLayout
            title={title}
            subtitle={subtitleText}
            headerRightItem={headerRightItem}
            initialLeftWidth="50%" /* Balanced 50/50 split */
            fullRight={isPracticeMode}
            leftPanel={
                <>
                    <ExplainPanel sections={explain} />

                    {/* Input Section */}
                    {inputDefs && inputDefs.length > 0 && (
                        <DualInputSection
                            inputs={inputDefs.map((inp, i) => ({
                                label: inp.label,
                                value: inputValues[i],
                                onChange: (val) => {
                                    const next = [...inputValues];
                                    next[i] = val;
                                    setInputValues(next);
                                },
                                placeholder: inp.placeholder,
                                flex: inp.flex || "1 1 120px",
                                style: inp.style,
                            }))}
                            onRun={handleRun}
                            onReset={handleReset}
                        />
                    )}

                    {/* Variables */}
                    <VariablesPanel vars={step.vars} />

                    {/* Code Editor */}
                    <CodeEditorPanel
                        code={(code || []).map((c, i) => typeof c === 'string' ? { id: i, text: c } : c)}
                        step={step} phaseLabels={phaseLabels} phaseColors={phaseColors}
                        fileName={fileName} idx={idx} setIdx={setIdx} steps={steps}
                        playing={playing} setPlaying={setPlaying}
                    />
                </>
            }
            rightPanel={
                isPracticeMode ? (
                    <PracticeEditor
                        config={problemConfig}
                        embedded={true}
                        onClose={() => setIsPracticeMode(false)}
                    />
                ) : (
                    <>
                        <div style={{
                            display: "flex", flexDirection: "column", gap: "32px",
                            alignItems: "center", width: "100%", paddingBottom: "100px"
                        }}>
                            {/* Array Visualization */}
                            <VizCard title={arrayTitle || "📊 Array Dashboard"}>
                                <ArrayCells step={step} theme={theme} isDark={isDark} pc={pc} />
                            </VizCard>

                            {/* Optional: Result display */}
                            {step.result !== undefined && (
                                <div style={{
                                    textAlign: "center", fontSize: "1.2rem",
                                    fontWeight: "800", color: "#10b981",
                                    background: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)",
                                    border: `1px solid rgba(16, 185, 129, 0.3)`,
                                    borderRadius: "12px",
                                    padding: "12px 24px",
                                    boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)",
                                    backdropFilter: "blur(12px)",
                                }}>
                                    Output: {step.result}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                                {/* Optional: HashMap panel */}
                                {panels.includes("hashmap") && step.map && (
                                    <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
                                        <HashMapPanel
                                            entries={step.map}
                                            activeKey={step.mapActiveKey}
                                            highlightKey={step.mapHighlightKey}
                                            status={step.mapStatus}
                                            title={step.mapTitle || "Hash Map"}
                                        />
                                    </div>
                                )}

                                {/* Optional: Second HashMap panel */}
                                {panels.includes("hashmap") && step.map2 && (
                                    <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
                                        <HashMapPanel
                                            entries={step.map2}
                                            activeKey={step.map2ActiveKey}
                                            highlightKey={step.map2HighlightKey}
                                            status={step.map2Status}
                                            title={step.map2Title || "Hash Map 2"}
                                        />
                                    </div>
                                )}

                                {/* Optional: HashSet panel */}
                                {panels.includes("hashset") && step.set && (
                                    <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
                                        <HashSetPanel
                                            values={step.set}
                                            activeValue={step.setActiveValue}
                                            highlightValue={step.setHighlightValue}
                                            status={step.setStatus}
                                            title={step.setTitle || "Hash Set"}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Animations */}
                        <style>{`
                            @keyframes pulse-glow {
                                0% { transform: scale(1); opacity: 0.3; }
                                50% { transform: scale(1.05); opacity: 0.5; }
                                100% { transform: scale(1); opacity: 0.3; }
                            }
                            .markdown-body {
                                color: inherit !important;
                            }
                            .markdown-body pre {
                                background-color: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} !important;
                            }
                        `}</style>
                    </>
                )
            }
            controls={
                !isPracticeMode && (
                    <ProgressBar
                        idx={idx} total={steps.length} accentColor={pc}
                        gradientStart={step.phase === "found" || step.phase === "done" ? "#3b82f6" : undefined}
                    />
                )
            }
        />
    );
}
