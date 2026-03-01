// src/engines/configs/productExceptSelf.js

export const productExceptSelfConfig = {
    title: "Product of Array Except Self",
    subtitle: () => "Calculate product of all elements except self in O(n) without division",
    defaults: { nums: [1, 2, 3, 4] },
    panels: [], // No hashmap needed

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>

<p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time and without using the division operation.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,2,3,4]
<strong>Output:</strong> [24,12,8,6]
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [-1,1,0,-3,3]
<strong>Output:</strong> [0,0,9,0,0]
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-30 &lt;= nums[i] &lt;= 30</code></li>
	<li>The input is generated such that <code>answer[i]</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong>&nbsp;Can you solve the problem in <code>O(1)</code>&nbsp;extra&nbsp;space complexity? (The output array <strong>does not</strong> count as extra space for space complexity analysis.)</p>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Core Insight
answer[i] = (product of everything LEFT of i) × (product of everything RIGHT of i)

## Approach — Two Passes
1. **Left pass:** build prefix products left-to-right
2. **Right pass:** multiply in suffix products right-to-left
3. Result array stores the final products

## Why Two Passes?
Without division, we can't just compute total product / nums[i]. But prefix × suffix gives the same result. Each pass is O(n), total O(n).`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Two linear passes |
| **Space** | **O(1)** | Output array doesn't count as extra space |

## Key Pattern
**Prefix/Suffix decomposition** — whenever you need "all except current," think left product × right product.`
        }
    ],

    code: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        res = [1] * len(nums)
        
        prefix = 1
        for i in range(len(nums)):
            res[i] = prefix
            prefix *= nums[i]
            
        postfix = 1
        for i in range(len(nums) - 1, -1, -1):
            res[i] *= postfix
            postfix *= nums[i]
            
        return res`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 2, 3, 4];
        const res = Array(nums.length).fill(1);

        yield {
            cl: 3, phase: "init", msg: "Initialize results array with 1s",
            arr: res, vars: { "nums": JSON.stringify(nums) }
        };

        let prefix = 1;
        yield {
            cl: 5, phase: "init", msg: "Initialize prefix product = 1",
            arr: res, vars: { prefix, "nums": JSON.stringify(nums) }
        };

        for (let i = 0; i < nums.length; i++) {
            res[i] = prefix;
            yield {
                cl: 7, phase: "build", msg: `Set res[${i}] to current prefix (${prefix})`,
                arr: [...res], ptrs: { [i]: "i" }, vars: { i, prefix, "nums": JSON.stringify(nums) }
            };

            prefix *= nums[i];
            yield {
                cl: 8, phase: "search", msg: `Multiply prefix by nums[${i}] (${nums[i]}) -> ${prefix}`,
                arr: [...res], ptrs: { [i]: "i" }, vars: { i, prefix, "nums[i]": nums[i] }
            };
        }

        let postfix = 1;
        yield {
            cl: 10, phase: "init", msg: "First pass complete. Now initialize postfix product = 1",
            arr: [...res], vars: { postfix, "nums": JSON.stringify(nums) }
        };

        for (let i = nums.length - 1; i >= 0; i--) {
            res[i] *= postfix;
            yield {
                cl: 12, phase: "build", msg: `Multiply res[${i}] by current postfix (${postfix}) -> ${res[i]}`,
                arr: [...res], ptrs: { [i]: "i" }, vars: { i, postfix, "nums[i]": nums[i] }
            };

            postfix *= nums[i];
            yield {
                cl: 13, phase: "search", msg: `Multiply postfix by nums[${i}] (${nums[i]}) -> ${postfix}`,
                arr: [...res], ptrs: { [i]: "i" }, vars: { i, postfix, "nums[i]": nums[i] }
            };
        }

        yield {
            cl: 15, phase: "done", msg: "Return final results array",
            arr: [...res], result: JSON.stringify(res), vars: {}
        };
    }
};
