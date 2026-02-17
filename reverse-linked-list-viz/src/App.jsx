import { useState } from "react";
import { useTheme } from "./shared/ThemeContext";
import Factorial from "./problems/Factorial";
import Fibonacci from "./problems/Fibonacci";
import Power from "./problems/Power";
import ReverseLinkedList from "./problems/ReverseLinkedList";
import MergeSortedLists from "./problems/MergeSortedLists";
import ClimbingStairs from "./problems/ClimbingStairs";
import Palindrome from "./problems/Palindrome";
import Atoi from "./problems/atoi";
import MergeSort from "./problems/mergesort";
import QuickSort from "./problems/quicksort";
import BinarySearch from "./problems/BinarySearch";
import CountInversions from "./problems/CountInversions";
import MaxSubarray from "./problems/MaxSubarray";
import KthLargest from "./problems/KthLargest";
import SortList from "./problems/SortList";

import Subsets from "./problems/Subsets";
import SubsetsII from "./problems/SubsetsII";
import CombinationSum from "./problems/CombinationSum";
import CombinationSumII from "./problems/CombinationSumII";
import CombinationSumIII from "./problems/CombinationSumIII";
import Combinations from "./problems/Combinations";
import TargetSum from "./problems/TargetSum";
import PartitionSubset from "./problems/PartitionSubset";
import Knapsack from "./problems/Knapsack";
import CoinChange from "./problems/CoinChange";
import CoinChangeII from "./problems/CoinChangeII";
import LCS from "./problems/LCS";
import EditDistance from "./problems/EditDistance";
import LIS from "./problems/LIS";
import Permutations from "./problems/Permutations";

