import { useTheme } from "../shared/ThemeContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import HeroSection from "../components/layout/HeroSection";
import PatternSection from "../components/layout/PatternSection";
import Footer from "../components/layout/Footer";
import { PATTERNS } from "../data/patternsData";

export default function CategoryDetailPage({ category, onBack, onProblemClick }) {
    const { theme } = useTheme();
    const catPatterns = category.patternIndices.map(i => PATTERNS[i]);
    const catTotal = catPatterns.reduce((s, p) => s + p.problems.length, 0);
    const catReady = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.component).length, 0);

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
                backLabel="← Home"
                stats={[
                    { value: catTotal, label: "Problems" },
                    { value: catPatterns.length, label: "Sections" },
                    { value: catReady, label: "Ready" },
                ]}
            />

            {/* Patterns & Problems */}
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 60px" }}>
                {catPatterns.map((pattern, pi) => (
                    <PatternSection
                        key={pi}
                        pattern={pattern}
                        onProblemClick={onProblemClick}
                    />
                ))}
            </div>

            <Footer>
                DSA Visualizer • {catReady} of {catTotal} problems ready in {category.name}
            </Footer>
        </div>
    );
}
