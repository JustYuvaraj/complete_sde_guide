// ═══════════════════════════════════════════════════════════════════
//  NeetCode 150 — Correctly categorized per official NeetCode
// ═══════════════════════════════════════════════════════════════════

export const FAANG_TOPICS = [
    // ═══════════════════════════════════════════════════════════════
    // 1. ARRAYS & HASHING (9 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Arrays & Hashing",
        icon: "🗄️",
        color: "#4ade80",
        description: "Foundation of DSA — almost every interview starts here",
        subtopics: [
            {
                name: "Hashing & Frequency Counting",
                problems: [
                    { name: "Contains Duplicate", lc: "217", diff: "🟢", component: "EngContainsDuplicate" },
                    { name: "Contains Duplicate II", lc: "219", diff: "🟢", component: "EngContainsDuplicateII" },
                    { name: "Valid Anagram", lc: "242", diff: "🟢", component: "EngValidAnagram" },
                    { name: "Two Sum", lc: "1", diff: "🟢", component: "EngTwoSum" },
                    { name: "Group Anagrams", lc: "49", diff: "🟡", component: "EngGroupAnagrams" },
                    { name: "Top K Frequent Elements", lc: "347", diff: "🟡", component: "EngTopKFrequent" },
                    { name: "Verifying an Alien Dictionary", lc: "953", diff: "🟡", component: "EngIsAlienSorted" },
                    { name: "Logger Rate Limiter", lc: "359", diff: "🟢", component: "EngLoggerRateLimiter" },
                    { name: "Ransom Note", lc: "383", diff: "🟢", component: "EngRansomNote" },
                    { name: "Isomorphic Strings", lc: "205", diff: "🟢", component: "EngIsomorphicStrings" },
                    { name: "Word Pattern", lc: "290", diff: "🟢", component: "EngWordPattern" },
                    { name: "Subarray Sum Equals K", lc: "560", diff: "🟡", component: "EngSubarraySum" },
                ],
            },
            {
                name: "String Manipulation",
                problems: [
                    { name: "Integer to Roman", lc: "12", diff: "🟡", component: "EngIntegerToRoman" },
                    { name: "Length of Last Word", lc: "58", diff: "🟢", component: "EngLengthOfLastWord" },
                    { name: "Reverse Words in a String", lc: "151", diff: "🟡", component: "EngReverseWords" },
                    { name: "Zigzag Conversion", lc: "6", diff: "🟡", component: "EngZigzagConversion" },
                    { name: "Find the Index of First Occurrence", lc: "28", diff: "🟢", component: "EngFindIndex" },
                    { name: "String to Integer (atoi)", lc: "8", diff: "🟡", component: "EngMyAtoi" },
                    { name: "Count and Say", lc: "38", diff: "🟡", component: "EngCountAndSay" },
                    { name: "Compare Version Numbers", lc: "165", diff: "🟡", component: "EngCompareVersion" },
                    { name: "Z Function", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/", component: "EngZFunction" },
                ],
            },
            {
                name: "Array Techniques",
                problems: [
                    { name: "Product of Array Except Self", lc: "238", diff: "🟡", component: "EngProductExceptSelf" },
                    { name: "Valid Sudoku", lc: "36", diff: "🟡", component: "ValidSudoku" },
                    { name: "Encode and Decode Strings", lc: "271", diff: "🟡", component: "EngEncodeDecodeStrings" },
                    { name: "Longest Consecutive Sequence", lc: "128", diff: "🟡", component: "EngLongestConsecutive" },
                    { name: "Next Permutation", lc: "31", diff: "🟡", component: "EngNextPermutation" },
                    { name: "First Missing Positive", lc: "41", diff: "🔴", component: "EngFirstMissingPositive" },
                    { name: "Pascal's Triangle", lc: "118", diff: "🟢", component: "EngPascalsTriangle" },
                    { name: "Majority Element", lc: "169", diff: "🟢", component: "EngMajorityElement" },
                    { name: "Largest Number", lc: "179", diff: "🟡", component: "EngLargestNumber" },
                    { name: "Insert Delete GetRandom O(1)", lc: "380", diff: "🟡", component: "EngInsertDeleteGetRandom" },
                    { name: "Game of Life", lc: "289", diff: "🟡", component: "EngGameOfLife" },
                    { name: "Rotate Array", lc: "189", diff: "🟡", component: "EngRotateArray" },
                    { name: "H-Index", lc: "274", diff: "🟡", component: "EngHIndex" },
                    { name: "Majority Element II", lc: "229", diff: "🟡", component: "EngMajorityElementII" },
                    { name: "Reverse Pairs", lc: "493", diff: "🔴", component: "ReversePairs" },
                    { name: "Max Consecutive Ones", lc: "485", diff: "🟢", component: "EngMaxConsecutiveOnes" },
                    { name: "Move Zeroes", lc: "283", diff: "🟢", component: "EngMoveZeroes" },
                    { name: "Diagonal Traverse", lc: "498", diff: "🟡", component: "EngDiagonalTraverse" },
                    { name: "Increasing Triplet Subsequence", lc: "334", diff: "🟡", component: "EngIncreasingTriplet" },
                    { name: "Longest Mountain in Array", lc: "845", diff: "🟡", component: "EngLongestMountain" },
                    { name: "Max Points You Can Obtain from Cards", lc: "1423", diff: "🟡", component: "EngMaxPointsCards" },
                    { name: "Find All Anagrams in a String", lc: "438", diff: "🟡", component: "EngFindAnagrams" },
                    { name: "Reorganize String", lc: "767", diff: "🟡", component: "EngReorganizeString" },
                    { name: "Decode String", lc: "394", diff: "🟡", component: "EngDecodeString" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. TWO POINTERS (5 problems)
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
                    { name: "Valid Palindrome", lc: "125", diff: "🟢", component: "EngValidPalindrome" },
                    { name: "Two Sum II Input Array Is Sorted", lc: "167", diff: "🟡", component: "EngTwoSumII" },
                    { name: "3Sum", lc: "15", diff: "🟡", component: "EngThreeSum" },
                    { name: "Container With Most Water", lc: "11", diff: "🟡", component: "EngContainerWithMostWater" },
                    { name: "Remove Element", lc: "27", diff: "🟢", component: "EngRemoveElement" },
                    { name: "Remove Duplicates from Sorted Array", lc: "26", diff: "🟢", component: "EngRemoveDuplicates" },
                    { name: "Remove Duplicates from Sorted Array II", lc: "80", diff: "🟡", component: "EngRemoveDuplicatesII" },
                    { name: "Merge Sorted Array", lc: "88", diff: "🟢", component: "EngMergeSortedArray" },
                    { name: "Sort Colors", lc: "75", diff: "🟡", component: "EngSortColors" },
                    { name: "4Sum", lc: "18", diff: "🟡", component: "EngFourSum" },
                    { name: "3Sum Closest", lc: "16", diff: "🟡", component: "EngThreeSumClosest" },
                    { name: "Trapping Rain Water", lc: "42", diff: "🔴", component: "EngTrappingRainWater" },
                ],
            },
            {
                name: "Subsequence",
                problems: [
                    { name: "Is Subsequence", lc: "392", diff: "🟢", component: "EngIsSubsequence" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. SLIDING WINDOW (6 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Sliding Window",
        icon: "🪟",
        color: "#f472b6",
        description: "Dynamic window tracking for subarray/substring problems",
        subtopics: [
            {
                name: "Fixed & Variable Window",
                problems: [
                    { name: "Best Time to Buy And Sell Stock", lc: "121", diff: "🟢", component: "EngBestTimeToBuyAndSellStock" },
                    { name: "Longest Substring Without Repeating Chars", lc: "3", diff: "🟡", component: "EngLongestSubstringWithoutRepeating" },
                    { name: "Longest Repeating Character Replacement", lc: "424", diff: "🟡", component: "EngLongestRepeatingCharReplacement" },
                    { name: "Permutation in String", lc: "567", diff: "🟡", component: "EngPermutationInString" },
                    { name: "Moving Average from Data Stream", lc: "346", diff: "🟢", component: "EngMovingAverage" },
                    { name: "Minimum Size Subarray Sum", lc: "209", diff: "🟡", component: "EngMinimumSizeSubarraySum" },
                ],
            },
            {
                name: "Window + HashMap",
                problems: [
                    { name: "Minimum Window Substring", lc: "76", diff: "🔴", component: "EngMinimumWindowSubstring" },
                    { name: "Sliding Window Maximum", lc: "239", diff: "🔴", component: "EngSlidingWindowMaximum" },
                    { name: "Substring with Concatenation of All Words", lc: "30", diff: "🔴", component: "EngSubstringConcatenation" },
                    { name: "Distinct Numbers in Each Subarray", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/count-distinct-elements-in-every-window-of-size-k/", component: "EngDistinctNumbersSubarray" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. STACK (7 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Stack",
        icon: "📚",
        color: "#fb923c",
        description: "LIFO operations, monotonic stack, expression evaluation",
        subtopics: [
            {
                name: "Stack Fundamentals",
                problems: [
                    { name: "Valid Parentheses", lc: "20", diff: "🟢" },
                    { name: "Min Stack", lc: "155", diff: "🟡" },
                    { name: "Evaluate Reverse Polish Notation", lc: "150", diff: "🟡" },
                    { name: "Generate Parentheses", lc: "22", diff: "🟡" },
                    { name: "Minimum Remove to Make Valid Parentheses", lc: "1249", diff: "🟡" },
                    { name: "Simplify Path", lc: "71", diff: "🟡" },
                    { name: "Basic Calculator", lc: "224", diff: "🔴" },
                    { name: "Longest Valid Parentheses", lc: "32", diff: "🔴" },
                    { name: "Max Stack", lc: "716", diff: "🔴" },
                    { name: "Implement Stack using Queues", lc: "225", diff: "🟢" },
                    { name: "Implement Queue using Stacks", lc: "232", diff: "🟢" },
                    { name: "Sort a Stack", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/sort-a-stack-using-recursion/" },
                    { name: "Basic Calculator II", lc: "227", diff: "🟡" },
                    { name: "Remove All Adjacent Duplicates II", lc: "1209", diff: "🟡" },
                    { name: "Design Circular Queue", lc: "622", diff: "🟡" },
                    { name: "Asteroid Collision", lc: "735", diff: "🟡" },
                    { name: "Sum of Subarray Minimums", lc: "907", diff: "🟡" },
                    { name: "Maximum Frequency Stack", lc: "895", diff: "🔴" },
                    { name: "Remove K Digits", lc: "402", diff: "🟡" },
                    { name: "Design Browser History", lc: "1472", diff: "🟡" },
                    { name: "Design Hit Counter", lc: "362", diff: "🟡" },
                    { name: "Exclusive Time of Functions", lc: "636", diff: "🟡" },
                    { name: "Baseball Game", lc: "682", diff: "🟢" },
                    { name: "Make The String Great", lc: "1544", diff: "🟢" },
                ],
            },
            {
                name: "Monotonic Stack",
                problems: [
                    { name: "Daily Temperatures", lc: "739", diff: "🟡", component: "EngDailyTemperatures" },
                    { name: "Car Fleet", lc: "853", diff: "🟡" },
                    { name: "Largest Rectangle In Histogram", lc: "84", diff: "🔴" },
                    { name: "Next Greater Element I", lc: "496", diff: "🟢" },
                    { name: "Online Stock Span", lc: "901", diff: "🟡" },
                    { name: "Next Smaller Element", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/next-smaller-element/" },
                    { name: "Max of Minimums for Every Window", lc: "GFG", diff: "🔴", link: "https://www.geeksforgeeks.org/find-the-maximum-of-minimums-for-every-window-size-in-a-given-array/" },
                    { name: "Next Greater Element II", lc: "503", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 5. BINARY SEARCH (7 problems)
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
                    { name: "Search a 2D Matrix", lc: "74", diff: "🟡" },
                    { name: "Find First and Last Position in Sorted Array", lc: "34", diff: "🟡" },
                    { name: "Search Insert Position", lc: "35", diff: "🟢" },
                    { name: "Sqrt(x)", lc: "69", diff: "🟢" },
                ],
            },
            {
                name: "BS on Rotated Arrays",
                problems: [
                    { name: "Find Minimum In Rotated Sorted Array", lc: "153", diff: "🟡" },
                    { name: "Search In Rotated Sorted Array", lc: "33", diff: "🟡" },
                    { name: "Find Peak Element", lc: "162", diff: "🟡" },
                    { name: "Single Element in a Sorted Array", lc: "540", diff: "🟡" },
                ],
            },
            {
                name: "BS on Answer Space",
                problems: [
                    { name: "Koko Eating Bananas", lc: "875", diff: "🟡" },
                    { name: "Time Based Key-Value Store", lc: "981", diff: "🟡" },
                    { name: "Median of Two Sorted Arrays", lc: "4", diff: "🔴" },
                    { name: "N-th Root of an Integer", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/n-th-root-number/" },
                    { name: "Matrix Median", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/" },
                    { name: "Kth Element of Two Sorted Arrays", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/k-th-element-two-sorted-arrays/" },
                    { name: "Allocate Minimum Pages", lc: "GFG", diff: "🔴", link: "https://www.geeksforgeeks.org/allocate-minimum-number-pages/" },
                    { name: "Aggressive Cows", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/aggressive-cows/" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 6. LINKED LIST (11 problems)
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
                    { name: "Remove Duplicates from Sorted List II", lc: "82", diff: "🟡" },
                    { name: "Delete Node in a Linked List", lc: "237", diff: "🟡" },
                ],
            },
            {
                name: "Fast & Slow Pointer",
                problems: [
                    { name: "Linked List Cycle", lc: "141", diff: "🟢" },
                    { name: "Find The Duplicate Number", lc: "287", diff: "🟡" },
                    { name: "Middle of the Linked List", lc: "876", diff: "🟢" },
                    { name: "Palindrome Linked List", lc: "234", diff: "🟢" },
                    { name: "Intersection of Two Linked Lists", lc: "160", diff: "🟢" },
                    { name: "Linked List Cycle II", lc: "142", diff: "🟡" },
                    { name: "Odd Even Linked List", lc: "328", diff: "🟡" },
                ],
            },
            {
                name: "Reversal Patterns",
                problems: [
                    { name: "Reverse Nodes In K Group", lc: "25", diff: "🔴" },
                    { name: "Reverse Linked List II", lc: "92", diff: "🟡" },
                    { name: "Swap Nodes in Pairs", lc: "24", diff: "🟡" },
                ],
            },
            {
                name: "Advanced Manipulation",
                problems: [
                    { name: "Reorder List", lc: "143", diff: "🟡" },
                    { name: "Remove Nth Node From End", lc: "19", diff: "🟡" },
                    { name: "Copy List With Random Pointer", lc: "138", diff: "🟡" },
                    { name: "Add Two Numbers", lc: "2", diff: "🟡" },
                    { name: "LRU Cache", lc: "146", diff: "🟡" },
                    { name: "Flatten Binary Tree to Linked List", lc: "114", diff: "🟡" },
                    { name: "Sort List", lc: "148", diff: "🟡" },
                    { name: "Rotate List", lc: "61", diff: "🟡" },
                    { name: "Partition List", lc: "86", diff: "🟡" },
                    { name: "Merge K Sorted Lists", lc: "23", diff: "🔴" },
                    { name: "Flatten Multilevel Doubly Linked List", lc: "430", diff: "🟡" },
                    { name: "LFU Cache", lc: "460", diff: "🔴" },
                    { name: "Design Linked List", lc: "707", diff: "🟡" },
                    { name: "Add Two Numbers II", lc: "445", diff: "🟡" },
                    { name: "Split Linked List in Parts", lc: "725", diff: "🟡" },
                    { name: "Remove Zero Sum Consecutive Nodes", lc: "1171", diff: "🟡" },
                    { name: "Plus One Linked List", lc: "369", diff: "🟡" },
                    { name: "Next Greater Node in Linked List", lc: "1019", diff: "🟡" },
                    { name: "Insertion Sort List", lc: "147", diff: "🟡" },
                    { name: "Convert Binary Number in LL", lc: "1290", diff: "🟢" },
                    { name: "Maximum Twin Sum of Linked List", lc: "2130", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 7. TREES (15 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Trees",
        icon: "🌳",
        color: "#a3e635",
        description: "DFS, BFS, BST operations — the most asked topic",
        subtopics: [
            {
                name: "Tree Properties",
                problems: [
                    { name: "Invert Binary Tree", lc: "226", diff: "🟢" },
                    { name: "Maximum Depth of Binary Tree", lc: "104", diff: "🟢" },
                    { name: "Diameter of Binary Tree", lc: "543", diff: "🟢" },
                    { name: "Balanced Binary Tree", lc: "110", diff: "🟢" },
                    { name: "Same Tree", lc: "100", diff: "🟢" },
                    { name: "Symmetric Tree", lc: "101", diff: "🟢" },
                    { name: "Subtree of Another Tree", lc: "572", diff: "🟢" },
                    { name: "Count Complete Tree Nodes", lc: "222", diff: "🟡" },
                    { name: "Children Sum Property", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/check-for-children-sum-property-in-a-binary-tree/" },
                    { name: "Minimum Depth of Binary Tree", lc: "111", diff: "🟢" },
                    { name: "Cousins in Binary Tree", lc: "993", diff: "🟢" },
                ],
            },
            {
                name: "Traversals & Views",
                problems: [
                    { name: "Binary Tree Level Order Traversal", lc: "102", diff: "🟡" },
                    { name: "Binary Tree Zigzag Level Order", lc: "103", diff: "🟡" },
                    { name: "Binary Tree Right Side View", lc: "199", diff: "🟡" },
                    { name: "Count Good Nodes in BT", lc: "1448", diff: "🟡" },
                    { name: "Average of Levels in Binary Tree", lc: "637", diff: "🟢" },
                    { name: "Populating Next Right Pointers II", lc: "117", diff: "🟡" },
                    { name: "Populating Next Right Pointers", lc: "116", diff: "🟡" },
                    { name: "Binary Tree Inorder Traversal", lc: "94", diff: "🟢" },
                    { name: "Binary Tree Preorder Traversal", lc: "144", diff: "🟢" },
                    { name: "Binary Tree Postorder Traversal", lc: "145", diff: "🟢" },
                    { name: "Vertical Order Traversal", lc: "987", diff: "🔴" },
                    { name: "Maximum Width of Binary Tree", lc: "662", diff: "🟡" },
                    { name: "Bottom View of Binary Tree", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/bottom-view-binary-tree/" },
                    { name: "Top View of Binary Tree", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/print-nodes-top-view-binary-tree/" },
                    { name: "Boundary Traversal of Binary Tree", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/boundary-traversal-of-binary-tree/" },
                ],
            },
            {
                name: "BST Operations",
                problems: [
                    { name: "Lowest Common Ancestor of a BST", lc: "235", diff: "🟡" },
                    { name: "Lowest Common Ancestor of a BT", lc: "236", diff: "🟡" },
                    { name: "Validate Binary Search Tree", lc: "98", diff: "🟡" },
                    { name: "Kth Smallest Element In a BST", lc: "230", diff: "🟡" },
                    { name: "Minimum Absolute Difference in BST", lc: "530", diff: "🟢" },
                    { name: "Binary Search Tree Iterator", lc: "173", diff: "🟡" },
                    { name: "Search in a BST", lc: "700", diff: "🟢" },
                    { name: "Two Sum IV - Input is a BST", lc: "653", diff: "🟢" },
                    { name: "Inorder Successor in BST", lc: "285", diff: "🟡" },
                    { name: "Floor in a BST", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/floor-in-binary-search-tree-bst/" },
                    { name: "Ceil in a BST", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/ceil-in-binary-search-tree-bst/" },
                    { name: "Largest BST in Binary Tree", lc: "333", diff: "🟡" },
                    { name: "Recover Binary Search Tree", lc: "99", diff: "🟡" },
                    { name: "Trim a Binary Search Tree", lc: "669", diff: "🟡" },
                    { name: "Delete Node in a BST", lc: "450", diff: "🟡" },
                    { name: "Range Sum of BST", lc: "938", diff: "🟢" },
                    { name: "Find Mode in BST", lc: "501", diff: "🟢" },
                    { name: "BST to Greater Sum Tree", lc: "1038", diff: "🟡" },
                ],
            },
            {
                name: "Construction & Advanced",
                problems: [
                    { name: "Construct BT From Preorder & Inorder", lc: "105", diff: "🟡" },
                    { name: "Construct BT From Inorder & Postorder", lc: "106", diff: "🟡" },
                    { name: "Find Leaves of Binary Tree", lc: "366", diff: "🟡" },
                    { name: "Path Sum", lc: "112", diff: "🟢" },
                    { name: "Sum Root to Leaf Numbers", lc: "129", diff: "🟡" },
                    { name: "Convert Sorted Array to BST", lc: "108", diff: "🟢" },
                    { name: "Construct Quad Tree", lc: "427", diff: "🟡" },
                    { name: "Binary Tree Maximum Path Sum", lc: "124", diff: "🔴" },
                    { name: "Serialize And Deserialize Binary Tree", lc: "297", diff: "🔴" },
                    { name: "Binary Tree Paths", lc: "257", diff: "🟢" },
                    { name: "Construct BST from Preorder", lc: "1008", diff: "🟡" },
                    { name: "Binary Tree to Doubly Linked List", lc: "426", diff: "🟡" },
                    { name: "Path Sum II", lc: "113", diff: "🟡" },
                    { name: "Count Univalue Subtrees", lc: "250", diff: "🟡" },
                    { name: "Convert Sorted List to BST", lc: "109", diff: "🟡" },
                    { name: "All Nodes Distance K in BT", lc: "863", diff: "🟡" },
                    { name: "Find Duplicate Subtrees", lc: "652", diff: "🟡" },
                    { name: "Sum of Left Leaves", lc: "404", diff: "🟢" },
                    { name: "House Robber III", lc: "337", diff: "🟡" },
                    { name: "Path Sum III", lc: "437", diff: "🟡" },
                    { name: "Check Completeness of BT", lc: "958", diff: "🟡" },
                    { name: "Max Ancestor Difference", lc: "1026", diff: "🟡" },
                    { name: "Distribute Coins in BT", lc: "979", diff: "🟡" },
                    { name: "Time to Inform All Employees", lc: "1376", diff: "🟡" },
                    { name: "Sum of Even-Valued Grandparent", lc: "1315", diff: "🟡" },
                    { name: "Smallest Subtree with Deepest Nodes", lc: "865", diff: "🟡" },
                    { name: "Binary Tree Cameras", lc: "968", diff: "🔴" },
                    { name: "Max Sum BST in Binary Tree", lc: "1373", diff: "🔴" },
                    { name: "Delete Leaves with Given Value", lc: "1325", diff: "🟡" },
                    { name: "Diameter of N-ary Tree", lc: "1522", diff: "🟡" },
                    { name: "Lowest Common Ancestor IV", lc: "1676", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 8. TRIES (3 problems)
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
                    { name: "Implement Trie", lc: "208", diff: "🟡" },
                    { name: "Design Add and Search Words", lc: "211", diff: "🟡" },
                    { name: "Word Search II", lc: "212", diff: "🔴" },
                    { name: "Longest Word with All Prefixes", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/longest-word-in-dictionary/" },
                    { name: "Number of Distinct Substrings", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/count-number-of-distinct-substring-in-a-string/" },
                    { name: "Maximum XOR of Two Numbers", lc: "421", diff: "🟡" },
                    { name: "Maximum XOR with Element from Array", lc: "1707", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 9. HEAP / PRIORITY QUEUE (7 problems)
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
                    { name: "Kth Largest Element In a Stream", lc: "703", diff: "🟢" },
                    { name: "Last Stone Weight", lc: "1046", diff: "🟢" },
                    { name: "K Closest Points to Origin", lc: "973", diff: "🟡" },
                    { name: "Kth Largest Element in an Array", lc: "215", diff: "🟡" },
                    { name: "High Five", lc: "1086", diff: "🟢" },
                    { name: "Find K Pairs with Smallest Sums", lc: "373", diff: "🟡" },
                    { name: "Top K Frequent Words", lc: "692", diff: "🟡" },
                    { name: "Minimum Cost to Connect Sticks", lc: "1167", diff: "🟡" },
                    { name: "Furthest Building You Can Reach", lc: "1642", diff: "🟡" },
                ],
            },
            {
                name: "Two Heaps & Streaming",
                problems: [
                    { name: "Find Median From Data Stream", lc: "295", diff: "🔴" },
                    { name: "IPO", lc: "502", diff: "🔴" },
                ],
            },
            {
                name: "Scheduling & Design",
                problems: [
                    { name: "Task Scheduler", lc: "621", diff: "🟡" },
                    { name: "Design Twitter", lc: "355", diff: "🟡" },
                    { name: "Implement Max Heap", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/building-heap-from-array/" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 10. BACKTRACKING (9 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Backtracking",
        icon: "🔄",
        color: "#c084fc",
        description: "Choose → Explore → Un-choose. The backbone of problem solving",
        subtopics: [
            {
                name: "Subsets & Combinations",
                problems: [
                    { name: "Subsets", lc: "78", diff: "🟡" },
                    { name: "Subsets II", lc: "90", diff: "🟡" },
                    { name: "Combination Sum", lc: "39", diff: "🟡" },
                    { name: "Combination Sum II", lc: "40", diff: "🟡" },
                    { name: "Combinations", lc: "77", diff: "🟡" },
                ],
            },
            {
                name: "Permutations",
                problems: [
                    { name: "Permutations", lc: "46", diff: "🟡" },
                    { name: "Letter Combinations of Phone Number", lc: "17", diff: "🟡" },
                    { name: "Permutation Sequence", lc: "60", diff: "🔴" },
                ],
            },
            {
                name: "Constraint Satisfaction",
                problems: [
                    { name: "Word Search", lc: "79", diff: "🟡" },
                    { name: "Palindrome Partitioning", lc: "131", diff: "🟡" },
                    { name: "N-Queens", lc: "51", diff: "🔴" },
                    { name: "N-Queens II", lc: "52", diff: "🔴" },
                    { name: "Sudoku Solver", lc: "37", diff: "🔴" },
                    { name: "Word Break II", lc: "140", diff: "🔴" },
                    { name: "M-Coloring Problem", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/m-coloring-problem/" },
                    { name: "Rat in a Maze", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/rat-in-a-maze/" },
                    { name: "Permutations II", lc: "47", diff: "🟡" },
                    { name: "Restore IP Addresses", lc: "93", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 11. GRAPHS (13 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Graphs",
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
                    { name: "Pacific Atlantic Water Flow", lc: "417", diff: "🟡" },
                    { name: "Surrounded Regions", lc: "130", diff: "🟡" },
                    { name: "Walls and Gates", lc: "286", diff: "🟡" },
                    { name: "Flood Fill", lc: "733", diff: "🟢" },
                    { name: "Shortest Path in Binary Matrix", lc: "1091", diff: "🟡" },
                    { name: "Shortest Bridge", lc: "934", diff: "🟡" },
                    { name: "Count Sub Islands", lc: "1905", diff: "🟡" },
                    { name: "Find if Path Exists in Graph", lc: "1971", diff: "🟢" },
                ],
            },
            {
                name: "Graph Traversal",
                problems: [
                    { name: "Clone Graph", lc: "133", diff: "🟡" },
                    { name: "Word Ladder", lc: "127", diff: "🔴" },
                    { name: "Find the Celebrity", lc: "277", diff: "🟡" },
                    { name: "Evaluate Division", lc: "399", diff: "🟡" },
                    { name: "Snakes and Ladders", lc: "909", diff: "🟡" },
                    { name: "Minimum Genetic Mutation", lc: "433", diff: "🟡" },
                    { name: "Bipartite Graph", lc: "785", diff: "🟡" },
                    { name: "Word Ladder II", lc: "126", diff: "🔴" },
                    { name: "Accounts Merge", lc: "721", diff: "🟡" },
                    { name: "Open the Lock", lc: "752", diff: "🟡" },
                    { name: "Keys and Rooms", lc: "841", diff: "🟡" },
                    { name: "Possible Bipartition", lc: "886", diff: "🟡" },
                    { name: "Find Eventual Safe States", lc: "802", diff: "🟡" },
                    { name: "All Paths From Source to Target", lc: "797", diff: "🟡" },
                    { name: "Minimum Height Trees", lc: "310", diff: "🟡" },
                    { name: "Path With Max Probability", lc: "1514", diff: "🟡" },
                ],
            },
            {
                name: "Cycle Detection & Topological Sort",
                problems: [
                    { name: "Course Schedule", lc: "207", diff: "🟡" },
                    { name: "Course Schedule II", lc: "210", diff: "🟡" },
                ],
            },
            {
                name: "Union-Find / DSU",
                problems: [
                    { name: "Number of Connected Components", lc: "323", diff: "🟡" },
                    { name: "Number of Provinces", lc: "547", diff: "🟡" },
                    { name: "Graph Valid Tree", lc: "261", diff: "🟡" },
                    { name: "Redundant Connection", lc: "684", diff: "🟡" },
                    { name: "Redundant Connection II", lc: "685", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 12. ADVANCED GRAPHS (6 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Advanced Graphs",
        icon: "🗺️",
        color: "#f87171",
        description: "Dijkstra, Bellman-Ford, MST, Euler paths",
        subtopics: [
            {
                name: "Shortest Path (Weighted)",
                problems: [
                    { name: "Network Delay Time", lc: "743", diff: "🟡" },
                    { name: "Cheapest Flights K Stops", lc: "787", diff: "🟡" },
                    { name: "Swim in Rising Water", lc: "778", diff: "🔴" },
                    { name: "Race Car", lc: "818", diff: "🔴" },
                    { name: "Bellman-Ford Algorithm", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/" },
                    { name: "Floyd Warshall", lc: "1334", diff: "🟡" },
                ],
            },
            {
                name: "MST & Topological",
                problems: [
                    { name: "Min Cost to Connect All Points", lc: "1584", diff: "🟡" },
                    { name: "Reconstruct Itinerary", lc: "332", diff: "🔴" },
                    { name: "Alien Dictionary", lc: "269", diff: "🔴" },
                    { name: "MST using Prim's", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/" },
                    { name: "Kosaraju's Algorithm (SCC)", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/strongly-connected-components/" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 13. 1-D DYNAMIC PROGRAMMING (12 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "1-D DP",
        icon: "📈",
        color: "#818cf8",
        description: "dp[i] depends on previous states — linear recurrences",
        subtopics: [
            {
                name: "Fibonacci Pattern",
                problems: [
                    { name: "Climbing Stairs", lc: "70", diff: "🟢" },
                    { name: "Min Cost Climbing Stairs", lc: "746", diff: "🟢" },
                    { name: "House Robber", lc: "198", diff: "🟡" },
                    { name: "House Robber II", lc: "213", diff: "🟡" },
                    { name: "Decode Ways", lc: "91", diff: "🟡" },
                    { name: "Coin Change", lc: "322", diff: "🟡" },
                    { name: "Maximum Product Subarray", lc: "152", diff: "🟡" },
                    { name: "Word Break", lc: "139", diff: "🟡" },
                    { name: "Longest Increasing Subsequence", lc: "300", diff: "🟡" },
                    { name: "Partition Equal Subset Sum", lc: "416", diff: "🟡" },
                    { name: "Maximum Sum Circular Subarray", lc: "918", diff: "🟡" },
                    { name: "Max Sum Increasing Subsequence", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/maximum-sum-increasing-subsequence-dp-14/" },
                    { name: "Max Profit in Job Scheduling", lc: "1235", diff: "🔴" },
                    { name: "Combination Sum IV", lc: "377", diff: "🟡" },
                    { name: "Delete and Earn", lc: "740", diff: "🟡" },
                    { name: "Integer Break", lc: "343", diff: "🟡" },
                    { name: "Frog Jump", lc: "403", diff: "🔴" },
                    { name: "Paint House", lc: "256", diff: "🟡" },
                    { name: "Paint Fence", lc: "276", diff: "🟡" },
                    { name: "Minimum Falling Path Sum", lc: "931", diff: "🟡" },
                ],
            },
            {
                name: "Palindrome DP",
                problems: [
                    { name: "Longest Palindromic Substring", lc: "5", diff: "🟡" },
                    { name: "Palindromic Substrings", lc: "647", diff: "🟡" },
                    { name: "Min Insertion Steps for Palindrome", lc: "1312", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 14. 2-D DYNAMIC PROGRAMMING (11 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "2-D DP",
        icon: "📊",
        color: "#a78bfa",
        description: "Grid DP, two-sequence DP, knapsack, interval DP",
        subtopics: [
            {
                name: "Grid DP",
                problems: [
                    { name: "Unique Paths", lc: "62", diff: "🟡" },
                    { name: "Unique Paths II", lc: "63", diff: "🟡" },
                    { name: "Longest Increasing Path in Matrix", lc: "329", diff: "🔴" },
                    { name: "Triangle", lc: "120", diff: "🟡" },
                    { name: "Minimum Path Sum", lc: "64", diff: "🟡" },
                    { name: "Maximal Square", lc: "221", diff: "🟡" },
                    { name: "Count Square Submatrices", lc: "1277", diff: "🟡" },
                ],
            },
            {
                name: "Two-String DP",
                problems: [
                    { name: "Longest Common Subsequence", lc: "1143", diff: "🟡" },
                    { name: "Interleaving String", lc: "97", diff: "🟡" },
                    { name: "Distinct Subsequences", lc: "115", diff: "🔴" },
                    { name: "Edit Distance", lc: "72", diff: "🔴" },
                    { name: "Regular Expression Matching", lc: "10", diff: "🔴" },
                    { name: "Longest Palindromic Subsequence", lc: "516", diff: "🟡" },
                    { name: "Max Length of Repeated Subarray", lc: "718", diff: "🟡" },
                ],
            },
            {
                name: "Knapsack & State DP",
                problems: [
                    { name: "Coin Change II", lc: "518", diff: "🟡" },
                    { name: "Target Sum", lc: "494", diff: "🟡" },
                    { name: "Best Time to Buy/Sell with Cooldown", lc: "309", diff: "🟡" },
                    { name: "Best Time to Buy/Sell Stock III", lc: "123", diff: "🔴" },
                    { name: "Best Time to Buy/Sell Stock IV", lc: "188", diff: "🔴" },
                    { name: "Burst Balloons", lc: "312", diff: "🔴" },
                    { name: "0/1 Knapsack", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
                    { name: "Matrix Chain Multiplication", lc: "GFG", diff: "🔴", link: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/" },
                    { name: "Rod Cutting Problem", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/cutting-a-rod-dp-13/" },
                    { name: "Super Egg Drop", lc: "887", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 15. GREEDY (8 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Greedy",
        icon: "🤑",
        color: "#22d3ee",
        description: "Locally optimal → globally optimal",
        subtopics: [
            {
                name: "Greedy Strategies",
                problems: [
                    { name: "Maximum Subarray", lc: "53", diff: "🟡" },
                    { name: "Jump Game", lc: "55", diff: "🟡" },
                    { name: "Jump Game II", lc: "45", diff: "🟡" },
                    { name: "Gas Station", lc: "134", diff: "🟡" },
                    { name: "Hand of Straights", lc: "846", diff: "🟡" },
                    { name: "Merge Triplets to Form Target", lc: "1899", diff: "🟡" },
                    { name: "Partition Labels", lc: "763", diff: "🟡" },
                    { name: "Valid Parenthesis String", lc: "678", diff: "🟡" },
                    { name: "Text Justification", lc: "68", diff: "🔴" },
                    { name: "Best Time to Buy and Sell Stock II", lc: "122", diff: "🟡" },
                    { name: "Candy", lc: "135", diff: "🔴" },
                    { name: "Assign Cookies", lc: "455", diff: "🟢" },
                    { name: "N Meetings in One Room", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/find-maximum-meetings-in-one-room/" },
                    { name: "Minimum Platforms", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/" },
                    { name: "Job Sequencing Problem", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/job-sequencing-problem/" },
                    { name: "Fractional Knapsack", lc: "GFG", diff: "🟡", link: "https://www.geeksforgeeks.org/fractional-knapsack-problem/" },
                    { name: "Split Array into Consecutive Subsequences", lc: "659", diff: "🟡" },
                    { name: "Car Pooling", lc: "1094", diff: "🟡" },
                    { name: "Queue Reconstruction by Height", lc: "406", diff: "🟡" },
                    { name: "Dota2 Senate", lc: "649", diff: "🟡" },
                    { name: "Advantage Shuffle", lc: "870", diff: "🟡" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 16. INTERVALS (6 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Intervals",
        icon: "📅",
        color: "#fb7185",
        description: "Merge, insert, and schedule interval problems",
        subtopics: [
            {
                name: "Interval Operations",
                problems: [
                    { name: "Insert Interval", lc: "57", diff: "🟡" },
                    { name: "Merge Intervals", lc: "56", diff: "🟡" },
                    { name: "Non-overlapping Intervals", lc: "435", diff: "🟡" },
                    { name: "Meeting Rooms", lc: "252", diff: "🟢" },
                    { name: "Meeting Rooms II", lc: "253", diff: "🟡" },
                    { name: "Minimum Number of Arrows", lc: "452", diff: "🟡" },
                    { name: "Remove Interval", lc: "1272", diff: "🟡" },
                    { name: "Employee Free Time", lc: "759", diff: "🔴" },
                    { name: "Min Interval to Include Each Query", lc: "1851", diff: "🔴" },
                    { name: "Summary Ranges", lc: "228", diff: "🟢" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 17. MATH & GEOMETRY (8 problems)
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Math & Geometry",
        icon: "🔢",
        color: "#facc15",
        description: "Number theory, matrix ops, and mathematical patterns",
        subtopics: [
            {
                name: "Matrix Operations",
                problems: [
                    { name: "Rotate Image", lc: "48", diff: "🟡", component: "EngRotateImage" },
                    { name: "Spiral Matrix", lc: "54", diff: "🟡", component: "EngSpiralMatrix" },
                    { name: "Set Matrix Zeroes", lc: "73", diff: "🟡", component: "EngSetMatrixZeroes" },
                    { name: "Matrix Diagonal Sum", lc: "1572", diff: "🟢", component: "EngMatrixDiagonalSum" },
                    { name: "Design Tic-Tac-Toe", lc: "348", diff: "🟡" },
                ],
            },
            {
                name: "Number Theory & Math",
                problems: [
                    { name: "Happy Number", lc: "202", diff: "🟢" },
                    { name: "Plus One", lc: "66", diff: "🟢" },
                    { name: "Fizz Buzz", lc: "412", diff: "🟢" },
                    { name: "Roman to Integer", lc: "13", diff: "🟢" },
                    { name: "Longest Common Prefix", lc: "14", diff: "🟢" },
                    { name: "Pow(x, n)", lc: "50", diff: "🟡" },
                    { name: "Multiply Strings", lc: "43", diff: "🟡" },
                    { name: "Detect Squares", lc: "2013", diff: "🟡" },
                    { name: "Palindrome Number", lc: "9", diff: "🟢" },
                    { name: "Factorial Trailing Zeroes", lc: "172", diff: "🟡" },
                    { name: "Max Points on a Line", lc: "149", diff: "🔴" },
                ],
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 18. BIT MANIPULATION (7 problems)
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
                    { name: "Sum of Two Integers", lc: "371", diff: "🟡" },
                    { name: "Count Triplets Equal XOR", lc: "1442", diff: "🟡" },
                ],
            },
            {
                name: "Bit Counting & Operations",
                problems: [
                    { name: "Number of 1 Bits", lc: "191", diff: "🟢" },
                    { name: "Counting Bits", lc: "338", diff: "🟢" },
                    { name: "Reverse Bits", lc: "190", diff: "🟢" },
                    { name: "Missing Number", lc: "268", diff: "🟢" },
                    { name: "Reverse Integer", lc: "7", diff: "🟡" },
                    { name: "Add Binary", lc: "67", diff: "🟢" },
                    { name: "Bitwise AND of Numbers Range", lc: "201", diff: "🟡" },
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
