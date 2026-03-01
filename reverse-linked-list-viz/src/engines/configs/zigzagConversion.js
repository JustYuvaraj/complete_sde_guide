// src/engines/configs/zigzagConversion.js

export const zigzagConversionConfig = {
    title: "Zigzag Conversion",
    subtitle: (args) => `Convert the string into a zigzag pattern with ${args[1] || 3} rows`,    defaults: { s: "PAYPALISHIRING", numRows: 3 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>The string <code>&quot;PAYPALISHIRING&quot;</code> is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)</p>

<pre>
P   A   H   N
A P L S I I G
Y   I   R
</pre>

<p>And then read line by line: <code>&quot;PAHNAPLSIIGYIR&quot;</code></p>

<p>Write the code that will take a string and make this conversion given a number of rows:</p>

<pre>
string convert(string s, int numRows);
</pre>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 3
<strong>Output:</strong> &quot;PAHNAPLSIIGYIR&quot;
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 4
<strong>Output:</strong> &quot;PINALSIGYAHRPI&quot;
<strong>Explanation:</strong>
P     I    N
A   L S  I G
Y A   H R
P     I
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;A&quot;, numRows = 1
<strong>Output:</strong> &quot;A&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 1000</code></li>
	<li><code>s</code> consists of English letters (lower-case and upper-case), <code>&#39;,&#39;</code> and <code>&#39;.&#39;</code>.</li>
	<li><code>1 &lt;= numRows &lt;= 1000</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Row Simulation
Create numRows buckets. Simulate the zigzag: move down rows 0→n-1, then back up n-2→1, repeating.
Each char goes to its current row bucket. Concatenate all buckets.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Visit each character once |
| **Space** | **O(n)** | Row buckets |`}],

    code: `class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1: return s
        
        res = ""
        for r in range(numRows):
            increment = 2 * (numRows - 1)
            for i in range(r, len(s), increment):
                res += s[i]
                if (r > 0 and r < numRows - 1 and 
                    i + increment - 2 * r < len(s)):
                    res += s[i + increment - 2 * r]
                    
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "PAYPALISHIRING";
        const numRows = args[1] || 3;
        const arr = s.split("");

        yield {
            cl: 3, phase: "init", msg: "Check if numRows is 1.",
            arr, vars: { numRows, "len(s)": s.length }
        };
        if (numRows === 1) {
            yield { cl: 3, phase: "done", msg: "numRows is 1, return original string.", arr, vars: {}, result: `"${s}"` };
            return;
        }

        let res = "";

        for (let r = 0; r < numRows; r++) {
            const increment = 2 * (numRows - 1);

            yield {
                cl: 6, phase: "init", msg: `Processing Row ${r}. Base jump increment = ${increment}`,
                arr, ptrs: { [r]: "r", [increment]: "inc" }, vars: { res: `"${res}"`, r, numRows, increment }
            };

            for (let i = r; i < s.length; i += increment) {
                res += s[i];
                yield {
                    cl: 9, phase: "build", msg: `Append main column char s[${i}] = '${s[i]}'`,
                    arr, ptrs: { [i]: "i" }, vars: { r, i, increment, res: `"${res}"` }
                };

                // check intermediate diagonal char
                const diagonalIdx = i + increment - 2 * r;
                if (r > 0 && r < numRows - 1 && diagonalIdx < s.length) {
                    yield {
                        cl: 10, phase: "search", msg: `Middle row! Checking diagonal char at index ${diagonalIdx}`,
                        arr, ptrs: { [i]: "i", [diagonalIdx]: "diag" }, vars: { r, i, increment, "diagonalIdx": diagonalIdx, res: `"${res}"` }
                    };

                    res += s[diagonalIdx];
                    yield {
                        cl: 12, phase: "build", msg: `Append diagonal char '${s[diagonalIdx]}'`,
                        arr, ptrs: { [i]: "i", [diagonalIdx]: "diag" }, vars: { r, i, res: `"${res}"` }
                    };
                }
            }
        }

        yield {
            cl: 14, phase: "done", msg: "Iterated through all rows. Zigzag string created.",
            arr, vars: { numRows }, result: `"${res}"`
        };
    }
};
