// src/engines/configs/trappingRainWater.js

export const trappingRainWaterConfig = {
    title: "Trapping Rain Water",
    subtitle: () => 'Use two pointers from both ends to calculate the trapped water at each step based on max heights',    defaults: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<img src="https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png" style="width: 412px; height: 161px;" />
<pre>
<strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> height = [4,2,0,3,2,5]
<strong>Output:</strong> 9
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>n == height.length</code></li>
	<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>0 &lt;= height[i] &lt;= 10<sup>5</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers Approach
Water at position i = min(maxLeft, maxRight) - height[i].
Use two pointers from both ends, tracking maxLeft and maxRight. Process the smaller side first.

## Why?
The smaller side determines the water level. By processing it first, we guarantee correctness without needing pre-computed arrays.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass with two pointers |
| **Space** | **O(1)** | Just pointers and maxes |`}],

    code: `class Solution:
    def trap(self, height: List[int]) -> int:
        if not height: return 0

        l, r = 0, len(height) - 1
        leftMax, rightMax = height[l], height[r]
        res = 0

        while l < r:
            if leftMax < rightMax:
                l += 1
                leftMax = max(leftMax, height[l])
                res += leftMax - height[l]
            else:
                r -= 1
                rightMax = max(rightMax, height[r])
                res += rightMax - height[r]

        return res`.split("\n"),

    generator: function* (args) {
        let height = args[0] || [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

        if (!height || height.length === 0) {
            yield { cl: 3, phase: "done", msg: "Empty array, return 0", arr: [], vars: {}, result: "0" };
            return;
        }

        let l = 0;
        let r = height.length - 1;
        let leftMax = height[l];
        let rightMax = height[r];
        let res = 0;

        const stringifyHeights = (arr, activeL, activeR) => arr.map((h, i) => {
            if (i === activeL || i === activeR) return `[${h}]`;
            return h;
        });

        yield {
            cl: 5, phase: "init", msg: `Initialize l=0, r=${r}. leftMax=${leftMax}, rightMax=${rightMax}. res=0.`,
            arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, leftMax, rightMax, res }
        };

        while (l < r) {
            yield {
                cl: 9, phase: "search", msg: `Compare leftMax (${leftMax}) and rightMax (${rightMax}). The smaller one acts as the bottleneck for water.`,
                arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { leftMax, rightMax, res }
            };

            if (leftMax < rightMax) {
                yield {
                    cl: 10, phase: "search", msg: `leftMax (${leftMax}) < rightMax (${rightMax}). Left side is the bottleneck. Advance 'l'.`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { leftMax, rightMax, "h[l]": height[l], "h[r]": height[r] }
                };

                l += 1;
                leftMax = Math.max(leftMax, height[l]);
                let water = leftMax - height[l];
                res += water;

                yield {
                    cl: 12, phase: "build", msg: `Moved l to index ${l}. Updated leftMax = max(${leftMax}, ${height[l]}) = ${leftMax}. Trapped water = ${leftMax} - ${height[l]} = ${water}. Total water: ${res}`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { leftMax, rightMax, "water added": water, res }
                };
            } else {
                yield {
                    cl: 14, phase: "search", msg: `leftMax (${leftMax}) >= rightMax (${rightMax}). Right side is the bottleneck. Advance 'r'.`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { leftMax, rightMax, "h[l]": height[l], "h[r]": height[r] }
                };

                r -= 1;
                rightMax = Math.max(rightMax, height[r]);
                let water = rightMax - height[r];
                res += water;

                yield {
                    cl: 16, phase: "build", msg: `Moved r to index ${r}. Updated rightMax = max(${rightMax}, ${height[r]}) = ${rightMax}. Trapped water = ${rightMax} - ${height[r]} = ${water}. Total water: ${res}`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { leftMax, rightMax, "water added": water, res }
                };
            }
        }

        yield {
            cl: 19, phase: "done", msg: `Pointers crossed! All water trapped has been calculated: ${res} units.`,
            arr: stringifyHeights(height, -1, -1), vars: { res }, result: String(res)
        };
    }
};
