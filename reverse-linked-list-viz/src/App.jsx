// ═══════════════════════════════════════════════════════════════════
//  DSA Visualizer — App Entry Point
//  Handles navigation state and delegates rendering to page components
// ═══════════════════════════════════════════════════════════════════

import { useState } from "react";
import { useTheme } from "./shared/ThemeContext";

// ── Page Components ──
import HomePage from "./pages/HomePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ProblemViewPage from "./pages/ProblemViewPage";
import NeetCodeDashboard from "./pages/NeetCodeDashboard";
import NeetCodeCategoryPage from "./pages/NeetCodeCategoryPage";
import Faang500Page from "./pages/Faang500Page";

export default function App() {
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [ncMode, setNcMode] = useState(false);
  const [activeNCCategory, setActiveNCCategory] = useState(null);
  const [faang500Mode, setFaang500Mode] = useState(false);

  // ── FAANG 500 Roadmap ──
  if (faang500Mode) {
    return <Faang500Page onBack={() => setFaang500Mode(false)} />;
  }

  // ── NeetCode Category Detail ──
  if (activeNCCategory) {
    return (
      <NeetCodeCategoryPage
        category={activeNCCategory}
        onBack={() => setActiveNCCategory(null)}
        onProblemClick={(problem) => {
          setActiveNCCategory(null);
          setNcMode(false);
          setActiveProblem(problem);
        }}
      />
    );
  }

  // ── NeetCode 250 Dashboard ──
  if (ncMode) {
    return (
      <NeetCodeDashboard
        onBack={() => setNcMode(false)}
        onCategoryClick={setActiveNCCategory}
      />
    );
  }

  // ── Problem Visualization ──
  if (activeProblem) {
    return (
      <ProblemViewPage
        problem={activeProblem}
        onBack={() => setActiveProblem(null)}
      />
    );
  }

  // ── Category Detail ──
  if (activeCategory) {
    return (
      <CategoryDetailPage
        category={activeCategory}
        onBack={() => setActiveCategory(null)}
        onProblemClick={setActiveProblem}
      />
    );
  }

  // ── Homepage ──
  return (
    <HomePage
      onCategoryClick={setActiveCategory}
      onNcModeClick={() => setNcMode(true)}
      onFaang500Click={() => setFaang500Mode(true)}
    />
  );
}
