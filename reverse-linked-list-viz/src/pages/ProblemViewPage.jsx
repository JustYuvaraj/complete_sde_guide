import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import { COMPONENTS } from "../data/componentRegistry";

export default function ProblemViewPage({ problem, onBack }) {
    const { theme } = useTheme();
    const Comp = COMPONENTS[problem.component];

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <ThemeToggle />
            <button
                onClick={onBack}
                style={{
                    position: "fixed", top: "16px", left: "16px", zIndex: 100,
                    background: theme.backBtnBg, color: theme.text,
                    border: `1px solid ${theme.backBtnBorder}`, borderRadius: "10px",
                    padding: "10px 20px", fontSize: "0.82rem",
                    fontFamily: "'Inter', sans-serif", fontWeight: "700",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = theme.backBtnHoverBg; e.currentTarget.style.borderColor = theme.backBtnHoverBorder; }}
                onMouseOut={e => { e.currentTarget.style.background = theme.backBtnBg; e.currentTarget.style.borderColor = theme.backBtnBorder; }}
            >
                ← Back
            </button>
            <Comp />
        </div>
    );
}
