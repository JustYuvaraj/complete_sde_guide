// src/engines/configs/ransomNote.js

export const ransomNoteConfig = {
    title: "Ransom Note",
    subtitle: () => 'Check if ransomNote can be built from magazine letters',    defaults: { ransomNote: "aa", magazine: "aab" },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code><em> if </em><code>ransomNote</code><em> can be constructed by using the letters from </em><code>magazine</code><em> and </em><code>false</code><em> otherwise</em>.</p>

<p>Each letter in <code>magazine</code> can only be used once in <code>ransomNote</code>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> ransomNote = "a", magazine = "b"
<strong>Output:</strong> false
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> ransomNote = "aa", magazine = "ab"
<strong>Output:</strong> false
</pre><p><strong class="example">Example 3:</strong></p>
<pre><strong>Input:</strong> ransomNote = "aa", magazine = "aab"
<strong>Output:</strong> true
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= ransomNote.length, magazine.length &lt;= 10<sup>5</sup></code></li>
	<li><code>ransomNote</code> and <code>magazine</code> consist of lowercase English letters.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Core Insight
Count available letters in magazine, then check if ransomNote's letters are all available.

## Approach
1. Build frequency map from magazine
2. For each char in ransomNote, decrement count
3. If any count goes below 0 → return false`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n+m)** | Count both strings |
| **Space** | **O(26)** = O(1) | Frequency map |`}],

    code: `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        if len(ransomNote) > len(magazine):
            return False
            
        counts = {}
        for c in magazine:
            counts[c] = counts.get(c, 0) + 1
            
        for c in ransomNote:
            if counts.get(c, 0) == 0:
                return False
            counts[c] -= 1
            
        return True`.split("\n"),

    generator: function* (args) {
        const ransomNote = args[0] || "aa";
        const magazine = args[1] || "aab";

        const arrRansom = ransomNote.split("");
        const arrMag = magazine.split("");
        const counts = {};

        yield {
            cl: 2, phase: "init", msg: "Check if ransomNote is longer than magazine",
            arr: [], vars: { "len(ransom)": ransomNote.length, "len(mag)": magazine.length }, map: {}
        };

        if (ransomNote.length > magazine.length) {
            yield { cl: 4, phase: "done", msg: "Ransom note is too long. Impossible!", arr: [], vars: {}, result: "False" };
            return;
        }

        yield {
            cl: 6, phase: "init", msg: "Count letters available in the magazine",
            arr: arrMag, vars: {}, map: {}, mapTitle: "Magazine Letters"
        };

        for (let i = 0; i < magazine.length; i++) {
            const c = magazine[i];
            counts[c] = (counts[c] || 0) + 1;
            yield {
                cl: 8, phase: "build", msg: `Count '${c}'`,
                arr: arrMag, ptrs: { [i]: "c" }, vars: { c },
                map: { ...counts }, mapActiveKey: c, mapStatus: "inserting"
            };
        }

        yield {
            cl: 10, phase: "init", msg: "Now check if we have the letters for the ransom note",
            arr: arrRansom, vars: {}, map: { ...counts }, mapTitle: "Magazine Letters (Remaining)"
        };

        for (let i = 0; i < ransomNote.length; i++) {
            const c = ransomNote[i];
            yield {
                cl: 11, phase: "search", msg: `Need a '${c}' for the note bounds`,
                arr: arrRansom, ptrs: { [i]: "c" }, vars: { c }, map: { ...counts }
            };

            if (!counts[c] || counts[c] === 0) {
                yield {
                    cl: 12, phase: "done", msg: `No '${c}' available in magazine! We failed.`,
                    arr: arrRansom, ptrs: { [i]: "c" }, vars: { c },
                    map: { ...counts }, mapHighlightKey: c, result: "False"
                };
                return;
            }

            counts[c] -= 1;
            yield {
                cl: 13, phase: "build", msg: `Use one '${c}'. Remaining: ${counts[c]}`,
                arr: arrRansom, ptrs: { [i]: "c" }, vars: { c },
                map: { ...counts }, mapActiveKey: c, mapStatus: "found"
            };
        }

        yield {
            cl: 15, phase: "done", msg: "Successfully built the ransom note!",
            arr: arrRansom, vars: {}, map: { ...counts }, result: "True"
        };
    }
};
