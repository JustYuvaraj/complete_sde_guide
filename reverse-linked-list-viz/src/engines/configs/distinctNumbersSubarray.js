// src/engines/configs/distinctNumbersSubarray.js

export const distinctNumbersSubarrayConfig = {
    title: "Distinct Numbers in Each Subarray",
    subtitle: () => 'Count distinct elements in every window of size k',
    defaults: { nums: [1, 2, 1, 3, 4, 2, 3], k: 4 },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `## GFG — Count Distinct Elements in Every Window of Size K

**Difficulty:** Medium   **Topics:** Array, Sliding Window, Hash Table

---

Given an array of integers and a window size \`k\`, find the **number of distinct elements** in every window of size k.

---

### Examples

**Example 1:**
    Input:  nums = [1,2,1,3,4,2,3], k = 4
    Output: [3, 4, 4, 3]
    Windows: [1,2,1,3]=3 distinct, [2,1,3,4]=4, [1,3,4,2]=4, [3,4,2,3]=3

### Constraints
- 1 <= k <= n <= 10⁵`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Fixed-Size Window + Map

Maintain a frequency map of the current window. The number of keys = number of distinct elements.

## Step 2 — Slide the Window

As the window slides:
- Add new element (increment frequency)
- Remove old element (decrement, delete if 0)
- Count keys in the map

## Key Takeaway
Fixed-window + frequency map = count distinct. The map's key count directly gives you distinct elements. O(1) per slide.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass, O(1) per element |
| **Space** | **O(k)** | Frequency map holds at most k elements |

## Related Problems
- First Negative in Every Window
- Maximum/Minimum of Every Window
All use the same fixed-window sliding pattern.`
        }
    ],

    code: `def countDistinct(nums, k):
    freq = {}
    res = []
    
    for i in range(len(nums)):
        freq[nums[i]] = freq.get(nums[i], 0) + 1
        
        if i >= k:
            old = nums[i - k]
            freq[old] -= 1
            if freq[old] == 0:
                del freq[old]
        
        if i >= k - 1:
            res.append(len(freq))
    
    return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 2, 1, 3, 4, 2, 3];
        const k = args[1] !== undefined ? args[1] : 4;
        const freq = {};
        const res = [];

        yield {
            cl: 1, phase: "init", msg: `Count distinct elements in every window of size k = ${k}`,
            arr: nums, vars: { k },
            map: {}, mapTitle: "Frequency Map"
        };

        for (let i = 0; i < nums.length; i++) {
            freq[nums[i]] = (freq[nums[i]] || 0) + 1;

            yield {
                cl: 5, phase: "build", msg: `Add nums[${i}] = ${nums[i]}. freq[${nums[i]}] = ${freq[nums[i]]}`,
                arr: nums, ptrs: { [Math.max(0, i - k + 1)]: "l", [i]: "r" },
                vars: { i, "nums[i]": nums[i] },
                map: { ...freq }, mapTitle: "Frequency Map", mapActiveKey: String(nums[i])
            };

            if (i >= k) {
                const old = nums[i - k];
                freq[old]--;
                if (freq[old] === 0) delete freq[old];

                yield {
                    cl: 9, phase: "search", msg: `Window full: remove nums[${i - k}] = ${old}`,
                    arr: nums, ptrs: { [i - k + 1]: "l", [i]: "r" },
                    vars: { removed: old },
                    map: { ...freq }, mapTitle: "Frequency Map", mapHighlightKey: String(old)
                };
            }

            if (i >= k - 1) {
                const distinct = Object.keys(freq).length;
                res.push(distinct);

                yield {
                    cl: 14, phase: "build", msg: `Window [${i - k + 1}..${i}]: ${distinct} distinct elements. Result: [${res.join(", ")}]`,
                    arr: nums, ptrs: { [i - k + 1]: "l", [i]: "r" },
                    vars: { distinct, result: `[${res.join(", ")}]` },
                    map: { ...freq }, mapTitle: "Frequency Map"
                };
            }
        }

        yield {
            cl: 16, phase: "done", msg: `All windows processed!`,
            arr: nums, vars: { result: `[${res.join(", ")}]` },
            map: {}, mapTitle: "Frequency Map",
            result: `[${res.join(", ")}]`
        };
    }
};
