import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import BackButton from "../components/layout/BackButton";
import Stat from "../components/layout/Stat";
import Footer from "../components/layout/Footer";
import { NC_PATTERNS, NC_CATEGORIES } from "../data/neetcode250Data";

export default function NeetCodeDashboard({ onBack, onCategoryClick }) {
    const { theme, isDark } = useTheme();
    const ncTotalProblems = NC_PATTERNS.reduce((s, p) => s + p.problems.length, 0);

    return (
        <div style={{
            minHeight: "100vh", background: theme.bg, color: theme.text,
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            <ThemeToggle />

            {/* NC Hero */}
            <div style={{
                textAlign: "center", padding: "60px 20px 45px",
                background: theme.heroBg,
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)",
                    width: "600px", height: "600px", borderRadius: "50%",
                    background: `radial-gradient(circle, #f97316${isDark ? '15' : '10'} 0%, transparent 70%)`,
                    pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                    <BackButton onClick={onBack} label="← Home" />
                    <div style={{
                        fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "#f97316", marginBottom: "12px", fontWeight: "700",
                    }}>
                        NeetCode Roadmap
                    </div>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "900",
                        background: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        margin: "0 0 12px", lineHeight: "1.2",
                    }}>
                        NeetCode 250
                    </h1>
                    <p style={{ color: theme.textMuted, fontSize: "1rem", margin: "0 0 8px", maxWidth: "520px", marginInline: "auto" }}>
                        Master every pattern. 18 categories, 250+ problems, organized Easy → Medium → Hard.
                    </p>
                    <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "24px" }}>
                        <Stat value={ncTotalProblems} label="Problems" />
                        <Stat value={NC_CATEGORIES.length} label="Patterns" />
                        <Stat value={NC_PATTERNS.reduce((s, p) => s + p.problems.filter(x => x.diff === '🔴').length, 0)} label="Hard" />
                    </div>
                </div>
            </div>

            {/* NC Category Cards */}
            <div style={{
                maxWidth: "1000px", margin: "0 auto", padding: "40px 20px 60px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
            }}>
                {NC_CATEGORIES.map((cat) => {
                    const catPatterns = cat.patternIndices.map(i => NC_PATTERNS[i]);
                    const catTotal = catPatterns.reduce((s, p) => s + p.problems.length, 0);
                    const easyCount = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.diff === '🟢').length, 0);
                    const medCount = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.diff === '🟡').length, 0);
                    const hardCount = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.diff === '🔴').length, 0);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryClick(cat)}
                            style={{
                                background: isDark
                                    ? `linear-gradient(145deg, ${cat.bg}, #0d1117)`
                                    : `linear-gradient(145deg, ${cat.bgLight}, #ffffff)`,
                                border: `1.5px solid ${cat.color}33`,
                                borderRadius: "20px", padding: "28px 24px",
                                cursor: "pointer", textAlign: "left",
                                transition: "all 0.3s",
                                position: "relative", overflow: "hidden",
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.borderColor = cat.color;
                                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                                e.currentTarget.style.boxShadow = `0 12px 40px ${cat.color}${isDark ? "44" : "33"}`;
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.borderColor = cat.color + "33";
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                position: "absolute", top: "-30px", right: "-30px",
                                width: "100px", height: "100px", borderRadius: "50%",
                                background: `${cat.color}10`, pointerEvents: "none",
                            }} />
                            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{cat.icon}</div>
                            <h2 style={{ margin: "0 0 4px", fontSize: "1.15rem", fontWeight: "900", color: cat.color }}>
                                {cat.name}
                            </h2>
                            <p style={{ margin: "0 0 14px", fontSize: "0.75rem", color: theme.textMuted, lineHeight: "1.4" }}>
                                {cat.subtitle}
                            </p>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.65rem" }}>
                                <span style={{ background: "#065f4620", padding: "3px 8px", borderRadius: "6px", fontWeight: "700", color: "#4ade80" }}>
                                    {easyCount}E
                                </span>
                                <span style={{ background: "#f59e0b20", padding: "3px 8px", borderRadius: "6px", fontWeight: "700", color: "#fbbf24" }}>
                                    {medCount}M
                                </span>
                                <span style={{ background: "#ef444420", padding: "3px 8px", borderRadius: "6px", fontWeight: "700", color: "#f87171" }}>
                                    {hardCount}H
                                </span>
                                <span style={{
                                    marginLeft: "auto",
                                    background: isDark ? "#1e293b" : "#f1f5f9",
                                    padding: "3px 8px", borderRadius: "6px",
                                    fontWeight: "700", color: cat.color,
                                }}>
                                    {catTotal} total
                                </span>
                            </div>
                            <div style={{
                                position: "absolute", bottom: "16px", right: "16px",
                                fontSize: "1.2rem", color: cat.color + "66",
                            }}>
                                →
                            </div>
                        </button>
                    );
                })}
            </div>

            <Footer>
                NeetCode 250 • {ncTotalProblems} problems • 18 patterns
            </Footer>
        </div>
    );
}
