import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import { NC_PATTERNS } from "../data/neetcode250Data";
import { COMPONENTS } from "../data/componentRegistry";

export default function NeetCodeCategoryPage({ category, onBack, onProblemClick }) {
    const { theme, isDark } = useTheme();
    const catPatterns = category.patternIndices.map(i => NC_PATTERNS[i]);
    const catTotal = catPatterns.reduce((s, p) => s + p.problems.length, 0);

    return (
        <div style={{
            minHeight: "100vh", background: theme.bg, color: theme.text,
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            <ThemeToggle />

            <HeroSection
                icon={category.icon}
                title={category.name}
                subtitle={category.subtitle}
                gradient={category.gradient}
                glowColor={`${category.color}15`}
                onBack={onBack}
                backLabel="← Back"
                stats={[
                    { value: catTotal, label: "Problems" },
                    { value: catPatterns.length, label: "Sections" },
                ]}
            />

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 60px" }}>
                {catPatterns.map((pattern, pi) => (
                    <div key={pi} style={{ marginBottom: "36px" }}>
                        {/* Pattern Header */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            marginBottom: "16px", padding: "0 4px",
                        }}>
                            <span style={{ fontSize: "1.5rem" }}>{pattern.icon}</span>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: pattern.color }}>
                                        {pattern.name}
                                    </h2>
                                    <span style={{
                                        fontSize: "0.65rem",
                                        background: isDark ? pattern.bg : pattern.bgLight,
                                        color: pattern.color, padding: "3px 10px",
                                        borderRadius: "20px", fontWeight: "700",
                                        border: `1px solid ${pattern.color}33`,
                                    }}>
                                        {pattern.problems.length} problems
                                    </span>
                                </div>
                                <p style={{ margin: "2px 0 0", color: theme.textMuted, fontSize: "0.8rem" }}>
                                    {pattern.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Problem Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: "10px",
                        }}>
                            {pattern.problems.map((problem) => {
                                const hasViz = !!problem.component && !!COMPONENTS[problem.component];
                                return (
                                    <div
                                        key={problem.id}
                                        onClick={() => { if (hasViz) onProblemClick(problem); }}
                                        style={{
                                            background: isDark
                                                ? `linear-gradient(135deg, ${pattern.bg}, #0d1117)`
                                                : `linear-gradient(135deg, ${pattern.bgLight}, #ffffff)`,
                                            border: `1px solid ${pattern.color}33`,
                                            borderRadius: "14px", padding: "16px 18px",
                                            display: "flex", alignItems: "center", gap: "14px",
                                            transition: "all 0.25s",
                                            cursor: hasViz ? "pointer" : "default",
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.borderColor = pattern.color + "88";
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 8px 30px ${pattern.color}22`;
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.borderColor = pattern.color + "33";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div style={{
                                            width: "36px", height: "36px", borderRadius: "10px",
                                            background: pattern.color + "20",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "0.8rem", fontWeight: "800",
                                            color: pattern.color, flexShrink: 0,
                                        }}>
                                            {problem.id}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: "0.85rem", fontWeight: "700",
                                                color: theme.text,
                                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                            }}>
                                                {problem.name}
                                            </div>
                                            <div style={{
                                                fontSize: "0.68rem", color: theme.textMuted, marginTop: "3px",
                                                display: "flex", gap: "8px", alignItems: "center",
                                            }}>
                                                <span>{problem.diff}</span>
                                                <span>LC #{problem.lc}</span>
                                                {hasViz && <span style={{ color: "#10b981", fontWeight: 700 }}>▶ VIZ</span>}
                                            </div>
                                        </div>
                                        <a
                                            href={`https://leetcode.com/problems/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            style={{
                                                fontSize: "0.6rem", fontWeight: "700",
                                                color: pattern.color, textDecoration: "none",
                                                padding: "4px 8px", borderRadius: "6px",
                                                background: pattern.color + "15",
                                                border: `1px solid ${pattern.color}33`,
                                                flexShrink: 0,
                                            }}
                                        >
                                            LC ↗
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <Footer>
                NeetCode 250 • {catTotal} problems in {category.name}
            </Footer>
        </div>
    );
}
