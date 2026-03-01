// src/engines/configs/removeElement.js

export const removeElementConfig = {
    title: "Remove Element",
    subtitle: () => "Remove all occurrences of a specific value in-place",    defaults: { nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code> and an integer <code>val</code>, remove all occurrences of <code>val</code> in <code>nums</code> <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a>. The order of the elements may be changed. Then return <em>the number of elements in </em><code>nums</code><em> which are not equal to </em><code>val</code>.</p>

<p>Consider the number of elements in <code>nums</code> which are not equal to <code>val</code> be <code>k</code>, to get accepted, you need to do the following things:</p>

<ul>
	<li>Change the array <code>nums</code> such that the first <code>k</code> elements of <code>nums</code> contain the elements which are not equal to <code>val</code>. The remaining elements of <code>nums</code> are not important as well as the size of <code>nums</code>.</li>
	<li>Return <code>k</code>.</li>
</ul>

<p><strong>Custom Judge:</strong></p>

<p>The judge will test your solution with the following code:</p>

<pre>
int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i &lt; actualLength; i++) {
    assert nums[i] == expectedNums[i];
}
</pre>

<p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,2,3], val = 3
<strong>Output:</strong> 2, nums = [2,2,_,_]
<strong>Explanation:</strong> Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,1,2,2,3,0,4,2], val = 2
<strong>Output:</strong> 5, nums = [0,1,4,0,3,_,_,_]
<strong>Explanation:</strong> Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= nums.length &lt;= 100</code></li>
	<li><code>0 &lt;= nums[i] &lt;= 50</code></li>
	<li><code>0 &lt;= val &lt;= 100</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers — Write Pointer
Use a write pointer k. For each element, if not val, write it at position k and increment k.

## Why?
This is the "partition" pattern — separate wanted from unwanted elements in-place.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | In-place |`}],

    code: `class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0
        
        for i in range(len(nums)):
            if nums[i] != val:
                nums[k] = nums[i]
                k += 1
                
        return k`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [0, 1, 2, 2, 3, 0, 4, 2];
        const val = args[1] !== undefined ? args[1] : 2;

        let k = 0;

        yield {
            cl: 3, phase: "init", msg: `Initialize write pointer k at 0. Target value to remove: ${val}`,
            arr: [...nums], ptrs: { [k]: "k" }, vars: { val, k }
        };

        for (let i = 0; i < nums.length; i++) {
            yield {
                cl: 6, phase: "search", msg: `Read pointer i at ${i}. Check if nums[i] (${nums[i]}) != val (${val})`,
                arr: [...nums], ptrs: { [k]: k === i ? "k, i" : "k", [i]: k === i ? undefined : "i" }, vars: { val, k, i, "nums[i]": nums[i] }
            };

            if (nums[i] !== val) {
                yield {
                    cl: 7, phase: "build", msg: `nums[${i}] != ${val}. Copy value to write pointer k (${k}).`,
                    arr: [...nums], ptrs: { [k]: "write", [i]: k === i ? undefined : "read" }, vars: { val, k, i }
                };

                nums[k] = nums[i];

                yield {
                    cl: 8, phase: "build", msg: `Copied ${nums[i]} into index ${k}. Increment k.`,
                    arr: [...nums], ptrs: { [k]: k === i ? "k, i" : "k", [i]: k === i ? undefined : "i" }, vars: { val, k, i }
                };

                k++;
            } else {
                yield {
                    cl: 6, phase: "search", msg: `nums[${i}] == ${val}. Target value matches! Do NOT copy. Just advance read pointer i.`,
                    arr: [...nums], ptrs: { [k]: k === i ? "k, i" : "k", [i]: k === i ? undefined : "i" }, vars: { val, k, i }
                };
            }
        }

        // Highlight valid prefix
        const finalArr = nums.map((n, idx) => idx < k ? `[${n}]` : `_${n}_`);

        yield {
            cl: 10, phase: "done", msg: `Finished scanning array. The valid elements are in the first ${k} indices.`,
            arr: finalArr, ptrs: { [k]: "Length" }, vars: { val, k }, result: String(k)
        };
    }
};
