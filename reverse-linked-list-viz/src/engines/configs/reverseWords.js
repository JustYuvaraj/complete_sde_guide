// src/engines/configs/reverseWords.js

export const reverseWordsConfig = {
    title: "Reverse Words in a String",
    subtitle: () => 'Reverse words while omitting extra spaces',    defaults: { s: "  hello world  " },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given an input string <code>s</code>, reverse the order of the <strong>words</strong>.</p>

<p>A <strong>word</strong> is defined as a sequence of non-space characters. The <strong>words</strong> in <code>s</code> will be separated by at least one space.</p>

<p>Return <em>a string of the words in reverse order concatenated by a single space.</em></p>

<p><b>Note</b> that <code>s</code> may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;the sky is blue&quot;
<strong>Output:</strong> &quot;blue is sky the&quot;
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;  hello world  &quot;
<strong>Output:</strong> &quot;world hello&quot;
<strong>Explanation:</strong> Your reversed string should not contain leading or trailing spaces.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;a good   example&quot;
<strong>Output:</strong> &quot;example good a&quot;
<strong>Explanation:</strong> You need to reduce multiple spaces between two words to a single space in the reversed string.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> contains English letters (upper-case and lower-case), digits, and spaces <code>&#39; &#39;</code>.</li>
	<li>There is <strong>at least one</strong> word in <code>s</code>.</li>
</ul>

<p>&nbsp;</p>
<p><b data-stringify-type="bold">Follow-up:&nbsp;</b>If the string data type is mutable in your language, can&nbsp;you solve it&nbsp;<b data-stringify-type="bold">in-place</b>&nbsp;with&nbsp;<code data-stringify-type="code">O(1)</code>&nbsp;extra space?</p>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Approach
1. Split by spaces (filter empty strings)
2. Reverse the array of words
3. Join with single space

## In-Place Alternative
Reverse entire string, then reverse each word individually.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Split + reverse + join |
| **Space** | **O(n)** | Store words array |`}],

    code: `class Solution:
    def reverseWords(self, s: str) -> str:
        words = s.split()
        
        l, r = 0, len(words) - 1
        while l < r:
            words[l], words[r] = words[r], words[l]
            l += 1
            r -= 1
            
        return " ".join(words)`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "  hello world  ";
        const words = s.trim().split(/\s+/);

        yield {
            cl: 3, phase: "init", msg: "Split the string into an array of words, automatically removing extra spaces",
            arr: words, vars: { "s": `"${s}"` }
        };

        let l = 0;
        let r = words.length - 1;

        yield {
            cl: 5, phase: "init", msg: `Initialize two pointers: l=${l}, r=${r}`,
            arr: words, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
        };

        while (l < r) {
            yield {
                cl: 7, phase: "search", msg: `Swap word at l ('${words[l]}') with word at r ('${words[r]}')`,
                arr: words, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };

            const temp = words[l];
            words[l] = words[r];
            words[r] = temp;

            yield {
                cl: 7, phase: "build", msg: `Swapped!`,
                arr: words, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };

            l += 1;
            r -= 1;

            yield {
                cl: 8, phase: "init", msg: "Move pointers inward",
                arr: words, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };
        }

        yield {
            cl: 11, phase: "done", msg: "Pointers met! Array reversed. Join words with a single space.",
            arr: words, vars: { l, r }, result: `"${words.join(" ")}"`
        };
    }
};
