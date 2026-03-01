// src/engines/configs/hIndex.js

export const hIndexConfig = {
    title: "H-Index",
    subtitle: () => 'Find maximum h such that h papers have at least h citations',    defaults: { citations: [3, 0, 6, 1, 5] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an array of integers <code>citations</code> where <code>citations[i]</code> is the number of citations a researcher received for their <code>i<sup>th</sup></code> paper, return <em>the researcher&#39;s h-index</em>.</p>

<p>According to the <a href="https://en.wikipedia.org/wiki/H-index" target="_blank">definition of h-index on Wikipedia</a>: The h-index is defined as the maximum value of <code>h</code> such that the given researcher has published at least <code>h</code> papers that have each been cited at least <code>h</code> times.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> citations = [3,0,6,1,5]
<strong>Output:</strong> 3
<strong>Explanation:</strong> [3,0,6,1,5] means the researcher has 5 papers in total and each of them had received 3, 0, 6, 1, 5 citations respectively.
Since the researcher has 3 papers with at least 3 citations each and the remaining two with no more than 3 citations each, their h-index is 3.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> citations = [1,3,1]
<strong>Output:</strong> 1
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>n == citations.length</code></li>
	<li><code>1 &lt;= n &lt;= 5000</code></li>
	<li><code>0 &lt;= citations[i] &lt;= 1000</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Bucket Sort Approach
Create buckets [0..n]. Count papers by citation (cap at n). Scan from high to low, accumulate counts until count >= bucket index.

## Why Not Just Sort?
Sorting works (O(n log n)) but bucket sort gives O(n). Citations > n are equivalent to n.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Bucket sort |
| **Space** | **O(n)** | Bucket array |`}],

    code: `class Solution:
    def hIndex(self, citations: List[int]) -> int:
        n = len(citations)
        counts = [0] * (n + 1)
        
        for c in citations:
            if c >= n:
                counts[n] += 1
            else:
                counts[c] += 1
                
        h = 0
        for i in range(n, -1, -1):
            h += counts[i]
            if h >= i:
                return i
                
        return 0`.split("\n"),

    generator: function* (args) {
        const citations = args[0] || [3, 0, 6, 1, 5];
        const n = citations.length;
        const counts = Array(n + 1).fill(0);

        yield {
            cl: 3, phase: "init", msg: `Initialize frequency array 'counts' of size ${n + 1}`,
            arr: citations, vars: { n }, map: Object.fromEntries(counts.map((c, i) => [i, c])), mapTitle: "Counts Array"
        };

        for (let j = 0; j < citations.length; j++) {
            const c = citations[j];

            yield {
                cl: 6, phase: "init", msg: `Paper ${j} has ${c} citations`,
                arr: citations, ptrs: { [j]: "c" }, vars: { c, n }, map: Object.fromEntries(counts.map((num, i) => [i, num]))
            };

            if (c >= n) {
                counts[n] += 1;
                yield {
                    cl: 8, phase: "build", msg: `${c} >= ${n}. Cap at ${n} and increment counts[${n}]`,
                    arr: citations, ptrs: { [j]: "c" }, vars: { c, n },
                    map: Object.fromEntries(counts.map((num, i) => [i, num])), mapActiveKey: String(n)
                };
            } else {
                counts[c] += 1;
                yield {
                    cl: 10, phase: "build", msg: `${c} < ${n}. Increment counts[${c}]`,
                    arr: citations, ptrs: { [j]: "c" }, vars: { c, n },
                    map: Object.fromEntries(counts.map((num, i) => [i, num])), mapActiveKey: String(c)
                };
            }
        }

        let h = 0;
        yield { cl: 12, phase: "init", msg: "Now accumulate citations from highest possible h down to 0", arr: citations, vars: { h }, map: Object.fromEntries(counts.map((num, i) => [i, num])) };

        for (let i = n; i >= 0; i--) {
            h += counts[i];

            yield {
                cl: 14, phase: "search", msg: `Check h = ${i}. Accumulate counts[${i}] (${counts[i]}). Total h papers = ${h}`,
                arr: citations, vars: { i, h, "counts[i]": counts[i] },
                map: Object.fromEntries(counts.map((num, k) => [k, num])), mapHighlightKey: String(i)
            };

            if (h >= i) {
                yield {
                    cl: 16, phase: "done", msg: `Total papers with >= ${i} citations is ${h} (which is >= ${i}). Thus H-Index is ${i}!`,
                    arr: citations, vars: { i, h },
                    map: Object.fromEntries(counts.map((num, k) => [k, num])), result: String(i)
                };
                return;
            }
        }

        yield { cl: 18, phase: "done", msg: "Array processed. No positive h-index. Return 0.", arr: citations, vars: {}, result: "0" };
    }
};
