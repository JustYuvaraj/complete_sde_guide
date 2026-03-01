// src/engines/configs/lengthOfLastWord.js

export const lengthOfLastWordConfig = {
    title: "Length of Last Word",
    subtitle: () => 'Return length of the last word in the string',    defaults: { str: "   fly me   to   the moon  " },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given a string <code>s</code> consisting of words and spaces, return <em>the length of the <strong>last</strong> word in the string.</em></p>

<p>A <strong>word</strong> is a maximal <span data-keyword="substring-nonempty">substring</span> consisting of non-space characters only.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;Hello World&quot;
<strong>Output:</strong> 5
<strong>Explanation:</strong> The last word is &quot;World&quot; with length 5.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;   fly me   to   the moon  &quot;
<strong>Output:</strong> 4
<strong>Explanation:</strong> The last word is &quot;moon&quot; with length 4.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;luffy is still joyboy&quot;
<strong>Output:</strong> 6
<strong>Explanation:</strong> The last word is &quot;joyboy&quot; with length 6.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> consists of only English letters and spaces <code>&#39; &#39;</code>.</li>
	<li>There will be at least one word in <code>s</code>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Approach — Scan from the end
1. Skip trailing spaces
2. Count characters until next space or beginning

Scanning from the end is O(last word length) in best case.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Worst case scan entire string |
| **Space** | **O(1)** | Just a counter |`}],

    code: `class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        i, length = len(s) - 1, 0
        
        while s[i] == " ":
            i -= 1
            
        while i >= 0 and s[i] != " ":
            length += 1
            i -= 1
            
        return length`.split("\n"),

    generator: function* (args) {
        const str = args[0] || "   fly me   to   the moon  ";
        const arr = str.split("");

        let i = arr.length - 1;
        let length = 0;

        yield {
            cl: 3, phase: "init", msg: "Initialize pointer i at the end of the string, length to 0",
            arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length }
        };

        yield {
            cl: 5, phase: "search", msg: "Skip trailing spaces",
            arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length }
        };

        while (i >= 0 && arr[i] === " ") {
            i -= 1;
            yield {
                cl: 6, phase: "search", msg: "Space found. Decrement i.",
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length }
            };
        }

        yield {
            cl: 8, phase: "init", msg: "Found end of last word. Start counting length.",
            arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length }
        };

        while (i >= 0 && arr[i] !== " ") {
            length += 1;
            yield {
                cl: 9, phase: "build", msg: `Character '${arr[i]}' found. Increment length to ${length}`,
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length, "char": arr[i] }
            };
            i -= 1;
            if (i >= 0) {
                yield {
                    cl: 10, phase: "search", msg: `Move pointer i back to ${i}`,
                    arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { i, length }
                };
            }
        }

        yield {
            cl: 12, phase: "done", msg: `Space encountered or beginning of string reached. Last word length is ${length}`,
            arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [i]: "i" }, vars: { length }, result: String(length)
        };
    }
};
