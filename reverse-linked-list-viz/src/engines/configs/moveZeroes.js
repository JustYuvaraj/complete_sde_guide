// ═══════════════════════════════════════════════════════════════════
//  Config: Move Zeroes (LC #283) — Two Pointer Visualization
// ═══════════════════════════════════════════════════════════════════

export const moveZeroesConfig = {
    title: "Move Zeroes",
    subtitle: (args) => `LC #283 · nums = [${(args[0] || []).join(",")}] · O(n) Time, O(1) Space`,
    fileName: "move_zeroes.py",
    speed: 1200,
    arrayTitle: "📊 nums[] — move all 0s to end, keep relative order",

    defaults: { nums: [0, 1, 0, 3, 12] },

    inputs: [
        { label: "nums:", type: "array", default: "0,1,0,3,12", placeholder: "0,1,0,3,12", flex: "1 1 200px", minLen: 1, maxLen: 12 },
    ],

    panels: [],

    code: [
        { id: 0, text: `def moveZeroes(nums):` },
        { id: 1, text: `    write = 0` },
        { id: 2, text: `` },
        { id: 3, text: `    for read in range(len(nums)):` },
        { id: 4, text: `        if nums[read] != 0:` },
        { id: 5, text: `            nums[write], nums[read] = nums[read], nums[write]` },
        { id: 6, text: `            write += 1` },
        { id: 7, text: `` },
        { id: 8, text: `    return nums` },
    ],

    phases: {
        init: { color: "#8b5cf6", label: "INITIALIZE" },
        check: { color: "#6366f1", label: "CHECK" },
        skip: { color: "#64748b", label: "SKIP ZERO" },
        swap: { color: "#f59e0b", label: "SWAP" },
        advance: { color: "#3b82f6", label: "ADVANCE" },
        done: { color: "#10b981", label: "COMPLETE ✓" },
    },

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an integer array <code>nums</code>, move all <code>0</code>&#39;s to the end of it while maintaining the relative order of the non-zero elements.</p>

<p><strong>Note</strong> that you must do this in-place without making a copy of the array.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [0,1,0,3,12]
<strong>Output:</strong> [1,3,12,0,0]
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [0]
<strong>Output:</strong> [0]
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> Could you minimize the total number of operations done?
`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Two Pointer Technique

Use two pointers:
- **write**: where to place the next non-zero
- **read**: scans through the array

## Step 2 — The Logic

For each element:
1. If nums[read] != 0 → swap with nums[write], then write++
2. If nums[read] == 0 → skip, just advance read

## Step 3 — Why It Works

- All non-zero values get placed at the front in order
- Zeros naturally bubble to the end
- The swap ensures we don't lose any values

## Key Takeaway
- "Partition array in-place" → use **write pointer** pattern. Read pointer scans, write pointer tracks where to place valid elements.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Python Solution
    def moveZeroes(nums):
        write = 0
        for read in range(len(nums)):
            if nums[read] != 0:
                nums[write], nums[read] = nums[read], nums[write]
                write += 1

## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass through array |
| **Space** | **O(1)** | In-place, no extra space |`
        }
    ],

    generateSteps(nums) {
        const steps = [];
        const arr = [...nums];

        steps.push({
            cl: 1, phase: "init",
            array: [...arr],
            highlights: {}, pointers: { write: 0 },
            msg: "Initialize write pointer at 0",
            vars: { write: 0, "len(nums)": arr.length },
        });

        let write = 0;
        for (let read = 0; read < arr.length; read++) {
            // Check if non-zero
            const isNonZero = arr[read] !== 0;
            steps.push({
                cl: 4, phase: "check",
                array: [...arr],
                highlights: { [read]: "active" },
                pointers: { write, read },
                msg: `nums[${read}] = ${arr[read]} → ${isNonZero ? "non-zero! swap" : "zero, skip"}`,
                vars: { read, write, [`nums[${read}]`]: arr[read], "!= 0?": isNonZero ? "YES" : "NO" },
            });

            if (isNonZero) {
                if (read !== write) {
                    // Show swap
                    [arr[write], arr[read]] = [arr[read], arr[write]];
                    steps.push({
                        cl: 5, phase: "swap",
                        array: [...arr],
                        highlights: { [write]: "swapped", [read]: "swapped" },
                        pointers: { write, read },
                        msg: `Swap nums[${write}] ↔ nums[${read}]`,
                        vars: { [`nums[${write}]`]: arr[write], [`nums[${read}]`]: arr[read] },
                    });
                } else {
                    steps.push({
                        cl: 5, phase: "swap",
                        array: [...arr],
                        highlights: { [write]: "active" },
                        pointers: { write, read },
                        msg: `write == read, no swap needed`,
                        vars: { write, read },
                    });
                }
                write++;
                steps.push({
                    cl: 6, phase: "advance",
                    array: [...arr],
                    highlights: Object.fromEntries(
                        [...Array(write)].map((_, i) => [i, "sorted"])
                    ),
                    pointers: { write, read },
                    msg: `write++ → ${write}`,
                    vars: { write },
                });
            } else {
                steps.push({
                    cl: 3, phase: "skip",
                    array: [...arr],
                    highlights: { [read]: "dimmed" },
                    pointers: { write, read },
                    msg: `Zero at index ${read}, keep scanning`,
                    vars: { read, write },
                });
            }
        }

        const finalHighlights = {};
        arr.forEach((v, i) => { finalHighlights[i] = v !== 0 ? "sorted" : "dimmed"; });
        steps.push({
            cl: 8, phase: "done",
            array: [...arr],
            highlights: finalHighlights,
            pointers: {},
            msg: `✅ Done! Result: [${arr.join(", ")}]`,
            vars: { result: `[${arr.join(",")}]` },
            result: `[${arr.join(", ")}]`,
        });

        return steps;
    },
};
