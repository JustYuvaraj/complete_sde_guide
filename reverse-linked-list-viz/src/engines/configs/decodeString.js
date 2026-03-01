// src/engines/configs/decodeString.js

export const decodeStringConfig = {
    title: "Decode String",
    subtitle: () => 'Decode an encoded string using stacks to handle nested patterns',
    defaults: { str: "3[a2[c]]" },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an encoded string, return its decoded string.</p>

<p>The encoding rule is: <code>k[encoded_string]</code>, where the <code>encoded_string</code> inside the square brackets is being repeated exactly <code>k</code> times. Note that <code>k</code> is guaranteed to be a positive integer.</p>

<p>You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, <code>k</code>. For example, there will not be input like <code>3a</code> or <code>2[4]</code>.</p>

<p>The test cases are generated so that the length of the output will never exceed <code>10<sup>5</sup></code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;3[a]2[bc]&quot;
<strong>Output:</strong> &quot;aaabcbc&quot;
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;3[a2[c]]&quot;
<strong>Output:</strong> &quot;accaccacc&quot;
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;2[abc]3[cd]ef&quot;
<strong>Output:</strong> &quot;abcabccdcdcdef&quot;
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 30</code></li>
	<li><code>s</code> consists of lowercase English letters, digits, and square brackets <code>&#39;[]&#39;</code>.</li>
	<li><code>s</code> is guaranteed to be <strong>a valid</strong> input.</li>
	<li>All the integers in <code>s</code> are in the range <code>[1, 300]</code>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Stack-Based Approach
Use a stack to handle nested brackets:
1. Push current string and count when hitting '['
2. Pop and repeat when hitting ']'
3. Build the string as you go

## Why Stack?
Nesting means we need to "remember" the outer context while processing inner brackets. Stack naturally handles this.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(output length)** | Process each output char once |
| **Space** | **O(output length)** | Stack + result string |`}],

    code: `class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        
        for i in range(len(s)):
            if s[i] != "]":
                stack.append(s[i])
            else:
                substr = ""
                while stack[-1] != "[":
                    substr = stack.pop() + substr
                stack.pop()
                
                k = ""
                while stack and stack[-1].isdigit():
                    k = stack.pop() + k
                    
                stack.append(int(k) * substr)
                
        return "".join(stack)`.split("\n"),

    generator: function* (args) {
        const str = args[0] || "3[a2[c]]";
        const arr = str.split("");
        const stack = [];

        yield {
            cl: 3, phase: "init", msg: "Initialize stack logic using a string array visualization",
            arr, vars: { stack: "[]" }
        };

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            yield {
                cl: 5, phase: "init", msg: `Read char at index ${i}: '${char}'`,
                arr, ptrs: { [i]: "i" }, vars: { char, i, stack: `[${stack.join(", ")}]` }
            };

            if (char !== "]") {
                stack.push(char);
                yield {
                    cl: 7, phase: "build", msg: `Not a closing bracket '!== ]'. Push to stack.`,
                    arr, ptrs: { [i]: "i" }, vars: { char, i, stack: `[${stack.join(", ")}]` }
                };
            } else {
                yield {
                    cl: 10, phase: "search", msg: `Found closing bracket ']'. Start extracting inner substring.`,
                    arr, ptrs: { [i]: "i" }, vars: { char, i, substr: '""', stack: `[${stack.join(", ")}]` }
                };

                let substr = "";
                while (stack[stack.length - 1] !== "[") {
                    const popped = stack.pop();
                    substr = popped + substr;
                    yield {
                        cl: 12, phase: "build", msg: `Pop from stack and prepend to substr: '${popped}' -> '${substr}'`,
                        arr, ptrs: { [i]: "i" }, vars: { popped, substr, stack: `[${stack.join(", ")}]` }
                    };
                }

                stack.pop(); // pop "["
                yield {
                    cl: 13, phase: "build", msg: `Pop opening bracket '[' off the stack.`,
                    arr, ptrs: { [i]: "i" }, vars: { substr, stack: `[${stack.join(", ")}]` }
                };

                let k = "";
                while (stack.length > 0 && !isNaN(stack[stack.length - 1])) {
                    const num = stack.pop();
                    k = num + k;
                    yield {
                        cl: 17, phase: "build", msg: `Pop digit from stack to build k multiplier: '${num}' -> '${k}'`,
                        arr, ptrs: { [i]: "i" }, vars: { num, k, substr, stack: `[${stack.join(", ")}]` }
                    };
                }

                const multiplier = parseInt(k, 10);
                const repeated = substr.repeat(multiplier);
                stack.push(repeated);

                yield {
                    cl: 19, phase: "build", msg: `Push decoded chunk to stack (${multiplier} * '${substr}') = '${repeated}'`,
                    arr, ptrs: { [i]: "i" }, vars: { multiplier, substr, repeated, stack: `[${stack.join(", ")}]` }
                };
            }
        }

        const finalStr = stack.join("");
        yield {
            cl: 21, phase: "done", msg: `String processing complete. Join stack into final string.`,
            arr, vars: { stack: `[${stack.join(", ")}]` }, result: `"${finalStr}"`
        };
    }
};
