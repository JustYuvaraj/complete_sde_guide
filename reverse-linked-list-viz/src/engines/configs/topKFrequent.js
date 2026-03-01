// src/engines/configs/topKFrequent.js

export const topKFrequentConfig = {
    title: "Top K Frequent Elements",
    subtitle: (args) => `Find the top ${args[1]} most frequent elements in array`,
    defaults: { nums: [1, 1, 1, 2, 2, 3], k: 2 },

    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1,1,1,2,2,3], k = 2</span></p>

<p><strong>Output:</strong> <span class="example-io">[1,2]</span></p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1], k = 1</span></p>

<p><strong>Output:</strong> <span class="example-io">[1]</span></p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">nums = [1,2,1,2,1,2,3,1,3,2], k = 2</span></p>

<p><strong>Output:</strong> <span class="example-io">[1,2]</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.</li>
	<li>It is <strong>guaranteed</strong> that the answer is <strong>unique</strong>.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong> Your algorithm&#39;s time complexity must be better than <code>O(n log n)</code>, where n is the array&#39;s size.</p>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Count Frequencies
Build a HashMap: number → frequency. O(n).

## Step 2 — Bucket Sort Trick
Create buckets indexed by frequency (0 to n). Place each number in its frequency bucket.
Scan buckets from high to low, collect k elements.

## Why Bucket Sort?
- Heap solution: O(n log k) — good but not optimal
- Bucket sort: O(n) — frequencies are bounded by n, so buckets have fixed range
- This is the **optimal** approach`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Count + bucket sort |
| **Space** | **O(n)** | Frequency map + buckets |`
        }
    ],

    code: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = {}
        freq = [[] for i in range(len(nums) + 1)]
        
        for n in nums:
            count[n] = 1 + count.get(n, 0)
            
        for n, c in count.items():
            freq[c].append(n)
            
        res = []
        for i in range(len(freq) - 1, 0, -1):
            for n in freq[i]:
                res.append(n)
                if len(res) == k:
                    return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 1, 1, 2, 2, 3];
        const k = args[1] || 2;

        const count = {};
        const freq = Array(nums.length + 1).fill().map(() => []);

        yield {
            cl: 3, phase: "init", msg: "Initialize count map and bucket array",
            arr: nums, vars: { k }, map: {}, mapTitle: "Frequency Map"
        };

        yield { cl: 4, phase: "build", msg: "Create 'freq' buckets array (index = frequency)", arr: freq.map(f => `[${f.join(",")}]`), vars: { k }, map: {} };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];
            count[n] = (count[n] || 0) + 1;

            yield {
                cl: 7, phase: "build", msg: `Count occurrence of '${n}'`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n },
                map: { ...count }, mapActiveKey: String(n), mapStatus: "inserting"
            };
        }

        yield { cl: 9, phase: "init", msg: "Map elements into buckets by their frequency", arr: freq.map(f => `[${f.join(",")}]`), vars: {}, map: { ...count } };

        for (const [n, c] of Object.entries(count)) {
            freq[c] = [...freq[c], parseInt(n)];
            yield {
                cl: 10, phase: "build", msg: `Element ${n} occurred ${c} times. Add to bucket ${c}`,
                arr: freq.map((f, i) => i === parseInt(c) ? `[${f.join(",")}] <=` : `[${f.join(",")}]`),
                ptrs: { [c]: "freq[c]" },
                vars: { n, c }, map: { ...count }, mapHighlightKey: n
            };
        }

        const res = [];
        yield { cl: 12, phase: "init", msg: "Gather elements starting from the highest frequency bucket", arr: freq.map(f => `[${f.join(",")}]`), vars: { k, res: "[]" }, map: { ...count } };

        for (let i = freq.length - 1; i > 0; i--) {
            yield {
                cl: 13, phase: "search", msg: `Checking bucket ${i}`,
                arr: freq.map(f => `[${f.join(",")}]`), ptrs: { [i]: "i" }, vars: { k }, map: { ...count }
            };

            for (const n of freq[i]) {
                res.push(n);
                yield {
                    cl: 15, phase: "build", msg: `Found ${n} in bucket! Add to result.`,
                    arr: freq.map(f => `[${f.join(",")}]`), ptrs: { [i]: "i" }, vars: { k, n }, result: JSON.stringify(res), map: { ...count }
                };

                if (res.length === k) {
                    yield {
                        cl: 17, phase: "done", msg: `Result length is exactly k(${k}). We are done!`,
                        arr: [], vars: { k }, result: JSON.stringify(res), map: { ...count }
                    };
                    return;
                }
            }
        }
    }
};