const PATTERNS = [
  {
    name: "Simple Recursion",
    subtitle: "Shrink by 1",
    icon: "🔽",
    color: "#4ade80",
    bg: "#064e3b",
    bgLight: "#dcfce7",
    problems: [
      { id: 1, name: "Factorial", lc: "—", diff: "🟢", component: "Factorial" },
      { id: 2, name: "Fibonacci Number", lc: "509", diff: "🟢", component: "Fibonacci" },
      { id: 3, name: "Power of x^n", lc: "50", diff: "🟡", component: "Power" },
      { id: 4, name: "Reverse Linked List", lc: "206", diff: "🟢", component: "ReverseLinkedList" },
      { id: 5, name: "Merge Two Sorted Lists", lc: "21", diff: "🟢", component: "MergeSortedLists" },
      { id: 6, name: "Climbing Stairs", lc: "70", diff: "🟢", component: "ClimbingStairs" },
      { id: 7, name: "Check Palindrome", lc: "—", diff: "🟢", component: "Palindrome" },
      { id: 8, name: "String to Integer (atoi)", lc: "8", diff: "🟡", component: "Atoi" },
    ],
  },
  {
    name: "Divide & Conquer",
    subtitle: "Split in Half",
    icon: "✂️",
    color: "#60a5fa",
    bg: "#172554",
    bgLight: "#dbeafe",
    problems: [
      { id: 9, name: "Merge Sort", lc: "—", diff: "🟡", component: "MergeSort" },
      { id: 10, name: "Quick Sort", lc: "—", diff: "🟡", component: "QuickSort" },
      { id: 11, name: "Binary Search", lc: "704", diff: "🟢", component: "BinarySearch" },
      { id: 12, name: "Count Inversions", lc: "—", diff: "🔴", component: "CountInversions" },
      { id: 13, name: "Maximum Subarray (D&C)", lc: "53", diff: "🟡", component: "MaxSubarray" },
      { id: 14, name: "Kth Largest Element", lc: "215", diff: "🟡", component: "KthLargest" },
      { id: 15, name: "Sort List", lc: "148", diff: "🟡", component: "SortList" },
    ],
  },
  {
    name: "Include / Exclude",
    subtitle: "Take or Skip",
    icon: "🎯",
    color: "#fb923c",
    bg: "#431407",
    bgLight: "#ffedd5",
    problems: [
      { id: 16, name: "Subsets", lc: "78", diff: "🟡", component: "Subsets" },
      { id: 17, name: "Subsets II", lc: "90", diff: "🟡", component: "SubsetsII" },
      { id: 18, name: "Combination Sum", lc: "39", diff: "🟡", component: "CombinationSum" },
      { id: 19, name: "Combination Sum II", lc: "40", diff: "🟡", component: "CombinationSumII" },
      { id: 20, name: "Combination Sum III", lc: "216", diff: "🟡", component: "CombinationSumIII" },
      { id: 21, name: "Combinations (nCr)", lc: "77", diff: "🟡", component: "Combinations" },
      { id: 22, name: "Target Sum", lc: "494", diff: "🟡", component: "TargetSum" },
      { id: 23, name: "Partition Equal Subset Sum", lc: "416", diff: "🟡", component: "PartitionSubset" },
      { id: 24, name: "0/1 Knapsack", lc: "—", diff: "🟡", component: "Knapsack" },
      { id: 25, name: "Coin Change", lc: "322", diff: "🟡", component: "CoinChange" },
      { id: 26, name: "Coin Change II", lc: "518", diff: "🟡", component: "CoinChangeII" },
      { id: 27, name: "Longest Common Subsequence", lc: "1143", diff: "🟡", component: "LCS" },
      { id: 28, name: "Edit Distance", lc: "72", diff: "🔴", component: "EditDistance" },
      { id: 29, name: "Longest Increasing Subseq", lc: "300", diff: "🟡", component: "LIS" },
    ],
  },
  {
    name: "Try All Choices",
    subtitle: "Loop + Recurse",
    icon: "🔄",
    color: "#c084fc",
    bg: "#2e1065",
    bgLight: "#f3e8ff",
    problems: [
      { id: 30, name: "Permutations", lc: "46", diff: "🟡", component: "Permutations" },
      { id: 31, name: "Permutations II", lc: "47", diff: "🟡", component: null },
      { id: 32, name: "Generate Parentheses", lc: "22", diff: "🟡", component: null },
      { id: 33, name: "Letter Combinations of Phone", lc: "17", diff: "🟡", component: null },
      { id: 34, name: "N-Queens", lc: "51", diff: "🔴", component: null },
      { id: 35, name: "N-Queens II", lc: "52", diff: "🔴", component: null },
      { id: 36, name: "Sudoku Solver", lc: "37", diff: "🔴", component: null },
      { id: 37, name: "Beautiful Arrangement", lc: "526", diff: "🟡", component: null },
      { id: 38, name: "Next Permutation", lc: "31", diff: "🟡", component: null },
      { id: 39, name: "Permutation Sequence", lc: "60", diff: "🔴", component: null },
    ],
  },
  {
    name: "Partition / Cut",
    subtitle: "Try Every Split",
    icon: "🔪",
    color: "#f87171",
    bg: "#450a0a",
    bgLight: "#fee2e2",
    problems: [
      { id: 40, name: "Palindrome Partitioning", lc: "131", diff: "🟡", component: null },
      { id: 41, name: "Palindrome Partitioning II", lc: "132", diff: "🔴", component: null },
      { id: 42, name: "Word Break", lc: "139", diff: "🟡", component: null },
      { id: 43, name: "Word Break II", lc: "140", diff: "🔴", component: null },
      { id: 44, name: "Restore IP Addresses", lc: "93", diff: "🟡", component: null },
      { id: 45, name: "Decode Ways", lc: "91", diff: "🟡", component: null },
      { id: 46, name: "Scramble String", lc: "87", diff: "🔴", component: null },
      { id: 47, name: "Expression Add Operators", lc: "282", diff: "🔴", component: null },
    ],
  },
  {
    name: "Grid / 2D Recursion",
    subtitle: "Move in All Directions",
    icon: "🗺️",
    color: "#2dd4bf",
    bg: "#042f2e",
    bgLight: "#ccfbf1",
    problems: [
      { id: 48, name: "Flood Fill", lc: "733", diff: "🟢", component: null },
      { id: 49, name: "Number of Islands", lc: "200", diff: "🟡", component: null },
      { id: 50, name: "Word Search", lc: "79", diff: "🟡", component: null },
      { id: 51, name: "Word Search II", lc: "212", diff: "🔴", component: null },
      { id: 52, name: "Surrounded Regions", lc: "130", diff: "🟡", component: null },
      { id: 53, name: "Unique Paths", lc: "62", diff: "🟡", component: null },
      { id: 54, name: "Unique Paths II", lc: "63", diff: "🟡", component: null },
      { id: 55, name: "Minimum Path Sum", lc: "64", diff: "🟡", component: null },
      { id: 56, name: "Rat in a Maze", lc: "—", diff: "🟡", component: null },
      { id: 57, name: "Longest Increasing Path", lc: "329", diff: "🔴", component: null },
      { id: 58, name: "Pacific Atlantic Water Flow", lc: "417", diff: "🟡", component: null },
      { id: 59, name: "Max Area of Island", lc: "695", diff: "🟡", component: null },
      { id: 60, name: "Rotting Oranges", lc: "994", diff: "🟡", component: null },
    ],
  },
];

const COMPONENTS = {
  Factorial,
  Fibonacci,
  Power,
  ReverseLinkedList,
  MergeSortedLists,
  ClimbingStairs,
  Palindrome,
  Atoi,
  MergeSort,
  QuickSort,
  BinarySearch,
  CountInversions,
  MaxSubarray,
  KthLargest,
  SortList,

  Subsets,
  SubsetsII,
  CombinationSum,
  CombinationSumII,
  CombinationSumIII,
  Combinations,
  TargetSum,
  PartitionSubset,
  Knapsack,
  CoinChange,
  CoinChangeII,
  LCS,
  EditDistance,
  LIS,
  Permutations,
};

const totalProblems = PATTERNS.reduce((s, p) => s + p.problems.length, 0);
const readyProblems = PATTERNS.reduce((s, p) => s + p.problems.filter(x => x.component).length, 0);

