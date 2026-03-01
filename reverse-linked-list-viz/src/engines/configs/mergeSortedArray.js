// src/engines/configs/mergeSortedArray.js

export const mergeSortedArrayConfig = {
    title: "Merge Sorted Array",
    subtitle: () => "Merge nums2 into nums1 backwards to avoid overwriting elements",    defaults: { m: 3, n: 3 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>

<p><strong>Merge</strong> <code>nums1</code> and <code>nums2</code> into a single array sorted in <strong>non-decreasing order</strong>.</p>

<p>The final sorted array should not be returned by the function, but instead be <em>stored inside the array </em><code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
<strong>Output:</strong> [1,2,2,3,5,6]
<strong>Explanation:</strong> The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [<u>1</u>,<u>2</u>,2,<u>3</u>,5,6] with the underlined elements coming from nums1.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums1 = [1], m = 1, nums2 = [], n = 0
<strong>Output:</strong> [1]
<strong>Explanation:</strong> The arrays we are merging are [1] and [].
The result of the merge is [1].
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums1 = [0], m = 0, nums2 = [1], n = 1
<strong>Output:</strong> [1]
<strong>Explanation:</strong> The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>nums1.length == m + n</code></li>
	<li><code>nums2.length == n</code></li>
	<li><code>0 &lt;= m, n &lt;= 200</code></li>
	<li><code>1 &lt;= m + n &lt;= 200</code></li>
	<li><code>-10<sup>9</sup> &lt;= nums1[i], nums2[j] &lt;= 10<sup>9</sup></code></li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up: </strong>Can you come up with an algorithm that runs in <code>O(m + n)</code> time?</p>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Merge from the End
Start filling from the back (position m+n-1). Compare largest elements of both arrays. This avoids overwriting.

## Why From the End?
Merging from the front would overwrite nums1's elements. From the back, we fill empty slots first.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(m+n)** | Visit each element once |
| **Space** | **O(1)** | In-place |`}],

    code: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        last = m + n - 1
        
        while m > 0 and n > 0:
            if nums1[m - 1] > nums2[n - 1]:
                nums1[last] = nums1[m - 1]
                m -= 1
            else:
                nums1[last] = nums2[n - 1]
                n -= 1
            last -= 1
            
        while n > 0:
            nums1[last] = nums2[n - 1]
            n, last = n - 1, last - 1`.split("\n"),

    generator: function* (args) {
        const m = args[0] !== undefined ? args[0] : 3;
        const n = args[1] !== undefined ? args[1] : 3;
        const nums1 = [1, 2, 3, 0, 0, 0];
        const nums2 = [2, 5, 6];

        // We will visualize both arrays as a single combined string representation
        const renderBoth = (n1, n2, mPtr, nPtr, lastPtr) => {
            const arr = [];
            arr.push("[nums1:]");
            for (let i = 0; i < n1.length; i++) {
                if (i === lastPtr) arr.push(`*[${n1[i]}]*`);
                else arr.push(n1[i]);
            }
            arr.push("[nums2:]");
            for (let i = 0; i < n2.length; i++) {
                arr.push(n2[i]);
            }
            return arr;
        };

        let mPtr = m;
        let nPtr = n;
        let last = m + n - 1;

        const getMIndex = (idx) => 1 + idx; // offset past "[nums1:]"
        const getNIndex = (idx) => 1 + nums1.length + 1 + idx; // offset past nums1 elements + "[nums2:]"

        yield {
            cl: 3, phase: "init", msg: `Initialize pointers. 'last' = ${last} (end of nums1). m=${mPtr}, n=${nPtr}. We start from the end!`,
            arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
            ptrs: { [getMIndex(mPtr - 1)]: "m-1", [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "last" },
            vars: { m: mPtr, n: nPtr, last }
        };

        while (mPtr > 0 && nPtr > 0) {
            yield {
                cl: 5, phase: "search", msg: `Compare nums1[${mPtr - 1}] (${nums1[mPtr - 1]}) and nums2[${nPtr - 1}] (${nums2[nPtr - 1]}).`,
                arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                ptrs: { [getMIndex(mPtr - 1)]: "m-1", [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "last" },
                vars: { m: mPtr, n: nPtr, last, "nums1[m-1]": nums1[mPtr - 1], "nums2[n-1]": nums2[nPtr - 1] }
            };

            if (nums1[mPtr - 1] > nums2[nPtr - 1]) {
                yield {
                    cl: 7, phase: "build", msg: `${nums1[mPtr - 1]} > ${nums2[nPtr - 1]}. Put ${nums1[mPtr - 1]} at the end of nums1 (index ${last}).`,
                    arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                    ptrs: { [getMIndex(mPtr - 1)]: "take", [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "place" },
                    vars: { m: mPtr, n: nPtr, last }
                };
                nums1[last] = nums1[mPtr - 1];
                mPtr -= 1;

                yield {
                    cl: 8, phase: "build", msg: `Copied successfully. Decrement m (now ${mPtr}).`,
                    arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                    ptrs: { ...(mPtr > 0 ? { [getMIndex(mPtr - 1)]: "m-1" } : {}), [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "placed" },
                    vars: { m: mPtr, n: nPtr, last }
                };
            } else {
                yield {
                    cl: 10, phase: "build", msg: `${nums1[mPtr - 1]} <= ${nums2[nPtr - 1]}. Put ${nums2[nPtr - 1]} at the end of nums1 (index ${last}).`,
                    arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                    ptrs: { [getMIndex(mPtr - 1)]: "m-1", [getNIndex(nPtr - 1)]: "take", [getMIndex(last)]: "place" },
                    vars: { m: mPtr, n: nPtr, last }
                };
                nums1[last] = nums2[nPtr - 1];
                nPtr -= 1;

                yield {
                    cl: 11, phase: "build", msg: `Copied successfully. Decrement n (now ${nPtr}).`,
                    arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                    ptrs: { [getMIndex(mPtr - 1)]: "m-1", ...(nPtr > 0 ? { [getNIndex(nPtr - 1)]: "n-1" } : {}), [getMIndex(last)]: "placed" },
                    vars: { m: mPtr, n: nPtr, last }
                };
            }

            last -= 1;

            yield {
                cl: 12, phase: "init", msg: `Decrement 'last' pointer to ${last} to be ready for the next largest element.`,
                arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                ptrs: { ...(mPtr > 0 ? { [getMIndex(mPtr - 1)]: "m-1" } : {}), ...(nPtr > 0 ? { [getNIndex(nPtr - 1)]: "n-1" } : {}), [getMIndex(last)]: "last" },
                vars: { m: mPtr, n: nPtr, last }
            };
        }

        while (nPtr > 0) {
            yield {
                cl: 14, phase: "search", msg: `n is still ${nPtr}. nums1 is exhausted but there are still elements in nums2. Copying remaining elements from nums2.`,
                arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                ptrs: { [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "last" },
                vars: { m: mPtr, n: nPtr, last }
            };

            nums1[last] = nums2[nPtr - 1];

            yield {
                cl: 15, phase: "build", msg: `Copied ${nums2[nPtr - 1]} into nums1 index ${last}.`,
                arr: renderBoth(nums1, nums2, mPtr, nPtr, last),
                ptrs: { [getNIndex(nPtr - 1)]: "n-1", [getMIndex(last)]: "placed" },
                vars: { m: mPtr, n: nPtr, last }
            };

            nPtr -= 1;
            last -= 1;
        }

        yield {
            cl: 16, phase: "done", msg: `All elements merged successfully in-place within nums1!`,
            arr: renderBoth(nums1, nums2, mPtr, nPtr, -1),
            vars: { m: mPtr, n: nPtr, last }, result: `nums1 = [${nums1.join(", ")}]`
        };
    }
};
