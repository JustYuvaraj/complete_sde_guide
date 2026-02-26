import { useTheme } from "../../shared/ThemeContext";

export default function Stat({ value, label }) {
    const { theme } = useTheme();
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "900", color: theme.text }}>{value}</div>
            <div style={{ fontSize: "0.7rem", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
        </div>
    );
}
