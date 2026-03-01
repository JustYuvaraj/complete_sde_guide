import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useTheme } from "./ThemeContext";

/* ━━━ Code Panel ━━━ */
export function CodePanel({ code, activeLineId, accentColor, fileName }) {
    const { theme } = useTheme();
    return (
        <div style={{
            flex: "1 1 320px", background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`, borderRadius: "12px", overflow: "hidden",
        }}>
            <div style={{
                background: theme.cardHeaderBg, padding: "6px 14px",
                fontSize: "0.63rem", color: theme.textMuted,
                borderBottom: `1px solid ${theme.cardHeaderBorder}`,
            }}>
                {fileName}
            </div>
            <div style={{ padding: "4px 0" }}>
                {code.map(line => {
                    const active = line.id === activeLineId;
                    return (
                        <div key={line.id} style={{
                            display: "flex", alignItems: "center", padding: "1.5px 0",
                            background: active ? theme.lineHighlightBg : "transparent",
                            borderLeft: `3px solid ${active ? (accentColor || "#818cf8") : "transparent"}`,
                            transition: "background 0.3s",
                        }}>
                            <span style={{
                                width: "24px", textAlign: "right", color: theme.textDim,
                                fontSize: "0.6rem", paddingRight: "8px", flexShrink: 0,
                            }}>
                                {line.id + 1}
                            </span>
                            <span style={{
                                fontSize: "0.7rem", whiteSpace: "pre",
                                color: active ? theme.textCodeActive : line.text === "" ? "transparent" : theme.textCode,
                                fontWeight: active ? "700" : "400",
                            }}>
                                {line.text || " "}
                            </span>
                            {active && (
                                <span style={{
                                    marginLeft: "6px", fontSize: "0.55rem",
                                    background: theme.executingBg, color: theme.executingText,
                                    padding: "1px 5px", borderRadius: "3px",
                                }}>
                                    ←
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ━━━ Variables Panel ━━━ */
export function VariablesPanel({ vars, title = "🔍 Variables" }) {
    const { theme } = useTheme();
    const entries = Object.entries(vars || {});
    return (
        <div style={{
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px", overflow: "hidden",
        }}>
            <div style={{
                background: theme.cardHeaderBg, padding: "6px 14px",
                fontSize: "0.63rem", color: theme.textMuted,
                borderBottom: `1px solid ${theme.cardHeaderBorder}`,
            }}>
                {title}
            </div>
            <div style={{ padding: "6px 12px", minHeight: "40px" }}>
                {entries.length === 0
                    ? <span style={{ color: theme.textDim, fontSize: "0.68rem" }}>—</span>
                    : entries.map(([k, v]) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between",
                            gap: "6px", marginBottom: "3px",
                        }}>
                            <span style={{ color: theme.varKey, fontSize: "0.68rem" }}>{k}</span>
                            <span style={{ color: theme.varVal, fontSize: "0.68rem", fontWeight: "700" }}>
                                {String(v)}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

/* ━━━ Variable Guide Panel (Static info) ━━━ */
export function VariableGuide({ defs, title = "📖 Variable Guide" }) {
    const { theme } = useTheme();
    if (!defs || defs.length === 0) return null;
    return (
        <div style={{
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px", overflow: "hidden",
        }}>
            <div style={{
                background: theme.cardHeaderBg, padding: "6px 14px",
                fontSize: "0.63rem", color: theme.textMuted,
                borderBottom: `1px solid ${theme.cardHeaderBorder}`,
            }}>
                {title}
            </div>
            <div style={{ padding: "8px 12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.65rem" }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.cardBorder}`, textAlign: "left" }}>
                            <th style={{ padding: "4px 0", color: theme.textDim, fontWeight: "600" }}>Var</th>
                            <th style={{ padding: "4px 0", color: theme.textDim, fontWeight: "600" }}>Type</th>
                            <th style={{ padding: "4px 0", color: theme.textDim, fontWeight: "600" }}>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defs.map((d, i) => (
                            <tr key={i} style={{ borderBottom: i === defs.length - 1 ? "none" : `1px solid ${theme.cardHeaderBorder}` }}>
                                <td style={{ padding: "6px 0", color: theme.varKey, fontWeight: "800", fontFamily: "monospace" }}>{d.name}</td>
                                <td style={{ padding: "6px 0", color: theme.textDim }}>{d.type}</td>
                                <td style={{ padding: "6px 0", color: theme.text, lineHeight: "1.3" }}>{d.purpose}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ━━━ Call Stack Panel ━━━ */
export function CallStackPanel({ frames, renderFrame, emptyText = "empty" }) {
    const { theme } = useTheme();
    return (
        <div style={{
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px", overflow: "hidden", flex: 1,
        }}>
            <div style={{
                background: theme.cardHeaderBg, padding: "6px 14px",
                fontSize: "0.63rem", color: theme.textMuted,
                borderBottom: `1px solid ${theme.cardHeaderBorder}`,
            }}>
                📚 Call Stack
            </div>
            <div style={{
                padding: "6px 12px", display: "flex", flexDirection: "column-reverse",
                gap: "3px", minHeight: "40px", maxHeight: "160px", overflowY: "auto",
            }}>
                {frames.length === 0
                    ? <span style={{ color: theme.textDim, fontSize: "0.68rem" }}>{emptyText}</span>
                    : frames.map((frame, i) => {
                        const isTop = i === frames.length - 1;
                        const label = renderFrame ? renderFrame(frame) : String(frame);
                        return (
                            <div key={i} style={{
                                background: isTop ? theme.stackActiveBg : theme.stackBg,
                                border: `1px solid ${isTop ? theme.stackActiveBorder : theme.stackBorder}`,
                                borderRadius: "5px", padding: "3px 8px", fontSize: "0.65rem",
                                color: isTop ? theme.stackActiveText : theme.stackText,
                                fontWeight: isTop ? "700" : "400",
                                display: "flex", justifyContent: "space-between",
                            }}>
                                <span>{label}</span>
                                <span style={{
                                    color: isTop ? theme.stackActiveAccent : theme.stackMuted,
                                    fontSize: "0.55rem",
                                }}>
                                    {isTop ? "▶ active" : "waiting"}
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

/* ━━━ Message Bar ━━━ */
export function MessageBar({ phase, phaseLabel, msg, accentColor }) {
    const { theme } = useTheme();
    const pc = accentColor || "#6366f1";
    return (
        <div style={{
            width: "100%", maxWidth: "920px",
            background: theme.msgBg,
            border: `1px solid ${pc}44`,
            borderLeft: `3px solid ${pc}`,
            borderRadius: "10px", padding: "8px 14px",
            fontSize: "0.73rem", color: theme.text, lineHeight: "1.4",
        }}>
            <span style={{
                opacity: 0.6, marginRight: "8px", fontSize: "0.6rem",
                textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
                {phaseLabel}
            </span>
            {msg}
        </div>
    );
}

// ── Deprecated: ControlPanel (Use usePlayer + CodeEditorPanel instead) ──
export function ControlPanel({ currentStep, totalSteps, onStepChange }) {
    const { theme, isDark } = useTheme();
    return (
        <div style={{
            display: "flex", gap: "10px", alignItems: "center",
            padding: "16px 24px", background: isDark ? "rgba(22, 27, 34, 0.75)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)", borderRadius: "16px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.1)",
        }}>
            <button
                onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                    background: theme.btnBg, color: theme.text, border: `1px solid ${theme.cardBorder}`,
                    borderRadius: "8px", padding: "6px 16px", cursor: "pointer", opacity: currentStep === 0 ? 0.5 : 1
                }}
            >
                Prev
            </button>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: theme.text, minWidth: "100px", textAlign: "center" }}>
                Step {currentStep + 1} / {totalSteps}
            </span>
            <button
                onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
                disabled={currentStep === totalSteps - 1}
                style={{
                    background: "#818cf8", color: "#fff", border: "none",
                    borderRadius: "8px", padding: "6px 16px", cursor: "pointer", opacity: currentStep === totalSteps - 1 ? 0.5 : 1
                }}
            >
                Next
            </button>
        </div>
    );
}

/* ━━━ Control Bar (Legacy) ━━━ */
export function ControlBar({ idx, total, playing, setPlaying, setIdx }) {
    const { theme } = useTheme();
    const btns = [
        { label: "↺ Reset", onClick: () => { setPlaying(false); setIdx(0); }, disabled: false, hl: false },
        { label: "‹ Prev", onClick: () => setIdx(i => Math.max(0, i - 1)), disabled: idx === 0, hl: false },
        { label: playing ? "⏸ Pause" : "▶ Play", onClick: () => setPlaying(p => !p), disabled: false, hl: true },
        { label: "Next ›", onClick: () => setIdx(i => Math.min(total - 1, i + 1)), disabled: idx === total - 1, hl: false },
    ];
    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {btns.map(b => (
                <button key={b.label} onClick={b.onClick} disabled={b.disabled} style={{
                    background: b.hl ? theme.btnHighlightBg : theme.btnBg,
                    color: b.disabled ? theme.btnDisabledText : b.hl ? "#fff" : theme.btnText,
                    border: `1px solid ${b.hl ? theme.btnHighlightBorder : theme.btnBorder}`,
                    borderRadius: "8px", padding: "7px 16px",
                    fontSize: "0.72rem", fontFamily: "inherit", fontWeight: "700",
                    cursor: b.disabled ? "not-allowed" : "pointer",
                    opacity: b.disabled ? 0.4 : 1,
                }}>{b.label}</button>
            ))}
        </div>
    );
}

/* ━━━ Viz Card (generic panel wrapper) ━━━ */
export function VizCard({ title, children, maxWidth = "920px" }) {
    const { theme } = useTheme();
    return (
        <div style={{
            background: theme.isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: theme.isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.05)",
            borderRadius: "16px", padding: "16px 20px",
            width: "100%", maxWidth,
        }}>
            {title && (
                <div style={{
                    fontSize: "0.63rem", color: theme.textMuted, marginBottom: "6px",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
}

/* ━━━ Step Info (legend bar) ━━━ */
export function StepInfo({ idx, total, children }) {
    const { theme } = useTheme();
    return (
        <div style={{ fontSize: "0.63rem", color: theme.stepInfo, textAlign: "center", lineHeight: "1.6" }}>
            Step {idx + 1} / {total}
            {children && <>&nbsp;·&nbsp;{children}</>}
        </div>
    );
}

/* ━━━ usePlayerState hook ━━━ */
export function usePlayer(totalSteps, speed = 1600) {
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        if (playing) {
            timer.current = setTimeout(() => {
                if (idx < totalSteps - 1) setIdx(i => i + 1);
                else setPlaying(false);
            }, speed);
        }
        return () => clearTimeout(timer.current);
    }, [playing, idx, totalSteps, speed]);

    return { idx, setIdx, playing, setPlaying };
}

/* ━━━ Viz Layout (wrapper for each problem) ━━━ */
export function VizLayout({ title, subtitle, children }) {
    const { theme } = useTheme();
    return (
        <div style={{
            minHeight: "100vh", boxSizing: "border-box",
            color: theme.text,
            fontFamily: "'Fira Code','JetBrains Mono',monospace",
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "12px 16px 8px", gap: "8px",
            overflow: "auto",
        }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
                <h1 style={{
                    margin: 0, fontSize: "1.1rem", fontWeight: 800,
                    color: "#818cf8", letterSpacing: "-0.02em",
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{ margin: "2px 0 0", color: theme.textMuted, fontSize: "0.65rem" }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}

/* ━━━ Input Section (dynamic input for each problem) ━━━ */
export function InputSection({ value, onChange, onRun, onReset, placeholder, label }) {
    const { theme } = useTheme();
    return (
        <div style={{
            display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap",
            width: "100%", maxWidth: "920px",
        }}>
            <span style={{ fontSize: "0.6rem", color: theme.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>
                {label || "Input:"}
            </span>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onRun()}
                placeholder={placeholder}
                style={{
                    flex: 1, minWidth: "120px",
                    background: theme.cardBg, color: theme.text,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: "6px", padding: "5px 10px",
                    fontSize: "0.7rem", fontFamily: "inherit",
                    outline: "none",
                }}
            />
            <button onClick={onRun} style={{
                background: theme.btnHighlightBg, color: "#fff",
                border: `1px solid ${theme.btnHighlightBorder}`,
                borderRadius: "6px", padding: "5px 14px",
                fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "700",
                cursor: "pointer",
            }}>
                ▶ Run
            </button>
            <button onClick={onReset} style={{
                background: theme.btnBg, color: theme.btnText,
                border: `1px solid ${theme.btnBorder}`,
                borderRadius: "6px", padding: "5px 10px",
                fontSize: "0.65rem", fontFamily: "inherit", fontWeight: "600",
                cursor: "pointer",
            }}>
                ↺ Default
            </button>
        </div>
    );
}

/* ━━━ Explain Panel (expandable "How to Think" section) ━━━ */
export function ExplainPanel({ sections = [] }) {
    const { theme, isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // sections: [{ icon, title, content (string or JSX), color }]
    if (!sections.length) return null;

    const accentColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

    return (
        <div style={{
            width: "100%", maxWidth: "920px", flexShrink: 0,
            display: "flex", flexDirection: "column",
            background: isDark ? "#0d1117" : "#f8fafc",
            border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
            borderRadius: "12px", overflow: "hidden",
            transition: "all 0.3s",
        }}>
            {/* Toggle header */}
            <button onClick={() => setOpen(!open)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 16px", background: "transparent", border: "none",
                cursor: "pointer", color: isDark ? "#e2e8f0" : "#1e293b",
                fontFamily: "'Fira Code','JetBrains Mono',monospace",
                fontSize: "0.85rem", fontWeight: 800, textAlign: "left",
                flexShrink: 0,
            }}>
                <span style={{
                    fontSize: "1.1rem",
                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s", display: "inline-block",
                }}>▶</span>
                <span>🧠 How to Think & Solve This Problem</span>
                <span style={{
                    marginLeft: "auto", fontSize: "0.55rem", fontWeight: 600,
                    color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase",
                    letterSpacing: "0.1em",
                }}>{open ? "collapse" : "expand"}</span>
            </button>

            {/* Content */}
            {open && (
                <div style={{
                    borderTop: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                    display: "flex", flexDirection: "column",
                    maxHeight: "35vh", // Limits the overall open height explicitly
                }}>
                    {/* Tabs */}
                    <div style={{
                        display: "flex", gap: "0", overflowX: "auto",
                        borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                        flexShrink: 0,
                    }}>
                        {sections.map((sec, i) => {
                            const isActive = i === activeTab;
                            const col = sec.color || accentColors[i % accentColors.length];
                            return (
                                <button key={i} onClick={() => setActiveTab(i)} style={{
                                    flex: "1 1 0", padding: "8px 12px",
                                    background: isActive ? (isDark ? "#111827" : "#fff") : "transparent",
                                    border: "none",
                                    borderBottom: `2px solid ${isActive ? col : "transparent"}`,
                                    cursor: "pointer",
                                    color: isActive ? col : (isDark ? "#64748b" : "#94a3b8"),
                                    fontFamily: "'Fira Code','JetBrains Mono',monospace",
                                    fontSize: "0.68rem", fontWeight: isActive ? 800 : 600,
                                    display: "flex", alignItems: "center", gap: "6px",
                                    justifyContent: "center", whiteSpace: "nowrap",
                                    transition: "all 0.2s",
                                }}>
                                    <span style={{ fontSize: "0.9rem" }}>{sec.icon}</span>
                                    {sec.title}
                                </button>
                            );
                        })}
                    </div>

                    {/* Injection of sleek scrollbar styles for this component */}
                    <style>{`
                        .explain-scroll::-webkit-scrollbar {
                            width: 6px;
                            background-color: transparent;
                        }
                        .explain-scroll::-webkit-scrollbar-track {
                            background-color: transparent;
                            border-radius: 10px;
                        }
                        .explain-scroll::-webkit-scrollbar-thumb {
                            background-color: ${isDark ? "#334155" : "#cbd5e1"};
                            border-radius: 10px;
                        }
                        .explain-scroll::-webkit-scrollbar-thumb:hover {
                            background-color: ${isDark ? "#475569" : "#94a3b8"};
                        }
                    `}</style>
                    {/* Active Tab Content */}
                    <div className="explain-scroll" style={{
                        padding: "16px 20px",
                        fontSize: "1.05rem", lineHeight: "1.8",
                        color: isDark ? "#cbd5e1" : "#334155",
                        overflowY: "auto",
                        flex: 1, /* Takes up the remaining height in 35vh and scrolls */
                    }}>
                        {typeof sections[activeTab].content === "string"
                            ? <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ node, ...props }) => <p style={{ marginBottom: '0.4rem' }} {...props} />,
                                    pre: ({ node, ...props }) => <pre style={{
                                        background: isDark ? '#1e293b' : '#f1f5f9',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        overflowX: 'auto',
                                        fontSize: '0.85rem',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`
                                    }} {...props} />,
                                    code: ({ node, inline, ...props }) => inline
                                        ? <code style={{
                                            background: isDark ? '#1e293b' : '#f1f5f9',
                                            padding: '1px 4px',
                                            borderRadius: '3px',
                                            color: isDark ? '#93c5fd' : '#1e40af',
                                            fontSize: '0.85rem',
                                            fontFamily: "'JetBrains Mono', monospace"
                                        }} {...props} />
                                        : <code style={{ fontFamily: "'JetBrains Mono', monospace" }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#e2e8f0' : '#1e293b', marginTop: '14px', marginBottom: '6px', borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`, paddingBottom: '4px' }} {...props} />,
                                    h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: sections[activeTab].color || "#6366f1", marginTop: '12px', marginBottom: '4px' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.4rem' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: '0.2rem' }} {...props} />,
                                    table: ({ node, ...props }) => <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '0.4rem', fontSize: '0.85rem' }} {...props} />,
                                    th: ({ node, ...props }) => <th style={{ border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, padding: '4px 8px', background: isDark ? "#1e293b" : "#f1f5f9" }} {...props} />,
                                    td: ({ node, ...props }) => <td style={{ border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, padding: '4px 8px' }} {...props} />,
                                }}
                            >
                                {sections[activeTab].content}
                            </ReactMarkdown>
                            : sections[activeTab].content
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

/* ━━━ Code Editor Panel (polished, with inline controls) ━━━ */
export function CodeEditorPanel({
    code, step, phaseLabels, phaseColors,
    fileName, idx, setIdx, steps, playing, setPlaying,
}) {
    const { theme, isDark } = useTheme();
    const pc = (phaseColors && phaseColors[step.phase]) || "#6366f1";
    const phaseLabel = (phaseLabels && phaseLabels[step.phase]) || step.phase;

    return (
        <div style={{
            flex: "1 1 340px", background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`, borderRadius: "12px", overflow: "hidden",
            display: "flex", flexDirection: "column"
        }}>
            {/* Header: file + controls */}
            <div style={{
                background: theme.cardHeaderBg, padding: "5px 12px",
                borderBottom: `1px solid ${theme.cardHeaderBorder}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.63rem", color: theme.textMuted }}>{fileName}</span>
                    <span style={{
                        fontSize: "0.5rem", padding: "1px 6px", borderRadius: "4px",
                        background: `${pc}20`, border: `1px solid ${pc}40`,
                        color: pc, fontWeight: "700",
                    }}>{phaseLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <span style={{
                        fontSize: "0.55rem", color: theme.textDim, marginRight: "6px",
                        fontFamily: "monospace", fontWeight: "600",
                    }}>
                        {idx + 1}<span style={{ opacity: 0.4 }}>/</span>{steps.length}
                    </span>
                    {[
                        { label: "⟲", tip: "Reset", act: () => { setIdx(0); setPlaying(false); } },
                        { label: "‹", tip: "Prev Step", act: () => { setIdx(Math.max(0, idx - 1)); setPlaying(false); } },
                        { label: playing ? "⏸" : "▶", tip: playing ? "Pause" : "Auto Play", act: () => setPlaying(!playing), accent: true },
                        { label: "›", tip: "Next Step", act: () => { setIdx(Math.min(steps.length - 1, idx + 1)); setPlaying(false); } },
                    ].map((b, i) => (
                        <button key={i} onClick={b.act} title={b.tip} style={{
                            width: b.accent ? "28px" : "22px", height: "22px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: b.accent ? pc : (isDark ? "#ffffff0a" : "#00000006"),
                            color: b.accent ? "#fff" : theme.textDim,
                            border: `1px solid ${b.accent ? pc : theme.cardBorder}`,
                            borderRadius: "6px", cursor: "pointer",
                            fontSize: b.accent ? "0.6rem" : "0.8rem",
                            fontWeight: "800", transition: "all 0.15s",
                        }}
                            onMouseOver={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
                            onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; }}
                        >{b.label}</button>
                    ))}
                </div>
            </div>

            {/* Code lines */}
            <div style={{ padding: "4px 0", overflowY: "auto", flex: 1 }}>
                <style>{`
    div::-webkit-scrollbar { width: 6px; }
    div::-webkit-scrollbar-track { background: transparent; }
    div::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
`}</style>
                {code.map(line => {
                    const active = line.id === step.cl;
                    return (
                        <div key={line.id} style={{
                            display: "flex", alignItems: "center", padding: "1.5px 0",
                            background: active ? theme.lineHighlightBg : "transparent",
                            borderLeft: `3px solid ${active ? pc : "transparent"}`,
                            transition: "background 0.3s",
                        }}>
                            <span style={{
                                width: "24px", textAlign: "right", color: theme.textDim,
                                fontSize: "0.6rem", paddingRight: "8px", flexShrink: 0,
                            }}>{line.id + 1}</span>
                            <span style={{
                                fontSize: "0.7rem", whiteSpace: "pre",
                                color: active ? theme.textCodeActive : line.text === "" ? "transparent" : theme.textCode,
                                fontWeight: active ? "700" : "400",
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                            }}>{line.text || " "}</span>
                            {active && (
                                <span style={{
                                    marginLeft: "auto", marginRight: "10px",
                                    fontSize: "0.5rem",
                                    background: `${pc}25`, color: pc,
                                    padding: "1px 6px", borderRadius: "4px",
                                    fontWeight: "700", border: `1px solid ${pc}44`,
                                }}>executing</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Status bar */}
            <div style={{
                padding: "6px 12px", fontSize: "0.68rem", fontWeight: "500",
                borderTop: `1px solid ${theme.cardHeaderBorder}`,
                background: `${pc}06`, color: theme.text,
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}>
                <span style={{ color: pc, fontWeight: "700" }}>▸</span>
                {step.msg}
            </div>
        </div>
    );
}

/* ━━━ Progress Bar ━━━ */
export function ProgressBar({ idx, total, accentColor, gradientStart = "#3b82f6" }) {
    const { isDark } = useTheme();
    return (
        <div style={{
            width: "100%", maxWidth: "920px", height: "4px",
            background: isDark ? "#1e293b" : "#e2e8f0",
            borderRadius: "2px", overflow: "hidden",
        }}>
            <div style={{
                height: "100%", borderRadius: "2px",
                width: `${((idx + 1) / total) * 100}%`,
                background: `linear-gradient(90deg, ${gradientStart}, ${accentColor || gradientStart})`,
                transition: "width 0.4s ease",
            }} />
        </div>
    );
}

/* ━━━ Dual Input Section (two+ labeled inputs with Run/Default) ━━━ */
export function DualInputSection({ inputs = [], onRun, onReset }) {
    const { theme, isDark } = useTheme();
    return (
        <div style={{
            display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap",
            width: "100%", maxWidth: "920px",
        }}>
            {inputs.map((inp, i) => (
                <span key={i} style={{ display: "contents" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.textDim }}>{inp.label}</span>
                    <input
                        value={inp.value}
                        onChange={e => inp.onChange(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && onRun()}
                        placeholder={inp.placeholder}
                        style={{
                            flex: inp.flex || "1 1 120px", padding: "6px 12px", borderRadius: "8px",
                            background: isDark ? "#1e293b" : "#f1f5f9",
                            border: `1px solid ${theme.cardBorder}`, color: theme.text,
                            fontSize: "0.8rem", fontFamily: "monospace",
                            ...(inp.style || {}),
                        }}
                    />
                </span>
            ))}
            <button onClick={onRun} style={{
                padding: "6px 16px", borderRadius: "8px",
                background: "#6366f1", color: "#fff", border: "none",
                cursor: "pointer", fontWeight: "700", fontSize: "0.75rem",
            }}>▶ Run</button>
            <button onClick={onReset} style={{
                padding: "6px 12px", borderRadius: "8px",
                background: isDark ? "#1e293b" : "#f1f5f9",
                color: theme.text, border: `1px solid ${theme.cardBorder}`,
                cursor: "pointer", fontWeight: "600", fontSize: "0.75rem",
            }}>↺ Default</button>
        </div>
    );
}

/* ━━━ Hash Map Panel (bucket-style visualization) ━━━
 * entries: object { key: value, ... }  e.g. { "2": 0, "7": 1 }
 * activeKey: key being currently inserted/searched
 * highlightKey: key that was found/matched
 * status: "inserting" | "found" | "searching" | null
 * title: custom title string
 * bucketCount: number of buckets to display (default 7)
 */
export function HashMapPanel({
    entries = {}, activeKey, highlightKey, status,
    title, bucketCount = 7,
}) {
    const { theme, isDark } = useTheme();
    const keys = Object.keys(entries);

    /* Build bucket structure */
    const hashKey = (k) => {
        const n = parseInt(k);
        if (!isNaN(n)) return ((n % bucketCount) + bucketCount) % bucketCount;
        // Simple string hash for non-numeric keys
        let h = 0;
        for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) | 0;
        return ((h % bucketCount) + bucketCount) % bucketCount;
    };
    const buckets = Array.from({ length: bucketCount }, () => []);
    keys.forEach(key => {
        buckets[hashKey(key)].push({ key, value: entries[key] });
    });

    const statusColors = {
        inserting: "#3b82f6",
        found: "#10b981",
        searching: "#f59e0b",
    };
    const sc = statusColors[status] || "#6366f1";

    return (
        <div style={{
            width: "100%", maxWidth: "920px",
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.05)",
            borderRadius: "16px", overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{
                padding: "10px 16px",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem" }}>🗂️</span>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: "800",
                        color: theme.text, fontFamily: "monospace",
                        textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>{title || "Hash Map"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                        fontSize: "0.55rem", fontWeight: "700", color: theme.textDim,
                        fontFamily: "monospace",
                    }}>{keys.length} entries · {bucketCount} buckets</span>
                    {status && (
                        <span style={{
                            fontSize: "0.5rem", padding: "1px 8px", borderRadius: "4px",
                            background: `${sc}20`, border: `1px solid ${sc}40`,
                            color: sc, fontWeight: "700", textTransform: "uppercase",
                        }}>{status === "inserting" ? "INSERT" : status === "found" ? "FOUND" : "LOOKUP"}</span>
                    )}
                </div>
            </div>

            {/* Hash function indicator */}
            {activeKey != null && status === "inserting" && (
                <div style={{
                    padding: "4px 14px", fontSize: "0.6rem",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: "600",
                    color: sc,
                    background: `${sc}06`,
                    borderBottom: `1px solid ${theme.cardHeaderBorder}`,
                    display: "flex", alignItems: "center", gap: "6px",
                }}>
                    <span style={{ opacity: 0.7 }}>hash(</span>
                    <span style={{ fontWeight: "900" }}>{activeKey}</span>
                    <span style={{ opacity: 0.7 }}>) % {bucketCount} = </span>
                    <span style={{
                        fontWeight: "900",
                        background: `${sc}20`, padding: "0 4px", borderRadius: "3px",
                    }}>{hashKey(String(activeKey))}</span>
                </div>
            )}

            {/* Bucket rows */}
            <div style={{ padding: "6px 0" }}>
                {buckets.map((bucket, bi) => {
                    const hasActive = bucket.some(e => String(e.key) === String(activeKey));
                    const hasHighlight = bucket.some(e => String(e.key) === String(highlightKey));
                    const isEmpty = bucket.length === 0;

                    return (
                        <div key={bi} style={{
                            display: "flex", alignItems: "center",
                            padding: "3px 14px", minHeight: "32px",
                            background: hasActive ? `${sc}06` : hasHighlight ? "#10b98106" : "transparent",
                            borderLeft: `3px solid ${hasActive ? sc : hasHighlight ? "#10b981" : "transparent"}`,
                            transition: "all 0.3s",
                        }}>
                            {/* Bucket number */}
                            <span style={{
                                width: "32px", flexShrink: 0,
                                fontSize: "0.55rem", fontWeight: "700",
                                fontFamily: "monospace",
                                color: hasActive ? sc : hasHighlight ? "#10b981" : theme.textDim,
                                opacity: isEmpty ? 0.3 : 1,
                            }}>#{bi}</span>

                            {/* Entries in this bucket */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", flex: 1,
                            }}>
                                {isEmpty ? (
                                    <span style={{
                                        fontSize: "0.5rem", color: theme.textDim, opacity: 0.25,
                                        fontFamily: "monospace",
                                    }}>—</span>
                                ) : (
                                    bucket.map((entry, ei) => {
                                        const isActive = String(entry.key) === String(activeKey);
                                        const isFound = String(entry.key) === String(highlightKey);
                                        const eColor = isFound ? "#10b981" : isActive ? sc : theme.textDim;

                                        return (
                                            <React.Fragment key={ei}>
                                                {/* Chain arrow */}
                                                {ei > 0 && (
                                                    <span style={{
                                                        fontSize: "0.6rem", color: theme.textDim,
                                                        fontWeight: "700", opacity: 0.5,
                                                    }}>→</span>
                                                )}
                                                {/* Entry pill */}
                                                <div style={{
                                                    display: "flex", alignItems: "center", gap: "0",
                                                    borderRadius: "8px", overflow: "hidden",
                                                    border: `1.5px solid ${isActive || isFound ? eColor : theme.cardBorder}`,
                                                    transition: "all 0.3s",
                                                    transform: isActive || isFound ? "scale(1.08)" : "scale(1)",
                                                    boxShadow: isActive ? `0 2px 12px ${sc}40`
                                                        : isFound ? "0 2px 12px #10b98140" : "none",
                                                }}>
                                                    {/* Key cell */}
                                                    <div style={{
                                                        padding: "3px 8px",
                                                        background: isActive ? `${sc}18`
                                                            : isFound ? "#10b98118"
                                                                : (isDark ? "#1e293b" : "#f1f5f9"),
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: "0.72rem", fontWeight: "900",
                                                        color: isFound ? "#10b981" : isActive ? sc : theme.text,
                                                    }}>{entry.key}</div>
                                                    {/* Arrow separator */}
                                                    <div style={{
                                                        padding: "3px 4px",
                                                        background: isDark ? "#0f172a88" : "#e2e8f088",
                                                        fontSize: "0.5rem", color: theme.textDim,
                                                        fontWeight: "700",
                                                    }}>→</div>
                                                    {/* Value cell */}
                                                    <div style={{
                                                        padding: "3px 8px",
                                                        background: isActive ? `${sc}10`
                                                            : isFound ? "#10b98110"
                                                                : (isDark ? "#0f172a" : "#f8fafc"),
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        fontSize: "0.68rem", fontWeight: "600",
                                                        color: isFound ? "#10b981" : isActive ? sc : theme.textDim,
                                                    }}>idx {entry.value}</div>
                                                </div>

                                                {/* Badge */}
                                                {isActive && status === "inserting" && (
                                                    <span style={{
                                                        fontSize: "0.45rem", fontWeight: "800",
                                                        padding: "1px 5px", borderRadius: "4px",
                                                        background: sc, color: "#fff",
                                                        animation: "fadeIn 0.3s ease",
                                                    }}>NEW</span>
                                                )}
                                                {isFound && (
                                                    <span style={{
                                                        fontSize: "0.45rem", fontWeight: "800",
                                                        padding: "1px 5px", borderRadius: "4px",
                                                        background: "#10b981", color: "#fff",
                                                    }}>MATCH</span>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


/* ━━━ Hash Set Panel (bucket-style visualization) ━━━
 * values: array of values in the set, e.g. [1, 2, 3]
 * activeValue: value being currently inserted/searched
 * highlightValue: value that was found/matched
 * status: "inserting" | "found" | "searching" | null
 * title: custom title string
 * bucketCount: number of buckets to display (default 7)
 */
export function HashSetPanel({
    values = [], activeValue, highlightValue, status,
    title, bucketCount = 7,
}) {
    const { theme, isDark } = useTheme();

    /* Build bucket structure */
    const hashVal = (v) => {
        if (typeof v === 'number') return ((v % bucketCount) + bucketCount) % bucketCount;
        const s = String(v);
        let h = 0;
        for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
        return ((h % bucketCount) + bucketCount) % bucketCount;
    };
    const buckets = Array.from({ length: bucketCount }, () => []);
    values.forEach(val => {
        buckets[hashVal(val)].push(val);
    });

    const statusColors = {
        inserting: "#3b82f6",
        found: "#ef4444",
        searching: "#f59e0b",
    };
    const sc = statusColors[status] || "#6366f1";

    return (
        <div style={{
            width: "100%", maxWidth: "920px",
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.05)",
            borderRadius: "16px", overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{
                padding: "10px 16px",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem" }}>🗃️</span>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: "800",
                        color: theme.text, fontFamily: "monospace",
                        textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>{title || "Hash Set"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                        fontSize: "0.55rem", fontWeight: "700", color: theme.textDim,
                        fontFamily: "monospace",
                    }}>{values.length} elements · {bucketCount} buckets</span>
                    {status && (
                        <span style={{
                            fontSize: "0.5rem", padding: "1px 8px", borderRadius: "4px",
                            background: `${sc}20`, border: `1px solid ${sc}40`,
                            color: sc, fontWeight: "700", textTransform: "uppercase",
                        }}>{status === "inserting" ? "INSERT" : status === "found" ? "FOUND!" : "LOOKUP"}</span>
                    )}
                </div>
            </div>

            {/* Hash function indicator */}
            {
                activeValue != null && status === "inserting" && (
                    <div style={{
                        padding: "4px 14px", fontSize: "0.6rem",
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: "600",
                        color: sc,
                        background: `${sc}06`,
                        borderBottom: `1px solid ${theme.cardHeaderBorder}`,
                        display: "flex", alignItems: "center", gap: "6px",
                    }}>
                        <span style={{ opacity: 0.7 }}>hash(</span>
                        <span style={{ fontWeight: "900" }}>{activeValue}</span>
                        <span style={{ opacity: 0.7 }}>) % {bucketCount} = </span>
                        <span style={{
                            fontWeight: "900",
                            background: `${sc}20`, padding: "0 4px", borderRadius: "3px",
                        }}>{hashVal(activeValue)}</span>
                    </div>
                )
            }

            {/* Bucket rows */}
            <div style={{ padding: "6px 0" }}>
                {buckets.map((bucket, bi) => {
                    const hasActive = bucket.some(v => v === activeValue);
                    const hasHighlight = bucket.some(v => v === highlightValue);
                    const isEmpty = bucket.length === 0;

                    return (
                        <div key={bi} style={{
                            display: "flex", alignItems: "center",
                            padding: "3px 14px", minHeight: "30px",
                            background: hasActive ? `${sc}06` : hasHighlight ? "#ef444406" : "transparent",
                            borderLeft: `3px solid ${hasActive ? sc : hasHighlight ? "#ef4444" : "transparent"}`,
                            transition: "all 0.3s",
                        }}>
                            {/* Bucket number */}
                            <span style={{
                                width: "32px", flexShrink: 0,
                                fontSize: "0.55rem", fontWeight: "700",
                                fontFamily: "monospace",
                                color: hasActive ? sc : hasHighlight ? "#ef4444" : theme.textDim,
                                opacity: isEmpty ? 0.3 : 1,
                            }}>#{bi}</span>

                            {/* Values in this bucket */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", flex: 1,
                            }}>
                                {isEmpty ? (
                                    <span style={{
                                        fontSize: "0.5rem", color: theme.textDim, opacity: 0.25,
                                        fontFamily: "monospace",
                                    }}>—</span>
                                ) : (
                                    bucket.map((val, vi) => {
                                        const isActive = val === activeValue;
                                        const isFound = val === highlightValue;
                                        const vColor = isFound ? "#ef4444" : isActive ? sc : theme.text;

                                        return (
                                            <React.Fragment key={vi}>
                                                {/* Chain arrow */}
                                                {vi > 0 && (
                                                    <span style={{
                                                        fontSize: "0.6rem", color: theme.textDim,
                                                        fontWeight: "700", opacity: 0.5,
                                                    }}>→</span>
                                                )}
                                                {/* Value pill */}
                                                <div style={{
                                                    display: "flex", alignItems: "center",
                                                    padding: "3px 10px", borderRadius: "8px",
                                                    background: isActive ? `${sc}18`
                                                        : isFound ? "#ef444418"
                                                            : (isDark ? "#1e293b" : "#f1f5f9"),
                                                    border: `1.5px solid ${isActive || isFound ? vColor : theme.cardBorder}`,
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: "0.78rem", fontWeight: "900",
                                                    color: vColor,
                                                    transition: "all 0.3s",
                                                    transform: isActive || isFound ? "scale(1.1)" : "scale(1)",
                                                    boxShadow: isActive ? `0 2px 12px ${sc}40`
                                                        : isFound ? "0 2px 12px #ef444440" : "none",
                                                }}>{val}</div>

                                                {/* Badge */}
                                                {isActive && status === "inserting" && (
                                                    <span style={{
                                                        fontSize: "0.45rem", fontWeight: "800",
                                                        padding: "1px 5px", borderRadius: "4px",
                                                        background: sc, color: "#fff",
                                                    }}>NEW</span>
                                                )}
                                                {isFound && (
                                                    <span style={{
                                                        fontSize: "0.45rem", fontWeight: "800",
                                                        padding: "1px 5px", borderRadius: "4px",
                                                        background: "#ef4444", color: "#fff",
                                                    }}>DUP!</span>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}


/* ── Generic recursion tree ──
 * nodes: [{ id, label, parentId, status }]
 *   status: "active" | "done" | "pruned" | "found" | "base" | "" (default)
 *   edgeLabel: optional short string on the edge
 */
export function RecursionTreePanel({ nodes = [], title = "🌳 Recursion Tree" }) {
    const { theme, isDark } = useTheme();
    if (!nodes.length) return (
        <VizCard title={title}>
            <div style={{ color: theme.textDim, fontSize: "0.6rem", fontStyle: "italic", padding: "8px 0" }}>No calls yet</div>
        </VizCard>
    );

    // Build children map
    const childrenMap = {};
    const roots = [];
    nodes.forEach(n => {
        if (!childrenMap[n.id]) childrenMap[n.id] = [];
        if (n.parentId == null) roots.push(n);
        else {
            if (!childrenMap[n.parentId]) childrenMap[n.parentId] = [];
            childrenMap[n.parentId].push(n);
        }
    });
    const byId = {};
    nodes.forEach(n => { byId[n.id] = n; });

    // Layout: assign x, y to each node
    const nodeW = 80, nodeH = 22, gapX = 6, gapY = 34;
    const positions = {};
    let nextX = 0;

    function layout(nodeId, depth) {
        const kids = childrenMap[nodeId] || [];
        if (kids.length === 0) {
            positions[nodeId] = { x: nextX, y: depth * (nodeH + gapY) };
            nextX += nodeW + gapX;
            return;
        }
        kids.forEach(c => layout(c.id, depth + 1));
        const firstChild = positions[kids[0].id];
        const lastChild = positions[kids[kids.length - 1].id];
        const midX = (firstChild.x + lastChild.x) / 2;
        positions[nodeId] = { x: midX, y: depth * (nodeH + gapY) };
    }
    roots.forEach(r => layout(r.id, 0));

    const allX = Object.values(positions).map(p => p.x);
    const allY = Object.values(positions).map(p => p.y);
    const totalW = Math.max(200, (allX.length ? Math.max(...allX) + nodeW + 10 : 200));
    const totalH = Math.max(60, (allY.length ? Math.max(...allY) + nodeH + 10 : 60));

    const statusColors = {
        active: { bg: isDark ? "#1e1b4b" : "#e0e7ff", border: "#8b5cf6", text: isDark ? "#fff" : "#312e81" },
        done: { bg: isDark ? "#052e16" : "#dcfce7", border: "#10b981", text: "#10b981" },
        found: { bg: isDark ? "#052e16" : "#dcfce7", border: "#10b981", text: "#10b981" },
        pruned: { bg: isDark ? "#1c0a0a" : "#fee2e2", border: "#f87171", text: "#f87171" },
        base: { bg: isDark ? "#0c1f0c" : "#dcfce7", border: "#16a34a", text: "#16a34a" },
        "": { bg: isDark ? "#111827" : "#f1f5f9", border: theme.cardBorder, text: theme.textDim },
    };

    return (
        <VizCard title={title}>
            <div style={{ width: "100%", overflowX: "auto" }}>
                <svg width={totalW} height={totalH} style={{ display: "block", minWidth: "100%" }}>
                    {/* Edges */}
                    {nodes.filter(n => n.parentId != null && positions[n.parentId] && positions[n.id]).map(n => {
                        const p = positions[n.parentId], c = positions[n.id];
                        return (
                            <g key={`e-${n.id}`}>
                                <line x1={p.x + nodeW / 2} y1={p.y + nodeH} x2={c.x + nodeW / 2} y2={c.y}
                                    stroke={isDark ? "#334155" : "#c7d2fe"} strokeWidth="1.2" />
                                {n.edgeLabel && (
                                    <text x={(p.x + c.x) / 2 + nodeW / 2} y={(p.y + nodeH + c.y) / 2}
                                        textAnchor="middle" fontSize="6" fill={isDark ? "#94a3b8" : "#6366f1"}
                                        fontWeight="600">{n.edgeLabel}</text>
                                )}
                            </g>
                        );
                    })}
                    {/* Nodes */}
                    {nodes.filter(n => positions[n.id]).map(n => {
                        const pos = positions[n.id];
                        const sc = statusColors[n.status] || statusColors[""];
                        const isActive = n.status === "active";
                        return (
                            <g key={`n-${n.id}`}>
                                {isActive && <rect x={pos.x - 2} y={pos.y - 2} width={nodeW + 4} height={nodeH + 4}
                                    rx="6" fill="#8b5cf622" style={{ filter: "blur(4px)" }} />}
                                <rect x={pos.x} y={pos.y} width={nodeW} height={nodeH} rx="4"
                                    fill={sc.bg} stroke={sc.border} strokeWidth={isActive ? 2 : 1} />
                                <text x={pos.x + nodeW / 2} y={pos.y + nodeH / 2 + 3.5} textAnchor="middle"
                                    fontSize="7" fontWeight={isActive ? "800" : "600"} fill={sc.text}>
                                    {(n.label || "").length > 14 ? n.label.slice(0, 13) + "…" : n.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </VizCard>
    );
}
