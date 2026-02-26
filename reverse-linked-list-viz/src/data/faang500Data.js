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
                    { name: "Remove Duplicates from Sorted Array", lc: "26", diff: "🟢", tag: "classic" },
                    { name: "Move Zeroes", lc: "283", diff: "🟢", tag: "classic" },
                    { name: "Rotate Array", lc: "189", diff: "🟡", tag: "classic" },
                    { name: "Check if Array Is Sorted and Rotated", lc: "1752", diff: "🟢", tag: "important" },
                    { name: "Merge Sorted Array", lc: "88", diff: "🟢", tag: "important" },
                    { name: "Remove Element", lc: "27", diff: "🟢" },
                    { name: "Concatenation of Array", lc: "1929", diff: "🟢" },
                    { name: "Single Number", lc: "136", diff: "🟢" },
                    { name: "Max Consecutive Ones", lc: "485", diff: "🟢" },
                    { name: "Remove Duplicates from Sorted Array II", lc: "80", diff: "🟡" },
                    { name: "Plus One", lc: "66", diff: "🟢" },
                ],
            },
            {
                name: "Hashing & Frequency Counting",
                problems: [
                    { name: "Two Sum", lc: "1", diff: "🟢", tag: "classic" },
                    { name: "Group Anagrams", lc: "49", diff: "🟡", tag: "classic" },
                    { name: "Top K Frequent Elements", lc: "347", diff: "🟡", tag: "classic" },
                    { name: "Valid Anagram", lc: "242", diff: "🟢", tag: "classic" },
                    { name: "Contains Duplicate", lc: "217", diff: "🟢", tag: "important" },
                    { name: "Encode and Decode Strings", lc: "271", diff: "🟡", tag: "important" },
                    { name: "Isomorphic Strings", lc: "205", diff: "🟢" },
                    { name: "Word Pattern", lc: "290", diff: "🟢" },
                    { name: "Jewels and Stones", lc: "771", diff: "🟢" },
                    { name: "Ransom Note", lc: "383", diff: "🟢" },
                    { name: "Contains Duplicate II", lc: "219", diff: "🟢" },
                ],
            },
            {
                name: "Prefix Sum & Subarray",
                problems: [
                    { name: "Product of Array Except Self", lc: "238", diff: "🟡", tag: "classic" },
                    { name: "Subarray Sum Equals K", lc: "560", diff: "🟡", tag: "classic" },
                    { name: "Range Sum Query - Immutable", lc: "303", diff: "🟢", tag: "important" },
                    { name: "Range Sum Query 2D", lc: "304", diff: "🟡", tag: "important" },
                    { name: "Largest Subarray with 0 Sum", lc: "325", diff: "🟡" },
                    { name: "Minimum Size Subarray Sum", lc: "209", diff: "🟡" },
                    { name: "Find Pivot Index", lc: "724", diff: "🟢" },
                    { name: "Continuous Subarray Sum", lc: "523", diff: "🟡" },
                ],
            },
            {
                name: "Kadane's Algorithm",
                problems: [
                    { name: "Maximum Subarray", lc: "53", diff: "🟡", tag: "classic" },
                    { name: "Maximum Product Subarray", lc: "152", diff: "🟡", tag: "classic" },
                    { name: "Maximum Sum Circular Subarray", lc: "918", diff: "🟡", tag: "important" },
                    { name: "Longest Turbulent Subarray", lc: "978", diff: "🟡" },
                ],
            },
            {
                name: "Sorting & Partitioning",
                problems: [
                    { name: "Sort Colors (Dutch National Flag)", lc: "75", diff: "🟡", tag: "classic" },
                    { name: "Majority Element (Boyer-Moore)", lc: "169", diff: "�", tag: "classic" },
                    { name: "Majority Element II", lc: "229", diff: "�", tag: "important" },
                    { name: "Sort an Array (Merge/Quick Sort)", lc: "912", diff: "🟡", tag: "important" },
                    { name: "Rearrange Array Elements by Sign", lc: "2149", diff: "🟡" },
                    { name: "Kth Largest Element in an Array", lc: "215", diff: "🟡", tag: "classic" },
                ],
            },
            {
                name: "Matrix Operations",
                problems: [
                    { name: "Set Matrix Zeroes", lc: "73", diff: "🟡", tag: "classic" },
                    { name: "Rotate Image", lc: "48", diff: "🟡", tag: "classic" },
                    { name: "Spiral Matrix", lc: "54", diff: "🟡", tag: "classic" },
                    { name: "Valid Sudoku", lc: "36", diff: "�", tag: "important" },
                    { name: "Transpose Matrix", lc: "867", diff: "🟢" },
                    { name: "Game of Life", lc: "289", diff: "🟡" },
                ],
            },
            {
                name: "Advanced Array",
                problems: [
                    { name: "Longest Consecutive Sequence", lc: "128", diff: "🟡", tag: "classic" },
                    { name: "First Missing Positive", lc: "41", diff: "�", tag: "classic" },
                    { name: "Next Permutation", lc: "31", diff: "🟡", tag: "classic" },
                    { name: "Pascal's Triangle", lc: "118", diff: "�", tag: "important" },
                    { name: "Best Time to Buy And Sell Stock", lc: "121", diff: "�", tag: "classic" },
                    { name: "Best Time to Buy And Sell Stock II", lc: "122", diff: "�", tag: "important" },
                    { name: "Missing Number", lc: "268", diff: "�" },
                    { name: "Find All Duplicates in an Array", lc: "442", diff: "🟡" },
                    { name: "H-Index", lc: "274", diff: "🟡" },
                    { name: "Insert Delete GetRandom O(1)", lc: "380", diff: "🟡" },
                    { name: "Summary Ranges", lc: "228", diff: "🟢" },
                    { name: "Minimum Number of Arrows to Burst Balloons", lc: "452", diff: "🟡" },
                    { name: "Reverse Pairs", lc: "493", diff: "🔴" },
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
                    { name: "Valid Palindrome", lc: "125", diff: "🟢" },
                    { name: "Valid Palindrome II", lc: "680", diff: "🟢" },
                    { name: "Two Sum II (Sorted)", lc: "167", diff: "🟡" },
                    { name: "3Sum", lc: "15", diff: "🟡" },
                    { name: "4Sum", lc: "18", diff: "🟡" },
                    { name: "Container With Most Water", lc: "11", diff: "🟡" },
                    { name: "Trapping Rain Water", lc: "42", diff: "🔴" },
                ],
            },
            {
                name: "Same Direction",
                problems: [
                    { name: "Remove Duplicates From Sorted Array", lc: "26", diff: "🟢" },
                    { name: "Is Subsequence", lc: "392", diff: "🟢" },
                    { name: "Merge Strings Alternately", lc: "1768", diff: "🟢" },
                    { name: "Reverse String", lc: "344", diff: "🟢" },
                    { name: "Boats to Save People", lc: "881", diff: "🟡" },
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
                    { name: "Best Time to Buy And Sell Stock", lc: "121", diff: "🟢" },
                    { name: "Max Consecutive Ones III", lc: "1004", diff: "🟡" },
                    { name: "Find K Closest Elements", lc: "658", diff: "🟡" },
                ],
            },
            {
                name: "Variable-Size Window",
                problems: [
                    { name: "Longest Substring Without Repeating Chars", lc: "3", diff: "🟡" },
                    { name: "Longest Repeating Character Replacement", lc: "424", diff: "🟡" },
                    { name: "Minimum Size Subarray Sum", lc: "209", diff: "🟡" },
                ],
            },
            {
                name: "Window + HashMap",
                problems: [
                    { name: "Permutation In String", lc: "567", diff: "🟡" },
                    { name: "Find All Anagrams in a String", lc: "438", diff: "🟡" },
                    { name: "Minimum Window Substring", lc: "76", diff: "🔴" },
                    { name: "Substring with Concatenation of All Words", lc: "30", diff: "🔴" },
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
                    { name: "Binary Search", lc: "704", diff: "🟢" },
                    { name: "Search Insert Position", lc: "35", diff: "🟢" },
                    { name: "First and Last Position in Sorted Array", lc: "34", diff: "🟡" },
                    { name: "Guess Number Higher Or Lower", lc: "374", diff: "🟢" },
                    { name: "First Bad Version", lc: "278", diff: "🟢" },
                    { name: "Sqrt(x)", lc: "69", diff: "🟢" },
                ],
            },
            {
                name: "BS on Rotated Arrays",
                problems: [
                    { name: "Search In Rotated Sorted Array", lc: "33", diff: "🟡" },
                    { name: "Search In Rotated Sorted Array II", lc: "81", diff: "🟡" },
                    { name: "Find Minimum In Rotated Sorted Array", lc: "153", diff: "🟡" },
                    { name: "Single Element in Sorted Array", lc: "540", diff: "🟡" },
                    { name: "Find Peak Element", lc: "162", diff: "🟡" },
                    { name: "Peak Index in Mountain Array", lc: "852", diff: "🟢" },
                ],
            },
            {
                name: "BS on Answer Space",
                problems: [
                    { name: "Koko Eating Bananas", lc: "875", diff: "🟡" },
                    { name: "Capacity to Ship Packages", lc: "1011", diff: "🟡" },
                    { name: "Split Array Largest Sum", lc: "410", diff: "🔴" },
                    { name: "Minimum Days to Make M Bouquets", lc: "1482", diff: "🟡" },
                    { name: "Find the Smallest Divisor", lc: "1283", diff: "🟡" },
                    { name: "Magnetic Force Between Two Balls", lc: "1552", diff: "�" },
                    { name: "Painters Partition Problem", lc: "1891", diff: "🔴" },
                    { name: "Median of Two Sorted Arrays", lc: "4", diff: "🔴" },
                ],
            },
            {
                name: "BS on 2D Matrix",
                problems: [
                    { name: "Search a 2D Matrix", lc: "74", diff: "🟡" },
                    { name: "Search a 2D Matrix II", lc: "240", diff: "🟡" },
                    { name: "Time Based Key Value Store", lc: "981", diff: "🟡" },
                    { name: "Find in Mountain Array", lc: "1095", diff: "🔴" },
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
                    { name: "Reverse String", lc: "344", diff: "🟢" },
                    { name: "Reverse String II", lc: "541", diff: "🟢" },
                    { name: "Reverse Words in a String", lc: "151", diff: "🟡" },
                    { name: "Longest Common Prefix", lc: "14", diff: "🟢" },
                    { name: "Length of Last Word", lc: "58", diff: "🟢" },
                    { name: "GCD of Strings", lc: "1071", diff: "🟢" },
                    { name: "Rotate String", lc: "796", diff: "🟢" },
                    { name: "Find Words Containing Character", lc: "2942", diff: "🟢" },
                    { name: "Split a String in Balanced Strings", lc: "1221", diff: "🟢" },
                ],
            },
            {
                name: "Palindromes",
                problems: [
                    { name: "Longest Palindromic Substring", lc: "5", diff: "🟡" },
                    { name: "Palindromic Substrings", lc: "647", diff: "🟡" },
                    { name: "Largest Odd Number in String", lc: "1903", diff: "🟢" },
                ],
            },
            {
                name: "Encoding & Parsing",
                problems: [
                    { name: "String to Integer (atoi)", lc: "8", diff: "🟡" },
                    { name: "Roman to Integer", lc: "13", diff: "🟢" },
                    { name: "Integer to Roman", lc: "12", diff: "🟡" },
                    { name: "Decode Ways", lc: "91", diff: "🟡" },
                    { name: "Count and Say", lc: "38", diff: "🟡" },
                    { name: "Multiply Strings", lc: "43", diff: "🟡" },
                    { name: "Add Binary", lc: "67", diff: "🟢" },
                    { name: "Text Justification", lc: "68", diff: "🔴" },
                    { name: "Compare Version Numbers", lc: "165", diff: "🟡" },
                ],
            },
            {
                name: "Pattern Matching",
                problems: [
                    { name: "Find Index of First Occurrence", lc: "28", diff: "🟢" },
                    { name: "Repeated Substring Pattern", lc: "459", diff: "🟢" },
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
                    { name: "Implement Stack Using Queues", lc: "225", diff: "🟢" },
                    { name: "Implement Queue using Stacks", lc: "232", diff: "🟢" },
                    { name: "Baseball Game", lc: "682", diff: "🟢" },
                ],
            },
            {
                name: "Monotonic Stack",
                problems: [
                    { name: "Next Greater Element I", lc: "496", diff: "🟢" },
                    { name: "Next Greater Element II", lc: "503", diff: "🟡" },
                    { name: "Daily Temperatures", lc: "739", diff: "🟡" },
                    { name: "Online Stock Span", lc: "901", diff: "🟡" },
                    { name: "Largest Rectangle In Histogram", lc: "84", diff: "🔴" },
                    { name: "Remove K Digits", lc: "402", diff: "🟡" },
                ],
            },
            {
                name: "Expression & Parsing",
                problems: [
                    { name: "Evaluate Reverse Polish Notation", lc: "150", diff: "🟡" },
                    { name: "Decode String", lc: "394", diff: "🟡" },
                    { name: "Simplify Path", lc: "71", diff: "🟡" },
                    { name: "Remove Outermost Parentheses", lc: "1021", diff: "🟢" },
                    { name: "Asteroid Collision", lc: "735", diff: "🟡" },
                    { name: "Basic Calculator", lc: "224", diff: "🔴" },
                ],
            },
            {
                name: "Design with Stacks/Queues",
                problems: [
                    { name: "Car Fleet", lc: "853", diff: "🟡" },
                    { name: "Maximum Frequency Stack", lc: "895", diff: "🔴" },
                    { name: "LRU Cache", lc: "146", diff: "🟡" },
                    { name: "LFU Cache", lc: "460", diff: "🔴" },
                    { name: "Find the Celebrity", lc: "277", diff: "🟡" },
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
                    { name: "Remove Linked List Elements", lc: "203", diff: "🟢" },
                    { name: "Remove Duplicates from Sorted List", lc: "83", diff: "🟢" },
                    { name: "Design Linked List", lc: "707", diff: "🟡" },
                ],
            },
            {
                name: "Fast & Slow Pointer",
                problems: [
                    { name: "Linked List Cycle", lc: "141", diff: "🟢" },
                    { name: "Linked List Cycle II (Start Point)", lc: "142", diff: "🟡" },
                    { name: "Middle of Linked List", lc: "876", diff: "🟢" },
                    { name: "Palindrome Linked List", lc: "234", diff: "🟢" },
                    { name: "Find The Duplicate Number", lc: "287", diff: "🟡" },
                    { name: "Intersection of Two Linked Lists", lc: "160", diff: "🟢" },
                ],
            },
            {
                name: "Reversal Patterns",
                problems: [
                    { name: "Reverse Linked List II", lc: "92", diff: "🟡" },
                    { name: "Reverse Nodes In K Group", lc: "25", diff: "🔴" },
                    { name: "Swap Nodes in Pairs", lc: "24", diff: "🟡" },
                ],
            },
            {
                name: "Advanced Manipulation",
                problems: [
                    { name: "Reorder List", lc: "143", diff: "🟡" },
                    { name: "Remove Nth Node From End", lc: "19", diff: "🟡" },
                    { name: "Add Two Numbers", lc: "2", diff: "🟡" },
                    { name: "Copy List With Random Pointer", lc: "138", diff: "🟡" },
                    { name: "Odd Even Linked List", lc: "328", diff: "🟡" },
                    { name: "Rotate List", lc: "61", diff: "🟡" },
                    { name: "Sort List", lc: "148", diff: "🟡" },
                    { name: "Flatten a Multilevel DLL", lc: "430", diff: "🟡" },
                    { name: "Remove Duplicates from Sorted List II", lc: "82", diff: "🟡" },
                    { name: "Partition List", lc: "86", diff: "🟡" },
                    { name: "Merge K Sorted Lists", lc: "23", diff: "🔴" },
                    { name: "Delete Node in a Linked List", lc: "237", diff: "🟡" },
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
                    { name: "Binary Tree Preorder Traversal", lc: "144", diff: "🟢" },
                    { name: "Binary Tree Postorder Traversal", lc: "145", diff: "🟢" },
                    { name: "Binary Tree Level Order Traversal", lc: "102", diff: "🟡" },
                    { name: "Zigzag Level Order Traversal", lc: "103", diff: "🟡" },
                    { name: "Binary Tree Right Side View", lc: "199", diff: "🟡" },
                    { name: "Vertical Order Traversal of a BT", lc: "987", diff: "🔴" },
                    { name: "Maximum Width of Binary Tree", lc: "662", diff: "🟡" },
                    { name: "Boundary of Binary Tree", lc: "545", diff: "🟡" },
                ],
            },
            {
                name: "Tree Properties",
                problems: [
                    { name: "Maximum Depth of Binary Tree", lc: "104", diff: "🟢" },
                    { name: "Diameter of Binary Tree", lc: "543", diff: "🟢" },
                    { name: "Balanced Binary Tree", lc: "110", diff: "🟢" },
                    { name: "Same Tree", lc: "100", diff: "🟢" },
                    { name: "Subtree of Another Tree", lc: "572", diff: "🟢" },
                    { name: "Invert Binary Tree", lc: "226", diff: "🟢" },
                    { name: "Symmetric Tree", lc: "101", diff: "🟢" },
                ],
            },
            {
                name: "Path Problems",
                problems: [
                    { name: "Path Sum", lc: "112", diff: "🟢" },
                    { name: "Path Sum III", lc: "437", diff: "🟡" },
                    { name: "Binary Tree Maximum Path Sum", lc: "124", diff: "🔴" },
                    { name: "Count Good Nodes In Binary Tree", lc: "1448", diff: "🟡" },
                    { name: "Delete Leaves With a Given Value", lc: "1325", diff: "🟡" },
                    { name: "Binary Tree Paths", lc: "257", diff: "🟢" },
                ],
            },
            {
                name: "LCA & Ancestors",
                problems: [
                    { name: "LCA of a Binary Search Tree", lc: "235", diff: "🟡" },
                    { name: "Lowest Common Ancestor of BT", lc: "236", diff: "🟡" },
                    { name: "Populating Next Right Pointers", lc: "116", diff: "🟡" },
                    { name: "Populating Next Right Pointers II", lc: "117", diff: "🟡" },
                    { name: "Flatten Binary Tree to Linked List", lc: "114", diff: "🟡" },
                    { name: "Sum Root to Leaf Numbers", lc: "129", diff: "🟡" },
                    { name: "Count Complete Tree Nodes", lc: "222", diff: "🟢" },
                    { name: "Average of Levels in Binary Tree", lc: "637", diff: "🟢" },
                ],
            },
            {
                name: "BST Operations",
                problems: [
                    { name: "Search in a BST", lc: "700", diff: "🟢" },
                    { name: "Insert into a BST", lc: "701", diff: "🟡" },
                    { name: "Delete Node in a BST", lc: "450", diff: "🟡" },
                    { name: "Validate Binary Search Tree", lc: "98", diff: "🟡" },
                    { name: "Kth Smallest Element In a BST", lc: "230", diff: "🟡" },
                    { name: "Minimum Absolute Difference in BST", lc: "530", diff: "🟢" },
                    { name: "BST Iterator", lc: "173", diff: "🟡" },
                    { name: "House Robber III", lc: "337", diff: "🟡" },
                    { name: "Inorder Successor in BST", lc: "285", diff: "🟡" },
                    { name: "Two Sum IV - Input is a BST", lc: "653", diff: "🟢" },
                    { name: "Largest BST Subtree", lc: "333", diff: "🟡" },
                ],
            },
            {
                name: "Construction & Serialization",
                problems: [
                    { name: "Construct BT From Preorder & Inorder", lc: "105", diff: "🟡" },
                    { name: "Construct BT From Inorder & Postorder", lc: "106", diff: "🟡" },
                    { name: "Convert Sorted Array to BST", lc: "108", diff: "🟢" },
                    { name: "Serialize And Deserialize Binary Tree", lc: "297", diff: "🔴" },
                    { name: "Construct Quad Tree", lc: "427", diff: "🟡" },
                    { name: "Merge Two Binary Trees", lc: "617", diff: "🟢" },
                    { name: "Construct BST from Preorder Traversal", lc: "1008", diff: "🟡" },
                    { name: "Convert Binary Search Tree to Sorted Doubly Linked List", lc: "426", diff: "🟡" },
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
                    { name: "Kth Largest Element In An Array", lc: "215", diff: "🟡" },
                    { name: "Kth Largest Element In a Stream", lc: "703", diff: "🟢" },
                    { name: "K Closest Points to Origin", lc: "973", diff: "🟡" },
                    { name: "Last Stone Weight", lc: "1046", diff: "🟢" },
                    { name: "Top K Frequent Elements", lc: "347", diff: "🟡" },
                    { name: "Kth Smallest Element in Sorted Matrix", lc: "378", diff: "🟡" },
                ],
            },
            {
                name: "Two Heaps & Streaming",
                problems: [
                    { name: "Find Median From Data Stream", lc: "295", diff: "🔴" },
                    { name: "IPO", lc: "502", diff: "🔴" },
                    { name: "Reorganize String", lc: "767", diff: "🟡" },
                    { name: "Longest Happy String", lc: "1405", diff: "🟡" },
                    { name: "Find K Pairs with Smallest Sums", lc: "373", diff: "🟡" },
                ],
            },
            {
                name: "Scheduling & Design",
                problems: [
                    { name: "Task Scheduler", lc: "621", diff: "🟡" },
                    { name: "Design Twitter", lc: "355", diff: "🟡" },
                    { name: "Single Threaded CPU", lc: "1834", diff: "🟡" },
                    { name: "Car Pooling", lc: "1094", diff: "🟡" },
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
                    { name: "Fibonacci Number", lc: "509", diff: "🟢" },
                    { name: "Pow(x, n)", lc: "50", diff: "🟡" },
                    { name: "Climbing Stairs", lc: "70", diff: "🟢" },
                    { name: "Count Good Numbers", lc: "1922", diff: "🟡" },
                    { name: "Sort Array By Parity", lc: "905", diff: "�" },
                ],
            },
            {
                name: "Subsets & Combinations",
                problems: [
                    { name: "Subsets", lc: "78", diff: "🟡" },
                    { name: "Subsets II", lc: "90", diff: "🟡" },
                    { name: "Combination Sum", lc: "39", diff: "🟡" },
                    { name: "Combination Sum II", lc: "40", diff: "🟡" },
                    { name: "Combination Sum III", lc: "216", diff: "🟡" },
                    { name: "Combinations", lc: "77", diff: "🟡" },
                    { name: "Sum of All Subsets XOR Total", lc: "1863", diff: "🟢" },
                ],
            },
            {
                name: "Permutations",
                problems: [
                    { name: "Permutations", lc: "46", diff: "🟡" },
                    { name: "Permutations II", lc: "47", diff: "🟡" },
                    { name: "Letter Combinations of Phone Number", lc: "17", diff: "🟡" },
                    { name: "Permutation Sequence", lc: "60", diff: "🔴" },
                ],
            },
            {
                name: "Constraint Satisfaction",
                problems: [
                    { name: "Generate Parentheses", lc: "22", diff: "🟡" },
                    { name: "Word Search", lc: "79", diff: "🟡" },
                    { name: "Palindrome Partitioning", lc: "131", diff: "🟡" },
                    { name: "N Queens", lc: "51", diff: "🔴" },
                    { name: "N Queens II", lc: "52", diff: "🔴" },
                    { name: "Sudoku Solver", lc: "37", diff: "🔴" },
                    { name: "Word Break II", lc: "140", diff: "🔴" },
                    { name: "Expression Add Operators", lc: "282", diff: "🔴" },
                    { name: "Matchsticks to Square", lc: "473", diff: "🟡" },
                    { name: "Partition to K Equal Sum Subsets", lc: "698", diff: "🟡" },
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
                    { name: "Flood Fill", lc: "733", diff: "🟢" },
                    { name: "Rotting Oranges", lc: "994", diff: "🟡" },
                    { name: "Surrounded Regions", lc: "130", diff: "🟡" },
                    { name: "Pacific Atlantic Water Flow", lc: "417", diff: "🟡" },
                    { name: "Island Perimeter", lc: "463", diff: "🟢" },
                    { name: "Walls And Gates", lc: "286", diff: "🟡" },
                ],
            },
            {
                name: "Graph Traversal",
                problems: [
                    { name: "Clone Graph", lc: "133", diff: "🟡" },
                    { name: "Find the Town Judge", lc: "997", diff: "🟢" },
                    { name: "Find if Path Exists in Graph", lc: "1971", diff: "🟡" },
                    { name: "All Paths From Source to Target", lc: "797", diff: "🟡" },
                    { name: "Open The Lock", lc: "752", diff: "🟡" },
                    { name: "Evaluate Division", lc: "399", diff: "🟡" },
                    { name: "Snakes and Ladders", lc: "909", diff: "🟡" },
                    { name: "Minimum Genetic Mutation", lc: "433", diff: "🟡" },
                    { name: "Is Graph Bipartite?", lc: "785", diff: "🟡" },
                ],
            },
            {
                name: "Cycle Detection",
                problems: [
                    { name: "Course Schedule", lc: "207", diff: "🟡" },
                    { name: "Course Schedule II", lc: "210", diff: "🟡" },
                    { name: "Course Schedule IV", lc: "1462", diff: "🟡" },
                    { name: "Graph Valid Tree", lc: "261", diff: "🟡" },
                    { name: "Redundant Connection", lc: "684", diff: "🟡" },
                ],
            },
            {
                name: "Union-Find / DSU",
                problems: [
                    { name: "Connected Components (Undirected)", lc: "323", diff: "🟡" },
                    { name: "Accounts Merge", lc: "721", diff: "🟡" },
                    { name: "Num Operations to Make Network Connected", lc: "1319", diff: "🟡" },
                    { name: "Minimum Height Trees", lc: "310", diff: "🟡" },
                    { name: "Word Ladder", lc: "127", diff: "🔴" },
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
                    { name: "Network Delay Time (Dijkstra)", lc: "743", diff: "🟡" },
                    { name: "Path with Minimum Effort", lc: "1631", diff: "🟡" },
                    { name: "Cheapest Flights Within K Stops", lc: "787", diff: "🟡" },
                    { name: "Number of Ways to Arrive at Destination", lc: "1976", diff: "🟡" },
                    { name: "Swim In Rising Water", lc: "778", diff: "🔴" },
                ],
            },
            {
                name: "MST & Advanced",
                problems: [
                    { name: "Min Cost to Connect All Points (Prim's)", lc: "1584", diff: "🟡" },
                    { name: "Critical & Pseudo Critical Edges in MST", lc: "1489", diff: "🔴" },
                    { name: "Reconstruct Itinerary", lc: "332", diff: "🔴" },
                    { name: "Alien Dictionary", lc: "269", diff: "🔴" },
                    { name: "Build a Matrix With Conditions", lc: "2392", diff: "🔴" },
                    { name: "Greatest Common Divisor Traversal", lc: "2709", diff: "🔴" },
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
                    { name: "Climbing Stairs", lc: "70", diff: "🟢" },
                    { name: "Min Cost Climbing Stairs", lc: "746", diff: "🟢" },
                    { name: "N-th Tribonacci Number", lc: "1137", diff: "🟢" },
                    { name: "House Robber", lc: "198", diff: "🟡" },
                    { name: "House Robber II", lc: "213", diff: "🟡" },
                ],
            },
            {
                name: "Decision Making",
                problems: [
                    { name: "Coin Change", lc: "322", diff: "🟡" },
                    { name: "Word Break", lc: "139", diff: "🟡" },
                    { name: "Decode Ways", lc: "91", diff: "🟡" },
                    { name: "Combination Sum IV", lc: "377", diff: "🟡" },
                    { name: "Perfect Squares", lc: "279", diff: "🟡" },
                    { name: "Integer Break", lc: "343", diff: "🟡" },
                ],
            },
            {
                name: "Subsequence DP",
                problems: [
                    { name: "Longest Increasing Subsequence", lc: "300", diff: "🟡" },
                    { name: "Partition Equal Subset Sum", lc: "416", diff: "🟡" },
                    { name: "Maximum Product Subarray", lc: "152", diff: "🟡" },
                    { name: "Maximum Subarray", lc: "53", diff: "🟡" },
                    { name: "Longest Palindromic Substring", lc: "5", diff: "🟡" },
                    { name: "Palindromic Substrings", lc: "647", diff: "🟡" },
                ],
            },
            {
                name: "Stock Problems",
                problems: [
                    { name: "Best Time to Buy and Sell Stock", lc: "121", diff: "🟢" },
                    { name: "Best Time to Buy and Sell Stock II", lc: "122", diff: "🟡" },
                    { name: "Best Time to Buy and Sell Stock III", lc: "123", diff: "🔴" },
                    { name: "Best Time to Buy and Sell Stock IV", lc: "188", diff: "🔴" },
                    { name: "Buy & Sell Stock With Cooldown", lc: "309", diff: "🟡" },
                    { name: "Best Time With Transaction Fee", lc: "714", diff: "🟡" },
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
                    { name: "Unique Paths II", lc: "63", diff: "🟡" },
                    { name: "Minimum Path Sum", lc: "64", diff: "🟡" },
                    { name: "Triangle", lc: "120", diff: "🟡" },
                    { name: "Minimum Falling Path Sum", lc: "931", diff: "🟡" },
                    { name: "Maximal Square", lc: "221", diff: "🟡" },
                    { name: "Super Egg Drop", lc: "887", diff: "🔴" },
                ],
            },
            {
                name: "Two-String DP",
                problems: [
                    { name: "Longest Common Subsequence", lc: "1143", diff: "🟡" },
                    { name: "Edit Distance", lc: "72", diff: "🔴" },
                    { name: "Distinct Subsequences", lc: "115", diff: "🔴" },
                    { name: "Interleaving String", lc: "97", diff: "🟡" },
                    { name: "Wildcard Matching", lc: "44", diff: "🔴" },
                    { name: "Shortest Common Supersequence", lc: "1092", diff: "🔴" },
                    { name: "Minimum Insertions to Make a String Palindrome", lc: "1312", diff: "🔴" },
                ],
            },
            {
                name: "Knapsack Variants",
                problems: [
                    { name: "Target Sum", lc: "494", diff: "🟡" },
                    { name: "Coin Change II", lc: "518", diff: "🟡" },
                    { name: "Last Stone Weight II", lc: "1049", diff: "🟡" },
                    { name: "Ones and Zeroes", lc: "474", diff: "🟡" },
                    { name: "Min Cost For Tickets", lc: "983", diff: "🟡" },
                ],
            },
            {
                name: "Interval DP & MCM",
                problems: [
                    { name: "Burst Balloons", lc: "312", diff: "🔴" },
                    { name: "Palindrome Partitioning II", lc: "132", diff: "🔴" },
                    { name: "Minimum Score Triangulation of Polygon", lc: "1039", diff: "�" },
                    { name: "Minimum Cost to Cut a Stick", lc: "1547", diff: "🟡" },
                    { name: "Stone Game", lc: "877", diff: "🟡" },
                    { name: "Stone Game II", lc: "1140", diff: "🟡" },
                    { name: "Stone Game III", lc: "1406", diff: "🔴" },
                    { name: "Regular Expression Matching", lc: "10", diff: "🔴" },
                    { name: "Longest Increasing Path In Matrix", lc: "329", diff: "🔴" },
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
                    { name: "Jump Game II", lc: "45", diff: "🟡" },
                    { name: "Gas Station", lc: "134", diff: "🟡" },
                    { name: "Candy", lc: "135", diff: "🔴" },
                    { name: "Lemonade Change", lc: "860", diff: "🟢" },
                    { name: "Assign Cookies", lc: "455", diff: "🟢" },
                ],
            },
            {
                name: "Interval Greedy",
                problems: [
                    { name: "Merge Intervals", lc: "56", diff: "🟡" },
                    { name: "Insert Interval", lc: "57", diff: "🟡" },
                    { name: "Non Overlapping Intervals", lc: "435", diff: "🟡" },
                    { name: "Meeting Rooms", lc: "252", diff: "🟢" },
                    { name: "Meeting Rooms II", lc: "253", diff: "🟡" },
                    { name: "Meeting Rooms III", lc: "2402", diff: "🔴" },
                    { name: "Minimum Interval to Include Each Query", lc: "1851", diff: "🔴" },
                ],
            },
            {
                name: "String & Partition Greedy",
                problems: [
                    { name: "Valid Parenthesis String", lc: "678", diff: "🟡" },
                    { name: "Partition Labels", lc: "763", diff: "🟡" },
                    { name: "Hand of Straights", lc: "846", diff: "🟡" },
                    { name: "Merge Triplets to Form Target", lc: "1899", diff: "🟡" },
                    { name: "Dota2 Senate", lc: "649", diff: "🟡" },
                    { name: "Two City Scheduling", lc: "1029", diff: "🟡" },
                    { name: "Maximum Profit in Job Scheduling", lc: "1235", diff: "🔴" },
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
                    { name: "Implement Trie (Prefix Tree)", lc: "208", diff: "🟡" },
                    { name: "Design Add And Search Words", lc: "211", diff: "🟡" },
                    { name: "Word Search II", lc: "212", diff: "🔴" },
                    { name: "Extra Characters in a String", lc: "2707", diff: "🟡" },
                    { name: "Maximum XOR of Two Numbers", lc: "421", diff: "🟡" },
                    { name: "Longest Word With All Prefixes", lc: "1858", diff: "🟡" },
                    { name: "Number of Distinct Substrings in a String", lc: "1698", diff: "🟡" },
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
                    { name: "Single Number", lc: "136", diff: "🟢" },
                    { name: "Single Number II", lc: "137", diff: "🟡" },
                    { name: "Single Number III", lc: "260", diff: "🟡" },
                    { name: "Missing Number", lc: "268", diff: "🟢" },
                    { name: "Bitwise AND of Numbers Range", lc: "201", diff: "🟡" },
                    { name: "Maximum XOR With an Element From Array", lc: "1707", diff: "🔴" },
                ],
            },
            {
                name: "Bit Counting & Operations",
                problems: [
                    { name: "Number of 1 Bits", lc: "191", diff: "🟢" },
                    { name: "Counting Bits", lc: "338", diff: "🟢" },
                    { name: "Reverse Bits", lc: "190", diff: "🟢" },
                    { name: "Sum of Two Integers", lc: "371", diff: "🟡" },
                    { name: "Reverse Integer", lc: "7", diff: "🟡" },
                    { name: "Add Binary", lc: "67", diff: "🟢" },
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
                    { name: "Happy Number", lc: "202", diff: "🟢" },
                    { name: "Palindrome Number", lc: "9", diff: "🟢" },
                    { name: "Plus One", lc: "66", diff: "🟢" },
                    { name: "Factorial Trailing Zeroes", lc: "172", diff: "🟡" },
                    { name: "Pow(x, n)", lc: "50", diff: "🟡" },
                    { name: "Max Points on a Line", lc: "149", diff: "🔴" },
                    { name: "Detect Squares", lc: "2013", diff: "🟡" },
                    { name: "Excel Sheet Column Title", lc: "168", diff: "🟢" },
                    { name: "Roman to Integer", lc: "13", diff: "🟢" },
                    { name: "Divide Two Integers", lc: "29", diff: "🟡" },
                    { name: "GCD of Strings", lc: "1071", diff: "🟢" },
                ],
            },
            {
                name: "Matrix Math",
                problems: [
                    { name: "Rotate Image", lc: "48", diff: "🟡" },
                    { name: "Spiral Matrix", lc: "54", diff: "🟡" },
                    { name: "Set Matrix Zeroes", lc: "73", diff: "🟡" },
                    { name: "Transpose Matrix", lc: "867", diff: "🟢" },
                    { name: "Multiply Strings", lc: "43", diff: "🟡" },
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
