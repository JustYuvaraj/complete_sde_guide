// src/engines/configs/majorityElementII.js

export const majorityElementIIConfig = {
    title: "Majority Element II",
    subtitle: () => 'Find elements that appear more than n/3 times using Boyer-Moore',    defaults: { nums: [3, 2, 3] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>&lfloor; n/3 &rfloor;</code> times.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,3]
<strong>Output:</strong> [3]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [1]
<strong>Output:</strong> [1]
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2]
<strong>Output:</strong> [1,2]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong> Could you solve the problem in linear time and in <code>O(1)</code> space?</p>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Extended Boyer-Moore
At most 2 elements can appear >n/3 times. Track TWO candidates with TWO counters. Then verify both in a second pass.

## Why Two Candidates?
Math: if 3 elements each had >n/3 occurrences, total would exceed n. So max 2 majority elements.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Two passes |
| **Space** | **O(1)** | Two candidates + counts |`}],

    code: `class Solution:
    def majorityElement(self, nums: List[int]) -> List[int]:
        c1, c2, cand1, cand2 = 0, 0, 0, 1
        
        for n in nums:
            if n == cand1: c1 += 1
            elif n == cand2: c2 += 1
            elif c1 == 0: cand1, c1 = n, 1
            elif c2 == 0: cand2, c2 = n, 1
            else: c1, c2 = c1 - 1, c2 - 1
            
        res = []
        for c in [cand1, cand2]:
            if nums.count(c) > len(nums) // 3:
                res.append(c)
                
        return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [3, 2, 3];
        let c1 = 0, c2 = 0, cand1 = null, cand2 = null;

        yield {
            cl: 3, phase: "init", msg: "Initialize counts and 2 potential candidates",
            arr: nums, vars: { c1, c2, cand1: "null", cand2: "null" }
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 5, phase: "init", msg: `Read nums[${i}] = ${n}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 }
            };

            if (n === cand1) {
                c1++;
                yield { cl: 6, phase: "build", msg: `Matches cand1! Increment c1 to ${c1}`, arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 } };
            } else if (n === cand2) {
                c2++;
                yield { cl: 7, phase: "build", msg: `Matches cand2! Increment c2 to ${c2}`, arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 } };
            } else if (c1 === 0) {
                cand1 = n;
                c1 = 1;
                yield { cl: 8, phase: "build", msg: `c1 is 0! New cand1 = ${n}, c1 = 1`, arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 } };
            } else if (c2 === 0) {
                cand2 = n;
                c2 = 1;
                yield { cl: 9, phase: "build", msg: `c2 is 0! New cand2 = ${n}, c2 = 1`, arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 } };
            } else {
                c1--;
                c2--;
                yield { cl: 10, phase: "search", msg: `n matches neither. Decrement both counts. c1=${c1}, c2=${c2}`, arr: nums, ptrs: { [i]: "n" }, vars: { n, c1, cand1, c2, cand2 } };
            }
        }

        yield { cl: 12, phase: "init", msg: "Pass 1 complete. Now verify candidates in Pass 2.", arr: nums, vars: { cand1, cand2 } };

        const res = [];
        const threshold = Math.floor(nums.length / 3);

        for (const c of [cand1, cand2]) {
            if (c === null) continue;
            let actualCount = nums.filter(num => num === c).length;

            yield {
                cl: 14, phase: "search", msg: `Verify candidate ${c}. Count in array is ${actualCount}. Threshold is > ${threshold}`,
                arr: nums, vars: { "candidate": c, "actualCount": actualCount, "threshold": threshold, res: JSON.stringify(res) }
            };

            if (actualCount > threshold) {
                res.push(c);
                yield {
                    cl: 16, phase: "build", msg: `Yes! ${actualCount} > ${threshold}. Append to result.`,
                    arr: nums, vars: { "candidate": c, res: JSON.stringify(res) }
                };
            }
        }

        yield {
            cl: 18, phase: "done", msg: "Finished verification!",
            arr: nums, vars: { res: JSON.stringify(res) }, result: JSON.stringify(res)
        };
    }
};
