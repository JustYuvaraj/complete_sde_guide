// src/engines/configs/groupAnagrams.js

export const groupAnagramsConfig = {
    title: "Group Anagrams",
    subtitle: () => 'Grouping an array of strings by their anagrams',
    defaults: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] },

    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>Given an array of strings <code>strs</code>, group the <span data-keyword="anagram">anagrams</span> together. You can return the answer in <strong>any order</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">strs = [&quot;eat&quot;,&quot;tea&quot;,&quot;tan&quot;,&quot;ate&quot;,&quot;nat&quot;,&quot;bat&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[[&quot;bat&quot;],[&quot;nat&quot;,&quot;tan&quot;],[&quot;ate&quot;,&quot;eat&quot;,&quot;tea&quot;]]</span></p>

<p><strong>Explanation:</strong></p>

<ul>
	<li>There is no string in strs that can be rearranged to form <code>&quot;bat&quot;</code>.</li>
	<li>The strings <code>&quot;nat&quot;</code> and <code>&quot;tan&quot;</code> are anagrams as they can be rearranged to form each other.</li>
	<li>The strings <code>&quot;ate&quot;</code>, <code>&quot;eat&quot;</code>, and <code>&quot;tea&quot;</code> are anagrams as they can be rearranged to form each other.</li>
</ul>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">strs = [&quot;&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[[&quot;&quot;]]</span></p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">strs = [&quot;a&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[[&quot;a&quot;]]</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= strs.length &lt;= 10<sup>4</sup></code></li>
	<li><code>0 &lt;= strs[i].length &lt;= 100</code></li>
	<li><code>strs[i]</code> consists of lowercase English letters.</li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Core Insight
Anagrams share the same **sorted form**. "eat", "tea", "ate" → all sort to "aet".

## Approach
1. For each word, compute a **key** (sorted string or frequency tuple)
2. Group words by their key using a HashMap
3. Return all groups

## Why This Works
The sorted form is a canonical representation — all anagrams map to the same key. HashMap groups them in O(1) per lookup.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n·k·log k)** | n strings, each sorted in k·log k |
| **Space** | **O(n·k)** | Storing all strings in HashMap |

## Optimization
Use frequency count as key instead of sorting → O(n·k) time.`
        }
    ],

    code: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = {}
        
        for s in strs:
            sorted_s = "".join(sorted(s))
            
            if sorted_s not in res:
                res[sorted_s] = []
            
            res[sorted_s].append(s)
        
        return list(res.values())`.split("\n"),

    generator: function* (args) {
        const strs = args[0] || ["eat", "tea", "tan", "ate", "nat", "bat"];
        const res = {};

        yield {
            cl: 2, phase: "init", msg: "Initialize empty Hash Map to store groups",
            arr: strs, vars: { "strs.length": strs.length }, map: {}, mapTitle: "Anagram Groups"
        };

        for (let i = 0; i < strs.length; i++) {
            const s = strs[i];
            const sorted_s = s.split("").sort().join("");

            yield {
                cl: 4, phase: "init", msg: `Processing string '${s}'`,
                arr: strs, ptrs: { [i]: "s" }, vars: { s }, map: { ...res }
            };

            yield {
                cl: 5, phase: "search", msg: `Sort string to find its group key: '${sorted_s}'`,
                arr: strs, ptrs: { [i]: "s" }, vars: { s, sorted_s }, map: { ...res }
            };

            if (!res[sorted_s]) {
                res[sorted_s] = [];
                yield {
                    cl: 7, phase: "build", msg: `Key '${sorted_s}' not found. Create new group.`,
                    arr: strs, ptrs: { [i]: "s" }, vars: { s, sorted_s },
                    map: { ...res, [sorted_s]: "[]" }, mapStatus: "inserting", mapActiveKey: sorted_s
                };
            }

            res[sorted_s].push(s);
            yield {
                cl: 10, phase: "build", msg: `Append '${s}' to group '${sorted_s}'`,
                arr: strs, ptrs: { [i]: "s" }, vars: { s, sorted_s },
                map: { ...res, [sorted_s]: `[${res[sorted_s].join(",")}]` }, mapStatus: "found", mapActiveKey: sorted_s
            };
        }

        const output = Object.values(res);
        yield {
            cl: 12, phase: "done", msg: "Return all grouped values from the Hash Map.",
            arr: strs, vars: { "Groups": output.length }, map: { ...res },
            result: JSON.stringify(output)
        };
    }
};
