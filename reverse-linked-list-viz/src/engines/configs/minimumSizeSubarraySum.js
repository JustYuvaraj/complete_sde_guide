// src/engines/configs/minimumSizeSubarraySum.js

export const minimumSizeSubarraySumConfig = {
    title: "Minimum Size Subarray Sum",
    subtitle: () => 'Find the minimal length subarray whose sum ≥ target',
    defaults: { target: 7, nums: [2, 3, 1, 2, 4, 3] },
    panels: [],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return <em>the <strong>minimal length</strong> of a </em><span data-keyword="subarray-nonempty"><em>subarray</em></span><em> whose sum is greater than or equal to</em> <code>target</code>. If there is no such subarray, return <code>0</code> instead.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> target = 7, nums = [2,3,1,2,4,3]
<strong>Output:</strong> 2
<strong>Explanation:</strong> The subarray [4,3] has the minimal length under the problem constraint.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> target = 4, nums = [1,4,4]
<strong>Output:</strong> 1
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> target = 11, nums = [1,1,1,1,1,1,1,1]
<strong>Output:</strong> 0
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>1 &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> If you have figured out the <code>O(n)</code> solution, try coding another solution of which the time complexity is <code>O(n log(n))</code>.
`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Why Sliding Window?

All values are positive, so expanding the window only increases the sum, and shrinking decreases it. This monotonic property makes sliding window perfect.

## Step 2 — The Strategy

1. Expand right to increase sum
2. When sum ≥ target, try shrinking from left to find the minimum length
3. Track the smallest valid window

## Step 3 — The Algorithm

1. l = 0, total = 0, res = ∞
2. For each r: add nums[r] to total
3. While total ≥ target:
   - res = min(res, r - l + 1)
   - Subtract nums[l], l++
4. Return res (or 0 if ∞)

## Key Takeaway
"Minimum subarray with property X" + positive values → shrinkable sliding window. Expand to satisfy, shrink to minimize.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element added/removed at most once |
| **Space** | **O(1)** | Just pointers and variables |

## Follow-up
Can you do it in O(n log n)? Yes — using prefix sums + binary search. But the sliding window approach is optimal.`
        }
    ],

    code: `class Solution:
    def minSubArrayLen(self, target, nums):
        l = 0
        total = 0
        res = float('inf')
        
        for r in range(len(nums)):
            total += nums[r]
            
            while total >= target:
                res = min(res, r - l + 1)
                total -= nums[l]
                l += 1
        
        return res if res != float('inf') else 0`.split("\n"),

    generator: function* (args) {
        const target = args[0] !== undefined ? args[0] : 7;
        const nums = args[1] || [2, 3, 1, 2, 4, 3];
        let l = 0, total = 0, res = Infinity;

        yield {
            cl: 2, phase: "init", msg: `Find shortest subarray with sum ≥ ${target}`,
            arr: nums, vars: { target, l: 0, total: 0, res: "∞" }
        };

        for (let r = 0; r < nums.length; r++) {
            total += nums[r];

            yield {
                cl: 7, phase: "build", msg: `Add nums[${r}] = ${nums[r]}. total = ${total}`,
                arr: nums, ptrs: { [l]: "l", [r]: "r" },
                vars: { l, r, total, target, res: res === Infinity ? "∞" : res }
            };

            while (total >= target) {
                const windowLen = r - l + 1;
                if (windowLen < res) {
                    res = windowLen;
                    yield {
                        cl: 10, phase: "build", msg: `total ${total} ≥ target ${target}! Window [${l}..${r}], length = ${res}. New best!`,
                        arr: nums, ptrs: { [l]: "l", [r]: "r" },
                        vars: { l, r, total, window_len: windowLen, res }
                    };
                } else {
                    yield {
                        cl: 10, phase: "search", msg: `total ${total} ≥ target ${target}. Window length ${windowLen} ≥ best ${res}. Shrink.`,
                        arr: nums, ptrs: { [l]: "l", [r]: "r" },
                        vars: { l, r, total, window_len: windowLen, res }
                    };
                }
                total -= nums[l];
                yield {
                    cl: 12, phase: "search", msg: `Shrink: remove nums[${l}] = ${nums[l]}. total = ${total}. l → ${l + 1}`,
                    arr: nums, ptrs: { [l]: "l", [r]: "r" },
                    vars: { removing: nums[l], total, l: l + 1 }
                };
                l++;
            }
        }

        const answer = res === Infinity ? 0 : res;
        yield {
            cl: 14, phase: "done", msg: answer === 0
                ? "No subarray found with sum ≥ target"
                : `Minimum subarray length = ${answer}`,
            arr: nums, vars: { res: answer },
            result: `${answer}`
        };
    }
};
