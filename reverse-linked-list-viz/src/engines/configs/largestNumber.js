// src/engines/configs/largestNumber.js

export const largestNumberConfig = {
    title: "Largest Number",
    subtitle: () => 'Arrange a list of non-negative integers such that they form the largest number',    defaults: { nums: [3, 30, 34, 5, 9] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given a list of non-negative integers <code>nums</code>, arrange them such that they form the largest number and return it.</p>

<p>Since the result may be very large, so you need to return a string instead of an integer.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [10,2]
<strong>Output:</strong> &quot;210&quot;
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,30,34,5,9]
<strong>Output:</strong> &quot;9534330&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 100</code></li>
	<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Custom Comparator
Compare two numbers a,b by checking: is "ab" > "ba"? Sort with this comparator.

## Why?
"30" vs "3": "303" < "330", so "3" should come first. Concatenation comparison handles all edge cases.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n log n)** | Sorting with custom comparator |
| **Space** | **O(n)** | String conversions |`}],

    code: `class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        for i, n in enumerate(nums):
            nums[i] = str(n)
            
        def compare(n1, n2):
            if n1 + n2 > n2 + n1:
                return -1
            else:
                return 1
                
        nums = sorted(nums, key=cmp_to_key(compare))
        
        return str(int("".join(nums)))`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [3, 30, 34, 5, 9];
        // We will visualize a simple Bubble Sort to show the custom comparison logic clearly

        let strNums = nums.map(String);

        yield {
            cl: 3, phase: "init", msg: "Convert all integers to strings for comparison",
            arr: [...strNums], vars: { "Original nums": JSON.stringify(nums) }
        };

        let swapped;
        let n = strNums.length;

        yield {
            cl: 6, phase: "init", msg: "Sort the array using custom logic: 'A' + 'B' vs 'B' + 'A'",
            arr: [...strNums], vars: { "n": n, "algorithm": "Bubble Sort (for visualization)" }
        };

        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                const n1 = strNums[i];
                const n2 = strNums[i + 1];

                yield {
                    cl: 7, phase: "search", msg: `Compare n1="${n1}" and n2="${n2}". Which combination is bigger? "${n1}${n2}" or "${n2}${n1}"?`,
                    arr: [...strNums], ptrs: { [i]: "n1", [i + 1]: "n2" }, vars: { n1, n2, "n1+n2": n1 + n2, "n2+n1": n2 + n1 }
                };

                if (n1 + n2 < n2 + n1) {
                    yield {
                        cl: 8, phase: "build", msg: `"${n1}${n2}" < "${n2}${n1}". This means n2 should come before n1! Swapping them.`,
                        arr: [...strNums], ptrs: { [i]: "n1", [i + 1]: "n2" }, vars: { n1, n2 }
                    };

                    const temp = strNums[i];
                    strNums[i] = strNums[i + 1];
                    strNums[i + 1] = temp;
                    swapped = true;

                    yield {
                        cl: 9, phase: "build", msg: "Swapped.",
                        arr: [...strNums], ptrs: { [i]: "n2", [i + 1]: "n1" }, vars: { n1, n2 }
                    };
                } else {
                    yield {
                        cl: 10, phase: "search", msg: `"${n1}${n2}" >= "${n2}${n1}". Order is correct. No swap.`,
                        arr: [...strNums], ptrs: { [i]: "n1", [i + 1]: "n2" }, vars: { n1, n2 }
                    };
                }
            }
            n--;
        } while (swapped);

        yield {
            cl: 13, phase: "init", msg: "Array is fully sorted in custom descending order.",
            arr: [...strNums], vars: {}
        };

        let finalStr = strNums.join("");
        // Handle edge case where all numbers are 0
        if (finalStr[0] === "0") {
            finalStr = "0";
            yield {
                cl: 15, phase: "build", msg: "Edge case: Joined string starts with '0'. All numbers were 0. Return '0'.",
                arr: [...strNums], vars: { finalStr: `"${finalStr}"` }
            };
        } else {
            yield {
                cl: 15, phase: "done", msg: "Join array into the final Largest Number string!",
                arr: [...strNums], vars: { finalStr: `"${finalStr}"` }, result: `"${finalStr}"`
            };
        }
    }
};
