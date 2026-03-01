// src/engines/configs/validAnagram.js

export const validAnagramConfig = {
    title: "Valid Anagram",
    subtitle: (args) => `Checking if "${args[0]}" and "${args[1]}" are anagrams`,
    defaults: { s: "anagram", t: "nagaram" },

    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an <span data-keyword="anagram">anagram</span> of <code>s</code>, and <code>false</code> otherwise.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;anagram&quot;, t = &quot;nagaram&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;rat&quot;, t = &quot;car&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">false</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length, t.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong> What if the inputs contain Unicode characters? How would you adapt your solution to such a case?</p>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Core Insight
Two strings are anagrams iff they have **identical character frequencies**.

## Approach
1. If lengths differ → false immediately
2. Build frequency map for s (increment), then for t (decrement)
3. If all counts are 0 → anagram!

## Why HashMap?
Sorting works (O(n log n)) but a frequency map gives O(n). Count chars in s, subtract chars in t, check all zeros.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass to count |
| **Space** | **O(26)** = O(1) | Fixed-size frequency map |`
        }
    ],

    code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
            
        count = {}
        
        for char in s:
            count[char] = count.get(char, 0) + 1
        
        for char in t:
            count[char] = count.get(char, 0) - 1
        
        for val in count.values():
            if val != 0:
                return False
        
        return True`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "anagram";
        const t = args[1] || "nagaram";

        const arrS = s.split("");
        const arrT = t.split("");

        yield {
            cl: 1, phase: "init", msg: "Checking lengths first",
            arr: arrS, vars: { s: s, t: t }, map: {}, mapTitle: "Character Counts"
        };

        if (s.length !== t.length) {
            yield {
                cl: 3, phase: "done", msg: "Lengths differ! Not anagrams.",
                arr: arrS, vars: { s: s, t: t }, map: {}, result: "False"
            };
            return;
        }

        const count = {};

        yield { cl: 7, phase: "init", msg: "Counting characters in 's'", arr: arrS, vars: { s, t }, map: { ...count }, mapTitle: "Character Counts" };
        for (let i = 0; i < s.length; i++) {
            const char = s[i];
            count[char] = (count[char] || 0) + 1;
            yield {
                cl: 8, phase: "build", msg: `Increment count of '${char}'`,
                arr: arrS, ptrs: { [i]: "char" }, vars: { s, t, char },
                map: { ...count }, mapActiveKey: char, mapStatus: "inserting", mapTitle: "Character Counts (Building from S)"
            };
        }

        yield { cl: 10, phase: "init", msg: "Decrementing counts using 't'", arr: arrT, vars: { s, t }, map: { ...count }, mapTitle: "Character Counts (Reducing from T)" };
        for (let i = 0; i < t.length; i++) {
            const char = t[i];
            count[char] = (count[char] || 0) - 1;
            yield {
                cl: 11, phase: "search", msg: `Decrement count of '${char}'`,
                arr: arrT, ptrs: { [i]: "char" }, vars: { s, t, char },
                map: { ...count }, mapActiveKey: char, mapStatus: "searching", mapTitle: "Character Counts (Reducing from T)"
            };
        }

        yield { cl: 13, phase: "init", msg: "Verifying all counts hit zero", arr: [], vars: { s, t }, map: { ...count }, mapTitle: "Final Counts" };
        for (const char in count) {
            yield {
                cl: 14, phase: "search", msg: `Checking count of '${char}'`,
                arr: [], vars: { s, t, char, val: count[char] },
                map: { ...count }, mapActiveKey: char, mapStatus: "found", mapTitle: "Final Counts"
            };
            if (count[char] !== 0) {
                yield {
                    cl: 15, phase: "done", msg: `Count of '${char}' is non-zero. Not anagrams!`,
                    arr: [], vars: { s, t, char, val: count[char] },
                    map: { ...count }, mapHighlightKey: char, result: "False", mapTitle: "Final Counts"
                };
                return;
            }
        }

        yield {
            cl: 17, phase: "done", msg: "All zero! Strings are valid anagrams.",
            arr: [], vars: { s, t }, map: { ...count }, result: "True", mapTitle: "Final Counts"
        };
    }
};
