// src/engines/configs/threeSumClosest.js

export const threeSumClosestConfig = {
    title: "3Sum Closest",
    subtitle: () => 'Find a triplet that sum is closest to the given target',    defaults: { nums: [-1, 2, 1, -4], target: 1 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code> of length <code>n</code> and an integer <code>target</code>, find three integers at <strong>distinct indices</strong> in <code>nums</code> such that the sum is closest to <code>target</code>.</p>

<p>Return <em>the sum of the three integers</em>.</p>

<p>You may assume that each input would have exactly one solution.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [-1,2,1,-4], target = 1
<strong>Output:</strong> 2
<strong>Explanation:</strong> The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,0,0], target = 1
<strong>Output:</strong> 0
<strong>Explanation:</strong> The sum that is closest to the target is 0. (0 + 0 + 0 = 0).
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>3 &lt;= nums.length &lt;= 500</code></li>
	<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>
	<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Same as 3Sum but Track Closest
Sort + fix one + two pointers. Instead of finding exact match, track the closest sum seen so far.
Move pointers based on whether current sum is too small or too large.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n²)** | Same as 3Sum |
| **Space** | **O(1)** | Just tracking closest |`}],

    code: `class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        nums.sort()
        res = nums[0] + nums[1] + nums[2]
        
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
                
            l, r = i + 1, len(nums) - 1
            while l < r:
                curSum = nums[i] + nums[l] + nums[r]
                
                if abs(curSum - target) < abs(res - target):
                    res = curSum
                    
                if curSum > target:
                    r -= 1
                elif curSum < target:
                    l += 1
                else:
                    return res
                    
        return res`.split("\n"),

    generator: function* (args) {
        let numsRaw = args[0] || [-1, 2, 1, -4];
        let target = args[1] !== undefined ? args[1] : 1;

        const nums = [...numsRaw].sort((a, b) => a - b);

        yield {
            cl: 3, phase: "init", msg: `Target is ${target}. Sort the array first.`,
            arr: [...nums], vars: { target }
        };

        let res = nums[0] + nums[1] + nums[2];

        yield {
            cl: 4, phase: "init", msg: `Initialize results with first triplet sum: ${nums[0]} + ${nums[1]} + ${nums[2]} = ${res}`,
            arr: [...nums], vars: { target, res }
        };

        for (let i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] === nums[i - 1]) {
                yield {
                    cl: 8, phase: "search", msg: `Skip duplicate i pointer at index ${i}`,
                    arr: [...nums], ptrs: { [i]: "i" }, vars: { target, res, i }
                };
                continue;
            }

            let l = i + 1;
            let r = nums.length - 1;

            yield {
                cl: 10, phase: "init", msg: `Set pointers: i=${i}, l=${l}, r=${r}`,
                arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { i, l, r, target, res }
            };

            while (l < r) {
                let curSum = nums[i] + nums[l] + nums[r];

                yield {
                    cl: 12, phase: "search", msg: `Calculated curSum: ${nums[i]} + ${nums[l]} + ${nums[r]} = ${curSum}`,
                    arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { i, l, r, "curSum": curSum, target, "Best res so far": res }
                };

                let curDiff = Math.abs(curSum - target);
                let resDiff = Math.abs(res - target);

                if (curDiff < resDiff) {
                    yield {
                        cl: 15, phase: "build", msg: `New closest! abs(${curSum} - ${target}) [${curDiff}] < abs(${res} - ${target}) [${resDiff}]. Updating res to ${curSum}.`,
                        arr: [...nums], ptrs: { [i]: "closest", [l]: "closest", [r]: "closest" }, vars: { curSum, target, res: curSum }
                    };
                    res = curSum;
                } else {
                    yield {
                        cl: 14, phase: "search", msg: `Current sum ${curSum} (diff: ${curDiff}) is NOT closer than best ${res} (diff: ${resDiff}).`,
                        arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { curSum, res }
                    };
                }

                if (curSum > target) {
                    yield { cl: 18, phase: "search", msg: `curSum > target, we need a smaller sum. r -= 1`, arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { l, r } };
                    r -= 1;
                } else if (curSum < target) {
                    yield { cl: 20, phase: "search", msg: `curSum < target, we need a larger sum. l += 1`, arr: [...nums], ptrs: { [i]: "i", [l]: "l", [r]: "r" }, vars: { l, r } };
                    l += 1;
                } else {
                    yield {
                        cl: 22, phase: "done", msg: `curSum == target. Exact match is mathematically the closest possible! Returns ${res}.`,
                        arr: [...nums], ptrs: { [i]: "Best", [l]: "Best", [r]: "Best" }, vars: {}, result: String(res)
                    };
                    return;
                }
            }
        }

        yield {
            cl: 24, phase: "done", msg: `Checked all possible triplets. Return the closest sum found: ${res}`,
            arr: [...nums], vars: {}, result: String(res)
        };
    }
};
