// src/engines/configs/removeDuplicatesII.js

export const removeDuplicatesIIConfig = {
    title: "Remove Duplicates from Sorted Array II",
    subtitle: () => "Remove duplicates such that each element appears at most TWICE",    defaults: { nums: [1, 1, 1, 2, 2, 3] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove some duplicates <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a> such that each unique element appears <strong>at most twice</strong>. The <strong>relative order</strong> of the elements should be kept the <strong>same</strong>.</p>

<p>Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the <strong>first part</strong> of the array <code>nums</code>. More formally, if there are <code>k</code> elements after removing the duplicates, then the first <code>k</code> elements of <code>nums</code>&nbsp;should hold the final result. It does not matter what you leave beyond the first&nbsp;<code>k</code>&nbsp;elements.</p>

<p>Return <code>k</code><em> after placing the final result in the first </em><code>k</code><em> slots of </em><code>nums</code>.</p>

<p>Do <strong>not</strong> allocate extra space for another array. You must do this by <strong>modifying the input array <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a></strong> with O(1) extra memory.</p>

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
<strong>Input:</strong> nums = [1,1,1,2,2,3]
<strong>Output:</strong> 5, nums = [1,1,2,2,3,_]
<strong>Explanation:</strong> Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,0,1,1,1,1,2,3,3]
<strong>Output:</strong> 7, nums = [0,0,1,1,2,3,3,_,_]
<strong>Explanation:</strong> Your function should return k = 7, with the first seven elements of nums being 0, 0, 1, 1, 2, 3 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>nums</code> is sorted in <strong>non-decreasing</strong> order.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Generalized Pattern
Write pointer k. For each element: if k < 2 OR nums[i] ≠ nums[k-2] → write and increment k.

## Why k-2?
Allows at most 2 of the same. Generalizes to "at most N" by checking nums[k-N].`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | In-place |`}],

    code: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        l = 0
        r = 0
        
        while r < len(nums):
            count = 1
            while r + 1 < len(nums) and nums[r] == nums[r + 1]:
                r += 1
                count += 1
                
            for i in range(min(2, count)):
                nums[l] = nums[r]
                l += 1
                
            r += 1
            
        return l`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 1, 1, 2, 2, 3];

        let l = 0;
        let r = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize write pointer 'l' and read pointer 'r' at index 0.",
            arr: [...nums], ptrs: { [l]: "l,r" }, vars: { l, r }
        };

        while (r < nums.length) {
            let count = 1;

            yield {
                cl: 7, phase: "search", msg: `Counting occurrences for element ${nums[r]}`,
                arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r" }, vars: { l, r, count }
            };

            while (r + 1 < nums.length && nums[r] === nums[r + 1]) {
                r += 1;
                count += 1;

                yield {
                    cl: 9, phase: "search", msg: `Found duplicate: nums[${r}] == nums[${r - 1}]. Increment count to ${count}.`,
                    arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r" }, vars: { l, r, count }
                };
            }

            yield {
                cl: 12, phase: "build", msg: `Element ${nums[r]} appeared ${count} times. We will copy it min(2, ${count}) = ${Math.min(2, count)} times.`,
                arr: [...nums], ptrs: { [l]: "write", [r]: "read" }, vars: { l, r, count }
            };

            let copies = Math.min(2, count);
            for (let i = 0; i < copies; i++) {
                nums[l] = nums[r];

                yield {
                    cl: 13, phase: "build", msg: `Copy #${i + 1} of ${nums[r]} to index ${l}.`,
                    arr: [...nums], ptrs: { [l]: "write", [r]: "read" }, vars: { l, r, copies_allowed: copies }
                };

                l += 1;
            }

            r += 1;

            if (r < nums.length) {
                yield {
                    cl: 16, phase: "init", msg: "Completed processing current element. Move 'r' to next distinct element.",
                    arr: [...nums], ptrs: { [l]: l === r ? "l, r" : "l", [r]: l === r ? undefined : "r" }, vars: { l, r }
                };
            }
        }

        const finalArr = nums.map((n, idx) => idx < l ? `[${n}]` : `_${n}_`);

        yield {
            cl: 18, phase: "done", msg: `Array processed. Valid prefix is ${l} elements long where no element appears more than twice.`,
            arr: finalArr, ptrs: { [l]: "Length" }, vars: { l }, result: String(l)
        };
    }
};
