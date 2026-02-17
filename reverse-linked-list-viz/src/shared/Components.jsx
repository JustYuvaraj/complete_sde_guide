import { useState, useEffect, useRef } from "react";
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

/* ━━━ Control Bar ━━━ */
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
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px", padding: "10px 16px",
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
            height: "100vh", boxSizing: "border-box",
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
