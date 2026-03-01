// ═══════════════════════════════════════════════════════════════════
//  DSA Visualizer — App Entry Point
//  Handles navigation state and delegates rendering to page components
//  Integrates with browser history so Back button works correctly.
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./shared/ThemeContext";

// ── Page Components ──
import HomePage from "./pages/HomePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ProblemViewPage from "./pages/ProblemViewPage";
import Faang500Page from "./pages/Faang500Page";

// Simple state serialiser — we push a "page" key into history
function pushPage(page) {
  window.history.pushState({ page }, "");
}

export default function App() {
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [faang500Mode, setFaang500Mode] = useState(false);
  // Track where the user entered the problem from
  const [problemSource, setProblemSource] = useState(null); // "faang500" | "category" | null

  // ── Navigate helpers (push browser history) ──
  const goToFaang500 = useCallback(() => {
    setFaang500Mode(true);
    pushPage("faang500");
  }, []);

  const goToCategory = useCallback((cat) => {
    setActiveCategory(cat);
    pushPage("category");
  }, []);

  const goToProblem = useCallback((problem, source) => {
    setActiveProblem(problem);
    setProblemSource(source || null);
    pushPage("problem");
  }, []);

  const goHome = useCallback(() => {
    setActiveProblem(null);
    setActiveCategory(null);
    setFaang500Mode(false);
    setProblemSource(null);
  }, []);

  const goBackFromProblem = useCallback(() => {
    setActiveProblem(null);
    // Return to wherever the user came from
    if (problemSource === "faang500") {
      // Stay in faang500 mode — don't clear it
    } else if (problemSource === "category") {
      // Stay in category mode — don't clear it
    } else {
      // Unknown source — go home
      setActiveCategory(null);
      setFaang500Mode(false);
    }
    setProblemSource(null);
  }, [problemSource]);

  // ── Browser back/forward button handler ──
  useEffect(() => {
    const handlePopState = () => {
      // When the user presses browser Back, we pop one level of our nav
      if (activeProblem) {
        // Was viewing a problem → go back to source
        goBackFromProblem();
      } else if (faang500Mode) {
        setFaang500Mode(false);
      } else if (activeCategory) {
        setActiveCategory(null);
      }
      // else already home — browser will handle
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeProblem, faang500Mode, activeCategory, goBackFromProblem]);

  // ── Problem Visualization (always takes priority) ──
  if (activeProblem) {
    return (
      <ProblemViewPage
        problem={activeProblem}
        onBack={goBackFromProblem}
      />
    );
  }

  // ── FAANG 500 Roadmap ──
  if (faang500Mode) {
    return (
      <Faang500Page
        onBack={() => { setFaang500Mode(false); }}
        onProblemClick={(problem) => goToProblem(problem, "faang500")}
      />
    );
  }

  // ── Category Detail ──
  if (activeCategory) {
    return (
      <CategoryDetailPage
        category={activeCategory}
        onBack={() => { setActiveCategory(null); }}
        onProblemClick={(problem) => goToProblem(problem, "category")}
      />
    );
  }

  // ── Homepage ──
  return (
    <HomePage
      onCategoryClick={goToCategory}
      onFaang500Click={goToFaang500}
    />
  );
}
