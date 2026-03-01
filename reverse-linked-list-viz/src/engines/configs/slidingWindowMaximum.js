// src/engines/configs/slidingWindowMaximum.js

export const slidingWindowMaximumConfig = {
    title: "Sliding Window Maximum",
    subtitle: () => 'Find the maximum in each sliding window of size k',
    defaults: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
    panels: [],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>You are given an array of integers&nbsp;<code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position.</p>

<p>Return <em>the max sliding window</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,3,-1,-3,5,3,6,7], k = 3
<strong>Output:</strong> [3,3,5,5,6,7]
<strong>Explanation:</strong> 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       <strong>3</strong>
 1 [3  -1  -3] 5  3  6  7       <strong>3</strong>
 1  3 [-1  -3  5] 3  6  7      <strong> 5</strong>
 1  3  -1 [-3  5  3] 6  7       <strong>5</strong>
 1  3  -1  -3 [5  3  6] 7       <strong>6</strong>
 1  3  -1  -3  5 [3  6  7]      <strong>7</strong>
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [1], k = 1
<strong>Output:</strong> [1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>1 &lt;= k &lt;= nums.length</code></li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Why Not max() Each Window?

Naive: compute max of each window = O(n·k). Too slow for n = 10⁵.

## Step 2 — Monotonic Decreasing Deque

Maintain a deque of **indices** where values are in decreasing order.
- Front = always the max of current window
- When adding nums[i], pop all smaller elements from back (they'll never be max)
- When front falls outside window, pop it

## Step 3 — The Algorithm

1. For each index i:
   - Remove front if outside window (deq[0] < i - k + 1)
   - Pop back while nums[deq.back] < nums[i]
   - Push i
   - If i >= k-1, front is the window max

## Key Takeaway
**Monotonic deque** pattern: maintain elements in sorted order to get min/max in O(1). Core tool for sliding window problems.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element pushed/popped at most once |
| **Space** | **O(k)** | Deque holds at most k elements |

## Pattern
Monotonic deque is used in many problems: Next Greater Element, Stock Span, Maximum in All Subarrays, etc.`
        }
    ],

    code: `from collections import deque

class Solution:
    def maxSlidingWindow(self, nums, k):
        deq = deque()  # stores indices
        res = []
        
        for i in range(len(nums)):
            # Remove indices outside window
            while deq and deq[0] < i - k + 1:
                deq.popleft()
            
            # Remove smaller elements
            while deq and nums[deq[-1]] < nums[i]:
                deq.pop()
            
            deq.append(i)
            
            if i >= k - 1:
                res.append(nums[deq[0]])
        
        return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 3, -1, -3, 5, 3, 6, 7];
        const k = args[1] !== undefined ? args[1] : 3;
        const deq = []; // stores indices
        const res = [];

        yield {
            cl: 4, phase: "init", msg: `Find max in each window of size k = ${k}. Using monotonic decreasing deque.`,
            arr: nums, vars: { k, deque: "[]", result: "[]" }
        };

        for (let i = 0; i < nums.length; i++) {
            yield {
                cl: 7, phase: "search", msg: `Process index ${i}, value ${nums[i]}`,
                arr: nums, ptrs: { [i]: "i", [Math.max(0, i - k + 1)]: "l", ...(deq.length > 0 ? { [deq[0]]: "max" } : {}) },
                vars: { i, "nums[i]": nums[i], deque: `[${deq.map(j => `${j}(${nums[j]})`).join(", ")}]` }
            };

            // Remove out-of-window indices
            while (deq.length > 0 && deq[0] < i - k + 1) {
                const removed = deq.shift();
                yield {
                    cl: 9, phase: "search", msg: `Deque front ${removed} is outside window. Remove.`,
                    arr: nums, ptrs: { [i]: "i", [i - k + 1]: "l" },
                    vars: { removing_idx: removed, deque: `[${deq.map(j => `${j}(${nums[j]})`).join(", ")}]` }
                };
            }

            // Remove smaller elements from back
            while (deq.length > 0 && nums[deq[deq.length - 1]] < nums[i]) {
                const popped = deq.pop();
                yield {
                    cl: 13, phase: "search", msg: `nums[${popped}]=${nums[popped]} < nums[${i}]=${nums[i]}. Pop from back.`,
                    arr: nums, ptrs: { [i]: "i", [popped]: "pop" },
                    vars: { popping: `${popped}(${nums[popped]})`, deque: `[${deq.map(j => `${j}(${nums[j]})`).join(", ")}]` }
                };
            }

            deq.push(i);

            yield {
                cl: 15, phase: "build", msg: `Push index ${i} (val ${nums[i]}). Deque front = max = ${nums[deq[0]]}`,
                arr: nums, ptrs: { [i]: "i", [deq[0]]: "max", [Math.max(0, i - k + 1)]: "l" },
                vars: { deque: `[${deq.map(j => `${j}(${nums[j]})`).join(", ")}]` }
            };

            if (i >= k - 1) {
                res.push(nums[deq[0]]);
                yield {
                    cl: 18, phase: "build", msg: `Window [${i - k + 1}..${i}] max = ${nums[deq[0]]}. Result so far: [${res.join(", ")}]`,
                    arr: nums, ptrs: { [i - k + 1]: "l", [i]: "r", [deq[0]]: "max" },
                    vars: { window_max: nums[deq[0]], result: `[${res.join(", ")}]` }
                };
            }
        }

        yield {
            cl: 20, phase: "done", msg: `All window maximums computed!`,
            arr: nums, vars: { result: `[${res.join(", ")}]` },
            result: `[${res.join(", ")}]`
        };
    }
};
