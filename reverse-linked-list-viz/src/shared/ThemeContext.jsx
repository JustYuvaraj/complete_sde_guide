import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const DARK = {
    mode: "dark",
    bg: "#060912",
    cardBg: "#0d1117",
    cardHeaderBg: "#161b22",
    cardBorder: "#1e293b",
    cardHeaderBorder: "#21262d",
    text: "#e2e8f0",
    textMuted: "#475569",
    textDim: "#3d4451",
    textCode: "#4b5563",
    textCodeActive: "#c7d2fe",
    varKey: "#64748b",
    varVal: "#34d399",
    stackActiveBg: "#1a1f3a",
    stackActiveBorder: "#4f46e5",
    stackActiveText: "#a5b4fc",
    stackActiveAccent: "#6366f1",
    stackBg: "#111827",
    stackBorder: "#1f2937",
    stackText: "#4b5563",
    stackMuted: "#374151",
    lineHighlightBg: "#1a1f3a",
    executingBg: "#312e81",
    executingText: "#a5b4fc",
    btnBg: "#1e293b",
    btnBorder: "#1f2937",
    btnText: "#e2e8f0",
    btnHighlightBg: "#3730a3",
    btnHighlightBorder: "#6366f1",
    btnDisabledText: "#374151",
    msgBg: "#0f172a",
    stepInfo: "#334155",
    heroBg: "linear-gradient(180deg, #0f1729 0%, #060912 100%)",
    heroGlow: "#818cf822",
    heroAccent: "#6366f1",
    heroGradient: "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
    patternBadgeBorder: "33",
    cardHoverShadow: "22",
    problemBg: "#0b0f1a",
    problemDisabledOpacity: 0.45,
    footerBorder: "#1e293b",
    footerText: "#334155",
    backBtnBg: "#1e293b",
    backBtnBorder: "#334155",
    backBtnHoverBg: "#334155",
    backBtnHoverBorder: "#818cf8",
};

const LIGHT = {
    mode: "light",
    bg: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #fff1f2 80%, #f0fdfa 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    cardHeaderBg: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    cardBorder: "#c7d2fe",
    cardHeaderBorder: "#ddd6fe",
    text: "#1e1b4b",
    textMuted: "#6366f1",
    textDim: "#a5b4fc",
    textCode: "#6b7280",
    textCodeActive: "#312e81",
    varKey: "#4338ca",
    varVal: "#059669",
    stackActiveBg: "linear-gradient(135deg, #eef2ff, #ede9fe)",
    stackActiveBorder: "#7c3aed",
    stackActiveText: "#4338ca",
    stackActiveAccent: "#7c3aed",
    stackBg: "#f5f3ff",
    stackBorder: "#ddd6fe",
    stackText: "#6366f1",
    stackMuted: "#a78bfa",
    lineHighlightBg: "linear-gradient(90deg, #eef2ff, #faf5ff)",
    executingBg: "linear-gradient(135deg, #818cf8, #a78bfa)",
    executingText: "#ffffff",
    btnBg: "rgba(255,255,255,0.8)",
    btnBorder: "#c7d2fe",
    btnText: "#3730a3",
    btnHighlightBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    btnHighlightBorder: "#4f46e5",
    btnDisabledText: "#c4b5fd",
    msgBg: "rgba(238,242,255,0.8)",
    stepInfo: "#6366f1",
    heroBg: "linear-gradient(180deg, #e0e7ff 0%, #faf5ff 50%, #fff1f2 100%)",
    heroGlow: "#818cf822",
    heroAccent: "#6366f1",
    heroGradient: "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
    patternBadgeBorder: "33",
    cardHoverShadow: "25",
    problemBg: "rgba(245,243,255,0.6)",
    problemDisabledOpacity: 0.5,
    footerBorder: "#ddd6fe",
    footerText: "#a78bfa",
    backBtnBg: "rgba(255,255,255,0.8)",
    backBtnBorder: "#c7d2fe",
    backBtnHoverBg: "#eef2ff",
    backBtnHoverBorder: "#818cf8",
};

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        try { return localStorage.getItem("viz-theme") || "dark"; } catch { return "dark"; }
    });

    useEffect(() => {
        try { localStorage.setItem("viz-theme", mode); } catch { }
        document.body.style.background = mode === "dark" ? DARK.bg : "#f0f4ff";
    }, [mode]);

    const theme = mode === "dark" ? DARK : LIGHT;
    const toggle = () => setMode(m => m === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, toggle, isDark: mode === "dark" }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
