// src/engines/configs/rotateArray.js

export const rotateArrayConfig = {
    title: "Rotate Array",
    subtitle: (args) => `Rotate an array to the right by k=${args[1]} steps`,    defaults: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps, where <code>k</code> is non-negative.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,3,4,5,6,7], k = 3
<strong>Output:</strong> [5,6,7,1,2,3,4]
<strong>Explanation:</strong>
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [-1,-100,3,99], k = 2
<strong>Output:</strong> [3,99,-1,-100]
<strong>Explanation:</strong> 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
	<li><code>0 &lt;= k &lt;= 10<sup>5</sup></code></li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong></p>

<ul>
	<li>Try to come up with as many solutions as you can. There are at least <strong>three</strong> different ways to solve this problem.</li>
	<li>Could you do it in-place with <code>O(1)</code> extra space?</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Triple Reverse Trick
1. Reverse entire array
2. Reverse first k elements
3. Reverse remaining n-k elements

## Why It Works
Reversing "flips" the array, then partial reverses restore correct order within each half. O(n) time, O(1) space.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Three reverses = 2n operations |
| **Space** | **O(1)** | In-place reversal |`}],

    code: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        k = k % len(nums)
        
        def reverse(l, r):
            while l < r:
                nums[l], nums[r] = nums[r], nums[l]
                l, r = l + 1, r - 1
                
        reverse(0, len(nums) - 1)
        reverse(0, k - 1)
        reverse(k, len(nums) - 1)`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 2, 3, 4, 5, 6, 7];
        const originalK = args[1] || 3;
        const n = nums.length;

        const k = originalK % n;

        yield {
            cl: 3, phase: "init", msg: "Calculate effective k (k % len(nums))",
            arr: [...nums], vars: { "k (original)": originalK, "len(nums)": n }
        };

        yield {
            cl: 3, phase: "build", msg: `Effective k is ${k}`,
            arr: [...nums], vars: { k, originalK }
        };

        function* reverseVis(l, r, stepMsg) {
            yield {
                cl: 5, phase: "init", msg: `Call reverse(l=${l}, r=${r}) - ${stepMsg}`,
                arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r }
            };

            while (l < r) {
                yield {
                    cl: 7, phase: "search", msg: `Swapping nums[${l}] (${nums[l]}) and nums[${r}] (${nums[r]})`,
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r }
                };

                const temp = nums[l];
                nums[l] = nums[r];
                nums[r] = temp;

                yield {
                    cl: 7, phase: "build", msg: `Swapped!`,
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r }
                };

                l++;
                r--;

                yield {
                    cl: 8, phase: "init", msg: "Move pointers inward (l++, r--)",
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r }
                };
            }
        }

        yield* reverseVis(0, n - 1, "Reverse the entire array");
        yield { cl: 10, phase: "done", msg: "First reverse complete. Entire array is reversed.", arr: [...nums], vars: { k } };

        yield* reverseVis(0, k - 1, "Reverse the first k elements");
        yield { cl: 11, phase: "done", msg: "Second reverse complete. First k elements are in place.", arr: [...nums], vars: { k } };

        yield* reverseVis(k, n - 1, "Reverse the remaining elements");

        yield {
            cl: 12, phase: "done", msg: "Array is fully rotated!",
            arr: [...nums], vars: { k }, result: JSON.stringify(nums)
        };
    }
};
