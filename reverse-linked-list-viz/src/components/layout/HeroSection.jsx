import { useTheme } from "../../shared/ThemeContext";
import BackButton from "./BackButton";
import Stat from "./Stat";

export default function HeroSection({ icon, title, subtitle, gradient, glowColor, stats = [], onBack, backLabel }) {
    const { theme } = useTheme();
    return (
        <div style={{
            textAlign: "center", padding: "50px 20px 30px",
            background: theme.heroBg, position: "relative", overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
                width: "500px", height: "500px", borderRadius: "50%",
                background: `radial-gradient(circle, ${glowColor || theme.heroGlow} 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
                {onBack && <BackButton onClick={onBack} label={backLabel || "← Back"} />}
                {icon && <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{icon}</div>}
                <h1 style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "900",
                    background: gradient || theme.heroGradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    margin: "0 0 8px",
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{ color: theme.textMuted, fontSize: "0.9rem", margin: "0 0 16px" }}>
                        {subtitle}
                    </p>
                )}
                {stats.length > 0 && (
                    <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
                        {stats.map((s, i) => <Stat key={i} value={s.value} label={s.label} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
