// ═══════════════════════════════════════════════════════════════════
//  Array Visualization Engine — Data-driven renderer
//  Takes a problem config and renders full step-by-step visualization
// ═══════════════════════════════════════════════════════════════════

import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    VizLayout, VizCard, usePlayer, ExplainPanel,
    CodeEditorPanel, ProgressBar, DualInputSection,
    VariablesPanel, HashMapPanel, HashSetPanel,
} from "../shared/Components";

// ═══════════════════════════════════════════════════════════════════
//  Default Array Cell Renderer
// ═══════════════════════════════════════════════════════════════════

function ArrayCells({ step, theme, isDark, pc }) {
    const arr = step.array || step.nums || [];
    const pointers = step.pointers || {};       // { i: 2, j: 5, left: 0, right: 7 }
    const highlights = step.highlights || {};   // { 0: "active", 2: "comparing", 5: "sorted" }
    const labels = step.labels || {};           // { 0: "min", 3: "max" }

    const CELL_COLORS = {
        active: { bg: isDark ? `${pc}18` : `${pc}10`, border: pc, text: pc, scale: "scale(1.1) translateY(-3px)", shadow: `0 4px 16px ${pc}40` },
        comparing: { bg: isDark ? "#f59e0b18" : "#fef3c7", border: "#f59e0b", text: "#f59e0b", scale: "scale(1.08) translateY(-2px)", shadow: "0 4px 12px #f59e0b40" },
        swapped: { bg: isDark ? "#10b98118" : "#dcfce7", border: "#10b981", text: "#10b981", scale: "scale(1.12) translateY(-4px)", shadow: "0 6px 20px #10b98140" },
        sorted: { bg: isDark ? "#10b98112" : "#ecfdf5", border: "#10b98166", text: "#10b981", scale: "scale(1)", shadow: "none" },
        found: { bg: isDark ? "#10b98118" : "#dcfce7", border: "#10b981", text: "#10b981", scale: "scale(1.15) translateY(-6px)", shadow: "0 6px 24px #10b98140" },
        removed: { bg: isDark ? "#ef444418" : "#fef2f2", border: "#ef4444", text: "#ef4444", scale: "scale(0.9)", shadow: "none" },
        inserted: { bg: isDark ? "#3b82f618" : "#dbeafe", border: "#3b82f6", text: "#3b82f6", scale: "scale(1.1) translateY(-3px)", shadow: "0 4px 16px #3b82f640" },
        dimmed: { bg: isDark ? "#0f172a" : "#f8fafc", border: theme.cardBorder, text: theme.textDim, scale: "scale(1)", shadow: "none" },
    };
    const DEFAULT_CELL = { bg: isDark ? "#0f172a" : "#f1f5f9", border: theme.cardBorder, text: theme.text, scale: "scale(1)", shadow: "none" };

    // Map pointer positions for quick lookup
    const pointerAtIdx = {};
    Object.entries(pointers).forEach(([name, idx]) => {
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
                                width: "56px", height: "62px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                borderRadius: "12px",
                                background: cs.bg,
                                border: `2px solid ${cs.border}`,
                                transition: "all 0.4s ease",
                                transform: cs.scale,
                                boxShadow: cs.shadow,
                                position: "relative",
                            }}>
                                <span style={{
                                    fontSize: "1.3rem", fontWeight: "900", color: cs.text,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}>{val}</span>
                                <span style={{
                                    fontSize: "0.5rem", fontWeight: "600",
                                    color: state ? cs.text : theme.textDim,
                                }}>[{i}]</span>

                                {/* Checkmark for found/sorted */}
                                {(state === "found" || state === "swapped") && (
                                    <div style={{
                                        position: "absolute", top: "-8px", right: "-8px",
                                        width: "16px", height: "16px", borderRadius: "50%",
                                        background: cs.border, display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.5rem", color: "#fff", fontWeight: "900",
                                    }}>✓</div>
                                )}
                            </div>

                            {/* Pointer arrows below */}
                            {ptrs.length > 0 && (
                                <div style={{ display: "flex", gap: "3px", marginTop: "2px" }}>
                                    {ptrs.map(name => (
                                        <span key={name} style={{
                                            fontSize: "0.55rem", fontWeight: "800",
                                            color: POINTER_COLORS[name] || pc,
                                            display: "flex", flexDirection: "column", alignItems: "center",
                                            lineHeight: 1,
                                        }}>
                                            <span style={{ fontSize: "0.7rem" }}>↑</span>
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
                                <span style={{ fontSize: "1rem", fontWeight: "800", color: "#10b981" }}>{val}</span>
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

export default function ArrayVizEngine({ config }) {
    const { theme, isDark } = useTheme();

    // Parse config
    const {
        title, subtitle, code, explain, defaults,
        inputs: inputDefs, generateSteps, phases,
        panels = [], fileName = "solution.py", speed = 1400,
        arrayTitle,
    } = config;

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
        <VizLayout title={title} subtitle={subtitleText}>
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

            {/* Code + Variables */}
            <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodeEditorPanel
                    code={code} step={step} phaseLabels={phaseLabels} phaseColors={phaseColors}
                    fileName={fileName} idx={idx} setIdx={setIdx} steps={steps}
                    playing={playing} setPlaying={setPlaying}
                />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <VariablesPanel vars={step.vars} />
                </div>
            </div>

            {/* Array Visualization */}
            <VizCard title={arrayTitle || "📊 Array"}>
                <ArrayCells step={step} theme={theme} isDark={isDark} pc={pc} />
            </VizCard>

            {/* Optional: Result display */}
            {step.result !== undefined && (
                <div style={{
                    textAlign: "center", fontSize: "0.85rem",
                    fontWeight: "800", color: "#10b981",
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: "4px 0",
                }}>
                    {step.result}
                </div>
            )}

            {/* Optional: HashMap panel */}
            {panels.includes("hashmap") && step.map && (
                <HashMapPanel
                    entries={step.map}
                    activeKey={step.mapActiveKey}
                    highlightKey={step.mapHighlightKey}
                    status={step.mapStatus}
                    title={step.mapTitle || "Hash Map"}
                />
            )}

            {/* Optional: HashSet panel */}
            {panels.includes("hashset") && step.set && (
                <HashSetPanel
                    values={step.set}
                    activeValue={step.setActiveValue}
                    highlightValue={step.setHighlightValue}
                    status={step.setStatus}
                    title={step.setTitle || "Hash Set"}
                />
            )}

            {/* Progress */}
            <ProgressBar
                idx={idx} total={steps.length} accentColor={pc}
                gradientStart={step.phase === "found" || step.phase === "done" ? "#3b82f6" : undefined}
            />
        </VizLayout>
    );
}
