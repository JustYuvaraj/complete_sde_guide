// src/engines/configs/increasingTriplet.js

export const increasingTripletConfig = {
    title: "Increasing Triplet Subsequence",
    subtitle: () => 'Find if there exists a triplet i, j, k such that nums[i] < nums[j] < nums[k]',    defaults: { nums: [2, 1, 5, 0, 4, 6] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code>, return <code>true</code><em> if there exists a triple of indices </em><code>(i, j, k)</code><em> such that </em><code>i &lt; j &lt; k</code><em> and </em><code>nums[i] &lt; nums[j] &lt; nums[k]</code>. If no such indices exists, return <code>false</code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,3,4,5]
<strong>Output:</strong> true
<strong>Explanation:</strong> Any triplet where i &lt; j &lt; k is valid.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [5,4,3,2,1]
<strong>Output:</strong> false
<strong>Explanation:</strong> No triplet exists.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,1,5,0,4,6]
<strong>Output:</strong> true
<strong>Explanation:</strong> One of the valid triplet is (1, 4, 5), because nums[1] == 1 &lt; nums[4] == 4 &lt; nums[5] == 6.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>5</sup></code></li>
	<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> Could you implement a solution that runs in <code>O(n)</code> time complexity and <code>O(1)</code> space complexity?
`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Track Two Minimums
Keep first (smallest seen) and second (smallest after first).
If any number > second → found triplet!

## Why?
first and second maintain the invariant: first < second, and both appeared earlier. Any number > second completes the triplet.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Two variables |`}],

    code: `class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        first = float('inf')
        second = float('inf')
        
        for n in nums:
            if n <= first:
                first = n
            elif n <= second:
                second = n
            else:
                return True
                
        return False`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [2, 1, 5, 0, 4, 6];
        let first = Infinity;
        let second = Infinity;

        yield {
            cl: 3, phase: "init", msg: "Initialize 'first' and 'second' smallest elements seen so far to Infinity",
            arr: nums, vars: { first: "Infinity", second: "Infinity" }
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 6, phase: "init", msg: `Check sequence element nums[${i}] = ${n}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, first: first === Infinity ? "Infinity" : first, second: second === Infinity ? "Infinity" : second }
            };

            if (n <= first) {
                first = n;
                yield {
                    cl: 8, phase: "build", msg: `${n} <= first. Update first = ${n}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, first, second: second === Infinity ? "Infinity" : second }
                };
            } else if (n <= second) {
                second = n;
                yield {
                    cl: 10, phase: "build", msg: `${n} > first AND ${n} <= second. Update second = ${n}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, first, second }
                };
            } else {
                yield {
                    cl: 12, phase: "done", msg: `${n} > second (${second}) AND second > first (${first}). Triplet found! Return True.`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, "first": first, "second": second, "third": n }, result: "True"
                };
                return;
            }
        }

        yield {
            cl: 14, phase: "done", msg: "Checked all elements. No increasing triplet found.",
            arr: nums, vars: { first: first === Infinity ? "Infinity" : first, second: second === Infinity ? "Infinity" : second }, result: "False"
        };
    }
};
