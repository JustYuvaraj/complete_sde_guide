// src/engines/configs/minimumWindowSubstring.js

export const minimumWindowSubstringConfig = {
    title: "Minimum Window Substring",
    subtitle: () => 'Find the smallest window in s that contains all characters of t',
    defaults: { s: "ADOBECODEBANC", t: "ABC" },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <em>the <strong>minimum window</strong></em> <span data-keyword="substring-nonempty"><strong><em>substring</em></strong></span><em> of </em><code>s</code><em> such that every character in </em><code>t</code><em> (<strong>including duplicates</strong>) is included in the window</em>. If there is no such substring, return <em>the empty string </em><code>&quot;&quot;</code>.</p>

<p>The testcases will be generated such that the answer is <strong>unique</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;ADOBECODEBANC&quot;, t = &quot;ABC&quot;
<strong>Output:</strong> &quot;BANC&quot;
<strong>Explanation:</strong> The minimum window substring &quot;BANC&quot; includes &#39;A&#39;, &#39;B&#39;, and &#39;C&#39; from string t.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;a&quot;, t = &quot;a&quot;
<strong>Output:</strong> &quot;a&quot;
<strong>Explanation:</strong> The entire string s is the minimum window.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;a&quot;, t = &quot;aa&quot;
<strong>Output:</strong> &quot;&quot;
<strong>Explanation:</strong> Both &#39;a&#39;s from t must be included in the window.
Since the largest window of s only has one &#39;a&#39;, return empty string.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>m == s.length</code></li>
	<li><code>n == t.length</code></li>
	<li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>
	<li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong> Could you find an algorithm that runs in <code>O(m + n)</code> time?</p>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — What "Contains All Characters" Means

Build a frequency map of t. The window must have at least as many of each character.

## Step 2 — Track "formed" vs "required"

- **required** = number of unique chars in t
- **formed** = number of chars whose window count matches or exceeds t's count
- When formed == required → window is valid!

## Step 3 — The Algorithm

1. Build tCount from t, set required = unique chars in t
2. Expand right: add char, if count matches tCount → formed++
3. While formed == required:
   - Record window if smaller than best
   - Shrink from left: remove char, if count drops below tCount → formed--

## Key Takeaway
This is the **hardest** sliding window problem. The "formed" counter avoids comparing full maps at each step. Master this → you can solve any sliding window problem.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(|s| + |t|)** | Build map O(|t|), window pass O(|s|) |
| **Space** | **O(|s| + |t|)** | Two frequency maps |

## Related Problems
- Permutation in String (LC 567) — same pattern, fixed window
- Find All Anagrams (LC 438) — same pattern, collect all matches`
        }
    ],

    code: `class Solution:
    def minWindow(self, s, t):
        if not t or not s:
            return ""
        
        tCount = {}
        for c in t:
            tCount[c] = tCount.get(c, 0) + 1
        
        required = len(tCount)
        formed = 0
        windowCount = {}
        l = 0
        ans = (float('inf'), 0, 0)
        
        for r in range(len(s)):
            c = s[r]
            windowCount[c] = windowCount.get(c, 0) + 1
            
            if c in tCount and windowCount[c] == tCount[c]:
                formed += 1
            
            while formed == required:
                if r - l + 1 < ans[0]:
                    ans = (r - l + 1, l, r)
                windowCount[s[l]] -= 1
                if s[l] in tCount and windowCount[s[l]] < tCount[s[l]]:
                    formed -= 1
                l += 1
        
        return s[ans[1]:ans[2]+1] if ans[0] != float('inf') else ""`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "ADOBECODEBANC";
        const t = args[1] || "ABC";
        const chars = s.split("");
        const tCount = {};
        const windowCount = {};

        for (const c of t) tCount[c] = (tCount[c] || 0) + 1;
        const required = Object.keys(tCount).length;
        let formed = 0, l = 0;
        let ansLen = Infinity, ansL = 0, ansR = 0;

        yield {
            cl: 5, phase: "init", msg: `Need all chars from t = "${t}". Required unique chars = ${required}`,
            arr: chars, vars: { t: `"${t}"`, required, formed: 0 },
            map: { ...tCount }, mapTitle: "t Required",
            map2: {}, map2Title: "Window Count"
        };

        for (let r = 0; r < s.length; r++) {
            const c = s[r];
            windowCount[c] = (windowCount[c] || 0) + 1;

            if (c in tCount && windowCount[c] === tCount[c]) {
                formed++;
            }

            yield {
                cl: 17, phase: "build", msg: `Add '${c}'. formed = ${formed}/${required}`,
                arr: chars, ptrs: { [l]: "l", [r]: "r" },
                vars: { "s[r]": c, formed, required },
                map: { ...tCount }, mapTitle: "t Required",
                map2: { ...windowCount }, map2Title: "Window Count", map2ActiveKey: c
            };

            while (formed === required) {
                const windowLen = r - l + 1;
                if (windowLen < ansLen) {
                    ansLen = windowLen;
                    ansL = l;
                    ansR = r;
                    yield {
                        cl: 24, phase: "build", msg: `All chars found! Window [${l}..${r}] = "${s.substring(l, r + 1)}", length = ${windowLen}. New best!`,
                        arr: chars, ptrs: { [l]: "l", [r]: "r" },
                        vars: { window: `"${s.substring(l, r + 1)}"`, length: windowLen, best: ansLen },
                        map: { ...tCount }, mapTitle: "t Required",
                        map2: { ...windowCount }, map2Title: "Window Count"
                    };
                }

                windowCount[s[l]]--;
                if (s[l] in tCount && windowCount[s[l]] < tCount[s[l]]) {
                    formed--;
                }

                yield {
                    cl: 28, phase: "search", msg: `Shrink: remove '${s[l]}'. formed = ${formed}/${required}. l → ${l + 1}`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" },
                    vars: { removing: s[l], formed, required },
                    map: { ...tCount }, mapTitle: "t Required",
                    map2: { ...windowCount }, map2Title: "Window Count", map2HighlightKey: s[l]
                };
                l++;
            }
        }

        const result = ansLen === Infinity ? "" : s.substring(ansL, ansR + 1);
        yield {
            cl: 31, phase: "done", msg: result ? `Minimum window = "${result}" (length ${ansLen})` : "No valid window found",
            arr: chars, vars: { result: `"${result}"` },
            map: { ...tCount }, mapTitle: "t Required",
            map2: {}, map2Title: "Window Count",
            result: `"${result}"`
        };
    }
};
