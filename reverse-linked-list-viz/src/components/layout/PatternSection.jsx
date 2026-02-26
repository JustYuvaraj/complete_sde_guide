import { useTheme } from "../../shared/ThemeContext";
import ProblemCard from "./ProblemCard";
import { COMPONENTS } from "../../data/componentRegistry";

export default function PatternSection({ pattern, onProblemClick }) {
    const { isDark } = useTheme();
    const ready = pattern.problems.filter(p => p.component).length;

    return (
        <div style={{ marginBottom: "36px" }}>
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
                            {ready}/{pattern.problems.length} ready
                        </span>
                    </div>
                    <p style={{ margin: "2px 0 0", color: "#475569", fontSize: "0.8rem" }}>
                        {pattern.subtitle}
                    </p>
                </div>
            </div>

            {/* Problem Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "10px",
            }}>
                {pattern.problems.map((problem) => {
                    const hasViz = !!problem.component && !!COMPONENTS[problem.component];
                    return (
                        <ProblemCard
                            key={problem.id}
                            problem={problem}
                            pattern={pattern}
                            hasViz={hasViz}
                            onClick={onProblemClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}
