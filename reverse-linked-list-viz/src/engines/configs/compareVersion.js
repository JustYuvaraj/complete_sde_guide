// src/engines/configs/compareVersion.js

export const compareVersionConfig = {
    title: "Compare Version Numbers",
    subtitle: () => 'Compare two version strings parsed as arrays of integers',
    defaults: { version1: "1.01", version2: "1.001" },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given two <strong>version strings</strong>, <code>version1</code> and <code>version2</code>, compare them. A version string consists of <strong>revisions</strong> separated by dots <code>&#39;.&#39;</code>. The <strong>value of the revision</strong> is its <strong>integer conversion</strong> ignoring leading zeros.</p>

<p>To compare version strings, compare their revision values in <strong>left-to-right order</strong>. If one of the version strings has fewer revisions, treat the missing revision values as <code>0</code>.</p>

<p>Return the following:</p>

<ul>
	<li>If <code>version1 &lt; version2</code>, return -1.</li>
	<li>If <code>version1 &gt; version2</code>, return 1.</li>
	<li>Otherwise, return 0.</li>
</ul>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">version1 = &quot;1.2&quot;, version2 = &quot;1.10&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">-1</span></p>

<p><strong>Explanation:</strong></p>

<p>version1&#39;s second revision is &quot;2&quot; and version2&#39;s second revision is &quot;10&quot;: 2 &lt; 10, so version1 &lt; version2.</p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">version1 = &quot;1.01&quot;, version2 = &quot;1.001&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">0</span></p>

<p><strong>Explanation:</strong></p>

<p>Ignoring leading zeroes, both &quot;01&quot; and &quot;001&quot; represent the same integer &quot;1&quot;.</p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">version1 = &quot;1.0&quot;, version2 = &quot;1.0.0.0&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">0</span></p>

<p><strong>Explanation:</strong></p>

<p>version1 has less revisions, which means every missing revision are treated as &quot;0&quot;.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= version1.length, version2.length &lt;= 500</code></li>
	<li><code>version1</code> and <code>version2</code>&nbsp;only contain digits and <code>&#39;.&#39;</code>.</li>
	<li><code>version1</code> and <code>version2</code>&nbsp;<strong>are valid version numbers</strong>.</li>
	<li>All the given revisions in&nbsp;<code>version1</code> and <code>version2</code>&nbsp;can be stored in&nbsp;a&nbsp;<strong>32-bit integer</strong>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Split and Compare
Split by '.', compare each revision as integers. Missing revisions = 0.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n+m)** | Parse both strings |
| **Space** | **O(n+m)** | Split arrays |`}],

    code: `class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        v1 = version1.split(".")
        v2 = version2.split(".")
        
        for i in range(max(len(v1), len(v2))):
            num1 = int(v1[i]) if i < len(v1) else 0
            num2 = int(v2[i]) if i < len(v2) else 0
            
            if num1 < num2:
                return -1
            if num1 > num2:
                return 1
                
        return 0`.split("\n"),

    generator: function* (args) {
        const version1 = args[0] || "1.01";
        const version2 = args[1] || "1.001";

        const v1 = version1.split(".");
        const v2 = version2.split(".");

        yield {
            cl: 3, phase: "init", msg: "Split both version strings by '.' delimiter",
            arr: ["[v1:]", ...v1, "[v2:]", ...v2], vars: { version1: `"${version1}"`, version2: `"${version2}"` }
        };

        const limit = Math.max(v1.length, v2.length);
        yield {
            cl: 6, phase: "init", msg: `Iterate up to max length (${limit}) padding missing values with 0`,
            arr: ["[v1:]", ...v1, "[v2:]", ...v2], vars: { "max_len": limit }
        };

        for (let i = 0; i < limit; i++) {
            const num1 = i < v1.length ? parseInt(v1[i], 10) : 0;
            const num2 = i < v2.length ? parseInt(v2[i], 10) : 0;

            const p1 = i < v1.length ? i + 1 : undefined; // offset by 1 for "[v1:]"
            const p2 = i < v2.length ? v1.length + 2 + i : undefined; // offset by length of v1 + 2

            let ptrs = {};
            if (p1 !== undefined) ptrs[p1] = "i";
            if (p2 !== undefined) ptrs[p2] = "i";

            yield {
                cl: 7, phase: "init", msg: `Comparing revision chunk ${i}. Parse as integers.`,
                arr: ["[v1:]", ...v1, "[v2:]", ...v2], ptrs, vars: { i, num1, num2 }
            };

            if (num1 < num2) {
                yield {
                    cl: 11, phase: "done", msg: `${num1} < ${num2}. version1 is smaller. Return -1`,
                    arr: ["[v1:]", ...v1, "[v2:]", ...v2], ptrs, vars: { i, num1, num2 }, result: "-1"
                };
                return;
            }
            if (num1 > num2) {
                yield {
                    cl: 13, phase: "done", msg: `${num1} > ${num2}. version1 is larger. Return 1`,
                    arr: ["[v1:]", ...v1, "[v2:]", ...v2], ptrs, vars: { i, num1, num2 }, result: "1"
                };
                return;
            }

            yield {
                cl: 12, phase: "search", msg: `${num1} == ${num2}. They are equal. Continue to next revision chunk.`,
                arr: ["[v1:]", ...v1, "[v2:]", ...v2], ptrs, vars: { i, num1, num2 }
            };
        }

        yield {
            cl: 15, phase: "done", msg: "All chunks compared and are equal. Return 0.",
            arr: ["[v1:]", ...v1, "[v2:]", ...v2], vars: {}, result: "0"
        };
    }
};
