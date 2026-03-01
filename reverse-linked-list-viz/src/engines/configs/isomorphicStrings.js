// src/engines/configs/isomorphicStrings.js

export const isomorphicStringsConfig = {
    title: "Isomorphic Strings",
    subtitle: () => 'Determine if two strings can be mapped to one another',
    defaults: { s: "egg", t: "add" },
    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given two strings <code>s</code> and <code>t</code>, <em>determine if they are isomorphic</em>.</p>

<p>Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>.</p>

<p>All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;egg&quot;, t = &quot;add&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>

<p><strong>Explanation:</strong></p>

<p>The strings <code>s</code> and <code>t</code> can be made identical by:</p>

<ul>
	<li>Mapping <code>&#39;e&#39;</code> to <code>&#39;a&#39;</code>.</li>
	<li>Mapping <code>&#39;g&#39;</code> to <code>&#39;d&#39;</code>.</li>
</ul>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;f11&quot;, t = &quot;b23&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">false</span></p>

<p><strong>Explanation:</strong></p>

<p>The strings <code>s</code> and <code>t</code> can not be made identical as <code>&#39;1&#39;</code> needs to be mapped to both <code>&#39;2&#39;</code> and <code>&#39;3&#39;</code>.</p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;paper&quot;, t = &quot;title&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>t.length == s.length</code></li>
	<li><code>s</code> and <code>t</code> consist of any valid ascii character.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Core Insight
Need TWO maps: s→t AND t→s. Both must be consistent.

## Why Two Maps?
One map allows "ab"→"aa" (a→a, b→a). The reverse map catches this: if 'a' in t already maps to 'a' in s, it can't also map to 'b'.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(26)** = O(1) | Two mapping tables |`}],

    code: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        mapST, mapTS = {}, {}
        
        for i in range(len(s)):
            c1, c2 = s[i], t[i]
            
            if ((c1 in mapST and mapST[c1] != c2) or
                (c2 in mapTS and mapTS[c2] != c1)):
                return False
                
            mapST[c1] = c2
            mapTS[c2] = c1
            
        return True`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "egg";
        const t = args[1] || "add";

        const arrS = s.split("");
        const mapST = {};
        const mapTS = {};

        yield {
            cl: 3, phase: "init", msg: "Initialize two hashmaps: S \u2192 T and T \u2192 S",
            arr: arrS, vars: { s, t },
            map: {}, mapTitle: "S \u2192 T",
            map2: {}, map2Title: "T \u2192 S"
        };

        for (let i = 0; i < s.length; i++) {
            const c1 = s[i];
            const c2 = t[i];

            yield {
                cl: 6, phase: "init", msg: `Read characters at index ${i}: s[${i}]='${c1}', t[${i}]='${c2}'`,
                arr: arrS, ptrs: { [i]: "i" }, vars: { i, c1, c2 },
                map: { ...mapST }, mapTitle: "S \u2192 T",
                map2: { ...mapTS }, map2Title: "T \u2192 S"
            };

            // Check mapping collisions in both directions
            const stCollision = (c1 in mapST) && mapST[c1] !== c2;
            const tsCollision = (c2 in mapTS) && mapTS[c2] !== c1;

            yield {
                cl: 8, phase: "search", msg: `Check bijection: ${c1} \u2192 ${c2} and ${c2} \u2192 ${c1}`,
                arr: arrS, ptrs: { [i]: "i" }, vars: { i, c1, c2, [`mapST[${c1}]`]: mapST[c1], [`mapTS[${c2}]`]: mapTS[c2] },
                map: { ...mapST }, mapActiveKey: c1, mapStatus: "searching", mapTitle: "S \u2192 T",
                map2: { ...mapTS }, map2ActiveKey: c2, map2Status: "searching", map2Title: "T \u2192 S"
            };

            if (stCollision || tsCollision) {
                const reason = stCollision
                    ? `${c1} already maps to '${mapST[c1]}', not '${c2}'`
                    : `${c2} already maps to '${mapTS[c2]}', not '${c1}'`;
                yield {
                    cl: 10, phase: "done", msg: `Collision! ${reason}. Not isomorphic!`,
                    arr: arrS, ptrs: { [i]: "i" }, vars: { i, c1, c2 },
                    map: { ...mapST }, mapHighlightKey: stCollision ? c1 : undefined, mapTitle: "S \u2192 T",
                    map2: { ...mapTS }, map2HighlightKey: tsCollision ? c2 : undefined, map2Title: "T \u2192 S",
                    result: "False"
                };
                return;
            }

            mapST[c1] = c2;
            mapTS[c2] = c1;

            yield {
                cl: 12, phase: "build", msg: `Create/verify mapping: ${c1} \u2194 ${c2}`,
                arr: arrS, ptrs: { [i]: "i" }, vars: { i, c1, c2 },
                map: { ...mapST }, mapActiveKey: c1, mapStatus: "inserting", mapTitle: "S \u2192 T",
                map2: { ...mapTS }, map2ActiveKey: c2, map2Status: "inserting", map2Title: "T \u2192 S"
            };
        }

        yield {
            cl: 15, phase: "done", msg: "All mappings valid! Strings are isomorphic.",
            arr: arrS, vars: {},
            map: { ...mapST }, mapTitle: "S \u2192 T",
            map2: { ...mapTS }, map2Title: "T \u2192 S",
            result: "True"
        };
    }
};
