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
import Faang500Page from "./pages/Faang500Page";

export default function App() {
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [faang500Mode, setFaang500Mode] = useState(false);

  // ── Problem Visualization (always takes priority) ──
  if (activeProblem) {
    return (
      <ProblemViewPage
        problem={activeProblem}
        onBack={() => setActiveProblem(null)}
      />
    );
  }

  // ── FAANG 500 Roadmap ──
  if (faang500Mode) {
    return (
      <Faang500Page
        onBack={() => setFaang500Mode(false)}
        onProblemClick={(problem) => setActiveProblem(problem)}
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
      onFaang500Click={() => setFaang500Mode(true)}
    />
  );
}

