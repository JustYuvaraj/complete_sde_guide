// ═══════════════════════════════════════════════════════════════════
//  Config: Contains Duplicate (LC #217) — HashSet Visualization
// ═══════════════════════════════════════════════════════════════════

export const containsDuplicateConfig = {
    title: "Contains Duplicate",
    subtitle: (args) => `LC #217 · nums = [${(args[0] || []).join(",")}] · O(n) Time`,
    fileName: "contains_duplicate.py",
    speed: 1200,
    arrayTitle: "📊 nums[]",

    defaults: { nums: [1, 2, 3, 1] },

    inputs: [
        { label: "nums:", type: "array", default: "1,2,3,1", placeholder: "1,2,3,1", flex: "1 1 200px", minLen: 1, maxLen: 10 },
    ],

    panels: ["hashset"],

    code: [
        { id: 0, text: `def containsDuplicate(nums):` },
        { id: 1, text: `    seen = set()` },
        { id: 2, text: `` },
        { id: 3, text: `    for num in nums:` },
        { id: 4, text: `        if num in seen:` },
        { id: 5, text: `            return True` },
        { id: 6, text: `        seen.add(num)` },
        { id: 7, text: `` },
        { id: 8, text: `    return False` },
    ],

    phases: {
        init: { color: "#8b5cf6", label: "INITIALIZE" },
        check: { color: "#f59e0b", label: "LOOKUP" },
        found: { color: "#10b981", label: "DUPLICATE ✓" },
        add: { color: "#3b82f6", label: "ADD →" },
        done: { color: "#ef4444", label: "NO DUPLICATES" },
    },

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1,2,3,1]</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>

<p><strong>Explanation:</strong></p>

<p>The element 1 occurs at the indices 0 and 3.</p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1,2,3,4]</span></p>

<p><strong>Output:</strong> <span class="example-io">false</span></p>

<p><strong>Explanation:</strong></p>

<p>All elements are distinct.</p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1,1,1,3,3,4,3,2,4,2]</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — What Are We Really Asking?

"Does any element repeat?" → "Have I seen this element before?"

## Step 2 — Data Structure

We need O(1) lookup for "have I seen this?" → **Hash Set**

## Step 3 — The Algorithm

For each element:
1. Is it already in the set? → **Duplicate found!** Return True
2. Not in the set? → Add it

## Key Takeaway
- "Check for duplicates" → use a **Hash Set** for O(1) membership checking. Single pass = O(n) total.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Python Solution
    def containsDuplicate(nums):
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per set operation |
| **Space** | **O(n)** | Set stores up to n elements |

## Alternative: Sorting
Sort first → check adjacent pairs. O(n log n) time, O(1) space. Hash Set is faster.`
        }
    ],

    generateSteps(nums) {
        const steps = [];
        const seen = new Set();

        steps.push({
            cl: 1, phase: "init",
            array: [...nums], set: [], highlights: {}, pointers: {},
            setActiveValue: null, setHighlightValue: null, setStatus: null,
            setTitle: "Hash Set · seen",
            msg: "Create empty set (seen = set())",
            vars: { "len(seen)": 0 },
        });

        for (let i = 0; i < nums.length; i++) {
            const num = nums[i];
            const isDup = seen.has(num);

            // Check
            steps.push({
                cl: 4, phase: "check",
                array: [...nums], set: [...seen], highlights: { [i]: "comparing" },
                pointers: { i },
                setActiveValue: null, setHighlightValue: num,
                setStatus: "searching", setTitle: "Hash Set · seen",
                msg: `${num} in seen → ${isDup ? "YES! Duplicate found!" : "NO, first time"}`,
                vars: { i, num, "in seen?": isDup ? "YES" : "NO" },
            });

            if (isDup) {
                // Find the first occurrence
                const firstIdx = nums.indexOf(num);
                steps.push({
                    cl: 5, phase: "found",
                    array: [...nums], set: [...seen],
                    highlights: { [firstIdx]: "found", [i]: "found" },
                    pointers: { i },
                    setHighlightValue: num, setStatus: "found",
                    setTitle: "Hash Set · seen",
                    msg: `🎉 Duplicate! ${num} appeared at index ${firstIdx} and ${i}`,
                    vars: { return: "True", duplicate: num },
                    result: `True — ${num} is duplicated at indices [${firstIdx}, ${i}]`,
                });
                return steps;
            }

            seen.add(num);
            steps.push({
                cl: 6, phase: "add",
                array: [...nums], set: [...seen],
                highlights: { [i]: "inserted" },
                pointers: { i },
                setActiveValue: num, setHighlightValue: null,
                setStatus: "inserting", setTitle: "Hash Set · seen",
                msg: `seen.add(${num})`,
                vars: { [`seen`]: `{${[...seen].join(",")}}`, "len(seen)": seen.size },
            });
        }

        steps.push({
            cl: 8, phase: "done",
            array: [...nums], set: [...seen],
            highlights: Object.fromEntries(nums.map((_, i) => [i, "sorted"])),
            pointers: {},
            msg: "All elements are unique → return False",
            vars: { return: "False" },
            result: "False — no duplicates found",
        });

        return steps;
    },
};
