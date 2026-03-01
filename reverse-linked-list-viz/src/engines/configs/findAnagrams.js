// src/engines/configs/findAnagrams.js

export const findAnagramsConfig = {
    title: "Find All Anagrams in a String",
    subtitle: (args) => `Find all start indices of '${args[1]}' anagrams in '${args[0]}'`,    defaults: { s: "cbaebabacd", p: "abc" },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given two strings <code>s</code> and <code>p</code>, return an array of all the start indices of <code>p</code>&#39;s <span data-keyword="anagram">anagrams</span> in <code>s</code>. You may return the answer in <strong>any order</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;cbaebabacd&quot;, p = &quot;abc&quot;
<strong>Output:</strong> [0,6]
<strong>Explanation:</strong>
The substring with start index = 0 is &quot;cba&quot;, which is an anagram of &quot;abc&quot;.
The substring with start index = 6 is &quot;bac&quot;, which is an anagram of &quot;abc&quot;.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;abab&quot;, p = &quot;ab&quot;
<strong>Output:</strong> [0,1,2]
<strong>Explanation:</strong>
The substring with start index = 0 is &quot;ab&quot;, which is an anagram of &quot;ab&quot;.
The substring with start index = 1 is &quot;ba&quot;, which is an anagram of &quot;ab&quot;.
The substring with start index = 2 is &quot;ab&quot;, which is an anagram of &quot;ab&quot;.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length, p.length &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>s</code> and <code>p</code> consist of lowercase English letters.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Fixed-Size Sliding Window
Same as Permutation in String (LC 567) but collect ALL match positions instead of returning on first.

## Approach
Slide window of len(p) across s. Compare frequency maps. Collect start indices where they match.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass with O(1) comparison |
| **Space** | **O(1)** | Fixed-size frequency maps |`}],

    code: `class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        if len(p) > len(s): return []
        
        pCount, sCount = {}, {}
        for i in range(len(p)):
            pCount[p[i]] = 1 + pCount.get(p[i], 0)
            sCount[s[i]] = 1 + sCount.get(s[i], 0)
            
        res = [0] if sCount == pCount else []
        l = 0
        for r in range(len(p), len(s)):
            sCount[s[r]] = 1 + sCount.get(s[r], 0)
            sCount[s[l]] -= 1
            
            if sCount[s[l]] == 0:
                sCount.pop(s[l])
            l += 1
            
            if sCount == pCount:
                res.append(l)
                
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "cbaebabacd";
        const p = args[1] || "abc";
        const arr = s.split("");

        yield { cl: 3, phase: "init", msg: "Check lengths. If p > s, return []", arr, vars: { "len(p)": p.length, "len(s)": s.length }, map: {} };
        if (p.length > s.length) {
            yield { cl: 3, phase: "done", msg: "p is longer than s. Return []", arr, vars: {}, map: {}, result: "[]" };
            return;
        }

        const pCount = {};
        const sCount = {};

        for (let i = 0; i < p.length; i++) {
            pCount[p[i]] = (pCount[p[i]] || 0) + 1;
            sCount[s[i]] = (sCount[s[i]] || 0) + 1;
        }

        yield {
            cl: 8, phase: "init", msg: `Initialize sliding window of size ${p.length}. Build initial freq maps.`,
            arr, ptrs: { 0: "l", [p.length - 1]: "r" },
            vars: { "pCount": JSON.stringify(pCount) }, map: { ...sCount }, mapTitle: "Window Freq (sCount)"
        };

        const res = [];
        const matches = (m1, m2) => {
            const keys1 = Object.keys(m1);
            const keys2 = Object.keys(m2);
            if (keys1.length !== keys2.length) return false;
            for (let k of keys1) if (m1[k] !== m2[k]) return false;
            return true;
        };

        let isMatch = matches(sCount, pCount);
        if (isMatch) res.push(0);

        yield {
            cl: 10, phase: "search", msg: `Compare initial window to pCount. Match? ${isMatch}. res = [${res}]`,
            arr, ptrs: { 0: "l", [p.length - 1]: "r" },
            vars: { "pCount": JSON.stringify(pCount), isMatch }, map: { ...sCount }
        };

        let l = 0;
        for (let r = p.length; r < s.length; r++) {
            yield {
                cl: 12, phase: "init", msg: `Slide window right. Include char at r=${r} ('${s[r]}')`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l, "char": s[r] }, map: { ...sCount }
            };

            sCount[s[r]] = (sCount[s[r]] || 0) + 1;
            yield {
                cl: 13, phase: "build", msg: `Increment count for '${s[r]}'`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l, "char": s[r] },
                map: { ...sCount }, mapActiveKey: s[r]
            };

            sCount[s[l]] -= 1;
            yield {
                cl: 14, phase: "build", msg: `Shrink left side. Decrement count for '${s[l]}'`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l, "char": s[l] },
                map: { ...sCount }, mapActiveKey: s[l]
            };

            if (sCount[s[l]] === 0) {
                delete sCount[s[l]];
                yield {
                    cl: 16, phase: "build", msg: `Count hit 0. Remove '${s[l]}' from map.`,
                    arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l }, map: { ...sCount }
                };
            }

            l++;
            yield {
                cl: 18, phase: "init", msg: `Move l pointer forward to ${l}`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l }, map: { ...sCount }
            };

            isMatch = matches(sCount, pCount);
            if (isMatch) {
                res.push(l);
                yield {
                    cl: 21, phase: "done", msg: `Window matches pCount! Append l (${l}). res = [${res}]`,
                    arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l }, map: { ...sCount }, result: `[${res}]`
                };
            } else {
                yield {
                    cl: 20, phase: "search", msg: `Window does NOT match pCount. Move on.`,
                    arr, ptrs: { [l]: "l", [r]: "r" }, vars: { r, l }, map: { ...sCount }
                };
            }
        }

        yield {
            cl: 24, phase: "done", msg: "Array finished. Returning results.",
            arr, vars: {}, map: { ...sCount }, result: `[${res}]`
        };
    }
};
