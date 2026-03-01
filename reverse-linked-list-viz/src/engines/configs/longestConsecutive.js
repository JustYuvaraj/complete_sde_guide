// src/engines/configs/longestConsecutive.js

export const longestConsecutiveConfig = {
    title: "Longest Consecutive Sequence",
    subtitle: () => 'Find the longest consecutive elements sequence in O(n) time',
    defaults: { nums: [100, 4, 200, 1, 3, 2] },

    panels: ["hashset"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an unsorted array of integers <code>nums</code>, return <em>the length of the longest consecutive elements sequence.</em></p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [100,4,200,1,3,2]
<strong>Output:</strong> 4
<strong>Explanation:</strong> The longest consecutive elements sequence is <code>[1, 2, 3, 4]</code>. Therefore its length is 4.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [0,3,7,2,5,8,4,6,0,1]
<strong>Output:</strong> 9
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,0,1,2]
<strong>Output:</strong> 3
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Core Insight
Put all numbers in a **HashSet**. Only start counting from numbers that are the **start of a sequence** (num-1 NOT in set).

## Approach
1. Add all nums to a Set
2. For each num: if num-1 NOT in set → it's a sequence start
3. Count consecutive: num, num+1, num+2... while in set
4. Track the maximum length

## Why This Is O(n)
Each number is visited at most twice (once in the loop, once in the while chain). The "num-1 not in set" check ensures we don't re-count mid-sequence numbers.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element processed at most twice |
| **Space** | **O(n)** | HashSet stores all elements |

## Common Mistake
Don't sort first (O(n log n)). The HashSet approach is optimal at O(n).`
        }
    ],

    code: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        numSet = set(nums)
        longest = 0
        
        for n in nums:
            if (n - 1) not in numSet:
                length = 1
                while (n + length) in numSet:
                    length += 1
                longest = max(length, longest)
        
        return longest`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [100, 4, 200, 1, 3, 2];
        const numSet = new Set(nums);

        yield {
            cl: 3, phase: "init", msg: "Initialize HashSet with all numbers for O(1) lookups",
            arr: nums, vars: {}, set: Array.from(numSet), setTitle: "numSet"
        };

        let longest = 0;
        yield {
            cl: 4, phase: "init", msg: "Initialize longest = 0",
            arr: nums, vars: { longest }, set: Array.from(numSet), setTitle: "numSet"
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];

            yield {
                cl: 6, phase: "init", msg: `Evaluating number '${n}' from array`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, longest },
                set: Array.from(numSet), setActiveKey: String(n)
            };

            const hasPrev = numSet.has(n - 1);
            yield {
                cl: 7, phase: "search", msg: `Check if '${n}' is the START of a sequence. Is (${n}-1) = ${n - 1} in the set? ${hasPrev}`,
                arr: nums, ptrs: { [i]: "n" }, vars: { n, "(n - 1)": n - 1, longest },
                set: Array.from(numSet), setHighlightKey: hasPrev ? String(n - 1) : null
            };

            if (!hasPrev) {
                let length = 1;
                yield {
                    cl: 8, phase: "build", msg: `Yes! '${n}' is the start of a sequence. Length = 1`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, length, longest }, set: Array.from(numSet)
                };

                while (numSet.has(n + length)) {
                    yield {
                        cl: 9, phase: "search", msg: `Is (${n}+${length}) = ${n + length} in the set?`,
                        arr: nums, ptrs: { [i]: "n" }, vars: { n, "check": n + length, length, longest },
                        set: Array.from(numSet), setHighlightKey: String(n + length)
                    };

                    length += 1;

                    yield {
                        cl: 10, phase: "build", msg: `Found ${n + length - 1}! Increment length to ${length}`,
                        arr: nums, ptrs: { [i]: "n" }, vars: { n, length, longest },
                        set: Array.from(numSet), setActiveKey: String(n + length - 1)
                    };
                }

                yield {
                    cl: 9, phase: "search", msg: `Number ${n + length} is NOT in the set. Sequence ended.`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, "check": n + length, length, longest },
                    set: Array.from(numSet)
                };

                const oldLongest = longest;
                longest = Math.max(length, longest);
                yield {
                    cl: 11, phase: "build", msg: `Update longest: max(${length}, ${oldLongest}) = ${longest}`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, length, longest }, set: Array.from(numSet)
                };
            } else {
                yield {
                    cl: 7, phase: "search", msg: `No, ${n - 1} is in the set. '${n}' is NOT the start of a sequence. Skip it.`,
                    arr: nums, ptrs: { [i]: "n" }, vars: { n, longest }, set: Array.from(numSet)
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: `Finished array! Longest sequence found is ${longest}`,
            arr: nums, vars: { longest }, result: String(longest), set: Array.from(numSet)
        };
    }
};
