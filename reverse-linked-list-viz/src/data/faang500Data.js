// ═══════════════════════════════════════════════════════════════════
//  FAANG 500 — The Ultimate DSA Roadmap
//  Merged from: Blind 75, NeetCode 150/300, Striver A2Z, LC Top 150
//  Deduplicated and organized by topic → subtopic → problem
// ═══════════════════════════════════════════════════════════════════

export const FAANG_TOPICS = [
    // ═══════════════════════════════════════════════════════════════
    // 1. ARRAYS & HASHING
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Arrays & Hashing",
        icon: "🗄️",
        color: "#4ade80",
        description: "Foundation of DSA — almost every interview starts here",
        subtopics: [
            {
                name: "Basic Array Operations",
                problems: [
                    { name: "Move Zeroes", lc: "283", diff: "🟢", tag: "classic" },
                ],
            },
            {
                name: "Hashing & Frequency Counting",
                problems: [
                    { name: "Two Sum", lc: "1", diff: "🟢", tag: "classic" },
                    { name: "Group Anagrams", lc: "49", diff: "🟡", tag: "classic" },
                    { name: "Top K Frequent Elements", lc: "347", diff: "🟡", tag: "classic" },
                    { name: "Contains Duplicate", lc: "217", diff: "🟢", tag: "important" },
                ],
            },
            {
                name: "Prefix Sum & Subarray",
                problems: [
                    { name: "Product of Array Except Self", lc: "238", diff: "🟡", tag: "classic" },
                    { name: "Subarray Sum Equals K", lc: "560", diff: "🟡", tag: "classic" },
                ],
            },
            {
                name: "Kadane's Algorithm",
                problems: [
                    { name: "Maximum Subarray", lc: "53", diff: "🟡", tag: "classic" },
                    { name: "Maximum Product Subarray", lc: "152", diff: "🟡", tag: "classic" },
                ],
            },
            {
                name: "Sorting & Partitioning",
                problems: [
                    { name: "Sort Colors (Dutch National Flag)", lc: "75", diff: "🟡", tag: "classic" },
                    { name: "Majority Element (Boyer-Moore)", lc: "169", diff: "�", tag: "classic" },
                    { name: "Kth Largest Element in an Array", lc: "215", diff: "🟡", tag: "classic" },
                ],
            },
            {
                name: "Matrix Operations",
                problems: [
                    { name: "Rotate Image", lc: "48", diff: "🟡", tag: "classic" },
                ],
            },
            {
                name: "Advanced Array",
                problems: [
                    { name: "Longest Consecutive Sequence", lc: "128", diff: "🟡", tag: "classic" },
                    { name: "Next Permutation", lc: "31", diff: "🟡", tag: "classic" },
                    { name: "Pascal's Triangle", lc: "118", diff: "�", tag: "important" },
                    { name: "Best Time to Buy And Sell Stock", lc: "121", diff: "�", tag: "classic" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. TWO POINTERS
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Two Pointers",
        icon: "👆",
        color: "#60a5fa",
        description: "Converging, diverging, and same-direction pointer techniques",
        subtopics: [
            {
                name: "Opposite Direction",
                problems: [
                    { name: "3Sum", lc: "15", diff: "🟡" },
                    { name: "Container With Most Water", lc: "11", diff: "🟡" },
                    { name: "Trapping Rain Water", lc: "42", diff: "🔴" },
                ],
            },
            {
                name: "Same Direction",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. SLIDING WINDOW
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Sliding Window",
        icon: "🪟",
        color: "#f472b6",
        description: "Dynamic window tracking for subarray/substring problems",
        subtopics: [
            {
                name: "Fixed-Size Window",
                problems: [
                ],
            },
            {
                name: "Variable-Size Window",
                problems: [
                    { name: "Longest Substring Without Repeating Chars", lc: "3", diff: "🟡" },
                ],
            },
            {
                name: "Window + HashMap",
                problems: [
                    { name: "Minimum Window Substring", lc: "76", diff: "🔴" },
                    { name: "Sliding Window Maximum", lc: "239", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. BINARY SEARCH
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Binary Search",
        icon: "🔍",
        color: "#38bdf8",
        description: "Halve the search space — on arrays, answers, and matrices",
        subtopics: [
            {
                name: "Classic BS on Arrays",
                problems: [
                    { name: "Search Insert Position", lc: "35", diff: "🟢" },
                    { name: "First and Last Position in Sorted Array", lc: "34", diff: "🟡" },
                ],
            },
            {
                name: "BS on Rotated Arrays",
                problems: [
                    { name: "Search In Rotated Sorted Array", lc: "33", diff: "🟡" },
                    { name: "Find Minimum In Rotated Sorted Array", lc: "153", diff: "🟡" },
                    { name: "Find Peak Element", lc: "162", diff: "🟡" },
                ],
            },
            {
                name: "BS on Answer Space",
                problems: [
                    { name: "Median of Two Sorted Arrays", lc: "4", diff: "🔴" },
                ],
            },
            {
                name: "BS on 2D Matrix",
                problems: [
                    { name: "Search a 2D Matrix", lc: "74", diff: "🟡" },
                    { name: "Search a 2D Matrix II", lc: "240", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 5. STRINGS
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Strings",
        icon: "🔤",
        color: "#fbbf24",
        description: "Manipulation, pattern matching, and string DP",
        subtopics: [
            {
                name: "Basic Manipulation",
                problems: [
                ],
            },
            {
                name: "Palindromes",
                problems: [
                    { name: "Longest Palindromic Substring", lc: "5", diff: "🟡" },
                    { name: "Palindromic Substrings", lc: "647", diff: "🟡" },
                ],
            },
            {
                name: "Encoding & Parsing",
                problems: [
                ],
            },
            {
                name: "Pattern Matching",
                problems: [
                    { name: "Regular Expression Matching", lc: "10", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 6. STACK & QUEUES
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Stack & Queues",
        icon: "📚",
        color: "#fb923c",
        description: "LIFO/FIFO, monotonic stack, expression evaluation",
        subtopics: [
            {
                name: "Stack Fundamentals",
                problems: [
                    { name: "Valid Parentheses", lc: "20", diff: "🟢" },
                    { name: "Min Stack", lc: "155", diff: "🟡" },
                ],
            },
            {
                name: "Monotonic Stack",
                problems: [
                    { name: "Daily Temperatures", lc: "739", diff: "🟡" },
                    { name: "Largest Rectangle In Histogram", lc: "84", diff: "🔴" },
                ],
            },
            {
                name: "Expression & Parsing",
                problems: [
                ],
            },
            {
                name: "Design with Stacks/Queues",
                problems: [
                    { name: "LRU Cache", lc: "146", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 7. LINKED LIST
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Linked List",
        icon: "🔗",
        color: "#34d399",
        description: "Pointer manipulation, fast/slow, merge and reverse",
        subtopics: [
            {
                name: "Basic Operations",
                problems: [
                    { name: "Reverse Linked List", lc: "206", diff: "🟢" },
                    { name: "Merge Two Sorted Lists", lc: "21", diff: "🟢" },
                ],
            },
            {
                name: "Fast & Slow Pointer",
                problems: [
                    { name: "Linked List Cycle", lc: "141", diff: "🟢" },
                    { name: "Linked List Cycle II (Start Point)", lc: "142", diff: "🟡" },
                    { name: "Palindrome Linked List", lc: "234", diff: "🟢" },
                    { name: "Find The Duplicate Number", lc: "287", diff: "🟡" },
                    { name: "Intersection of Two Linked Lists", lc: "160", diff: "🟢" },
                ],
            },
            {
                name: "Reversal Patterns",
                problems: [
                    { name: "Reverse Nodes In K Group", lc: "25", diff: "🔴" },
                    { name: "Swap Nodes in Pairs", lc: "24", diff: "🟡" },
                ],
            },
            {
                name: "Advanced Manipulation",
                problems: [
                    { name: "Remove Nth Node From End", lc: "19", diff: "🟡" },
                    { name: "Add Two Numbers", lc: "2", diff: "🟡" },
                    { name: "Copy List With Random Pointer", lc: "138", diff: "🟡" },
                    { name: "Sort List", lc: "148", diff: "🟡" },
                    { name: "Merge K Sorted Lists", lc: "23", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 8. TREES
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Trees",
        icon: "🌳",
        color: "#a3e635",
        description: "DFS, BFS, BST operations — the most asked topic",
        subtopics: [
            {
                name: "Traversals",
                problems: [
                    { name: "Binary Tree Inorder Traversal", lc: "94", diff: "🟢" },
                    { name: "Binary Tree Level Order Traversal", lc: "102", diff: "🟡" },
                    { name: "Binary Tree Right Side View", lc: "199", diff: "🟡" },
                ],
            },
            {
                name: "Tree Properties",
                problems: [
                    { name: "Maximum Depth of Binary Tree", lc: "104", diff: "🟢" },
                    { name: "Diameter of Binary Tree", lc: "543", diff: "🟢" },
                    { name: "Invert Binary Tree", lc: "226", diff: "🟢" },
                    { name: "Symmetric Tree", lc: "101", diff: "🟢" },
                ],
            },
            {
                name: "Path Problems",
                problems: [
                    { name: "Path Sum III", lc: "437", diff: "🟡" },
                    { name: "Binary Tree Maximum Path Sum", lc: "124", diff: "🔴" },
                ],
            },
            {
                name: "LCA & Ancestors",
                problems: [
                    { name: "LCA of a Binary Search Tree", lc: "235", diff: "🟡" },
                    { name: "Lowest Common Ancestor of BT", lc: "236", diff: "🟡" },
                    { name: "Flatten Binary Tree to Linked List", lc: "114", diff: "🟡" },
                ],
            },
            {
                name: "BST Operations",
                problems: [
                    { name: "Validate Binary Search Tree", lc: "98", diff: "🟡" },
                    { name: "Kth Smallest Element In a BST", lc: "230", diff: "🟡" },
                ],
            },
            {
                name: "Construction & Serialization",
                problems: [
                    { name: "Construct BT From Preorder & Inorder", lc: "105", diff: "🟡" },
                    { name: "Convert Sorted Array to BST", lc: "108", diff: "🟢" },
                    { name: "Serialize And Deserialize Binary Tree", lc: "297", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 9. HEAP / PRIORITY QUEUE
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Heap / Priority Queue",
        icon: "⛰️",
        color: "#e879f9",
        description: "Top-K, scheduling, streaming medians",
        subtopics: [
            {
                name: "Kth Element Patterns",
                problems: [
                ],
            },
            {
                name: "Two Heaps & Streaming",
                problems: [
                    { name: "Find Median From Data Stream", lc: "295", diff: "🔴" },
                ],
            },
            {
                name: "Scheduling & Design",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 10. RECURSION & BACKTRACKING
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Recursion & Backtracking",
        icon: "🔄",
        color: "#c084fc",
        description: "Choose → Explore → Un-choose. The backbone of problem solving",
        subtopics: [
            {
                name: "Basic Recursion",
                problems: [
                    { name: "Climbing Stairs", lc: "70", diff: "🟢" },
                ],
            },
            {
                name: "Subsets & Combinations",
                problems: [
                    { name: "Subsets", lc: "78", diff: "🟡" },
                    { name: "Combination Sum", lc: "39", diff: "🟡" },
                    { name: "Combination Sum II", lc: "40", diff: "🟡" },
                ],
            },
            {
                name: "Permutations",
                problems: [
                    { name: "Permutations", lc: "46", diff: "🟡" },
                    { name: "Letter Combinations of Phone Number", lc: "17", diff: "🟡" },
                ],
            },
            {
                name: "Constraint Satisfaction",
                problems: [
                    { name: "Generate Parentheses", lc: "22", diff: "🟡" },
                    { name: "Word Search", lc: "79", diff: "🟡" },
                    { name: "Palindrome Partitioning", lc: "131", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 11. GRAPHS — BFS / DFS
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Graphs — BFS / DFS",
        icon: "🕸️",
        color: "#2dd4bf",
        description: "Traversals, connected components, topological sort",
        subtopics: [
            {
                name: "Grid DFS/BFS",
                problems: [
                    { name: "Number of Islands", lc: "200", diff: "🟡" },
                    { name: "Max Area of Island", lc: "695", diff: "🟡" },
                    { name: "Rotting Oranges", lc: "994", diff: "🟡" },
                ],
            },
            {
                name: "Graph Traversal",
                problems: [
                    { name: "Clone Graph", lc: "133", diff: "🟡" },
                    { name: "Evaluate Division", lc: "399", diff: "🟡" },
                ],
            },
            {
                name: "Cycle Detection",
                problems: [
                    { name: "Course Schedule", lc: "207", diff: "🟡" },
                    { name: "Course Schedule II", lc: "210", diff: "🟡" },
                ],
            },
            {
                name: "Union-Find / DSU",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 12. GRAPHS — ADVANCED
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Graphs — Advanced",
        icon: "🗺️",
        color: "#f87171",
        description: "Dijkstra, Bellman-Ford, Floyd-Warshall, MST",
        subtopics: [
            {
                name: "Shortest Path (Weighted)",
                problems: [
                ],
            },
            {
                name: "MST & Advanced",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 13. DYNAMIC PROGRAMMING — 1D
    // ═══════════════════════════════════════════════════════════════
    {
        name: "DP — 1D",
        icon: "📈",
        color: "#818cf8",
        description: "dp[i] depends on previous states — linear recurrences",
        subtopics: [
            {
                name: "Fibonacci Pattern",
                problems: [
                    { name: "House Robber", lc: "198", diff: "🟡" },
                    { name: "House Robber II", lc: "213", diff: "🟡" },
                    { name: "Perfect Squares", lc: "279", diff: "🟡" },
                    { name: "Coin Change", lc: "322", diff: "🟡" },
                    { name: "Word Break", lc: "139", diff: "🟡" },
                    { name: "Longest Increasing Subsequence", lc: "300", diff: "🟡" },
                    { name: "Partition Equal Subset Sum", lc: "416", diff: "🟡" },
                    { name: "Longest Valid Parentheses", lc: "32", diff: "�" },
                ],
            },
            {
                name: "Stock Problems",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 14. DYNAMIC PROGRAMMING — 2D / ADVANCED
    // ═══════════════════════════════════════════════════════════════
    {
        name: "DP — 2D / Advanced",
        icon: "📊",
        color: "#a78bfa",
        description: "Grid DP, two-sequence DP, knapsack, interval DP",
        subtopics: [
            {
                name: "Grid DP",
                problems: [
                    { name: "Unique Paths", lc: "62", diff: "🟡" },
                    { name: "Minimum Path Sum", lc: "64", diff: "🟡" },
                ],
            },
            {
                name: "Two-String DP",
                problems: [
                    { name: "Edit Distance", lc: "72", diff: "🔴" },
                ],
            },
            {
                name: "Knapsack Variants",
                problems: [
                ],
            },
            {
                name: "Interval DP & MCM",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 15. GREEDY
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Greedy",
        icon: "🤑",
        color: "#22d3ee",
        description: "Locally optimal → globally optimal",
        subtopics: [
            {
                name: "Array Greedy",
                problems: [
                    { name: "Jump Game", lc: "55", diff: "🟡" },
                ],
            },
            {
                name: "Interval Greedy",
                problems: [
                    { name: "Merge Intervals", lc: "56", diff: "🟡" },
                ],
            },
            {
                name: "String & Partition Greedy",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 16. TRIES
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Tries",
        icon: "🔡",
        color: "#fbbf24",
        description: "Prefix trees for efficient string operations",
        subtopics: [
            {
                name: "Trie Implementation & Applications",
                problems: [
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 17. BIT MANIPULATION
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Bit Manipulation",
        icon: "⚡",
        color: "#f97316",
        description: "XOR, AND, OR, shifts for O(1) tricks",
        subtopics: [
            {
                name: "XOR Tricks",
                problems: [
                ],
            },
            {
                name: "Bit Counting & Operations",
                problems: [
                    { name: "Counting Bits", lc: "338", diff: "🟢" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 18. MATH & GEOMETRY
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Math & Geometry",
        icon: "🔢",
        color: "#facc15",
        description: "Number theory, matrix ops, and mathematical patterns",
        subtopics: [
            {
                name: "Number Theory",
                problems: [
                ],
            },
            {
                name: "Matrix Math",
                problems: [
                ],
            },
        ],
    },
];

// ── Computed totals ──
export const FAANG_STATS = (() => {
    let total = 0, easy = 0, medium = 0, hard = 0, subtopicCount = 0;
    for (const topic of FAANG_TOPICS) {
        for (const sub of topic.subtopics) {
            subtopicCount++;
            for (const p of sub.problems) {
                total++;
                if (p.diff === "🟢") easy++;
                else if (p.diff === "🟡") medium++;
                else if (p.diff === "🔴") hard++;
            }
        }
    }
    return { total, easy, medium, hard, topics: FAANG_TOPICS.length, subtopics: subtopicCount };
})();
