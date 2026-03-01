// src/engines/configs/firstMissingPositive.js

export const firstMissingPositiveConfig = {
    title: "First Missing Positive",
    subtitle: () => 'Find smallest missing positive integer in O(n) time and O(1) space',    defaults: { nums: [3, 4, -1, 1] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an unsorted integer array <code>nums</code>. Return the <em>smallest positive integer</em> that is <em>not present</em> in <code>nums</code>.</p>

<p>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,0]
<strong>Output:</strong> 3
<strong>Explanation:</strong> The numbers in the range [1,2] are all in the array.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,4,-1,1]
<strong>Output:</strong> 2
<strong>Explanation:</strong> 1 is in the array but 2 is missing.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [7,8,9,11,12]
<strong>Output:</strong> 1
<strong>Explanation:</strong> The smallest positive integer 1 is missing.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Core Insight — Cyclic Sort
Place each number in its "correct" position: nums[i] should be i+1. Then scan for the first mismatch.

## Why Cyclic Sort?
The answer must be in [1, n+1]. So we use the array itself as a hash table. Swap nums[i] to index nums[i]-1.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element swapped at most once |
| **Space** | **O(1)** | Array used as hash table |`}],

    code: `class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        for i in range(n):
            while (1 <= nums[i] <= n and 
                   nums[nums[i] - 1] != nums[i]):
                # Swap nums[i] to its correct position
                correct_idx = nums[i] - 1
                nums[correct_idx], nums[i] = nums[i], nums[correct_idx]
                
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
                
        return n + 1`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [3, 4, -1, 1];
        const n = nums.length;

        yield {
            cl: 3, phase: "init", msg: "Initialize size n. We want numbers 1..n at indices 0..n-1",
            arr: [...nums], vars: { n }
        };

        for (let i = 0; i < n; i++) {
            yield {
                cl: 4, phase: "init", msg: `Examine nums[${i}] = ${nums[i]}`,
                arr: [...nums], ptrs: { [i]: "i" }, vars: { i, "nums[i]": nums[i], n }
            };

            while (1 <= nums[i] && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
                const target = nums[i] - 1;
                yield {
                    cl: 5, phase: "search", msg: `Number ${nums[i]} belongs at index ${target} (${nums[i]} - 1). It is not there yet.`,
                    arr: [...nums], ptrs: { [i]: "i", [target]: "target" }, vars: { i, target, "nums[i]": nums[i] }
                };

                // swap
                const temp = nums[i];
                nums[i] = nums[target];
                nums[target] = temp;

                yield {
                    cl: 8, phase: "build", msg: `Swap complete! Put ${temp} at index ${target}.`,
                    arr: [...nums], ptrs: { [i]: "i", [target]: "target" }, vars: { i, target }
                };
            }

            yield {
                cl: 5, phase: "init", msg: nums[i] <= 0 || nums[i] > n ? `${nums[i]} is out of bounds [1, ${n}], skip it.` : `${nums[i]} is already at correct index ${nums[i] - 1}.`,
                arr: [...nums], ptrs: { [i]: "i" }, vars: { i, "nums[i]": nums[i] }
            };
        }

        yield { cl: 11, phase: "init", msg: "Array is processed. Check first index where number doesn't match index + 1", arr: [...nums], vars: {} };

        for (let i = 0; i < n; i++) {
            if (nums[i] !== i + 1) {
                yield {
                    cl: 12, phase: "search", msg: `At index ${i}, expected ${i + 1}, but found ${nums[i]}!`,
                    arr: [...nums], ptrs: { [i]: "i" }, vars: { i, "expected": i + 1, "found": nums[i] }
                };
                yield {
                    cl: 13, phase: "done", msg: `First missing positive is ${i + 1}!`,
                    arr: [...nums], ptrs: { [i]: "i" }, vars: { i }, result: String(i + 1)
                };
                return;
            } else {
                yield {
                    cl: 12, phase: "search", msg: `At index ${i}, found ${i + 1}. This is correct.`,
                    arr: [...nums], ptrs: { [i]: "i" }, vars: { i, "found": nums[i] }
                };
            }
        }

        yield {
            cl: 15, phase: "done", msg: `All numbers 1 to ${n} present. First missing is ${n + 1}.`,
            arr: [...nums], vars: { n }, result: String(n + 1)
        };
    }
};
