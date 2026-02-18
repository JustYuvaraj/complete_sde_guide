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
import PermutationsII from "./problems/PermutationsII";
import GenerateParentheses from "./problems/GenerateParentheses";
import LetterCombinations from "./problems/LetterCombinations";
import NQueens from "./problems/NQueens";
import NQueensII from "./problems/NQueensII";
import SudokuSolver from "./problems/SudokuSolver";
import BeautifulArrangement from "./problems/BeautifulArrangement";
import NextPermutation from "./problems/NextPermutation";
import PermutationSequence from "./problems/PermutationSequence";

import PalindromePartition from "./problems/PalindromePartition";
import PalindromePartitionII from "./problems/PalindromePartitionII";
import WordBreak from "./problems/WordBreak";
import WordBreakII from "./problems/WordBreakII";
import RestoreIP from "./problems/RestoreIP";
import DecodeWays from "./problems/DecodeWays";
import ScrambleString from "./problems/ScrambleString";
import ExpressionOperators from "./problems/ExpressionOperators";

import FloodFill from "./problems/FloodFill";
import NumberOfIslands from "./problems/NumberOfIslands";
import WordSearch from "./problems/WordSearch";
import WordSearchII from "./problems/WordSearchII";
import SurroundedRegions from "./problems/SurroundedRegions";
import UniquePaths from "./problems/UniquePaths";
import UniquePathsII from "./problems/UniquePathsII";
import MinPathSum from "./problems/MinPathSum";
import RatInMaze from "./problems/RatInMaze";
import LongestIncreasingPath from "./problems/LongestIncreasingPath";
import PacificAtlantic from "./problems/PacificAtlantic";
import MaxAreaIsland from "./problems/MaxAreaIsland";
import RottingOranges from "./problems/RottingOranges";

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
      { id: 31, name: "Permutations II", lc: "47", diff: "🟡", component: "PermutationsII" },
      { id: 32, name: "Generate Parentheses", lc: "22", diff: "🟡", component: "GenerateParentheses" },
      { id: 33, name: "Letter Combinations of Phone", lc: "17", diff: "🟡", component: "LetterCombinations" },
      { id: 34, name: "N-Queens", lc: "51", diff: "🔴", component: "NQueens" },
      { id: 35, name: "N-Queens II", lc: "52", diff: "🔴", component: "NQueensII" },
      { id: 36, name: "Sudoku Solver", lc: "37", diff: "🔴", component: "SudokuSolver" },
      { id: 37, name: "Beautiful Arrangement", lc: "526", diff: "🟡", component: "BeautifulArrangement" },
      { id: 38, name: "Next Permutation", lc: "31", diff: "🟡", component: "NextPermutation" },
      { id: 39, name: "Permutation Sequence", lc: "60", diff: "🔴", component: "PermutationSequence" },
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
      { id: 40, name: "Palindrome Partitioning", lc: "131", diff: "🟡", component: "PalindromePartition" },
      { id: 41, name: "Palindrome Partitioning II", lc: "132", diff: "🔴", component: "PalindromePartitionII" },
      { id: 42, name: "Word Break", lc: "139", diff: "🟡", component: "WordBreak" },
      { id: 43, name: "Word Break II", lc: "140", diff: "🔴", component: "WordBreakII" },
      { id: 44, name: "Restore IP Addresses", lc: "93", diff: "🟡", component: "RestoreIP" },
      { id: 45, name: "Decode Ways", lc: "91", diff: "🟡", component: "DecodeWays" },
      { id: 46, name: "Scramble String", lc: "87", diff: "🔴", component: "ScrambleString" },
      { id: 47, name: "Expression Add Operators", lc: "282", diff: "🔴", component: "ExpressionOperators" },
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
      { id: 48, name: "Flood Fill", lc: "733", diff: "🟢", component: "FloodFill" },
      { id: 49, name: "Number of Islands", lc: "200", diff: "🟡", component: "NumberOfIslands" },
      { id: 50, name: "Word Search", lc: "79", diff: "🟡", component: "WordSearch" },
      { id: 51, name: "Word Search II", lc: "212", diff: "🔴", component: "WordSearchII" },
      { id: 52, name: "Surrounded Regions", lc: "130", diff: "🟡", component: "SurroundedRegions" },
      { id: 53, name: "Unique Paths", lc: "62", diff: "🟡", component: "UniquePaths" },
      { id: 54, name: "Unique Paths II", lc: "63", diff: "🟡", component: "UniquePathsII" },
      { id: 55, name: "Minimum Path Sum", lc: "64", diff: "🟡", component: "MinPathSum" },
      { id: 56, name: "Rat in a Maze", lc: "—", diff: "🟡", component: "RatInMaze" },
      { id: 57, name: "Longest Increasing Path", lc: "329", diff: "🔴", component: "LongestIncreasingPath" },
      { id: 58, name: "Pacific Atlantic Water Flow", lc: "417", diff: "🟡", component: "PacificAtlantic" },
      { id: 59, name: "Max Area of Island", lc: "695", diff: "🟡", component: "MaxAreaIsland" },
      { id: 60, name: "Rotting Oranges", lc: "994", diff: "🟡", component: "RottingOranges" },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  //  ARRAYS
  // ═══════════════════════════════════════════════════════════════════
  {
    name: "Arrays — Easy",
    subtitle: "Fundamentals & Frequency Patterns",
    icon: "📦",
    color: "#22d3ee",
    bg: "#083344",
    bgLight: "#cffafe",
    problems: [
      { id: 101, name: "Second Largest Element", lc: "—", diff: "🟢" },
      { id: 102, name: "Check if Array is Sorted", lc: "—", diff: "🟢" },
      { id: 103, name: "Remove Duplicates from Sorted Array", lc: "26", diff: "🟢" },
      { id: 104, name: "Left Rotate Array by One", lc: "—", diff: "🟢" },
      { id: 105, name: "Left Rotate Array by K Places", lc: "189", diff: "🟢" },
      { id: 106, name: "Move Zeros to End", lc: "283", diff: "🟢" },
      { id: 107, name: "Linear Search", lc: "—", diff: "🟢" },
      { id: 108, name: "Union of Two Sorted Arrays", lc: "—", diff: "🟢" },
      { id: 109, name: "Find Missing Number", lc: "268", diff: "🟢" },
      { id: 110, name: "Maximum Consecutive Ones", lc: "485", diff: "🟢" },
      { id: 111, name: "Single Number", lc: "136", diff: "🟡" },
      { id: 112, name: "Longest Subarray with Sum K (Positives)", lc: "—", diff: "🟡" },
      { id: 113, name: "Longest Subarray with Sum K", lc: "—", diff: "🟡" },
    ],
  },
  {
    name: "Arrays — Medium",
    subtitle: "Two Pointers, Prefix Sums & Greedy",
    icon: "📊",
    color: "#a78bfa",
    bg: "#2e1065",
    bgLight: "#ede9fe",
    problems: [
      { id: 114, name: "Two Sum", lc: "1", diff: "🟢" },
      { id: 115, name: "Sort 0s 1s 2s (Dutch National Flag)", lc: "75", diff: "🟡" },
      { id: 116, name: "Majority Element", lc: "169", diff: "🟢" },
      { id: 117, name: "Kadane's Algorithm (Max Subarray Sum)", lc: "53", diff: "🟡" },
      { id: 118, name: "Print Max Subarray", lc: "53", diff: "🟡" },
      { id: 119, name: "Stock Buy and Sell", lc: "121", diff: "🟡" },
      { id: 120, name: "Rearrange Array by Sign", lc: "2149", diff: "🟡" },
      { id: 121, name: "Next Permutation", lc: "31", diff: "🟡" },
      { id: 122, name: "Leaders in an Array", lc: "—", diff: "🟡" },
      { id: 123, name: "Longest Consecutive Sequence", lc: "128", diff: "🟡" },
      { id: 124, name: "Set Matrix Zeroes", lc: "73", diff: "🟡" },
      { id: 125, name: "Rotate Matrix by 90°", lc: "48", diff: "🟡" },
      { id: 126, name: "Spiral Matrix", lc: "54", diff: "🟡" },
      { id: 127, name: "Count Subarrays with Given Sum", lc: "560", diff: "🟡" },
    ],
  },
  {
    name: "Arrays — Hard",
    subtitle: "Advanced Techniques & Counting",
    icon: "🔥",
    color: "#f43f5e",
    bg: "#4c0519",
    bgLight: "#ffe4e6",
    problems: [
      { id: 128, name: "Pascal's Triangle", lc: "118", diff: "🟢" },
      { id: 129, name: "Majority Element II", lc: "229", diff: "🔴" },
      { id: 130, name: "3 Sum", lc: "15", diff: "🟡" },
      { id: 131, name: "4 Sum", lc: "18", diff: "🟡" },
      { id: 132, name: "Largest Subarray with Sum 0", lc: "—", diff: "🟡" },
      { id: 133, name: "Count Subarrays with XOR K", lc: "—", diff: "🔴" },
      { id: 134, name: "Merge Overlapping Intervals", lc: "56", diff: "🟡" },
      { id: 135, name: "Merge Sorted Arrays (No Extra Space)", lc: "88", diff: "🟡" },
      { id: 136, name: "Repeating and Missing Number", lc: "—", diff: "🔴" },
      { id: 137, name: "Count Inversions", lc: "—", diff: "🔴" },
      { id: 138, name: "Reverse Pairs", lc: "493", diff: "🔴" },
      { id: 139, name: "Maximum Product Subarray", lc: "152", diff: "🔴" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  BINARY SEARCH
  // ═══════════════════════════════════════════════════════════════════
  {
    name: "BS on 1D Arrays",
    subtitle: "Classic Binary Search Patterns",
    icon: "🔍",
    color: "#38bdf8",
    bg: "#082f49",
    bgLight: "#e0f2fe",
    problems: [
      { id: 201, name: "Search X in Sorted Array", lc: "704", diff: "🟢" },
      { id: 202, name: "Lower Bound", lc: "—", diff: "🟢" },
      { id: 203, name: "Upper Bound", lc: "—", diff: "🟢" },
      { id: 204, name: "Search Insert Position", lc: "35", diff: "🟢" },
      { id: 205, name: "Floor and Ceil in Sorted Array", lc: "—", diff: "🟢" },
      { id: 206, name: "First and Last Occurrence", lc: "34", diff: "🟢" },
      { id: 207, name: "Count Occurrences in Sorted Array", lc: "—", diff: "🟢" },
      { id: 208, name: "Search in Rotated Sorted Array I", lc: "33", diff: "🟡" },
      { id: 209, name: "Search in Rotated Sorted Array II", lc: "81", diff: "🟢" },
      { id: 210, name: "Min in Rotated Sorted Array", lc: "153", diff: "🟢" },
      { id: 211, name: "How Many Times Array Rotated", lc: "—", diff: "🟢" },
      { id: 212, name: "Single Element in Sorted Array", lc: "540", diff: "🟡" },
      { id: 213, name: "Find Peak Element", lc: "162", diff: "🟡" },
    ],
  },
  {
    name: "BS on Answers",
    subtitle: "Binary Search on Search Space",
    icon: "🎯",
    color: "#e879f9",
    bg: "#4a044e",
    bgLight: "#fae8ff",
    problems: [
      { id: 214, name: "Find Square Root", lc: "69", diff: "🟡" },
      { id: 215, name: "Find Nth Root", lc: "—", diff: "🟡" },
      { id: 216, name: "Koko Eating Bananas", lc: "875", diff: "🟡" },
      { id: 217, name: "Minimum Days to Make M Bouquets", lc: "1482", diff: "🟡" },
      { id: 218, name: "Find the Smallest Divisor", lc: "1283", diff: "🟡" },
      { id: 219, name: "Capacity to Ship Packages", lc: "1011", diff: "🟡" },
      { id: 220, name: "Kth Missing Positive Number", lc: "1539", diff: "🟡" },
      { id: 221, name: "Aggressive Cows", lc: "—", diff: "🔴" },
      { id: 222, name: "Book Allocation Problem", lc: "—", diff: "🔴" },
      { id: 223, name: "Split Array — Largest Sum", lc: "410", diff: "🔴" },
      { id: 224, name: "Painter's Partition", lc: "—", diff: "🟡" },
      { id: 225, name: "Minimize Max Distance to Gas Station", lc: "774", diff: "🔴" },
      { id: 226, name: "Median of 2 Sorted Arrays", lc: "4", diff: "🔴" },
      { id: 227, name: "Kth Element of 2 Sorted Arrays", lc: "—", diff: "🟡" },
    ],
  },
  {
    name: "BS on 2D Arrays",
    subtitle: "Matrix Binary Search",
    icon: "🧮",
    color: "#34d399",
    bg: "#064e3b",
    bgLight: "#d1fae5",
    problems: [
      { id: 228, name: "Row with Maximum 1's", lc: "—", diff: "🟢" },
      { id: 229, name: "Search in a 2D Matrix", lc: "74", diff: "🔴" },
      { id: 230, name: "Search in 2D Matrix II", lc: "240", diff: "🔴" },
      { id: 231, name: "Find Peak Element II", lc: "1901", diff: "🟡" },
      { id: 232, name: "Matrix Median", lc: "—", diff: "🔴" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  STRINGS
  // ═══════════════════════════════════════════════════════════════════
  {
    name: "Strings — Basic",
    subtitle: "Fundamentals & Pattern Matching",
    icon: "🔤",
    color: "#fbbf24",
    bg: "#422006",
    bgLight: "#fef3c7",
    problems: [
      { id: 301, name: "Remove Outermost Parentheses", lc: "1021", diff: "🟡" },
      { id: 302, name: "Reverse Words in a String", lc: "151", diff: "🟡" },
      { id: 303, name: "Largest Odd Number in String", lc: "1903", diff: "🟢" },
      { id: 304, name: "Longest Common Prefix", lc: "14", diff: "🟢" },
      { id: 305, name: "Isomorphic Strings", lc: "205", diff: "🟢" },
      { id: 306, name: "Rotate String", lc: "796", diff: "🟢" },
      { id: 307, name: "Check Anagram", lc: "242", diff: "🟢" },
    ],
  },
  {
    name: "Strings — Medium",
    subtitle: "Frequency, Sliding Window & DP",
    icon: "📝",
    color: "#fb923c",
    bg: "#431407",
    bgLight: "#ffedd5",
    problems: [
      { id: 308, name: "Sort Characters by Frequency", lc: "451", diff: "🟢" },
      { id: 309, name: "Max Nesting Depth of Parentheses", lc: "1614", diff: "🟡" },
      { id: 310, name: "Roman to Integer", lc: "13", diff: "🟡" },
      { id: 311, name: "String to Integer (atoi)", lc: "8", diff: "🟡" },
      { id: 312, name: "Count Number of Substrings", lc: "—", diff: "🟢" },
      { id: 313, name: "Longest Palindromic Substring", lc: "5", diff: "🟡" },
      { id: 314, name: "Sum of Beauty of All Substrings", lc: "1781", diff: "🟡" },
      { id: 315, name: "Reverse Every Word in a String", lc: "151", diff: "🟡" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  LINKED LIST
  // ═══════════════════════════════════════════════════════════════════
  {
    name: "Singly Linked List — Basics",
    subtitle: "Learn SLL Operations",
    icon: "🔗",
    color: "#6ee7b7",
    bg: "#064e3b",
    bgLight: "#d1fae5",
    problems: [
      { id: 401, name: "Introduction to Linked List", lc: "—", diff: "🟢" },
      { id: 402, name: "Insert at Head of LL", lc: "—", diff: "🟢" },
      { id: 403, name: "Delete Head of LL", lc: "—", diff: "🟢" },
      { id: 404, name: "Find Length of Linked List", lc: "—", diff: "🟢" },
      { id: 405, name: "Search in Linked List", lc: "—", diff: "🟡" },
    ],
  },
  {
    name: "Doubly Linked List — Basics",
    subtitle: "Learn DLL Operations",
    icon: "🔗",
    color: "#93c5fd",
    bg: "#1e3a5f",
    bgLight: "#dbeafe",
    problems: [
      { id: 406, name: "Introduction to Doubly LL", lc: "—", diff: "🟢" },
      { id: 407, name: "Insert Before Head in DLL", lc: "—", diff: "🟢" },
      { id: 408, name: "Delete Head of DLL", lc: "—", diff: "🟢" },
      { id: 409, name: "Reverse a Doubly LL", lc: "—", diff: "🟡" },
    ],
  },
  {
    name: "Linked List — Medium",
    subtitle: "Floyd's, Two-Pointer & Manipulation",
    icon: "⛓️",
    color: "#c084fc",
    bg: "#3b0764",
    bgLight: "#f3e8ff",
    problems: [
      { id: 410, name: "Middle of Linked List", lc: "876", diff: "🟢" },
      { id: 411, name: "Reverse LL (Iterative)", lc: "206", diff: "🟡" },
      { id: 412, name: "Reverse LL (Recursive)", lc: "206", diff: "🟡" },
      { id: 413, name: "Detect Loop in LL", lc: "141", diff: "🟡" },
      { id: 414, name: "Find Starting Point in LL Cycle", lc: "142", diff: "🟡" },
      { id: 415, name: "Length of Loop in LL", lc: "—", diff: "🟡" },
      { id: 416, name: "Check if LL is Palindrome", lc: "234", diff: "🟡" },
      { id: 417, name: "Segregate Odd and Even Nodes", lc: "328", diff: "🟡" },
      { id: 418, name: "Remove Nth Node from End", lc: "19", diff: "🟡" },
      { id: 419, name: "Delete Middle Node in LL", lc: "2095", diff: "🟡" },
      { id: 420, name: "Sort Linked List", lc: "148", diff: "🔴" },
      { id: 421, name: "Sort LL of 0s 1s and 2s", lc: "—", diff: "🟡" },
      { id: 422, name: "Intersection Point of Y LL", lc: "160", diff: "🟡" },
      { id: 423, name: "Add One to Number in LL", lc: "—", diff: "🟡" },
      { id: 424, name: "Add Two Numbers in LL", lc: "2", diff: "🟡" },
    ],
  },
  {
    name: "Doubly Linked List — Medium",
    subtitle: "DLL Manipulation Problems",
    icon: "⛓️",
    color: "#f472b6",
    bg: "#500724",
    bgLight: "#fce7f3",
    problems: [
      { id: 425, name: "Delete All Occurrences of Key in DLL", lc: "—", diff: "🔴" },
      { id: 426, name: "Find Pairs with Given Sum in DLL", lc: "—", diff: "🟡" },
      { id: 427, name: "Remove Duplicates from Sorted DLL", lc: "—", diff: "🔴" },
    ],
  },
  {
    name: "Linked List — Hard",
    subtitle: "Reverse in Groups, Flatten & Clone",
    icon: "💀",
    color: "#ef4444",
    bg: "#450a0a",
    bgLight: "#fee2e2",
    problems: [
      { id: 428, name: "Reverse LL in Groups of K", lc: "25", diff: "🔴" },
      { id: 429, name: "Rotate a Linked List", lc: "61", diff: "🔴" },
      { id: 430, name: "Flattening of Linked List", lc: "—", diff: "🔴" },
      { id: 431, name: "Clone LL with Random Pointer", lc: "138", diff: "🔴" },
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

  PermutationsII,
  GenerateParentheses,
  LetterCombinations,
  NQueens,
  NQueensII,
  SudokuSolver,
  BeautifulArrangement,
  NextPermutation,
  PermutationSequence,

  PalindromePartition,
  PalindromePartitionII,
  WordBreak,
  WordBreakII,
  RestoreIP,
  DecodeWays,
  ScrambleString,
  ExpressionOperators,

  FloodFill,
  NumberOfIslands,
  WordSearch,
  WordSearchII,
  SurroundedRegions,
  UniquePaths,
  UniquePathsII,
  MinPathSum,
  RatInMaze,
  LongestIncreasingPath,
  PacificAtlantic,
  MaxAreaIsland,
  RottingOranges,
};

const CATEGORIES = [
  {
    id: "recursion",
    name: "Recursion",
    subtitle: "6 Patterns · Master the recursive mindset",
    icon: "🔁",
    color: "#818cf8",
    bg: "#1e1b4b",
    bgLight: "#e0e7ff",
    gradient: "linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)",
    patternIndices: [0, 1, 2, 3, 4, 5],
  },
  {
    id: "arrays",
    name: "Arrays",
    subtitle: "Easy → Medium → Hard progression",
    icon: "📦",
    color: "#22d3ee",
    bg: "#083344",
    bgLight: "#cffafe",
    gradient: "linear-gradient(135deg, #06b6d4, #22d3ee, #67e8f9)",
    patternIndices: [6, 7, 8],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    subtitle: "1D, 2D & Search Space patterns",
    icon: "🔍",
    color: "#38bdf8",
    bg: "#082f49",
    bgLight: "#e0f2fe",
    gradient: "linear-gradient(135deg, #0284c7, #38bdf8, #7dd3fc)",
    patternIndices: [9, 10, 11],
  },
  {
    id: "strings",
    name: "Strings",
    subtitle: "Basics & Medium level patterns",
    icon: "🔤",
    color: "#fbbf24",
    bg: "#422006",
    bgLight: "#fef3c7",
    gradient: "linear-gradient(135deg, #d97706, #fbbf24, #fde68a)",
    patternIndices: [12, 13],
  },
  {
    id: "linked-list",
    name: "Linked List",
    subtitle: "SLL, DLL & Advanced manipulation",
    icon: "🔗",
    color: "#34d399",
    bg: "#064e3b",
    bgLight: "#d1fae5",
    gradient: "linear-gradient(135deg, #059669, #34d399, #6ee7b7)",
    patternIndices: [14, 15, 16, 17, 18],
  },
];

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
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Problem Visualization View ──
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
          ← Back
        </button>
        <Comp />
      </div>
    );
  }

  // ── Category Detail View (patterns + problems inside a category) ──
  if (activeCategory) {
    const cat = activeCategory;
    const catPatterns = cat.patternIndices.map(i => PATTERNS[i]);
    const catTotal = catPatterns.reduce((s, p) => s + p.problems.length, 0);
    const catReady = catPatterns.reduce((s, p) => s + p.problems.filter(x => x.component).length, 0);

    return (
      <div style={{
        minHeight: "100vh", background: theme.bg, color: theme.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <ThemeToggle />

        {/* Category Header */}
        <div style={{
          textAlign: "center", padding: "50px 20px 30px",
          background: theme.heroBg, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
            width: "500px", height: "500px", borderRadius: "50%",
            background: `radial-gradient(circle, ${cat.color}15 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                position: "absolute", top: "0", left: "0",
                background: theme.backBtnBg, color: theme.text,
                border: `1px solid ${theme.backBtnBorder}`, borderRadius: "10px",
                padding: "8px 16px", fontSize: "0.78rem",
                fontFamily: "'Inter', sans-serif", fontWeight: "700",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = theme.backBtnHoverBg; }}
              onMouseOut={e => { e.currentTarget.style.background = theme.backBtnBg; }}
            >
              ← Home
            </button>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{cat.icon}</div>
            <h1 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "900",
              background: cat.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: "0 0 8px",
            }}>
              {cat.name}
            </h1>
            <p style={{ color: theme.textMuted, fontSize: "0.9rem", margin: "0 0 16px" }}>
              {cat.subtitle}
            </p>
            <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
              <Stat value={catTotal} label="Problems" />
              <Stat value={catPatterns.length} label="Sections" />
              <Stat value={catReady} label="Ready" />
            </div>
          </div>
        </div>

        {/* Patterns & Problems */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 60px" }}>
          {catPatterns.map((pattern, pi) => {
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
                        {pattern.name}
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
          DSA Visualizer • {catReady} of {catTotal} problems ready in {cat.name}
        </div>
      </div>
    );
  }

  // ── Homepage: Category Cards ──
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

      {/* Category Cards */}
      <div style={{
        maxWidth: "900px", margin: "0 auto", padding: "40px 20px 60px",
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
              onClick={() => setActiveCategory(cat)}
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
              {/* Glow */}
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "100px", height: "100px", borderRadius: "50%",
                background: `${cat.color}10`, pointerEvents: "none",
              }} />

              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{cat.icon}</div>
              <h2 style={{
                margin: "0 0 6px", fontSize: "1.4rem", fontWeight: "900",
                color: cat.color,
              }}>
                {cat.name}
              </h2>
              <p style={{
                margin: "0 0 16px", fontSize: "0.8rem",
                color: theme.textMuted, lineHeight: "1.4",
              }}>
                {cat.subtitle}
              </p>
              <div style={{
                display: "flex", gap: "12px", alignItems: "center",
                fontSize: "0.72rem", color: theme.textDim,
              }}>
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

              {/* Arrow */}
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

      <div style={{
        textAlign: "center", padding: "30px 20px 40px",
        borderTop: `1px solid ${theme.footerBorder}`, color: theme.footerText, fontSize: "0.75rem",
      }}>
        DSA Visualizer • {readyProblems} of {totalProblems} problems ready • More coming soon
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

