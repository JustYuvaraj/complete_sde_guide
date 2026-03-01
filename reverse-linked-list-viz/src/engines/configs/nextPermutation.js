// src/engines/configs/nextPermutation.js

export const nextPermutationConfig = {
    title: "Next Permutation",
    subtitle: () => 'Find the next lexicographically greater permutation in-place',    defaults: { nums: [1, 2, 3] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>A <strong>permutation</strong> of an array of integers is an arrangement of its members into a sequence or linear order.</p>

<ul>
	<li>For example, for <code>arr = [1,2,3]</code>, the following are all the permutations of <code>arr</code>: <code>[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]</code>.</li>
</ul>

<p>The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the <strong>next permutation</strong> of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).</p>

<ul>
	<li>For example, the next permutation of <code>arr = [1,2,3]</code> is <code>[1,3,2]</code>.</li>
	<li>Similarly, the next permutation of <code>arr = [2,3,1]</code> is <code>[3,1,2]</code>.</li>
	<li>While the next permutation of <code>arr = [3,2,1]</code> is <code>[1,2,3]</code> because <code>[3,2,1]</code> does not have a lexicographical larger rearrangement.</li>
</ul>

<p>Given an array of integers <code>nums</code>, <em>find the next permutation of</em> <code>nums</code>.</p>

<p>The replacement must be <strong><a href="http://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in place</a></strong> and use only constant extra memory.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,3]
<strong>Output:</strong> [1,3,2]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,1]
<strong>Output:</strong> [1,2,3]
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,1,5]
<strong>Output:</strong> [1,5,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 100</code></li>
	<li><code>0 &lt;= nums[i] &lt;= 100</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Three Steps
1. Find the largest i where nums[i] < nums[i+1] (rightmost ascent)
2. Find the largest j > i where nums[j] > nums[i]
3. Swap i and j, then reverse everything after i

## Why?
Step 1 finds where to make a change. Step 2 finds the smallest larger digit. Step 3 minimizes the suffix.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | At most 3 linear scans |
| **Space** | **O(1)** | In-place |`}],

    code: `class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        i = len(nums) - 2
        while i >= 0 and nums[i + 1] <= nums[i]:
            i -= 1
            
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
            
        # Reverse from i+1 to end
        l, r = i + 1, len(nums) - 1
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l, r = l + 1, r - 1`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 2, 3];
        const n = nums.length;
        let i = n - 2;

        yield {
            cl: 3, phase: "init", msg: `Start pointer i from right-to-left at index ${i}`,
            arr: [...nums], ptrs: { [i]: "i" }, vars: { i }
        };

        while (i >= 0 && nums[i + 1] <= nums[i]) {
            yield {
                cl: 4, phase: "search", msg: `nums[${i + 1}] (${nums[i + 1]}) <= nums[${i}] (${nums[i]}). Sequence is decreasing. Decrement i.`,
                arr: [...nums], ptrs: { [i]: "i", [i + 1]: "i+1" }, vars: { i }
            };
            i -= 1;
        }

        if (i >= 0) {
            yield {
                cl: 6, phase: "search", msg: `Found first decreasing element from right: nums[${i}] = ${nums[i]}. Now find element just barely larger than it to swap.`,
                arr: [...nums], ptrs: { [i]: "i" }, vars: { i, "nums[i]": nums[i] }
            };

            let j = n - 1;
            while (nums[j] <= nums[i]) {
                yield {
                    cl: 9, phase: "search", msg: `nums[${j}] (${nums[j]}) <= nums[${i}]. Decrement j.`,
                    arr: [...nums], ptrs: { [i]: "i", [j]: "j" }, vars: { i, j }
                };
                j -= 1;
            }

            yield {
                cl: 11, phase: "build", msg: `Found nums[${j}] = ${nums[j]} which is > ${nums[i]}. Swapping them.`,
                arr: [...nums], ptrs: { [i]: "i", [j]: "j" }, vars: { i, j }
            };

            const temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;

            yield {
                cl: 11, phase: "build", msg: `Swapped! Result holds a larger prefix now.`,
                arr: [...nums], ptrs: { [i]: "i", [j]: "j" }, vars: { i, j }
            };
        } else {
            yield {
                cl: 6, phase: "search", msg: `i = ${i} < 0. Entire array is strictly decreasing (last permutation). We just reverse the whole thing.`,
                arr: [...nums], vars: { i }
            };
        }

        let l = i + 1;
        let r = n - 1;

        yield {
            cl: 14, phase: "init", msg: "Reverse the suffix elements from i+1 to end to get the smallest lexicographical order for the suffix.",
            arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
        };

        while (l < r) {
            yield {
                cl: 16, phase: "search", msg: `Swapping nums[${l}] and nums[${r}]`,
                arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };

            const temp = nums[l];
            nums[l] = nums[r];
            nums[r] = temp;

            l++;
            r--;

            yield {
                cl: 17, phase: "build", msg: `Move inward (l++, r--)`,
                arr: [...nums], ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };
        }

        yield {
            cl: 17, phase: "done", msg: "In-place Next Permutation complete!",
            arr: [...nums], vars: {}, result: JSON.stringify(nums)
        };
    }
};
