import { useTheme } from "../../shared/ThemeContext";

export default function ProblemCard({ problem, pattern, hasViz, onClick }) {
    const { theme, isDark } = useTheme();
    return (
        <div
            onClick={() => { if (hasViz) onClick(problem); }}
            style={{
                background: hasViz
                    ? (isDark
                        ? `linear-gradient(135deg, ${pattern.bg}, #0d1117)`
                        : `linear-gradient(135deg, ${pattern.bgLight}, #ffffff)`)
                    : theme.problemBg,
                border: `1px solid ${hasViz ? pattern.color + "44" : theme.cardBorder}`,
                borderRadius: "14px", padding: "16px 18px",
                cursor: hasViz ? "pointer" : "default",
                textAlign: "left",
                display: "flex", alignItems: "center", gap: "14px",
                transition: "all 0.25s",
                opacity: hasViz ? 1 : (theme.problemDisabledOpacity || 0.45),
                position: "relative", overflow: "hidden",
            }}
            onMouseOver={e => {
                if (hasViz) {
                    e.currentTarget.style.borderColor = pattern.color + "88";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px ${pattern.color}22`;
                }
            }}
            onMouseOut={e => {
                if (hasViz) {
                    e.currentTarget.style.borderColor = pattern.color + "44";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }
            }}
        >
            {/* Problem ID Badge */}
            <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: hasViz ? pattern.color + "20" : (isDark ? "#1e293b" : "#e2e8f0"),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: "800",
                color: hasViz ? pattern.color : theme.textDim,
                flexShrink: 0,
            }}>
                {problem.id}
            </div>

            {/* Problem Name & Meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: "0.85rem", fontWeight: "700",
                    color: hasViz ? theme.text : theme.textMuted,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {problem.name}
                </div>
                <div style={{
                    fontSize: "0.68rem", color: theme.textMuted, marginTop: "3px",
                    display: "flex", gap: "8px", alignItems: "center",
                }}>
                    <span>{problem.diff}</span>
                    {problem.lc !== "—" && <span>LC #{problem.lc}</span>}
                    {problem.lc === "—" && <span>Classic</span>}
                </div>
            </div>

            {/* Status */}
            <div style={{
                fontSize: "0.65rem", fontWeight: "700",
                color: hasViz ? "#10b981" : theme.textDim,
                flexShrink: 0,
            }}>
                {hasViz ? "▶ VIEW" : "soon"}
            </div>
        </div>
    );
}