function ThemeToggle() {
  const { toggle, isDark } = useTheme();
  return (
    <button
      onClick={toggle}
      style={{
        position: "fixed", top: "16px", right: "16px", zIndex: 100,
        background: isDark ? "#1e293b" : "#e2e8f0",
        color: isDark ? "#e2e8f0" : "#1e293b",
        border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
        borderRadius: "10px", padding: "8px 14px",
        fontSize: "0.82rem", fontWeight: "700", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.2s",
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "#818cf8"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = isDark ? "#334155" : "#cbd5e1"; }}
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default function App() {
  const { theme, isDark } = useTheme();
  const [activeProblem, setActiveProblem] = useState(null);

  if (activeProblem) {
    const Comp = COMPONENTS[activeProblem.component];
    return (
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        <ThemeToggle />
        <button
          onClick={() => setActiveProblem(null)}
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
          ← All Problems
        </button>
        <Comp />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <ThemeToggle />

      {/* Hero */}
      <div style={{
        textAlign: "center", padding: "60px 20px 40px",
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
            Recursion Visualizer
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "1rem", margin: "0 0 8px", maxWidth: "500px", marginInline: "auto" }}>
            Step through every recursive call. See the code, stack, and data structures change in real-time.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
            <Stat value={totalProblems} label="Problems" />
            <Stat value="6" label="Patterns" />
            <Stat value={readyProblems} label="Ready" />
          </div>
        </div>
      </div>

      {/* Patterns grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 60px" }}>
        {PATTERNS.map((pattern, pi) => {
          const ready = pattern.problems.filter(p => p.component).length;
          return (
            <div key={pi} style={{ marginBottom: "36px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "16px", padding: "0 4px",
              }}>
                <span style={{ fontSize: "1.5rem" }}>{pattern.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: pattern.color }}>
                      Pattern {pi + 1}: {pattern.name}
                    </h2>
                    <span style={{
                      fontSize: "0.65rem",
                      background: isDark ? pattern.bg : pattern.bgLight,
                      color: pattern.color, padding: "3px 10px",
                      borderRadius: "20px", fontWeight: "700",
                      border: `1px solid ${pattern.color}${theme.patternBadgeBorder}`,
                    }}>
                      {ready}/{pattern.problems.length} ready
                    </span>
                  </div>
                  <p style={{ margin: "2px 0 0", color: theme.textMuted, fontSize: "0.8rem" }}>
                    {pattern.subtitle}
                  </p>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "10px",
              }}>
                {pattern.problems.map((problem) => {
                  const hasViz = !!problem.component;
                  return (
                    <button
                      key={problem.id}
                      onClick={() => hasViz && setActiveProblem(problem)}
                      disabled={!hasViz}
                      style={{
                        background: hasViz
                          ? (isDark ? `linear-gradient(135deg, ${pattern.bg}, #0d1117)` : `linear-gradient(135deg, ${pattern.bgLight}, #ffffff)`)
                          : theme.problemBg,
                        border: `1px solid ${hasViz ? pattern.color + "44" : theme.cardBorder}`,
                        borderRadius: "14px", padding: "16px 18px",
                        cursor: hasViz ? "pointer" : "default",
                        textAlign: "left",
                        display: "flex", alignItems: "center", gap: "14px",
                        transition: "all 0.25s",
                        opacity: hasViz ? 1 : theme.problemDisabledOpacity,
                        position: "relative", overflow: "hidden",
                      }}
                      onMouseOver={e => {
                        if (hasViz) {
                          e.currentTarget.style.borderColor = pattern.color;
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 8px 30px ${pattern.color}${theme.cardHoverShadow}`;
                        }
                      }}
                      onMouseOut={e => {
                        if (hasViz) {
                          e.currentTarget.style.borderColor = pattern.color + "44";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: hasViz ? pattern.color + "20" : (isDark ? "#1e293b" : "#e2e8f0"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: "800",
                        color: hasViz ? pattern.color : theme.textDim,
                        flexShrink: 0,
                      }}>
                        {problem.id}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "0.85rem", fontWeight: "700",
                          color: hasViz ? theme.text : theme.textMuted,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {problem.name}
                        </div>
                        <div style={{
                          fontSize: "0.68rem", color: theme.textMuted, marginTop: "3px",
                          display: "flex", gap: "8px", alignItems: "center",
                        }}>
                          <span>{problem.diff}</span>
                          {problem.lc !== "—" && <span>LC #{problem.lc}</span>}
                          {problem.lc === "—" && <span>Classic</span>}
                        </div>
                      </div>

                      <div style={{
                        fontSize: "0.65rem", fontWeight: "700",
                        color: hasViz ? "#10b981" : theme.textDim,
                        flexShrink: 0,
                      }}>
                        {hasViz ? "▶ VIEW" : "soon"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        textAlign: "center", padding: "30px 20px 40px",
        borderTop: `1px solid ${theme.footerBorder}`, color: theme.footerText, fontSize: "0.75rem",
      }}>
        Recursion Visualizer • {readyProblems} of {totalProblems} problems ready • More coming soon
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  const { theme } = useTheme();
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: theme.text }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}
