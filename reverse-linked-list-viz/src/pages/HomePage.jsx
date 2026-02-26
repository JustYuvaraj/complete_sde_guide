import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import Stat from "../components/layout/Stat";
import Footer from "../components/layout/Footer";
import { PATTERNS, CATEGORIES, totalProblems, readyProblems } from "../data/patternsData";
import { NC_PATTERNS } from "../data/neetcode250Data";

export default function HomePage({ onCategoryClick, onNcModeClick, onFaang500Click }) {
    const { theme, isDark } = useTheme();
    const ncTotalProblems = NC_PATTERNS.reduce((s, p) => s + p.problems.length, 0);

    return (
        <div style={{
            minHeight: "100vh", background: theme.bg, color: theme.text,
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            <ThemeToggle />

            {/* Hero */}
            <div style={{
                textAlign: "center", padding: "70px 20px 50px",
                background: theme.heroBg,
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)",
                    width: "600px", height: "600px", borderRadius: "50%",
                    background: `radial-gradient(circle, ${theme.heroGlow} 0%, transparent 70%)`,
                    pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                    <div style={{
                        fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
                        color: theme.heroAccent, marginBottom: "12px", fontWeight: "700",
                    }}>
                        Interactive Learning
                    </div>
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "900",
                        background: theme.heroGradient,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        margin: "0 0 12px", lineHeight: "1.2",
                    }}>
                        DSA Visualizer
                    </h1>
                    <p style={{ color: theme.textMuted, fontSize: "1rem", margin: "0 0 8px", maxWidth: "520px", marginInline: "auto" }}>
                        Step through every algorithm visually. See the code, stack, and data structures change in real-time.
                    </p>
                    <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "24px" }}>
                        <Stat value={totalProblems} label="Problems" />
                        <Stat value={CATEGORIES.length} label="Topics" />
                        <Stat value={readyProblems} label="Ready" />
                    </div>
                </div>
            </div>

            {/* NeetCode 250 Banner */}
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px 20px 0" }}>
                <button
                    onClick={onNcModeClick}
                    style={{
                        width: "100%",
                        background: isDark
                            ? "linear-gradient(135deg, #431407, #1c1917, #422006)"
                            : "linear-gradient(135deg, #fff7ed, #ffffff, #fef3c7)",
                        border: `2px solid ${isDark ? '#f9731633' : '#f9731644'}`,
                        borderRadius: "24px", padding: "32px 36px",
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.3s",
                        position: "relative", overflow: "hidden",
                        display: "flex", alignItems: "center", gap: "24px",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.borderColor = '#f97316';
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = `0 16px 50px ${isDark ? '#f9731633' : '#f9731622'}`;
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.borderColor = isDark ? '#f9731633' : '#f9731644';
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <div style={{
                        position: "absolute", top: "-50px", right: "-50px",
                        width: "200px", height: "200px", borderRadius: "50%",
                        background: "radial-gradient(circle, #f9731615 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        fontSize: "3rem",
                        background: "linear-gradient(135deg, #f97316, #fbbf24)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        fontWeight: "900", lineHeight: 1,
                    }}>
                        🔥
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            margin: "0 0 4px", fontSize: "1.5rem", fontWeight: "900",
                            background: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            NeetCode 250
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: theme.textMuted }}>
                            18 patterns • {ncTotalProblems} problems • Organized by difficulty
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.7rem" }}>
                        <span style={{ background: "#065f4620", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#4ade80" }}>Easy</span>
                        <span style={{ background: "#f59e0b20", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#fbbf24" }}>Medium</span>
                        <span style={{ background: "#ef444420", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#f87171" }}>Hard</span>
                    </div>
                    <div style={{ fontSize: "1.5rem", color: "#f97316", fontWeight: "900" }}>→</div>
                </button>
            </div>

            {/* FAANG 500 Banner */}
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 20px 0" }}>
                <button
                    onClick={onFaang500Click}
                    style={{
                        width: "100%",
                        background: isDark
                            ? "linear-gradient(135deg, #1e1b4b, #0d1117, #172554)"
                            : "linear-gradient(135deg, #eef2ff, #ffffff, #e0f2fe)",
                        border: `2px solid ${isDark ? '#818cf833' : '#818cf844'}`,
                        borderRadius: "24px", padding: "28px 36px",
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.3s",
                        position: "relative", overflow: "hidden",
                        display: "flex", alignItems: "center", gap: "24px",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.borderColor = '#818cf8';
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = `0 16px 50px ${isDark ? '#818cf833' : '#818cf822'}`;
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.borderColor = isDark ? '#818cf833' : '#818cf844';
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <div style={{
                        position: "absolute", top: "-50px", right: "-50px",
                        width: "200px", height: "200px", borderRadius: "50%",
                        background: "radial-gradient(circle, #818cf815 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        fontSize: "3rem",
                        background: "linear-gradient(135deg, #818cf8, #6366f1)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        fontWeight: "900", lineHeight: 1,
                    }}>
                        🎯
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            margin: "0 0 4px", fontSize: "1.5rem", fontWeight: "900",
                            background: "linear-gradient(135deg, #818cf8, #6366f1, #4f46e5)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            FAANG 500 Roadmap
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: theme.textMuted }}>
                            18 topics • 60+ subtopics • The ultimate DSA interview checklist
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.65rem" }}>
                        <span style={{ background: "#818cf820", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#818cf8" }}>Blind 75</span>
                        <span style={{ background: "#10b98120", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#34d399" }}>NeetCode</span>
                        <span style={{ background: "#f9731620", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", color: "#f97316" }}>Striver</span>
                    </div>
                    <div style={{ fontSize: "1.5rem", color: "#818cf8", fontWeight: "900" }}>→</div>
                </button>
            </div>

            {/* Category Cards */}
            <div style={{
                maxWidth: "900px", margin: "0 auto", padding: "30px 20px 60px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
            }}>
                {CATEGORIES.map((cat) => {
                    const catPatterns = cat.patternIndices.map(i => PATTERNS[i]);
                    const catTotal = catPatterns.reduce((s, p) => s + p.problems.length, 0);
                    const catReady = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.component).length, 0);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryClick(cat)}
                            style={{
                                background: isDark
                                    ? `linear-gradient(145deg, ${cat.bg}, #0d1117)`
                                    : `linear-gradient(145deg, ${cat.bgLight}, #ffffff)`,
                                border: `1.5px solid ${cat.color}33`,
                                borderRadius: "20px", padding: "32px 28px",
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
                            <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{cat.icon}</div>
                            <h2 style={{ margin: "0 0 6px", fontSize: "1.4rem", fontWeight: "900", color: cat.color }}>
                                {cat.name}
                            </h2>
                            <p style={{ margin: "0 0 16px", fontSize: "0.8rem", color: theme.textMuted, lineHeight: "1.4" }}>
                                {cat.subtitle}
                            </p>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "0.72rem", color: theme.textDim }}>
                                <span style={{
                                    background: isDark ? "#1e293b" : "#f1f5f9",
                                    padding: "4px 10px", borderRadius: "8px",
                                    fontWeight: "700", color: cat.color,
                                }}>
                                    {catTotal} problems
                                </span>
                                {catReady > 0 && (
                                    <span style={{
                                        background: "#065f4620",
                                        padding: "4px 10px", borderRadius: "8px",
                                        fontWeight: "700", color: "#10b981",
                                    }}>
                                        {catReady} ready
                                    </span>
                                )}
                                {catReady === 0 && (
                                    <span style={{
                                        background: isDark ? "#1e293b" : "#f1f5f9",
                                        padding: "4px 10px", borderRadius: "8px",
                                        fontWeight: "600", color: theme.textDim,
                                    }}>
                                        coming soon
                                    </span>
                                )}
                            </div>
                            <div style={{
                                position: "absolute", bottom: "20px", right: "20px",
                                fontSize: "1.2rem", color: cat.color + "66",
                            }}>
                                →
                            </div>
                        </button>
                    );
                })}
            </div>

            <Footer>
                DSA Visualizer • {readyProblems} of {totalProblems} problems ready • More coming soon
            </Footer>
        </div>
    );
}
