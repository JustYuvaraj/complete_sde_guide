import { useTheme } from "../../shared/ThemeContext";

export default function ThemeToggle() {
    const { toggle, isDark } = useTheme();
    return (
        <button
            onClick={toggle}
            style={{
                position: "fixed", top: "16px", right: "16px", zIndex: 100,
                background: isDark ? "#1e293b" : "#e2e8f0",
                color: isDark ? "#e2e8f0" : "#1e293b",
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                borderRadius: "10px", padding: "8px 14px",
                fontSize: "0.82rem", fontWeight: "700", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#818cf8"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = isDark ? "#334155" : "#cbd5e1"; }}
        >
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}
