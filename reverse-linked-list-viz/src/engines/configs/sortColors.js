// src/engines/configs/sortColors.js

export const sortColorsConfig = {
    title: "Sort Colors",
    subtitle: () => 'Dutch National Flag algorithm using three pointers (l, mid, r) to sort 0s, 1s, and 2s in-place',    defaults: { nums: [2, 0, 2, 1, 1, 0] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong><a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a> </strong>so that objects of the same color are adjacent, with the colors in the order red, white, and blue.</p>

<p>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.</p>

<p>You must solve this problem without using the library&#39;s sort function.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,0,2,1,1,0]
<strong>Output:</strong> [0,0,1,1,2,2]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,0,1]
<strong>Output:</strong> [0,1,2]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>n == nums.length</code></li>
	<li><code>1 &lt;= n &lt;= 300</code></li>
	<li><code>nums[i]</code> is either <code>0</code>, <code>1</code>, or <code>2</code>.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong>&nbsp;Could you come up with a one-pass algorithm using only&nbsp;constant extra space?</p>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Dutch National Flag — Three Pointers
- low: boundary for 0s (left)
- mid: current element
- high: boundary for 2s (right)

If nums[mid]==0 → swap with low. If 2 → swap with high. If 1 → skip.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Three pointers |`}],

    code: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        l, r = 0, len(nums) - 1
        i = 0
        
        # l -> boundary for 0s (left side)
        # r -> boundary for 2s (right side)
        # i -> current element being processed
        
        while i <= r:
            if nums[i] == 0:
                nums[l], nums[i] = nums[i], nums[l]
                l += 1
                i += 1
            elif nums[i] == 2:
                nums[r], nums[i] = nums[i], nums[r]
                r -= 1
                # Do NOT increment i yet, need to check swapped value
            else:
                i += 1`.split("\n"),

    generator: function* (args) {
        let nums = args[0] || [2, 0, 2, 1, 1, 0];
        let l = 0;
        let r = nums.length - 1;
        let i = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize pointers: 'l' tracks rightmost 0, 'r' tracks leftmost 2, 'i' is our scanning pointer.",
            arr: [...nums], ptrs: { [l]: l === r ? "l,i,r" : (l === i ? "l,i" : "l"), [r]: l === r ? "l,i,r" : "r", [i]: l === i ? "l,i" : (i === r ? "i,r" : "i") },
            vars: { l, i, r }
        };

        while (i <= r) {
            yield {
                cl: 10, phase: "search", msg: `Check nums[${i}] = ${nums[i]}. Where does it belong?`,
                arr: [...nums], ptrs: { [l]: "l", [r]: "r", [i]: "i" }, vars: { l, i, r, "nums[i]": nums[i] }
            };

            if (nums[i] === 0) {
                yield {
                    cl: 12, phase: "build", msg: `nums[${i}] is 0. Swap it with nums[l] to group it leftwards.`,
                    arr: [...nums], ptrs: { [i]: "swap_i", [l]: "swap_l", [r]: "r" }, vars: { l, i, r }
                };

                let temp = nums[l];
                nums[l] = nums[i];
                nums[i] = temp;

                yield {
                    cl: 12, phase: "build", msg: `Swapped! Now 0 is at index ${l}.`,
                    arr: [...nums], ptrs: { [l]: "swapped", [r]: "r", [i]: "i" }, vars: { l, i, r }
                };

                l += 1;
                i += 1;

                yield {
                    cl: 14, phase: "init", msg: `Increment 'l' boundary and scanning pointer 'i'.`,
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r", [i]: "i" }, vars: { l, i, r }
                };

            } else if (nums[i] === 2) {
                yield {
                    cl: 16, phase: "build", msg: `nums[${i}] is 2. Swap it with nums[r] to group it rightwards.`,
                    arr: [...nums], ptrs: { [i]: "swap_i", [r]: "swap_r", [l]: "l" }, vars: { l, i, r }
                };

                let temp = nums[r];
                nums[r] = nums[i];
                nums[i] = temp;

                yield {
                    cl: 16, phase: "build", msg: `Swapped! Now 2 is at index ${r}.`,
                    arr: [...nums], ptrs: { [r]: "swapped", [i]: "i", [l]: "l" }, vars: { l, i, r }
                };

                r -= 1;

                yield {
                    cl: 18, phase: "init", msg: `Decrement 'r' boundary. Do NOT increment 'i' yet, because the newly swapped value at 'i' (which came from 'r') hasn't been evaluated!`,
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r", [i]: "i" }, vars: { l, i, r }
                };

            } else {
                yield {
                    cl: 20, phase: "init", msg: `nums[${i}] is 1. It belongs in the middle. Do nothing, just advance 'i'.`,
                    arr: [...nums], ptrs: { [l]: "l", [r]: "r", [i]: "i" }, vars: { l, i, r }
                };

                i += 1;
            }
        }

        yield {
            cl: 21, phase: "done", msg: "'i' passed 'r'. Array is fully sorted!",
            arr: [...nums], vars: {}, result: JSON.stringify(nums)
        };
    }
};
