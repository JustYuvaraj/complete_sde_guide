// src/engines/configs/longestRepeatingCharReplacement.js

export const longestRepeatingCharReplacementConfig = {
    title: "Longest Repeating Character Replacement",
    subtitle: () => 'Find the longest substring with at most k character replacements',
    defaults: { s: "AABABBA", k: 1 },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most <code>k</code> times.</p>

<p>Return <em>the length of the longest substring containing the same letter you can get after performing the above operations</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;ABAB&quot;, k = 2
<strong>Output:</strong> 4
<strong>Explanation:</strong> Replace the two &#39;A&#39;s with two &#39;B&#39;s or vice versa.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;AABABBA&quot;, k = 1
<strong>Output:</strong> 4
<strong>Explanation:</strong> Replace the one &#39;A&#39; in the middle with &#39;B&#39; and form &quot;AABBBBA&quot;.
The substring &quot;BBBB&quot; has the longest repeating letters, which is 4.
There may exists other ways to achieve this answer too.</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>
	<li><code>s</code> consists of only uppercase English letters.</li>
	<li><code>0 &lt;= k &lt;= s.length</code></li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Key Insight

In any valid window, the number of chars we need to replace = **window_size - max_frequency_char**.
If this exceeds k, the window is invalid → shrink.

## Step 2 — The Formula

replacements_needed = (r - l + 1) - maxFreq
If replacements_needed > k → shrink from left.

## Step 3 — The Algorithm

1. Track frequency of each char in window
2. Track maxFreq (most frequent char count in window)
3. Expand right, if window invalid → shrink left
4. Track the maximum valid window size

## Key Takeaway
The trick is: you don't need to know WHICH char is most frequent — just how many replacements are needed. maxFreq never decreases, which is fine because we only care about the maximum window.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each character visited at most twice |
| **Space** | **O(26)** = O(1) | Frequency map for uppercase letters |

## Common Mistake
Don't recalculate maxFreq when shrinking — it's okay to keep the old max. We only care about finding LONGER windows.`
        }
    ],

    code: `class Solution:
    def characterReplacement(self, s, k):
        count = {}
        l = 0
        maxFreq = 0
        res = 0
        
        for r in range(len(s)):
            count[s[r]] = count.get(s[r], 0) + 1
            maxFreq = max(maxFreq, count[s[r]])
            
            while (r - l + 1) - maxFreq > k:
                count[s[l]] -= 1
                l += 1
            
            res = max(res, r - l + 1)
        
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "AABABBA";
        const k = args[1] !== undefined ? args[1] : 1;
        const chars = s.split("");
        const count = {};
        let l = 0, maxFreq = 0, res = 0;

        yield {
            cl: 2, phase: "init", msg: `Initialize window. k = ${k} (max replacements allowed)`,
            arr: chars, ptrs: { 0: "l" }, vars: { k, l: 0, maxFreq: 0, res: 0 },
            map: {}, mapTitle: "Char Frequency"
        };

        for (let r = 0; r < s.length; r++) {
            count[s[r]] = (count[s[r]] || 0) + 1;
            maxFreq = Math.max(maxFreq, count[s[r]]);

            yield {
                cl: 8, phase: "build", msg: `Add '${s[r]}': count = ${count[s[r]]}. maxFreq = ${maxFreq}`,
                arr: chars, ptrs: { [l]: "l", [r]: "r" },
                vars: { "s[r]": s[r], window: r - l + 1, maxFreq, replacements: (r - l + 1) - maxFreq, k },
                map: { ...count }, mapTitle: "Char Frequency", mapActiveKey: s[r]
            };

            while ((r - l + 1) - maxFreq > k) {
                yield {
                    cl: 12, phase: "search", msg: `Window needs ${(r - l + 1) - maxFreq} replacements > k=${k}. Shrink: remove '${s[l]}'`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" },
                    vars: { l, r, window: r - l + 1, maxFreq, replacements: (r - l + 1) - maxFreq, k },
                    map: { ...count }, mapTitle: "Char Frequency", mapHighlightKey: s[l]
                };
                count[s[l]]--;
                l++;
            }

            const windowLen = r - l + 1;
            if (windowLen > res) {
                res = windowLen;
                yield {
                    cl: 16, phase: "build", msg: `Valid window [${l}..${r}] = "${s.substring(l, r + 1)}", length = ${res}. New best!`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" },
                    vars: { l, r, window: windowLen, maxFreq, replacements: windowLen - maxFreq, k, res },
                    map: { ...count }, mapTitle: "Char Frequency"
                };
            } else {
                yield {
                    cl: 16, phase: "search", msg: `Valid window [${l}..${r}], length = ${windowLen}. Best still ${res}`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" },
                    vars: { l, r, window: windowLen, res },
                    map: { ...count }, mapTitle: "Char Frequency"
                };
            }
        }

        yield {
            cl: 18, phase: "done", msg: `Longest valid substring length = ${res}`,
            arr: chars, vars: { res },
            map: { ...count }, mapTitle: "Char Frequency",
            result: `${res}`
        };
    }
};
