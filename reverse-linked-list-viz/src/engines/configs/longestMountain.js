// src/engines/configs/longestMountain.js

export const longestMountainConfig = {
    title: "Longest Mountain in Array",
    subtitle: () => 'Find the longest subarray that forms a mountain (increase then decrease)',    defaults: { arr: [2, 1, 4, 7, 3, 2, 5] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>You may recall that an array <code>arr</code> is a <strong>mountain array</strong> if and only if:</p>

<ul>
	<li><code>arr.length &gt;= 3</code></li>
	<li>There exists some index <code>i</code> (<strong>0-indexed</strong>) with <code>0 &lt; i &lt; arr.length - 1</code> such that:
	<ul>
		<li><code>arr[0] &lt; arr[1] &lt; ... &lt; arr[i - 1] &lt; arr[i]</code></li>
		<li><code>arr[i] &gt; arr[i + 1] &gt; ... &gt; arr[arr.length - 1]</code></li>
	</ul>
	</li>
</ul>

<p>Given an integer array <code>arr</code>, return <em>the length of the longest subarray, which is a mountain</em>. Return <code>0</code> if there is no mountain subarray.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> arr = [2,1,4,7,3,2,5]
<strong>Output:</strong> 5
<strong>Explanation:</strong> The largest mountain is [1,4,7,3,2] which has length 5.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> arr = [2,2,2]
<strong>Output:</strong> 0
<strong>Explanation:</strong> There is no mountain.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= arr.length &lt;= 10<sup>4</sup></code></li>
	<li><code>0 &lt;= arr[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong></p>

<ul>
	<li>Can you solve it using only one pass?</li>
	<li>Can you solve it in <code>O(1)</code> space?</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two-Pass or Expand from Peak
For each potential peak (arr[i] > arr[i-1] and arr[i] > arr[i+1]):
Expand left while increasing, expand right while decreasing. Total length = left + right + 1.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each element visited at most twice |
| **Space** | **O(1)** | Just pointers |`}],

    code: `class Solution:
    def longestMountain(self, arr: List[int]) -> int:
        res = 0
        
        for i in range(1, len(arr) - 1):
            if arr[i - 1] < arr[i] > arr[i + 1]:
                l = r = i
                
                while l > 0 and arr[l] > arr[l - 1]:
                    l -= 1
                    
                while r < len(arr) - 1 and arr[r] > arr[r + 1]:
                    r += 1
                    
                res = max(res, (r - l + 1))
                
        return res`.split("\n"),

    generator: function* (args) {
        const arr = args[0] || [2, 1, 4, 7, 3, 2, 5];
        let res = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize max mountain length result to 0",
            arr, vars: { res }
        };

        for (let i = 1; i < arr.length - 1; i++) {
            yield {
                cl: 5, phase: "init", msg: `Check if index ${i} is a mountain peak`,
                arr, ptrs: { [i - 1]: "prev", [i]: "peak", [i + 1]: "next" }, vars: { res, i, "arr[i]": arr[i] }
            };

            if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
                yield {
                    cl: 7, phase: "build", msg: `Peak found at ${i}! It is greater than both left and right neighbors. Expand outwards.`,
                    arr, ptrs: { [i]: "peak" }, vars: { res, i }
                };

                let l = i;
                let r = i;

                while (l > 0 && arr[l] > arr[l - 1]) {
                    l -= 1;
                    yield {
                        cl: 10, phase: "search", msg: `Expand left pointer downhill. arr[${l + 1}] > arr[${l}], so l=${l}`,
                        arr, ptrs: { [l]: "l", [i]: "peak", [r]: "r" }, vars: { res, i, l, r }
                    };
                }

                while (r < arr.length - 1 && arr[r] > arr[r + 1]) {
                    r += 1;
                    yield {
                        cl: 13, phase: "search", msg: `Expand right pointer downhill. arr[${r - 1}] > arr[${r}], so r=${r}`,
                        arr, ptrs: { [l]: "l", [i]: "peak", [r]: "r" }, vars: { res, i, l, r }
                    };
                }

                const currentMountainLen = r - l + 1;
                res = Math.max(res, currentMountainLen);

                yield {
                    cl: 15, phase: "build", msg: `Mountain bounds found: [${l}, ${r}]. Length is ${currentMountainLen}. Max length is now ${res}.`,
                    arr, ptrs: { [l]: "l", [i]: "peak", [r]: "r" }, vars: { res, i, l, r, "current_len": currentMountainLen }
                };
            } else {
                yield {
                    cl: 6, phase: "search", msg: `Index ${i} is NOT a peak. Skip to next index.`,
                    arr, ptrs: { [i]: "i" }, vars: { res, i }
                };
            }
        }

        yield {
            cl: 17, phase: "done", msg: "Finished array scan. Return max mountain length.",
            arr, vars: { res }, result: String(res)
        };
    }
};
