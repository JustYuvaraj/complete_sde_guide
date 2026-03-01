// src/engines/configs/myAtoi.js

export const myAtoiConfig = {
    title: "String to Integer (atoi)",
    subtitle: () => 'Convert a string to a 32-bit signed integer',    defaults: { str: "   -42  " },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer.</p>

<p>The algorithm for <code>myAtoi(string s)</code> is as follows:</p>

<ol>
	<li><strong>Whitespace</strong>: Ignore any leading whitespace (<code>&quot; &quot;</code>).</li>
	<li><strong>Signedness</strong>: Determine the sign by checking if the next character is <code>&#39;-&#39;</code> or <code>&#39;+&#39;</code>, assuming positivity if neither present.</li>
	<li><strong>Conversion</strong>: Read the integer by skipping leading zeros&nbsp;until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.</li>
	<li><strong>Rounding</strong>: If the integer is out of the 32-bit signed integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then round the integer to remain in the range. Specifically, integers less than <code>-2<sup>31</sup></code> should be rounded to <code>-2<sup>31</sup></code>, and integers greater than <code>2<sup>31</sup> - 1</code> should be rounded to <code>2<sup>31</sup> - 1</code>.</li>
</ol>

<p>Return the integer as the final result.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;42&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">42</span></p>

<p><strong>Explanation:</strong></p>

<pre>
The underlined characters are what is read in and the caret is the current reader position.
Step 1: &quot;42&quot; (no characters read because there is no leading whitespace)
         ^
Step 2: &quot;42&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)
         ^
Step 3: &quot;<u>42</u>&quot; (&quot;42&quot; is read in)
           ^
</pre>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot; -042&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">-42</span></p>

<p><strong>Explanation:</strong></p>

<pre>
Step 1: &quot;<u>   </u>-042&quot; (leading whitespace is read and ignored)
            ^
Step 2: &quot;   <u>-</u>042&quot; (&#39;-&#39; is read, so the result should be negative)
             ^
Step 3: &quot;   -<u>042</u>&quot; (&quot;042&quot; is read in, leading zeros ignored in the result)
               ^
</pre>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;1337c0d3&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">1337</span></p>

<p><strong>Explanation:</strong></p>

<pre>
Step 1: &quot;1337c0d3&quot; (no characters read because there is no leading whitespace)
         ^
Step 2: &quot;1337c0d3&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)
         ^
Step 3: &quot;<u>1337</u>c0d3&quot; (&quot;1337&quot; is read in; reading stops because the next character is a non-digit)
             ^
</pre>
</div>

<p><strong class="example">Example 4:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;0-1&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">0</span></p>

<p><strong>Explanation:</strong></p>

<pre>
Step 1: &quot;0-1&quot; (no characters read because there is no leading whitespace)
         ^
Step 2: &quot;0-1&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)
         ^
Step 3: &quot;<u>0</u>-1&quot; (&quot;0&quot; is read in; reading stops because the next character is a non-digit)
          ^
</pre>
</div>

<p><strong class="example">Example 5:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;words and 987&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">0</span></p>

<p><strong>Explanation:</strong></p>

<p>Reading stops at the first non-digit character &#39;w&#39;.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 200</code></li>
	<li><code>s</code> consists of English letters (lower-case and upper-case), digits (<code>0-9</code>), <code>&#39; &#39;</code>, <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, and <code>&#39;.&#39;</code>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## State Machine
1. Skip whitespace
2. Check for +/- sign
3. Read digits, build number
4. Clamp to [-2³¹, 2³¹-1]

Handle overflow by checking BEFORE multiplying by 10.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(1)** | Just the result variable |`}],

    code: `class Solution:
    def myAtoi(self, s: str) -> int:
        s = s.lstrip()
        if not s: return 0
        
        sign = 1
        if s[0] == "-":
            sign = -1
            s = s[1:]
        elif s[0] == "+":
            s = s[1:]
            
        res = 0
        for char in s:
            if not char.isdigit():
                break
            res = res * 10 + int(char)
            
        res *= sign
        res = max(-2**31, min(res, 2**31 - 1))
        
        return res`.split("\n"),

    generator: function* (args) {
        const inputStr = args[0] || "   -42  ";
        const arr = inputStr.split("");

        yield {
            cl: 3, phase: "init", msg: "Read input string. Find first non-whitespace character.",
            arr: arr.map(c => c === " " ? "␣" : c),
            vars: { "s": `"${inputStr}"` }
        };

        let s = inputStr.trimStart();
        if (!s) {
            yield { cl: 4, phase: "done", msg: "String is empty or only whitespace. Return 0.", arr, vars: {}, result: "0" };
            return;
        }

        let sign = 1;
        let startIndex = inputStr.length - s.length;

        yield {
            cl: 6, phase: "init", msg: "Initialize sign = 1.",
            arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [startIndex]: "start" }, vars: { sign, s: `"${s}"` }
        };

        if (s[0] === "-") {
            sign = -1;
            s = s.substring(1);
            startIndex += 1;
            yield {
                cl: 8, phase: "search", msg: `Found '-'. Set sign = -1. Step forward.`,
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [startIndex]: "start" }, vars: { sign, s: `"${s}"` }
            };
        } else if (s[0] === "+") {
            s = s.substring(1);
            startIndex += 1;
            yield {
                cl: 10, phase: "search", msg: `Found '+'. Sign remains 1. Step forward.`,
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [startIndex]: "start" }, vars: { sign, s: `"${s}"` }
            };
        }

        let res = 0;
        yield { cl: 13, phase: "init", msg: "Initialize integer accumulator res = 0", arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [startIndex]: "start" }, vars: { sign, res } };

        for (let i = 0; i < s.length; i++) {
            const char = s[i];
            const arrIndex = startIndex + i;

            yield {
                cl: 14, phase: "init", msg: `Read character '${char}'`,
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [arrIndex]: "char" }, vars: { sign, res, char }
            };

            if (!/^[0-9]$/.test(char)) {
                yield {
                    cl: 16, phase: "done", msg: `Character '${char}' is not a digit! Break the loop.`,
                    arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [arrIndex]: "char" }, vars: { sign, res, char }
                };
                break;
            }

            res = res * 10 + parseInt(char, 10);
            yield {
                cl: 17, phase: "build", msg: `Digit found! Update res = res * 10 + ${char} = ${res}`,
                arr: arr.map(c => c === " " ? "␣" : c), ptrs: { [arrIndex]: "char" }, vars: { sign, res, char }
            };
        }

        res *= sign;
        yield {
            cl: 19, phase: "build", msg: `Apply sign: res *= ${sign}. res is now ${res}.`,
            arr: arr.map(c => c === " " ? "␣" : c), vars: { sign, res }
        };

        const INT_MIN = -Math.pow(2, 31);
        const INT_MAX = Math.pow(2, 31) - 1;

        if (res < INT_MIN) res = INT_MIN;
        if (res > INT_MAX) res = INT_MAX;

        yield {
            cl: 20, phase: "build", msg: `Clamp to 32-bit bounds [${INT_MIN}, ${INT_MAX}]. Final res: ${res}.`,
            arr: arr.map(c => c === " " ? "␣" : c), vars: { sign, res, INT_MIN, INT_MAX }
        };

        yield {
            cl: 22, phase: "done", msg: "Finished parsing. Return final integer.",
            arr: arr.map(c => c === " " ? "␣" : c), vars: { res }, result: String(res)
        };
    }
};
