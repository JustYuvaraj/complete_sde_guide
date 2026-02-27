import { useState, useMemo } from "react";
import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import { FAANG_TOPICS, FAANG_STATS } from "../data/faang500Data";

export default function Faang500Page({ onBack, onProblemClick }) {
    const { theme, isDark } = useTheme();
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [expandedSub, setExpandedSub] = useState(null);
    const [checkedProblems, setCheckedProblems] = useState(() => {
        try { return JSON.parse(localStorage.getItem("faang500_checked") || "{}"); }
        catch { return {}; }
    });

    const toggleProblem = (key) => {
        setCheckedProblems((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("faang500_checked", JSON.stringify(next));
            return next;
        });
    };

    const solvedCount = useMemo(
        () => Object.values(checkedProblems).filter(Boolean).length,
        [checkedProblems]
    );

    const getTopicProgress = (topic) => {
        let total = 0, done = 0;
        for (const sub of topic.subtopics) {
            for (const p of sub.problems) {
                total++;
                const key = `${topic.name}::${sub.name}::${p.name}`;
                if (checkedProblems[key]) done++;
            }
        }
        return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    };

    const getSubProgress = (topic, sub) => {
        let total = 0, done = 0;
        for (const p of sub.problems) {
            total++;
            const key = `${topic.name}::${sub.name}::${p.name}`;
            if (checkedProblems[key]) done++;
        }
        return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    };

    const progressPct = FAANG_STATS.total > 0
        ? Math.round((solvedCount / FAANG_STATS.total) * 100)
        : 0;

    // ── Styles ──
    const pageStyle = {
        minHeight: "100vh",
        background: isDark ? "#0a0a0f" : "#fafbfc",
        color: theme.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    };

    const headerStyle = {
        position: "sticky", top: 0, zIndex: 50,
        background: isDark ? "rgba(10,10,15,0.85)" : "rgba(250,251,252,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${isDark ? "#1e1e2e" : "#e5e7eb"}`,
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
    };

    return (
        <div style={pageStyle}>
            {/* ── Header ── */}
            <div style={headerStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button onClick={onBack} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: theme.text, fontSize: "1.2rem", padding: 0,
                        display: "flex", alignItems: "center",
                    }}>←</button>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: "1.15rem", fontWeight: 800,
                            letterSpacing: "-0.03em",
                            color: isDark ? "#fff" : "#111",
                        }}>
                            FAANG 500
                        </h1>
                        <p style={{
                            margin: 0, fontSize: "0.7rem", fontWeight: 500,
                            color: isDark ? "#64748b" : "#9ca3af",
                        }}>
                            The definitive DSA roadmap to crack any tech interview
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* Progress pill */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: isDark ? "#111118" : "#f3f4f6",
                        borderRadius: "999px", padding: "6px 16px",
                        border: `1px solid ${isDark ? "#1e1e2e" : "#e5e7eb"}`,
                    }}>
                        <span style={{
                            fontSize: "0.75rem", fontWeight: 700,
                            color: isDark ? "#4ade80" : "#16a34a",
                        }}>
                            {solvedCount}/{FAANG_STATS.total}
                        </span>
                        <div style={{
                            width: "80px", height: "4px", borderRadius: "2px",
                            background: isDark ? "#1e1e2e" : "#e5e7eb",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                height: "100%", borderRadius: "2px",
                                width: `${progressPct}%`,
                                background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                                transition: "width 0.5s ease",
                            }} />
                        </div>
                        <span style={{
                            fontSize: "0.65rem", fontWeight: 600,
                            color: isDark ? "#64748b" : "#9ca3af",
                        }}>{progressPct}%</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div style={{
                maxWidth: "800px", margin: "24px auto 0", padding: "0 24px",
                display: "flex", gap: "12px", flexWrap: "wrap",
            }}>
                {[
                    { label: "Topics", value: FAANG_STATS.topics, color: "#818cf8" },
                    { label: "Subtopics", value: FAANG_STATS.subtopics, color: "#60a5fa" },
                    { label: "Easy", value: FAANG_STATS.easy, color: "#4ade80" },
                    { label: "Medium", value: FAANG_STATS.medium, color: "#fbbf24" },
                    { label: "Hard", value: FAANG_STATS.hard, color: "#f87171" },
                ].map((s) => (
                    <div key={s.label} style={{
                        flex: "1 1 80px",
                        background: isDark ? "#111118" : "#fff",
                        border: `1px solid ${isDark ? "#1e1e2e" : "#e5e7eb"}`,
                        borderRadius: "10px", padding: "12px 16px",
                        textAlign: "center",
                    }}>
                        <div style={{
                            fontSize: "1.3rem", fontWeight: 800, color: s.color,
                            letterSpacing: "-0.02em",
                        }}>{s.value}</div>
                        <div style={{
                            fontSize: "0.6rem", fontWeight: 600, color: isDark ? "#64748b" : "#9ca3af",
                            textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px",
                        }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Topics ── */}
            <div style={{
                maxWidth: "800px", margin: "24px auto", padding: "0 24px 60px",
                display: "flex", flexDirection: "column", gap: "8px",
            }}>
                {FAANG_TOPICS.map((topic, ti) => {
                    const isOpen = expandedTopic === ti;
                    const prog = getTopicProgress(topic);
                    const totalProblems = topic.subtopics.reduce((s, sub) => s + sub.problems.length, 0);

                    return (
                        <div key={ti} style={{
                            background: isDark ? "#111118" : "#fff",
                            border: `1px solid ${isOpen ? topic.color + "44" : (isDark ? "#1e1e2e" : "#e5e7eb")}`,
                            borderRadius: "12px",
                            overflow: "hidden",
                            transition: "border-color 0.2s",
                        }}>
                            {/* Topic Header */}
                            <button
                                onClick={() => setExpandedTopic(isOpen ? null : ti)}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center",
                                    gap: "14px", padding: "14px 18px",
                                    background: "transparent", border: "none",
                                    cursor: "pointer", textAlign: "left",
                                    color: isDark ? "#e2e8f0" : "#1e293b",
                                    fontFamily: "inherit",
                                }}
                            >
                                <span style={{ fontSize: "1.3rem" }}>{topic.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{
                                            fontSize: "0.88rem", fontWeight: 700,
                                            letterSpacing: "-0.01em",
                                        }}>{topic.name}</span>
                                        <span style={{
                                            fontSize: "0.55rem", fontWeight: 600,
                                            color: isDark ? "#64748b" : "#9ca3af",
                                        }}>{totalProblems} problems · {topic.subtopics.length} sections</span>
                                    </div>
                                    <p style={{
                                        margin: "2px 0 0", fontSize: "0.65rem",
                                        color: isDark ? "#475569" : "#94a3b8",
                                        fontWeight: 400,
                                    }}>{topic.description}</p>
                                </div>

                                {/* Progress ring */}
                                <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
                                    <svg width="44" height="44" viewBox="0 0 44 44">
                                        <circle cx="22" cy="22" r="18" fill="none"
                                            stroke={isDark ? "#1e1e2e" : "#e5e7eb"} strokeWidth="3" />
                                        <circle cx="22" cy="22" r="18" fill="none"
                                            stroke={topic.color} strokeWidth="3"
                                            strokeDasharray={`${(prog.pct / 100) * 113} 113`}
                                            strokeLinecap="round"
                                            transform="rotate(-90 22 22)"
                                            style={{ transition: "stroke-dasharray 0.5s ease" }} />
                                    </svg>
                                    <span style={{
                                        position: "absolute", inset: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.55rem", fontWeight: 800,
                                        color: prog.pct > 0 ? topic.color : (isDark ? "#475569" : "#94a3b8"),
                                    }}>{prog.pct}%</span>
                                </div>

                                <span style={{
                                    fontSize: "0.8rem",
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s", color: isDark ? "#64748b" : "#94a3b8",
                                }}>▼</span>
                            </button>

                            {/* Subtopics */}
                            {isOpen && (
                                <div style={{
                                    borderTop: `1px solid ${isDark ? "#1e1e2e" : "#e5e7eb"}`,
                                    padding: "8px",
                                }}>
                                    {topic.subtopics.map((sub, si) => {
                                        const subKey = `${ti}-${si}`;
                                        const subOpen = expandedSub === subKey;
                                        const subProg = getSubProgress(topic, sub);

                                        return (
                                            <div key={si} style={{ marginBottom: "2px" }}>
                                                {/* Subtopic header */}
                                                <div
                                                    onClick={() => setExpandedSub(subOpen ? null : subKey)}
                                                    style={{
                                                        width: "100%", display: "flex", alignItems: "center",
                                                        gap: "10px", padding: "10px 14px",
                                                        background: subOpen ? (isDark ? "#0f0f18" : "#f8f9fa") : "transparent",
                                                        border: "none", borderRadius: "8px",
                                                        cursor: "pointer", textAlign: "left",
                                                        color: isDark ? "#cbd5e1" : "#334155",
                                                        fontFamily: "inherit",
                                                        transition: "background 0.15s",
                                                    }}
                                                >
                                                    <span style={{
                                                        fontSize: "0.7rem",
                                                        transform: subOpen ? "rotate(90deg)" : "rotate(0deg)",
                                                        transition: "transform 0.15s",
                                                        color: topic.color, fontWeight: 700,
                                                    }}>▶</span>
                                                    <span style={{
                                                        flex: 1, fontSize: "0.78rem", fontWeight: 600,
                                                    }}>{sub.name}</span>
                                                    <span style={{
                                                        fontSize: "0.6rem", fontWeight: 600,
                                                        color: subProg.done > 0 ? topic.color : (isDark ? "#475569" : "#94a3b8"),
                                                    }}>{subProg.done}/{subProg.total}</span>
                                                    {/* Mini bar */}
                                                    <div style={{
                                                        width: "40px", height: "3px", borderRadius: "2px",
                                                        background: isDark ? "#1e1e2e" : "#e5e7eb",
                                                        overflow: "hidden",
                                                    }}>
                                                        <div style={{
                                                            height: "100%", borderRadius: "2px",
                                                            width: `${subProg.pct}%`,
                                                            background: topic.color,
                                                            transition: "width 0.3s",
                                                        }} />
                                                    </div>
                                                </div>

                                                {/* Problems */}
                                                {subOpen && (
                                                    <div style={{ padding: "4px 0 8px 38px" }}>
                                                        {sub.problems.map((p, pi) => {
                                                            const key = `${topic.name}::${sub.name}::${p.name}`;
                                                            const checked = !!checkedProblems[key];
                                                            const lcUrl = p.lc && p.lc !== "—"
                                                                ? `https://leetcode.com/problems/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}/`
                                                                : null;

                                                            return (
                                                                <div key={pi} style={{
                                                                    display: "flex", alignItems: "center", gap: "10px",
                                                                    padding: "6px 10px",
                                                                    borderRadius: "6px",
                                                                    background: checked
                                                                        ? (isDark ? "#4ade8008" : "#dcfce708")
                                                                        : "transparent",
                                                                    transition: "background 0.15s",
                                                                }}>
                                                                    {/* Checkbox */}
                                                                    <button
                                                                        onClick={() => toggleProblem(key)}
                                                                        style={{
                                                                            width: "18px", height: "18px",
                                                                            borderRadius: "5px", flexShrink: 0,
                                                                            border: checked
                                                                                ? `2px solid #4ade80`
                                                                                : `2px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                                                                            background: checked ? "#4ade80" : "transparent",
                                                                            cursor: "pointer",
                                                                            display: "flex", alignItems: "center",
                                                                            justifyContent: "center",
                                                                            transition: "all 0.15s",
                                                                            padding: 0,
                                                                        }}
                                                                    >
                                                                        {checked && (
                                                                            <span style={{
                                                                                fontSize: "0.6rem", color: "#000",
                                                                                fontWeight: 900, lineHeight: 1,
                                                                            }}>✓</span>
                                                                        )}
                                                                    </button>

                                                                    {/* LeetCode / GFG link */}
                                                                    {lcUrl ? (
                                                                        <a href={lcUrl} target="_blank" rel="noopener noreferrer"
                                                                            style={{
                                                                                display: "inline-flex", alignItems: "center",
                                                                                flexShrink: 0, opacity: 0.6,
                                                                                transition: "opacity 0.15s",
                                                                            }}
                                                                            onMouseOver={e => e.currentTarget.style.opacity = 1}
                                                                            onMouseOut={e => e.currentTarget.style.opacity = 0.6}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#f3a21f" d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z" /></svg>
                                                                        </a>
                                                                    ) : p.gfg ? (
                                                                        <a href={p.gfg} target="_blank" rel="noopener noreferrer"
                                                                            style={{
                                                                                display: "inline-flex", alignItems: "center",
                                                                                flexShrink: 0, opacity: 0.7,
                                                                                transition: "opacity 0.15s",
                                                                                color: "#22c55e",
                                                                                fontSize: "0.65rem",
                                                                                fontWeight: 700,
                                                                                textDecoration: "none",
                                                                                backgroundColor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.15)",
                                                                                padding: "2px 6px",
                                                                                borderRadius: "4px"
                                                                            }}
                                                                            onMouseOver={e => e.currentTarget.style.opacity = 1}
                                                                            onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                                                                        >
                                                                            GFG
                                                                        </a>
                                                                    ) : null}

                                                                    {/* Problem name */}
                                                                    <span style={{
                                                                        flex: 1, fontSize: "0.73rem", fontWeight: 500,
                                                                        textDecoration: checked ? "line-through" : "none",
                                                                        opacity: checked ? 0.5 : 1,
                                                                        color: isDark ? "#e2e8f0" : "#1e293b",
                                                                        transition: "opacity 0.15s",
                                                                    }}>{p.name}</span>

                                                                    {/* Book icon */}
                                                                    {p.component && onProblemClick && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onProblemClick(p);
                                                                            }}
                                                                            title="View Visualization"
                                                                            style={{
                                                                                display: "inline-flex", alignItems: "center",
                                                                                justifyContent: "center",
                                                                                flexShrink: 0, opacity: 0.6,
                                                                                cursor: "pointer",
                                                                                background: "transparent",
                                                                                border: "none",
                                                                                padding: "4px",
                                                                                borderRadius: "4px",
                                                                                transition: "all 0.15s",
                                                                            }}
                                                                            onMouseOver={e => {
                                                                                e.currentTarget.style.opacity = 1;
                                                                                e.currentTarget.style.background = isDark ? "rgba(105, 111, 199, 0.15)" : "rgba(105, 111, 199, 0.1)";
                                                                            }}
                                                                            onMouseOut={e => {
                                                                                e.currentTarget.style.opacity = 0.6;
                                                                                e.currentTarget.style.background = "transparent";
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#696FC7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path></svg>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Footer ── */}
            <div style={{
                textAlign: "center", padding: "16px 24px 32px",
                fontSize: "0.6rem", color: isDark ? "#334155" : "#94a3b8",
                fontWeight: 500,
            }}>
                Curated from Blind 75 · NeetCode 150/300 · Striver A2Z · LeetCode Top Interview 150
            </div>
        </div>
    );
}
