// ═══════════════════════════════════════════════════════════════════
//  Config: Two Sum (LC #1) — Engine-powered
// ═══════════════════════════════════════════════════════════════════

export const twoSumConfig = {
    title: "Two Sum",
    subtitle: (args) => `LC #1 · nums = [${(args[0] || []).join(",")}], target = ${args[1]} · O(n) Time`,
    fileName: "two_sum.py",
    speed: 1400,
    arrayTitle: "📥 nums[]",

    defaults: { nums: [2, 7, 11, 15], target: 9 },

    inputs: [
        { label: "nums:", type: "array", default: "2,7,11,15", placeholder: "2,7,11,15", flex: "1 1 140px", minLen: 2, maxLen: 8 },
        { label: "target:", type: "number", default: "9", placeholder: "9", flex: "0 0 70px", style: { textAlign: "center" } },
    ],

    panels: ["hashmap"],

    code: [
        { id: 0, text: `def twoSum(nums, target):` },
        { id: 1, text: `    seen = {}` },
        { id: 2, text: `` },
        { id: 3, text: `    for i, num in enumerate(nums):` },
        { id: 4, text: `        comp = target - num` },
        { id: 5, text: `        if comp in seen:` },
        { id: 6, text: `            return [seen[comp], i]` },
        { id: 7, text: `        seen[num] = i` },
        { id: 8, text: `` },
        { id: 9, text: `    return []` },
    ],

    phases: {
        init: { color: "#8b5cf6", label: "INITIALIZE" },
        calc: { color: "#6366f1", label: "COMPLEMENT" },
        check: { color: "#f59e0b", label: "LOOKUP" },
        store: { color: "#3b82f6", label: "STORE →" },
        found: { color: "#10b981", label: "FOUND ✓" },
        done: { color: "#ef4444", label: "NO PAIR ✗" },
    },

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `## LeetCode 1 — Two Sum

**Difficulty:** Easy   **Topics:** Array, Hash Table

---

Given an array of integers \`nums\` and an integer \`target\`, return **indices of the two numbers** such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

---

### Examples

**Example 1:**
    Input:  nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: nums[0] + nums[1] = 2 + 7 = 9

**Example 2:**
    Input:  nums = [3,2,4], target = 6
    Output: [1,2]

### Constraints
- 2 <= nums.length <= 10⁴
- -10⁹ <= nums[i] <= 10⁹
- Only **one valid answer** exists`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Reframe the Problem

Instead of "find two numbers that sum to target", think:
- For each number x, does target - x exist in the array?

This transforms from **pair searching** to **single lookup**.

## Step 2 — What Data Structure?

We need O(1) lookup of "has this value been seen?" with its index.
→ **Hash Map** (value → index)

## Step 3 — The Algorithm

For each element:
1. Calculate complement = target - nums[i]
2. Is complement in the map? → **Found the pair!**
3. If not → store nums[i] → i in the map

## Key Takeaway
- "Find a pair with sum = X" → for each element, check if X - element is already in a hash map. Converts O(n²) brute force to O(n).`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Python Solution
    def twoSum(nums, target):
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per lookup |
| **Space** | **O(n)** | Hash map stores up to n entries |

## Why Not Brute Force?
Two nested loops = O(n²). The hash map reduces to O(n) by trading space for time.`
        }
    ],

    generateSteps(nums, target) {
        const steps = [];
        const map = {};

        steps.push({
            cl: 1, phase: "init",
            array: [...nums], map: { ...map },
            highlights: {}, pointers: {},
            mapActiveKey: null, mapHighlightKey: null, mapStatus: null,
            mapTitle: "Hash Map · value → index",
            msg: "Create empty hash map (seen = {})",
            vars: { target, "len(seen)": 0 },
        });

        for (let i = 0; i < nums.length; i++) {
            const comp = target - nums[i];

            // Calculate complement
            steps.push({
                cl: 4, phase: "calc",
                array: [...nums], map: { ...map },
                highlights: { [i]: "active" },
                pointers: { i },
                mapActiveKey: null, mapHighlightKey: null, mapStatus: null,
                mapTitle: "Hash Map · value → index",
                msg: `comp = ${target} - ${nums[i]} = ${comp}`,
                vars: { i, num: nums[i], target, comp },
            });

            // Check map
            const found = comp in map;
            steps.push({
                cl: 5, phase: "check",
                array: [...nums], map: { ...map },
                highlights: { [i]: "comparing" },
                pointers: { i },
                mapActiveKey: null, mapHighlightKey: String(comp),
                mapStatus: "searching", mapTitle: "Hash Map · value → index",
                msg: `${comp} in seen → ${found ? `YES! At index ${map[comp]}` : "NO, not found"}`,
                vars: { comp, "in seen?": found ? "YES" : "NO" },
            });

            if (found) {
                const j = map[comp];
                steps.push({
                    cl: 6, phase: "found",
                    array: [...nums], map: { ...map },
                    highlights: { [j]: "found", [i]: "found" },
                    pointers: { i },
                    mapActiveKey: null, mapHighlightKey: String(comp),
                    mapStatus: "found", mapTitle: "Hash Map · value → index",
                    msg: `🎉 return [${j}, ${i}] → ${nums[j]} + ${nums[i]} = ${target}`,
                    vars: { return: `[${j}, ${i}]`, sum: `${nums[j]} + ${nums[i]} = ${target}` },
                    result: `nums[${j}] + nums[${i}] = ${nums[j]} + ${nums[i]} = ${target} ✓`,
                });
                return steps;
            }

            map[nums[i]] = i;
            steps.push({
                cl: 7, phase: "store",
                array: [...nums], map: { ...map },
                highlights: { [i]: "inserted" },
                pointers: { i },
                mapActiveKey: String(nums[i]), mapHighlightKey: null,
                mapStatus: "inserting", mapTitle: "Hash Map · value → index",
                msg: `seen[${nums[i]}] = ${i}`,
                vars: { [`seen[${nums[i]}]`]: i, "len(seen)": Object.keys(map).length },
            });
        }

        steps.push({
            cl: 9, phase: "done",
            array: [...nums], map: { ...map },
            highlights: {}, pointers: {},
            msg: "No pair found → return []",
            vars: { return: "[]" },
        });

        return steps;
    },
};
