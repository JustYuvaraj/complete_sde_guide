// src/engines/configs/wordPattern.js

export const wordPatternConfig = {
    title: "Word Pattern",
    subtitle: () => 'Check if words follow exactly the given pattern',
    defaults: { pattern: "abba", s: "dog cat cat dog" },
    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code>&nbsp;follows the same pattern.</p>

<p>Here <b>follow</b> means a full match, such that there is a bijection between a letter in <code>pattern</code> and a <b>non-empty</b> word in <code>s</code>. Specifically:</p>

<ul>
	<li>Each letter in <code>pattern</code> maps to <strong>exactly</strong> one unique word in <code>s</code>.</li>
	<li>Each unique word in <code>s</code> maps to <strong>exactly</strong> one letter in <code>pattern</code>.</li>
	<li>No two letters map to the same word, and no two words map to the same letter.</li>
</ul>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">pattern = &quot;abba&quot;, s = &quot;dog cat cat dog&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">true</span></p>

<p><strong>Explanation:</strong></p>

<p>The bijection can be established as:</p>

<ul>
	<li><code>&#39;a&#39;</code> maps to <code>&quot;dog&quot;</code>.</li>
	<li><code>&#39;b&#39;</code> maps to <code>&quot;cat&quot;</code>.</li>
</ul>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">pattern = &quot;abba&quot;, s = &quot;dog cat cat fish&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">false</span></p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">pattern = &quot;aaaa&quot;, s = &quot;dog cat cat dog&quot;</span></p>

<p><strong>Output:</strong> <span class="example-io">false</span></p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= pattern.length &lt;= 300</code></li>
	<li><code>pattern</code> contains only lower-case English letters.</li>
	<li><code>1 &lt;= s.length &lt;= 3000</code></li>
	<li><code>s</code> contains only lowercase English letters and spaces <code>&#39; &#39;</code>.</li>
	<li><code>s</code> <strong>does not contain</strong> any leading or trailing spaces.</li>
	<li>All the words in <code>s</code> are separated by a <strong>single space</strong>.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two HashMap Approach
Like Isomorphic Strings — need TWO maps:
- char → word AND word → char
- Both must be consistent (bijection)

## Why Two Maps?
One map allows "ab" → "dog dog" (a→dog, b→dog). Reverse map catches this.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass |
| **Space** | **O(n)** | Two maps |`}],

    code: `class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split(" ")
        if len(pattern) != len(words):
            return False
            
        charToWord = {}
        wordToChar = {}
        
        for c, w in zip(pattern, words):
            if c in charToWord and charToWord[c] != w:
                return False
            if w in wordToChar and wordToChar[w] != c:
                return False
                
            charToWord[c] = w
            wordToChar[w] = c
            
        return True`.split("\n"),

    generator: function* (args) {
        const pattern = args[0] || "abba";
        const s = args[1] || "dog cat cat dog";

        const words = s.split(" ");

        yield {
            cl: 3, phase: "init", msg: "Split string into words and check lengths.",
            arr: words, vars: { pattern, "len(pattern)": pattern.length, "len(words)": words.length },
            map: {}, mapTitle: "Char \u2192 Word",
            map2: {}, map2Title: "Word \u2192 Char"
        };

        if (pattern.length !== words.length) {
            yield {
                cl: 4, phase: "done", msg: "Lengths differ! Return False.", arr: words, vars: {}, result: "False",
                map: {}, mapTitle: "Char \u2192 Word", map2: {}, map2Title: "Word \u2192 Char"
            };
            return;
        }

        const charToWord = {};
        const wordToChar = {};

        yield {
            cl: 7, phase: "init", msg: "Initialize two hashmaps to ensure a 1-to-1 bijection mapping",
            arr: words, vars: { pattern },
            map: {}, mapTitle: "Char \u2192 Word",
            map2: {}, map2Title: "Word \u2192 Char"
        };

        for (let i = 0; i < pattern.length; i++) {
            const c = pattern[i];
            const w = words[i];

            yield {
                cl: 9, phase: "init", msg: `Check pair: pattern '${c}' and word '${w}'`,
                arr: words, ptrs: { [i]: "w" }, vars: { c, w },
                map: { ...charToWord }, mapTitle: "Char \u2192 Word",
                map2: { ...wordToChar }, map2Title: "Word \u2192 Char"
            };

            const hasC = c in charToWord;
            const hasW = w in wordToChar;

            yield {
                cl: 10, phase: "search", msg: `Check if '${c}' maps to anything but '${w}', or '${w}' maps to anything but '${c}'`,
                arr: words, ptrs: { [i]: "w" }, vars: { c, w, [c]: charToWord[c], [w]: wordToChar[w] },
                map: { ...charToWord }, mapActiveKey: c, mapTitle: "Char \u2192 Word",
                map2: { ...wordToChar }, map2ActiveKey: w, map2Title: "Word \u2192 Char"
            };

            if (hasC && charToWord[c] !== w) {
                yield {
                    cl: 12, phase: "done", msg: `Collision! '${c}' is already mapped to '${charToWord[c]}', but we expected '${w}'!`,
                    arr: words, ptrs: { [i]: "w" }, vars: { c, w },
                    map: { ...charToWord }, mapHighlightKey: c, mapTitle: "Char \u2192 Word",
                    map2: { ...wordToChar }, map2Title: "Word \u2192 Char",
                    result: "False"
                };
                return;
            }
            if (hasW && wordToChar[w] !== c) {
                yield {
                    cl: 14, phase: "done", msg: `Collision! Word '${w}' is already mapped to char '${wordToChar[w]}', but we expected '${c}'!`,
                    arr: words, ptrs: { [i]: "w" }, vars: { c, w },
                    map: { ...charToWord }, mapTitle: "Char \u2192 Word",
                    map2: { ...wordToChar }, map2HighlightKey: w, map2Title: "Word \u2192 Char",
                    result: "False"
                };
                return;
            }

            charToWord[c] = w;
            wordToChar[w] = c;

            yield {
                cl: 16, phase: "build", msg: `Create/verify bi-directional mapping: '${c}' \u2194 '${w}'`,
                arr: words, ptrs: { [i]: "w" }, vars: { c, w },
                map: { ...charToWord }, mapActiveKey: c, mapStatus: "inserting", mapTitle: "Char \u2192 Word",
                map2: { ...wordToChar }, map2ActiveKey: w, map2Status: "inserting", map2Title: "Word \u2192 Char"
            };
        }

        yield {
            cl: 19, phase: "done", msg: "All words successfully follow pattern. 1-to-1 bijection verified!",
            arr: words, vars: {},
            map: { ...charToWord }, mapTitle: "Char \u2192 Word",
            map2: { ...wordToChar }, map2Title: "Word \u2192 Char",
            result: "True"
        };
    }
};
