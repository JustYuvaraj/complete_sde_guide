// src/engines/configs/permutationInString.js

export const permutationInStringConfig = {
    title: "Permutation in String",
    subtitle: () => 'Check if s1\'s permutation is a substring of s2',
    defaults: { s1: "ab", s2: "eidbaooo" },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a <span data-keyword="permutation-string">permutation</span> of <code>s1</code>, or <code>false</code> otherwise.</p>

<p>In other words, return <code>true</code> if one of <code>s1</code>&#39;s permutations is the substring of <code>s2</code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s1 = &quot;ab&quot;, s2 = &quot;eidbaooo&quot;
<strong>Output:</strong> true
<strong>Explanation:</strong> s2 contains one permutation of s1 (&quot;ba&quot;).
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s1 = &quot;ab&quot;, s2 = &quot;eidboaoo&quot;
<strong>Output:</strong> false
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s1.length, s2.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s1</code> and <code>s2</code> consist of lowercase English letters.</li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Permutation = Same Frequency

A permutation of s1 has the **exact same character frequencies**. So we need a window in s2 of size len(s1) whose frequency map matches s1's.

## Step 2 — Fixed-Size Window

Window size is always len(s1). Slide it across s2:
- Add the new right character
- Remove the old left character (when window exceeds s1 length)
- Compare frequency maps

## Step 3 — The Algorithm

1. Build frequency map for s1
2. Slide fixed window of size len(s1) across s2
3. At each position, compare window's frequency map with s1's
4. If they match → return True

## Key Takeaway
Fixed-size sliding window + frequency comparison. "Is any anagram of X in Y?" → slide window of len(X) across Y, compare frequencies.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Slide window once across s2 |
| **Space** | **O(26)** = O(1) | Two frequency maps of constants size |

## Optimization
Instead of comparing full maps, track a "matches" counter for how many chars have equal frequency. When matches == 26, we found a permutation.`
        }
    ],

    code: `class Solution:
    def checkInclusion(self, s1, s2):
        if len(s1) > len(s2):
            return False
        
        s1Count = {}
        for c in s1:
            s1Count[c] = s1Count.get(c, 0) + 1
        
        windowCount = {}
        for i in range(len(s2)):
            windowCount[s2[i]] = windowCount.get(s2[i], 0) + 1
            
            if i >= len(s1):
                c = s2[i - len(s1)]
                windowCount[c] -= 1
                if windowCount[c] == 0:
                    del windowCount[c]
            
            if windowCount == s1Count:
                return True
        
        return False`.split("\n"),

    generator: function* (args) {
        const s1 = args[0] || "ab";
        const s2 = args[1] || "eidbaooo";
        const chars = s2.split("");
        const s1Count = {};
        const windowCount = {};

        for (const c of s1) s1Count[c] = (s1Count[c] || 0) + 1;

        yield {
            cl: 5, phase: "init", msg: `Build frequency map for s1 = "${s1}". Window size = ${s1.length}`,
            arr: chars, vars: { s1: `"${s1}"`, s2: `"${s2}"`, window_size: s1.length },
            map: { ...s1Count }, mapTitle: "s1 Target",
            map2: {}, map2Title: "Window Count"
        };

        for (let i = 0; i < s2.length; i++) {
            windowCount[s2[i]] = (windowCount[s2[i]] || 0) + 1;

            yield {
                cl: 11, phase: "build", msg: `Add '${s2[i]}' to window`,
                arr: chars, ptrs: { [Math.max(0, i - s1.length + 1)]: "l", [i]: "r" },
                vars: { i, "s2[i]": s2[i] },
                map: { ...s1Count }, mapTitle: "s1 Target",
                map2: { ...windowCount }, map2Title: "Window Count", map2ActiveKey: s2[i]
            };

            if (i >= s1.length) {
                const removeChar = s2[i - s1.length];
                windowCount[removeChar]--;
                if (windowCount[removeChar] === 0) delete windowCount[removeChar];

                yield {
                    cl: 15, phase: "search", msg: `Window full: remove '${removeChar}' (leftmost)`,
                    arr: chars, ptrs: { [i - s1.length + 1]: "l", [i]: "r" },
                    vars: { i, removed: removeChar },
                    map: { ...s1Count }, mapTitle: "s1 Target",
                    map2: { ...windowCount }, map2Title: "Window Count"
                };
            }

            // Check match
            const match = JSON.stringify(Object.keys(windowCount).sort().reduce((o, k) => { o[k] = windowCount[k]; return o; }, {}))
                === JSON.stringify(Object.keys(s1Count).sort().reduce((o, k) => { o[k] = s1Count[k]; return o; }, {}));

            if (match) {
                const l = i - s1.length + 1;
                yield {
                    cl: 20, phase: "done", msg: `Match found! Window [${l}..${i}] = "${s2.substring(l, i + 1)}" is a permutation of "${s1}"`,
                    arr: chars, ptrs: { [l]: "l", [i]: "r" },
                    vars: {},
                    map: { ...s1Count }, mapTitle: "s1 Target",
                    map2: { ...windowCount }, map2Title: "Window Count",
                    result: "True"
                };
                return;
            }

            if (i >= s1.length - 1) {
                yield {
                    cl: 20, phase: "search", msg: `Window [${i - s1.length + 1}..${i}] = "${s2.substring(i - s1.length + 1, i + 1)}" — no match`,
                    arr: chars, ptrs: { [i - s1.length + 1]: "l", [i]: "r" },
                    vars: {},
                    map: { ...s1Count }, mapTitle: "s1 Target",
                    map2: { ...windowCount }, map2Title: "Window Count"
                };
            }
        }

        yield {
            cl: 22, phase: "done", msg: `No permutation of "${s1}" found in "${s2}"`,
            arr: chars, vars: {},
            map: { ...s1Count }, mapTitle: "s1 Target",
            map2: { ...windowCount }, map2Title: "Window Count",
            result: "False"
        };
    }
};
