import React from "react";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";

// ═══════════════════════════════════════════════════════════════════
//  Premium Split-Screen Visualization Layout
// ═══════════════════════════════════════════════════════════════════

export function SplitVizLayout({
    title, subtitle,
    leftPanel, rightPanel,
    controls,
    headerRightItem,
    onBack,
    initialLeftWidth = "50%",
    fullRight = false
}) {
    // Force dark mode feeling for this layout if possible, or use theme
    const { theme, isDark } = useTheme();

    // Resize state
    const [leftWidth, setLeftWidth] = React.useState(() => {
        if (typeof initialLeftWidth === "string" && initialLeftWidth.endsWith("%")) {
            const pct = parseFloat(initialLeftWidth) / 100;
            return Math.floor(window.innerWidth * pct);
        }
        return typeof initialLeftWidth === "string" ? parseInt(initialLeftWidth) : initialLeftWidth;
    });
    const [isDragging, setIsDragging] = React.useState(false);

    // Background and border constants
    const bgLeft = isDark ? "#0d1117" : "#fafbfc";
    const bgRight = isDark ? "#010409" : "#f1f5f9"; // Darker/deeper right canvas
    const borderLeft = isDark ? "#30363d" : "#e5e7eb";

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection while dragging
    };

    React.useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            // Keep left panel between 350px and (window width - 400px)
            const newWidth = Math.max(350, Math.min(e.clientX, window.innerWidth - 400));
            setLeftWidth(newWidth);
        };
        const handleMouseUp = () => setIsDragging(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            padding: "16px",
            gap: "8px",
            boxSizing: "border-box",
            overflow: "hidden",
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: theme.text,
            background: isDark ? "#000000" : "#e2e8f0", // App background
            cursor: isDragging ? "col-resize" : "default",
        }}>
            {/* ── LEFT PANEL (IDE & Explain) ── */}
            <div style={{
                width: `${leftWidth}px`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: bgLeft,
                border: `1px solid ${borderLeft}`,
                borderRadius: "16px",
                boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.1)",
                zIndex: 10,
                pointerEvents: isDragging ? "none" : "auto",
                flexShrink: 0,
                overflow: "hidden", // clip rounded corners
            }}>
                {/* Header Navbar */}
                <div style={{
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    borderBottom: `1px solid ${borderLeft}`,
                    background: isDark ? "#161b22" : "#fff",
                }}>
                    {onBack ? (
                        <button onClick={onBack} style={{
                            background: "transparent", border: "none",
                            color: theme.text, fontSize: "1.2rem", cursor: "pointer",
                            padding: 0, display: "flex", alignItems: "center"
                        }}>←</button>
                    ) : (
                        <div style={{ width: "20px" }} /> // spacer
                    )}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>{title}</h1>
                        <div style={{ margin: 0, fontSize: "0.7rem", color: theme.textMuted }}>{subtitle}</div>
                    </div>
                    {headerRightItem}
                    <ThemeToggle />
                </div>

                {/* Left Content Scrollable Area */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px 24px 80px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}>
                    {leftPanel}
                </div>
            </div>

            {/* ── DRAG RESIZER HANDLE (Invisible click area in the gap) ── */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    width: "8px",
                    height: "100%",
                    margin: "0 -4px", // overlap the gap slightly for easier grabbing
                    cursor: "col-resize",
                    zIndex: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}
            >
                {/* Visual pill */}
                <div style={{
                    width: "4px", height: "40px", borderRadius: "4px",
                    background: isDragging ? (isDark ? "#6366f1" : "#818cf8") : (isDark ? "#ffffff22" : "#00000022"),
                    transition: "all 0.2s",
                    boxShadow: isDragging ? "0 0 10px rgba(99,102,241,0.5)" : "none",
                }} />
            </div>

            {/* ── RIGHT PANEL (Interactive Canvas) ── */}
            <div style={{
                flex: 1,
                height: "100%",
                position: "relative", // For floating elements
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                pointerEvents: isDragging ? "none" : "auto",
                background: bgRight,
                border: `1px solid ${borderLeft}`,
                borderRadius: "16px",
                boxShadow: isDark ? "inset 0 0 60px rgba(0,0,0,0.5)" : "inset 0 0 60px rgba(0,0,0,0.03)",
            }}>
                {/* Subdued Grid Background */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    backgroundImage: isDark
                        ? "radial-gradient(#ffffff11 1px, transparent 1px)"
                        : "radial-gradient(#00000008 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    opacity: 0.8,
                }} />

                {/* Center Glow (Premium aesthetic) */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60vw", height: "60vw",
                    background: isDark ? "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)" : "none",
                    filter: "blur(40px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }} />

                {/* Right Content Area */}
                <div style={{
                    flex: 1,
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: fullRight ? "stretch" : "center",
                    justifyContent: fullRight ? "stretch" : "center",
                    padding: fullRight ? "0" : "40px",
                    overflow: fullRight ? "hidden" : "auto",
                }}>
                    {rightPanel}
                </div>

                {/* Floating Controls at Bottom */}
                {controls && (
                    <div style={{
                        position: "absolute",
                        bottom: "32px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 20,
                        background: isDark ? "rgba(22, 27, 34, 0.75)" : "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.1)",
                        borderRadius: "16px",
                        padding: "16px 24px",
                        width: "80%",
                        maxWidth: "600px",
                    }}>
                        {controls}
                    </div>
                )}
            </div>
        </div>
    );
}
