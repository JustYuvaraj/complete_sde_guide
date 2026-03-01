import { useState, useMemo } from "react";
import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import { COMPONENTS } from "../data/componentRegistry";
import PracticeEditor from "../components/PracticeEditor";
import * as configs from "../engines/configs";

// Helper to get the actual config object from the engine component
// We need this so the PracticeEditor has access to the test cases (defaults) and description (explain)
function getConfigForProblem(problem) {
    // Component names like "WordPatternEngine" usually map to "wordPatternConfig"
    // So we try to find the matching config dynamically
    const baseName = problem.component.replace("Engine", "");
    const configName = baseName.charAt(0).toLowerCase() + baseName.slice(1) + "Config";
    return configs[configName] || {
        title: problem.title || "Practice Mode",
        code: ["class Solution:\n    def solve(self, *args):\n        pass\n"],
        explain: [{ title: "Description", content: "No description available." }],
        defaults: {}
    };
}

export default function ProblemViewPage({ problem, onBack }) {
    const { theme, isDark } = useTheme();
    const [isPracticeMode, setIsPracticeMode] = useState(false);

    // We get the actual Engine component to render
    const Comp = COMPONENTS[problem.component];
    const problemConfig = useMemo(() => getConfigForProblem(problem), [problem]);

    return (
        <div style={{ minHeight: "100vh", background: theme.bg, position: "relative" }}>

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

            <Comp
                isPracticeMode={isPracticeMode}
                problemConfig={problemConfig}
                setIsPracticeMode={setIsPracticeMode}
                headerRightItem={
                    <button
                        onClick={() => setIsPracticeMode(!isPracticeMode)}
                        style={{
                            background: isDark
                                ? (isPracticeMode ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.1) 100%)" : "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)")
                                : (isPracticeMode ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(248, 113, 113, 0.05) 100%)" : "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%)"),
                            color: isDark ? (isPracticeMode ? "#f87171" : "#34d399") : (isPracticeMode ? "#dc2626" : "#059669"),
                            border: `1px solid ${isDark ? (isPracticeMode ? "rgba(248, 113, 113, 0.3)" : "rgba(52, 211, 153, 0.3)") : (isPracticeMode ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)")}`,
                            borderRadius: "12px",
                            padding: "8px 16px",
                            fontSize: "0.85rem",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: isDark
                                ? "0 4px 12px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
                                : "0 4px 12px rgba(16, 185, 129, 0.05), inset 0 1px 0 rgba(255,255,255,0.5)",
                            textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.3)" : "none",
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onMouseDown={e => {
                            e.currentTarget.style.transform = "translateY(1px)";
                        }}
                        onMouseUp={e => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                    >
                        <span style={{ fontSize: "1.0rem" }}>{isPracticeMode ? "❌" : "💻"}</span> {isPracticeMode ? "Exit Practice" : "Practice Python"}
                    </button>
                }
            />
        </div>
    );
}
