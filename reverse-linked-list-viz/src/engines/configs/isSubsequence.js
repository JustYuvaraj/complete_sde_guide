// src/engines/configs/isSubsequence.js

export const isSubsequenceConfig = {
    title: "Is Subsequence",
    subtitle: () => "Check if the first string is a subsequence of the second using two pointers",    defaults: { s: "abc", t: "ahbgdc" },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code><em> if </em><code>s</code><em> is a <strong>subsequence</strong> of </em><code>t</code><em>, or </em><code>false</code><em> otherwise</em>.</p>

<p>A <strong>subsequence</strong> of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., <code>&quot;ace&quot;</code> is a subsequence of <code>&quot;<u>a</u>b<u>c</u>d<u>e</u>&quot;</code> while <code>&quot;aec&quot;</code> is not).</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> s = "abc", t = "ahbgdc"
<strong>Output:</strong> true
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> s = "axc", t = "ahbgdc"
<strong>Output:</strong> false
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 100</code></li>
	<li><code>0 &lt;= t.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> and <code>t</code> consist only of lowercase English letters.</li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> Suppose there are lots of incoming <code>s</code>, say <code>s<sub>1</sub>, s<sub>2</sub>, ..., s<sub>k</sub></code> where <code>k &gt;= 10<sup>9</sup></code>, and you want to check one by one to see if <code>t</code> has its subsequence. In this scenario, how would you change your code?
`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers — Greedy
Pointer i on s, pointer j on t. When s[i]==t[j], advance i. Always advance j.
If i reaches end of s → it's a subsequence.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass through t |
| **Space** | **O(1)** | Two pointers |`}],

    code: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i, j = 0, 0
        
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1
            j += 1
            
        return i == len(s)`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "abc";
        const t = args[1] || "ahbgdc";

        // Since we have two independent strings, let's represent them as a single array view
        // with distinct sections. E.g., ["[s]", "a", "b", "c", "[t]", "a", "h", "b", "g", "d", "c"]
        const sArr = s.split("");
        const tArr = t.split("");

        const combined = ["[s:]", ...sArr, " | [t:]", ...tArr];

        const mapPtrI = (idx) => 1 + idx; // Offset past "[s:]"
        const mapPtrJ = (idx) => 1 + sArr.length + 1 + idx; // Offset past s elements, separator, "[t:]"

        yield {
            cl: 3, phase: "init", msg: "Initialize pointer i for string 's' and pointer j for string 't'",
            arr: combined, ptrs: { [mapPtrI(0)]: "i", [mapPtrJ(0)]: "j" }, vars: { i: 0, j: 0, "len(s)": s.length, "len(t)": t.length }
        };

        let i = 0;
        let j = 0;

        while (i < s.length && j < t.length) {
            yield {
                cl: 6, phase: "search", msg: `Compare s[${i}] = '${s[i]}' with t[${j}] = '${t[j]}'`,
                arr: combined, ptrs: { [mapPtrI(i)]: "i", [mapPtrJ(j)]: "j" }, vars: { i, j, "s[i]": `"${s[i]}"`, "t[j]": `"${t[j]}"` }
            };

            if (s[i] === t[j]) {
                yield {
                    cl: 7, phase: "build", msg: `Match found! Advance BOTH pointers to check next character of s.`,
                    arr: combined, ptrs: { [mapPtrI(i)]: "MATCH", [mapPtrJ(j)]: "MATCH" }, vars: { i, j }
                };
                i++;
            } else {
                yield {
                    cl: 8, phase: "search", msg: `No match. Advance ONLY j to continue searching through t.`,
                    arr: combined, ptrs: { [mapPtrI(i)]: "i", [mapPtrJ(j)]: "skip" }, vars: { i, j }
                };
            }
            j++;
        }

        if (i === s.length) {
            yield {
                cl: 10, phase: "done", msg: `i reached length of s (${i} == ${s.length}). All characters of 's' found in 't'! Return True.`,
                arr: combined, ptrs: { [mapPtrJ(Math.min(j, t.length - 1))]: "j_end" }, vars: { i, j }, result: "True"
            };
        } else {
            yield {
                cl: 10, phase: "done", msg: `j reached end of t before i finished s (${i} != ${s.length}). 's' is not a subsequence. Return False.`,
                arr: combined, ptrs: { [mapPtrI(i)]: "stuck", [mapPtrJ(Math.min(j, t.length - 1))]: "j_end" }, vars: { i, j }, result: "False"
            };
        }
    }
};
