// src/engines/configs/containsDuplicateII.js

export const containsDuplicateIIConfig = {
    title: "Contains Duplicate II",
    subtitle: () => 'Check if any two distinct indices i, j have nums[i] == nums[j] and abs(i-j) <= k',
    defaults: { nums: [1, 2, 3, 1], k: 3 },
    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> <em>if there are two <strong>distinct indices</strong> </em><code>i</code><em> and </em><code>j</code><em> in the array such that </em><code>nums[i] == nums[j]</code><em> and </em><code>abs(i - j) &lt;= k</code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,3,1], k = 3
<strong>Output:</strong> true
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,0,1,1], k = 1
<strong>Output:</strong> true
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [1,2,3,1,2,3], k = 2
<strong>Output:</strong> false
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>0 &lt;= k &lt;= 10<sup>5</sup></code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Core Insight
Use a HashMap storing value→last index. For each element, check if we've seen it within distance k.

## Approach
1. For each num, check if it's in map AND current index - stored index <= k
2. If yes → return true. Otherwise update the map with current index.

## Why HashMap?
O(1) lookup of the last seen position. Sliding window with a set also works (maintain set of size k).`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(min(n,k))** | Map stores at most k+1 entries |`}],

    code: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        window = {}
        
        for i in range(len(nums)):
            if nums[i] in window and abs(i - window[nums[i]]) <= k:
                return True
            window[nums[i]] = i
            
        return False`.split("\n"),

    generator: function* (args) {
        const nums = args[0] || [1, 2, 3, 1];
        const k = args[1] || 3;
        const window = {};

        yield {
            cl: 3, phase: "init", msg: `Initialize empty hash map to store value -> indices`,
            arr: nums, vars: { k }, map: {}, mapTitle: "Index Map"
        };

        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];
            yield {
                cl: 5, phase: "init", msg: `Checking nums[${i}] = ${n}`,
                arr: nums, ptrs: { [i]: "i" }, vars: { k, i, n }, map: { ...window }
            };

            if (n in window) {
                const prevIndex = window[n];
                yield {
                    cl: 6, phase: "search", msg: `Found ${n} in map at index ${prevIndex}. Is ${i} - ${prevIndex} <= ${k}?`,
                    arr: nums, ptrs: { [i]: "i", [prevIndex]: "prev" }, vars: { k, i, n, "distance": i - prevIndex },
                    map: { ...window }, mapActiveKey: String(n)
                };

                if (i - prevIndex <= k) {
                    yield {
                        cl: 7, phase: "done", msg: `Yes! Distance is <= ${k}. We found a nearby duplicate!`,
                        arr: nums, ptrs: { [i]: "i", [prevIndex]: "prev" }, vars: { k, i, n, "distance": i - prevIndex },
                        map: { ...window }, mapHighlightKey: String(n), result: "True"
                    };
                    return;
                } else {
                    yield {
                        cl: 6, phase: "search", msg: `No, distance ${i - prevIndex} is > ${k}. Keep going.`,
                        arr: nums, ptrs: { [i]: "i", [prevIndex]: "prev" }, vars: { k, i, n },
                        map: { ...window }
                    };
                }
            } else {
                yield {
                    cl: 6, phase: "search", msg: `${n} not in map.`,
                    arr: nums, ptrs: { [i]: "i" }, vars: { k, i, n }, map: { ...window }
                };
            }

            window[n] = i;
            yield {
                cl: 8, phase: "build", msg: `Store/Update index of ${n} in map as ${i}`,
                arr: nums, ptrs: { [i]: "i" }, vars: { k, i, n },
                map: { ...window }, mapActiveKey: String(n), mapStatus: "inserting"
            };
        }

        yield {
            cl: 10, phase: "done", msg: "Finished array. No nearby duplicates found.",
            arr: nums, vars: { k }, map: { ...window }, result: "False"
        };
    }
};
