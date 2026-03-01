// src/engines/configs/maxConsecutiveOnes.js

export const maxConsecutiveOnesConfig = {
    title: "Max Consecutive Ones",
    subtitle: () => 'Find the maximum number of consecutive 1s in a binary array.',
    defaults: { nums: [1, 1, 0, 1, 1, 1] },
    panels: [], // No hashmap

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given a binary array <code>nums</code>, return <em>the maximum number of consecutive </em><code>1</code><em>&#39;s in the array</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,1,0,1,1,1]
<strong>Output:</strong> 3
<strong>Explanation:</strong> The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,0,1,1,0,1]
<strong>Output:</strong> 2
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>nums[i]</code> is either <code>0</code> or <code>1</code>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Simple Counter
Track current streak and max streak. Reset current to 0 when hitting a 0.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Two variables |`}],

    code: `class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        max_count = 0
        current_count = 0
        
        for n in nums:
            if n == 1:
                current_count += 1
                max_count = max(max_count, current_count)
            else:
                current_count = 0
                
        return max_count`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 1, 0, 1, 1, 1];
        let max_count = 0;
        let current_count = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize max_count and current_count to 0",
            arr: nums, vars: { max_count, current_count }
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 6, phase: "init", msg: `Checking if nums[${i}] is 1`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, max_count, current_count }
            };

            if (n === 1) {
                current_count += 1;
                yield {
                    cl: 8, phase: "build", msg: `It is 1! Increment current_count to ${current_count}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, max_count, current_count }
                };

                const old_max = max_count;
                max_count = Math.max(max_count, current_count);
                yield {
                    cl: 9, phase: "search", msg: `Update max_count: max(${old_max}, ${current_count}) = ${max_count}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, max_count, current_count }
                };
            } else {
                current_count = 0;
                yield {
                    cl: 11, phase: "search", msg: `It is 0. Reset current_count to 0`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, max_count, current_count }
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: `Finished array! Maximum consecutive 1s is ${max_count}`,
            arr: nums, vars: { max_count, current_count }, result: String(max_count)
        };
    }
};
