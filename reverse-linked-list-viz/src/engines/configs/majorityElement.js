// src/engines/configs/majorityElement.js

export const majorityElementConfig = {
    title: "Majority Element",
    subtitle: () => 'Find the element that appears more than n/2 times using Boyer-Moore Voting',
    defaults: { nums: [2, 2, 1, 1, 1, 2, 2] },
    panels: [], // No map needed for Boyer Moore

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an array <code>nums</code> of size <code>n</code>, return <em>the majority element</em>.</p>

<p>The majority element is the element that appears more than <code>&lfloor;n / 2&rfloor;</code> times. You may assume that the majority element always exists in the array.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [3,2,3]
<strong>Output:</strong> 3
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [2,2,1,1,1,2,2]
<strong>Output:</strong> 2
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>n == nums.length</code></li>
	<li><code>1 &lt;= n &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li>The input is generated such that a majority element will exist in the array.</li>
</ul>

<p>&nbsp;</p>
<strong>Follow-up:</strong> Could you solve the problem in linear time and in <code>O(1)</code> space?
`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Boyer-Moore Voting Algorithm
Maintain a candidate and count. For each element:
- If count==0 → new candidate
- If same as candidate → count++
- Else → count--

## Why It Works
The majority element appears >n/2 times, so it can never be fully "cancelled out" by other elements.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Just candidate + count |`}],

    code: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        res, count = 0, 0
        
        for n in nums:
            if count == 0:
                res = n
            
            if n == res:
                count += 1
            else:
                count -= 1
                
        return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [2, 2, 1, 1, 1, 2, 2];
        let res = 0;
        let count = 0;

        yield {
            cl: 2, phase: "init", msg: "Initialize result and count to 0",
            arr: nums, vars: { res, count }
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 4, phase: "init", msg: `Evaluating nums[${i}] = ${n}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, res, count }
            };

            if (count === 0) {
                res = n;
                yield {
                    cl: 6, phase: "build", msg: `Count is zero! Assigning new majority candidate: ${res}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, res, count }
                };
            }

            if (n === res) {
                count += 1;
                yield {
                    cl: 9, phase: "build", msg: `n matches candidate! Increment count to ${count}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, res, count }
                };
            } else {
                count -= 1;
                yield {
                    cl: 11, phase: "search", msg: `n differs from candidate. Decrement count to ${count}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, res, count }
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: `Finished array. The remaining candidate is the majority element!`,
            arr: nums, vars: { res, count }, result: String(res)
        };
    }
};
