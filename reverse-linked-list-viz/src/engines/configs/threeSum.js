// src/engines/configs/threeSum.js

export const threeSumConfig = {
    title: "3Sum",
    subtitle: () => "Find all unique triplets that sum to 0 using a loop and two converging pointers",    defaults: { nums: [-1, 0, 1, 2, -1, -4] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>

<p>Notice that the solution set must not contain duplicate triplets.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [-1,0,1,2,-1,-4]
<strong>Output:</strong> [[-1,-1,2],[-1,0,1]]
<strong>Explanation:</strong> 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,1,1]
<strong>Output:</strong> []
<strong>Explanation:</strong> The only possible triplet does not sum up to 0.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,0,0]
<strong>Output:</strong> [[0,0,0]]
<strong>Explanation:</strong> The only possible triplet sums up to 0.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>3 &lt;= nums.length &lt;= 3000</code></li>
	<li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Sort + Two Pointers
1. Sort the array
2. Fix one element (i), use two pointers on the rest
3. Skip duplicates at every level

## Why Sort First?
Sorting enables two-pointer approach (O(n²) vs O(n³) brute force) and makes duplicate skipping easy.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n²)** | Fix one, two-pointer on rest |
| **Space** | **O(1)** | Ignoring sort/output |`}],

    code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        res = []
        nums.sort()
        
        for i, a in enumerate(nums):
            if i > 0 and a == nums[i - 1]:
                continue
                
            l, r = i + 1, len(nums) - 1
            while l < r:
                threeSum = a + nums[l] + nums[r]
                if threeSum > 0:
                    r -= 1
                elif threeSum < 0:
                    l += 1
                else:
                    res.append([a, nums[l], nums[r]])
                    l += 1
                    while nums[l] == nums[l - 1] and l < r:
                        l += 1
                        
        return res`.split("\n"),

    generator: function* (args) {
        let numsRaw = args[0] || [-1, 0, 1, 2, -1, -4];

        yield {
            cl: 3, phase: "init", msg: "First step: Sort the array to easily use Two Pointers and avoid duplicates.",
            arr: [...numsRaw], vars: { res: "[]" }
        };

        const nums = [...numsRaw].sort((a, b) => a - b);
        let res = [];

        yield {
            cl: 4, phase: "init", msg: "Array is now sorted.",
            arr: [...nums], vars: { res: `[${res.join(",")}]` }
        };

        for (let i = 0; i < nums.length; i++) {
            let a = nums[i];

            yield {
                cl: 6, phase: "search", msg: `Set target a = nums[${i}] = ${a}. We need to find two elements that sum to ${-a}.`,
                arr: [...nums], ptrs: { [i]: "i" }, vars: { i, a, res: `[${res.join(", ")}]` }
            };

            if (i > 0 && a === nums[i - 1]) {
                yield {
                    cl: 8, phase: "search", msg: `nums[${i}] is the same as nums[${i - 1}]. Skip to avoid duplicate triplets.`,
                    arr: [...nums], ptrs: { [i]: "i" }, vars: { i, a }
                };
                continue;
            }

            let l = i + 1;
            let r = nums.length - 1;

            yield {
                cl: 10, phase: "init", msg: `Initialize l = ${l}, r = ${r} for the remaining subarray.`,
                arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { i, a, l, r }
            };

            while (l < r) {
                let threeSum = a + nums[l] + nums[r];

                yield {
                    cl: 12, phase: "search", msg: `Calculate threeSum: ${a} + ${nums[l]} + ${nums[r]} = ${threeSum}`,
                    arr: [...nums], ptrs: { [i]: "a", [l]: "l", [r]: "r" }, vars: { a, "nums[l]": nums[l], "nums[r]": nums[r], threeSum }
                };

                if (threeSum > 0) {
                    yield {
                        cl: 14, phase: "search", msg: `threeSum > 0. Sum is too large, shift right pointer left (r -= 1)`,
                        arr: [...nums], ptrs: { [i]: "a", [l]: "l", [r]: "r" }, vars: { l, r }
                    };
                    r -= 1;
                } else if (threeSum < 0) {
                    yield {
                        cl: 16, phase: "search", msg: `threeSum < 0. Sum is too small, shift left pointer right (l += 1)`,
                        arr: [...nums], ptrs: { [i]: "a", [l]: "l", [r]: "r" }, vars: { l, r }
                    };
                    l += 1;
                } else {
                    res.push(`[${a}, ${nums[l]}, ${nums[r]}]`);

                    yield {
                        cl: 18, phase: "build", msg: `Match found! threeSum == 0. Add triplet [${a}, ${nums[l]}, ${nums[r]}] to result.`,
                        arr: [...nums], ptrs: { [i]: "Triplet", [l]: "Triplet", [r]: "Triplet" }, vars: { threeSum, res: `[${res.join(", ")}]` }
                    };

                    l += 1;

                    while (nums[l] === nums[l - 1] && l < r) {
                        yield {
                            cl: 20, phase: "search", msg: `nums[${l}] == ${nums[l - 1]}. Skip duplicate left pointer to avoid duplicate triplets.`,
                            arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { l, r }
                        };
                        l += 1;
                    }
                }
            }
        }

        yield {
            cl: 22, phase: "done", msg: "Checked all possibilities. Return final triplets list.",
            arr: [...nums], vars: {}, result: `[${res.join(", ")}]`
        };
    }
};
