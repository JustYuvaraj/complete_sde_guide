// src/engines/configs/subarraySum.js

export const subarraySumConfig = {
    title: "Subarray Sum Equals K",
    subtitle: (args) => `Find total number of continuous subarrays summing to k=${args[1]}`,    defaults: { nums: [1, 1, 1], k: 2 },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return <em>the total number of subarrays whose sum equals to</em> <code>k</code>.</p>

<p>A subarray is a contiguous <strong>non-empty</strong> sequence of elements within an array.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,1,1], k = 2
<strong>Output:</strong> 2
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [1,2,3], k = 3
<strong>Output:</strong> 2
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>
	<li><code>-10<sup>7</sup> &lt;= k &lt;= 10<sup>7</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Core Insight — Prefix Sum + HashMap
If prefixSum[j] - prefixSum[i] == k, then subarray [i+1..j] sums to k.
Store frequency of each prefix sum in a map. For each new prefix sum, check if (prefixSum - k) exists.

## Why Not Sliding Window?
Array can have negative numbers, so the window sum isn't monotonic. Prefix sum + HashMap handles negatives.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass with O(1) map lookups |
| **Space** | **O(n)** | Prefix sum frequency map |`}],

    code: `class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        res = 0
        curSum = 0
        prefixSums = { 0: 1 }
        
        for n in nums:
            curSum += n
            diff = curSum - k
            
            res += prefixSums.get(diff, 0)
            prefixSums[curSum] = 1 + prefixSums.get(curSum, 0)
            
        return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 1, 1];
        const k = args[1] || 2;

        let res = 0;
        let curSum = 0;
        const prefixSums = { 0: 1 };

        yield {
            cl: 3, phase: "init", msg: "Initialize results and running sum",
            arr: nums, vars: { k, res, curSum }, map: { ...prefixSums }, mapTitle: "Prefix Sum Counts"
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 7, phase: "init", msg: `Read nums[${i}] = ${n}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { k, res, curSum, n }, map: { ...prefixSums }
            };

            curSum += n;
            const diff = curSum - k;

            yield {
                cl: 9, phase: "build", msg: `Add to running sum: ${curSum}. Target diff = sum - k = ${diff}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { k, res, curSum, n, diff }, map: { ...prefixSums }
            };

            yield {
                cl: 11, phase: "search", msg: `Check if diff ${diff} exists in prefixSums map`,
                arr: nums, ptrs: { [i]: "n" }, vars: { k, res, curSum, diff },
                map: { ...prefixSums }, mapActiveKey: String(diff), mapStatus: "searching"
            };

            if (prefixSums[diff]) {
                res += prefixSums[diff];
                yield {
                    cl: 11, phase: "build", msg: `Found ${diff}! Add frequency ${prefixSums[diff]} to res. res is now ${res}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { k, res, curSum, diff },
                    map: { ...prefixSums }, mapHighlightKey: String(diff)
                };
            }

            prefixSums[curSum] = (prefixSums[curSum] || 0) + 1;

            yield {
                cl: 12, phase: "build", msg: `Store current prefix sum ${curSum} in map`,
                arr: nums, ptrs: { [i]: "n" }, vars: { k, res, curSum },
                map: { ...prefixSums }, mapActiveKey: String(curSum), mapStatus: "inserting"
            };
        }

        yield {
            cl: 14, phase: "done", msg: `Finished! Found ${res} matching subarrays.`,
            arr: nums, vars: { res }, result: String(res), map: { ...prefixSums }
        };
    }
};
