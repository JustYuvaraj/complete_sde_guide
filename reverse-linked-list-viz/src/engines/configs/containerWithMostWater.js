// src/engines/configs/containerWithMostWater.js

export const containerWithMostWaterConfig = {
    title: "Container With Most Water",
    subtitle: () => "Find two lines that together with the x-axis form a container holding the most water",
    defaults: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>

<p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>

<p>Return <em>the maximum amount of water a container can store</em>.</p>

<p><strong>Notice</strong> that you may not slant the container.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<img alt="" src="https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg" style="width: 600px; height: 287px;" />
<pre>
<strong>Input:</strong> height = [1,8,6,2,5,4,8,3,7]
<strong>Output:</strong> 49
<strong>Explanation:</strong> The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> height = [1,1]
<strong>Output:</strong> 1
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>n == height.length</code></li>
	<li><code>2 &lt;= n &lt;= 10<sup>5</sup></code></li>
	<li><code>0 &lt;= height[i] &lt;= 10<sup>4</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers — Greedy
Start with widest container (left=0, right=n-1). Move the shorter side inward.

## Why Move the Shorter Side?
Moving the taller side can only decrease width without increasing height. Moving the shorter side might find a taller line, potentially increasing area.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | One pass inward |
| **Space** | **O(1)** | Two pointers |`}],

    code: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0

        while l < r:
            area = (r - l) * min(height[l], height[r])
            res = max(res, area)

            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
                
        return res`.split("\n"),

    generator: function* (args) {
        const height = args[0] || [1, 8, 6, 2, 5, 4, 8, 3, 7];

        // Custom string formatting to visually highlight heights
        const stringifyHeights = (arr, activeL, activeR) => arr.map((h, i) => {
            if (i === activeL || i === activeR) return `[h=${h}]`;
            return h;
        });

        let l = 0;
        let r = height.length - 1;
        let res = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize left pointer to start, right pointer to end, max area (res) to 0",
            arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, res }
        };

        while (l < r) {
            const width = r - l;
            const minHeight = Math.min(height[l], height[r]);
            const area = width * minHeight;

            yield {
                cl: 7, phase: "search", msg: `Calculate area between pointers: width=(${r}-${l})=${width}, height=min(${height[l]}, ${height[r]})=${minHeight}. Area = ${area}`,
                arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { width, "min-height": minHeight, area, res }
            };

            res = Math.max(res, area);

            yield {
                cl: 8, phase: "build", msg: `Update Max Area if ${area} > ${res}. Max area is now ${res}.`,
                arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { area, res }
            };

            if (height[l] < height[r]) {
                yield {
                    cl: 10, phase: "search", msg: `height[l] (${height[l]}) < height[r] (${height[r]}). Left limit is the bottleneck. Move left pointer rightward (l += 1) to seek a taller line.`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { "h[l]": height[l], "h[r]": height[r] }
                };
                l += 1;
            } else {
                yield {
                    cl: 12, phase: "search", msg: `height[l] (${height[l]}) >= height[r] (${height[r]}). Right limit is the bottleneck. Move right pointer leftward (r -= 1) to seek a taller line.`,
                    arr: stringifyHeights(height, l, r), ptrs: { [l]: "l", [r]: "r" }, vars: { "h[l]": height[l], "h[r]": height[r] }
                };
                r -= 1;
            }
        }

        yield {
            cl: 14, phase: "done", msg: `Pointers crossed. Maximum container area computed!`,
            arr: stringifyHeights(height, -1, -1), vars: { res }, result: String(res)
        };
    }
};
