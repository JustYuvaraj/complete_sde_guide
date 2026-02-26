import { useTheme } from "../../shared/ThemeContext";

export default function BackButton({ onClick, label = "← Back" }) {
    const { theme } = useTheme();
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute", top: "0", left: "0",
                background: theme.backBtnBg, color: theme.text,
                border: `1px solid ${theme.backBtnBorder}`, borderRadius: "10px",
                padding: "8px 16px", fontSize: "0.78rem",
                fontFamily: "'Inter', sans-serif", fontWeight: "700",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = theme.backBtnHoverBg; }}
            onMouseOut={e => { e.currentTarget.style.background = theme.backBtnBg; }}
        >
            {label}
        </button>
    );
}
