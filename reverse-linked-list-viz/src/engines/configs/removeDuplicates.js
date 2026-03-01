// src/engines/configs/removeDuplicates.js

export const removeDuplicatesConfig = {
    title: "Remove Duplicates from Sorted Array",
    subtitle: () => "Remove duplicates in-place such that each unique element appears only once",    defaults: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a> such that each unique element appears only <strong>once</strong>. The <strong>relative order</strong> of the elements should be kept the <strong>same</strong>.</p>

<p>Consider the number of <em>unique elements</em> in&nbsp;<code>nums</code> to be <code>k<strong>​​​​​​​</strong></code>​​​​​​​. <meta charset="UTF-8" />After removing duplicates, return the number of unique elements&nbsp;<code>k</code>.</p>

<p><meta charset="UTF-8" />The first&nbsp;<code>k</code>&nbsp;elements of&nbsp;<code>nums</code>&nbsp;should contain the unique numbers in <strong>sorted order</strong>. The remaining elements beyond index&nbsp;<code>k - 1</code>&nbsp;can be ignored.</p>

<p><strong>Custom Judge:</strong></p>

<p>The judge will test your solution with the following code:</p>

<pre>
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i &lt; k; i++) {
    assert nums[i] == expectedNums[i];
}
</pre>

<p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,1,2]
<strong>Output:</strong> 2, nums = [1,2,_]
<strong>Explanation:</strong> Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,0,1,1,1,2,2,3,3,4]
<strong>Output:</strong> 5, nums = [0,1,2,3,4,_,_,_,_,_]
<strong>Explanation:</strong> Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>-100 &lt;= nums[i] &lt;= 100</code></li>
	<li><code>nums</code> is sorted in <strong>non-decreasing</strong> order.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers — Slow/Fast
Slow pointer tracks the write position. Fast pointer scans ahead.
When fast finds a new value (≠ slow's value), write it at slow+1.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | In-place |`}],

    code: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        l = 1
        
        for r in range(1, len(nums)):
            if nums[r] != nums[r - 1]:
                nums[l] = nums[r]
                l += 1
                
        return l`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];

        if (nums.length === 0) {
            yield { cl: 8, phase: "done", msg: "Empty array. Return 0.", arr: [], vars: {}, result: "0" };
            return;
        }

        let l = 1;

        yield {
            cl: 3, phase: "init", msg: "Initialize write pointer 'l' to 1. The first element (index 0) is always 'unique' initially.",
            arr: [...nums], ptrs: { [l]: "l" }, vars: { l }
        };

        for (let r = 1; r < nums.length; r++) {
            yield {
                cl: 6, phase: "search", msg: `Read pointer 'r' at index ${r}. Compare nums[${r}] (${nums[r]}) with preceding element nums[${r - 1}] (${nums[r - 1]})`,
                arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r", [r - 1]: "r-1" }, vars: { l, r }
            };

            if (nums[r] !== nums[r - 1]) {
                yield {
                    cl: 7, phase: "build", msg: `Unique element discovered! ${nums[r]} is different from ${nums[r - 1]}. Copy into write pointer 'l'.`,
                    arr: [...nums], ptrs: { [l]: "write", [r]: l === r ? undefined : "read" }, vars: { l, r }
                };

                nums[l] = nums[r];

                yield {
                    cl: 8, phase: "build", msg: `Copied ${nums[r]} into index ${l}. Now increment 'l'.`,
                    arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r" }, vars: { l, r }
                };

                l += 1;
            } else {
                yield {
                    cl: 6, phase: "search", msg: `Duplicate element! ${nums[r]} == ${nums[r - 1]}. Do not copy. Advance 'r'.`,
                    arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r" }, vars: { l, r }
                };
            }
        }

        const finalArr = nums.map((n, idx) => idx < l ? `[${n}]` : `_${n}_`);

        yield {
            cl: 10, phase: "done", msg: `Traversal finished! The first ${l} elements hold the unique values.`,
            arr: finalArr, ptrs: { [l]: "Length" }, vars: { l }, result: String(l)
        };
    }
};
