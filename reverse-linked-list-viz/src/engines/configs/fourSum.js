// src/engines/configs/fourSum.js

export const fourSumConfig = {
    title: "4Sum",
    subtitle: () => "Find all unique quadruplets that sum to target using recursion or a double loop with two converging pointers",    defaults: { nums: [1, 0, -1, 0, -2, 2], target: 0 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an array <code>nums</code> of <code>n</code> integers, return <em>an array of all the <strong>unique</strong> quadruplets</em> <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that:</p>

<ul>
	<li><code>0 &lt;= a, b, c, d&nbsp;&lt; n</code></li>
	<li><code>a</code>, <code>b</code>, <code>c</code>, and <code>d</code> are <strong>distinct</strong>.</li>
	<li><code>nums[a] + nums[b] + nums[c] + nums[d] == target</code></li>
</ul>

<p>You may return the answer in <strong>any order</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,0,-1,0,-2,2], target = 0
<strong>Output:</strong> [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,2,2,2,2], target = 8
<strong>Output:</strong> [[2,2,2,2]]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 200</code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Generalized kSum
Sort + fix two elements (nested loops), then two pointers on the rest. Skip duplicates at every level.
Same pattern as 3Sum but one more loop.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n³)** | Two fixed + two pointers |
| **Space** | **O(1)** | Ignoring output |`}],

    code: `class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        nums.sort()
        res = []

        for i in range(len(nums) - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
                
            for j in range(i + 1, len(nums) - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                    
                l, r = j + 1, len(nums) - 1
                while l < r:
                    fourSum = nums[i] + nums[j] + nums[l] + nums[r]
                    if fourSum > target:
                        r -= 1
                    elif fourSum < target:
                        l += 1
                    else:
                        res.append([nums[i], nums[j], nums[l], nums[r]])
                        l += 1
                        while nums[l] == nums[l - 1] and l < r:
                            l += 1
                            
        return res`.split("\n"),

    generator: function* (args) {
        let numsRaw = args[0] || [1, 0, -1, 0, -2, 2];
        let target = args[1] !== undefined ? args[1] : 0;

        yield {
            cl: 3, phase: "init", msg: `Target is ${target}. Sort the array first.`,
            arr: [...numsRaw], vars: { target, res: "[]" }
        };

        const nums = [...numsRaw].sort((a, b) => a - b);
        let res = [];

        yield {
            cl: 4, phase: "init", msg: "Array is sorted.",
            arr: [...nums], vars: { target, res: `[${res.join(",")}]` }
        };

        for (let i = 0; i < nums.length - 3; i++) {
            if (i > 0 && nums[i] === nums[i - 1]) {
                yield { cl: 8, phase: "search", msg: `Skip duplicate i pointer at index ${i}`, arr: [...nums], ptrs: { [i]: "i" }, vars: { target, i } };
                continue;
            }

            for (let j = i + 1; j < nums.length - 2; j++) {
                if (j > i + 1 && nums[j] === nums[j - 1]) {
                    yield { cl: 12, phase: "search", msg: `Skip duplicate j pointer at index ${j}`, arr: [...nums], ptrs: { [i]: "i", [j]: "j" }, vars: { target, i, j } };
                    continue;
                }

                let l = j + 1;
                let r = nums.length - 1;

                yield {
                    cl: 14, phase: "init", msg: `Set pointers: i=${i}, j=${j}, l=${l}, r=${r}`,
                    arr: [...nums], ptrs: { [i]: "i", [j]: "j", [l]: "l", [r]: "r" }, vars: { i, j, l, r, target }
                };

                while (l < r) {
                    let fourSum = nums[i] + nums[j] + nums[l] + nums[r];

                    yield {
                        cl: 16, phase: "search", msg: `Calculate fourSum: ${nums[i]} + ${nums[j]} + ${nums[l]} + ${nums[r]} = ${fourSum}`,
                        arr: [...nums], ptrs: { [i]: "i", [j]: "j", [l]: "l", [r]: "r" }, vars: { i, j, l, r, "fourSum": fourSum, target }
                    };

                    if (fourSum > target) {
                        yield { cl: 18, phase: "search", msg: `fourSum > target. Decrease sum by shifting r -= 1`, arr: [...nums], ptrs: { [i]: "i", [j]: "j", [l]: "l", [r]: "r" }, vars: { l, r } };
                        r -= 1;
                    } else if (fourSum < target) {
                        yield { cl: 20, phase: "search", msg: `fourSum < target. Increase sum by shifting l += 1`, arr: [...nums], ptrs: { [i]: "i", [j]: "j", [l]: "l", [r]: "r" }, vars: { l, r } };
                        l += 1;
                    } else {
                        res.push(`[${nums[i]}, ${nums[j]}, ${nums[l]}, ${nums[r]}]`);
                        yield {
                            cl: 22, phase: "build", msg: `Match found! fourSum == target (${target}). Add quadruplet to result.`,
                            arr: [...nums], ptrs: { [i]: "Quad", [j]: "Quad", [l]: "Quad", [r]: "Quad" }, vars: { fourSum, target, res: `[${res.join(", ")}]` }
                        };

                        l += 1;

                        while (nums[l] === nums[l - 1] && l < r) {
                            yield { cl: 24, phase: "search", msg: `Skip duplicate left pointer to avoid duplicate quadruplets. l += 1`, arr: [...nums], ptrs: { [i]: "i", [j]: "j", [l]: "l", [r]: "r" }, vars: { l, r } };
                            l += 1;
                        }
                    }
                }
            }
        }

        yield {
            cl: 28, phase: "done", msg: "Checked all possibilities. Return final quadruplets list.",
            arr: [...nums], vars: {}, result: `[${res.join(", ")}]`
        };
    }
};
