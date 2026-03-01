// src/engines/configs/countAndSay.js

export const countAndSayConfig = {
    title: "Count and Say",
    subtitle: (args) => `Generate the ${args[0] || 4}th term of the count-and-say sequence`,
    defaults: { n: 4 },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>The <strong>count-and-say</strong> sequence is a sequence of digit strings defined by the recursive formula:</p>

<ul>
	<li><code>countAndSay(1) = &quot;1&quot;</code></li>
	<li><code>countAndSay(n)</code> is the run-length encoding of <code>countAndSay(n - 1)</code>.</li>
</ul>

<p><a href="http://en.wikipedia.org/wiki/Run-length_encoding" target="_blank">Run-length encoding</a> (RLE) is a string compression method that works by replacing consecutive identical characters (repeated 2 or more times) with the concatenation of the character and the number marking the count of the characters (length of the run). For example, to compress the string <code>&quot;3322251&quot;</code> we replace <code>&quot;33&quot;</code> with <code>&quot;23&quot;</code>, replace <code>&quot;222&quot;</code> with <code>&quot;32&quot;</code>, replace <code>&quot;5&quot;</code> with <code>&quot;15&quot;</code> and replace <code>&quot;1&quot;</code> with <code>&quot;11&quot;</code>. Thus the compressed string becomes <code>&quot;23321511&quot;</code>.</p>

<p>Given a positive integer <code>n</code>, return <em>the </em><code>n<sup>th</sup></code><em> element of the <strong>count-and-say</strong> sequence</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 4</span></p>

<p><strong>Output:</strong> <span class="example-io">&quot;1211&quot;</span></p>

<p><strong>Explanation:</strong></p>

<pre>
countAndSay(1) = &quot;1&quot;
countAndSay(2) = RLE of &quot;1&quot; = &quot;11&quot;
countAndSay(3) = RLE of &quot;11&quot; = &quot;21&quot;
countAndSay(4) = RLE of &quot;21&quot; = &quot;1211&quot;
</pre>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 1</span></p>

<p><strong>Output:</strong> <span class="example-io">&quot;1&quot;</span></p>

<p><strong>Explanation:</strong></p>

<p>This is the base case.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= n &lt;= 30</code></li>
</ul>

<p>&nbsp;</p>
<strong>Follow up:</strong> Could you solve it iteratively?
`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Iterative Simulation
Build each term from the previous by counting consecutive identical digits. "Run-length encoding" of the previous string.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n·m)** | n iterations, m = string length |
| **Space** | **O(m)** | Current string |`}],

    code: `class Solution:
    def countAndSay(self, n: int) -> str:
        s = "1"
        for _ in range(n - 1):
            next_s = ""
            i = 0
            while i < len(s):
                count = 1
                while i + 1 < len(s) and s[i] == s[i + 1]:
                    count += 1
                    i += 1
                next_s += str(count) + s[i]
                i += 1
            s = next_s
        return s`.split("\n"),

    generator: function* (args) {
        const n = parseInt(args[0]) || 4;
        let s = "1";

        yield {
            cl: 3, phase: "init", msg: "Base case: The sequence starts with '1'",
            arr: s.split(""), vars: { n, s: `"${s}"` }
        };

        for (let iter = 1; iter < n; iter++) {
            let next_s = "";
            let i = 0;
            const arr = s.split("");

            yield {
                cl: 5, phase: "init", msg: `Generating term ${iter + 1} from previous term "${s}"`,
                arr: arr, ptrs: { [i]: "i" }, vars: { n, s: `"${s}"`, next_s: `"${next_s}"` }
            };

            while (i < arr.length) {
                let count = 1;
                yield {
                    cl: 8, phase: "init", msg: `Reading sequence starting at index ${i} ('${arr[i]}'). Initial count = 1.`,
                    arr: arr, ptrs: { [i]: "i" }, vars: { s: `"${s}"`, next_s: `"${next_s}"`, count }
                };

                let startI = i;
                while (i + 1 < arr.length && arr[i] === arr[i + 1]) {
                    count++;
                    i++;

                    yield {
                        cl: 10, phase: "search", msg: `Found matching adjacent digit '${arr[i]}'. count is now ${count}.`,
                        arr: arr, ptrs: { [startI]: "start", [i]: "i" }, vars: { count }
                    };
                }

                next_s += String(count) + arr[startI];

                yield {
                    cl: 12, phase: "build", msg: `Append "${count}${arr[startI]}" (${count} copies of '${arr[startI]}') to next sequence string.`,
                    arr: arr, ptrs: { [startI]: "start", [i]: "curr" }, vars: { count, next_s: `"${next_s}"` }
                };

                i++;
                if (i < arr.length) {
                    yield {
                        cl: 13, phase: "init", msg: "Advance past the processed group.",
                        arr: arr, ptrs: { [i]: "i" }, vars: { next_s: `"${next_s}"` }
                    };
                }
            }

            s = next_s;
            yield {
                cl: 14, phase: "build", msg: `Completed generating term ${iter + 1}.`,
                arr: s.split(""), vars: { "Term": iter + 1, s: `"${s}"` }
            };
        }

        yield {
            cl: 15, phase: "done", msg: `Finished generating up to term ${n}!`,
            arr: s.split(""), vars: { n, result: `"${s}"` }, result: `"${s}"`
        };
    }
};
