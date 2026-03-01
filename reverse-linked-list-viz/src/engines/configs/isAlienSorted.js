// src/engines/configs/isAlienSorted.js

export const isAlienSortedConfig = {
    title: "Verifying an Alien Dictionary",
    subtitle: () => 'Check if words are sorted according to a given alien dictionary order',    defaults: { words: ["hello", "leetcode"], order: "hlabcdefgijkmnopqrstuvwxyz" },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different <code>order</code>. The <code>order</code> of the alphabet is some permutation of lowercase letters.</p>

<p>Given a sequence of <code>words</code> written in the alien language, and the <code>order</code> of the alphabet, return <code>true</code> if and only if the given <code>words</code> are sorted lexicographically in this alien language.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> words = [&quot;hello&quot;,&quot;leetcode&quot;], order = &quot;hlabcdefgijkmnopqrstuvwxyz&quot;
<strong>Output:</strong> true
<strong>Explanation: </strong>As &#39;h&#39; comes before &#39;l&#39; in this language, then the sequence is sorted.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> words = [&quot;word&quot;,&quot;world&quot;,&quot;row&quot;], order = &quot;worldabcefghijkmnpqstuvxyz&quot;
<strong>Output:</strong> false
<strong>Explanation: </strong>As &#39;d&#39; comes after &#39;l&#39; in this language, then words[0] &gt; words[1], hence the sequence is unsorted.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> words = [&quot;apple&quot;,&quot;app&quot;], order = &quot;abcdefghijklmnopqrstuvwxyz&quot;
<strong>Output:</strong> false
<strong>Explanation: </strong>The first three characters &quot;app&quot; match, and the second string is shorter (in size.) According to lexicographical rules &quot;apple&quot; &gt; &quot;app&quot;, because &#39;l&#39; &gt; &#39;&empty;&#39;, where &#39;&empty;&#39; is defined as the blank character which is less than any other character (<a href="https://en.wikipedia.org/wiki/Lexicographical_order" target="_blank">More info</a>).
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= words.length &lt;= 100</code></li>
	<li><code>1 &lt;= words[i].length &lt;= 20</code></li>
	<li><code>order.length == 26</code></li>
	<li>All characters in <code>words[i]</code> and <code>order</code> are English lowercase letters.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Approach
1. Build order map: char → position
2. Compare adjacent word pairs using the alien order
3. For each pair, find first differing character and check order

## Key Edge Case
If word1 is a prefix of word2 (like "app" vs "apple"), it's valid. But "apple" before "app" is invalid.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(total chars)** | Compare all adjacent pairs |
| **Space** | **O(26)** = O(1) | Order mapping |`}],

    code: `class Solution:
    def isAlienSorted(self, words: List[str], order: str) -> bool:
        orderInd = { c: i for i, c in enumerate(order) }
        
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            
            for j in range(len(w1)):
                if j == len(w2):
                    return False
                    
                if w1[j] != w2[j]:
                    if orderInd[w2[j]] < orderInd[w1[j]]:
                        return False
                    break
                    
        return True`.split("\n"),

    generator: function* (args) {
        const words = args[0] || ["hello", "leetcode"];
        const order = args[1] || "hlabcdefgijkmnopqrstuvwxyz";

        const orderInd = {};
        const orderArr = order.split("");

        yield {
            cl: 3, phase: "init", msg: "Initialize hashmap to store alien character ranks (O(1) lookup)",
            arr: orderArr, vars: { words: JSON.stringify(words) }, map: {}, mapTitle: "Alien Alphabet Ranks"
        };

        for (let i = 0; i < order.length; i++) {
            orderInd[order[i]] = i;
        }

        yield {
            cl: 3, phase: "build", msg: "Map each character to its index (rank)",
            arr: orderArr, vars: { words: JSON.stringify(words) }, map: { ...orderInd }, mapTitle: "Alien Alphabet Ranks"
        };

        for (let i = 0; i < words.length - 1; i++) {
            const w1 = words[i];
            const w2 = words[i + 1];

            yield {
                cl: 5, phase: "init", msg: `Comparing words[${i}] and words[${i + 1}]`,
                arr: words.map((w, idx) => idx === i || idx === i + 1 ? `> ${w}` : w), ptrs: { [i]: "w1", [i + 1]: "w2" },
                vars: { w1, w2 }, map: { ...orderInd }
            };

            for (let j = 0; j < w1.length; j++) {
                yield {
                    cl: 8, phase: "init", msg: `Compare char at index ${j}: '${w1[j]}' vs '${w2[j] || "EOF"}'`,
                    arr: [
                        w1.slice(0, j) + "[" + w1[j] + "]" + w1.slice(j + 1),
                        j < w2.length ? w2.slice(0, j) + "[" + w2[j] + "]" + w2.slice(j + 1) : w2 + "[EOF]"
                    ],
                    ptrs: { 0: "w1", 1: "w2" }, vars: { j, "w1[j]": w1[j], "w2[j]": w2[j] }, map: { ...orderInd }
                };

                if (j === w2.length) {
                    yield {
                        cl: 10, phase: "done", msg: `w2 is shorter than w1, and matches prefix! Therefore, w1 is lexicographically GREATER than w2. Not sorted!`,
                        arr: [w1, w2], vars: { j }, map: { ...orderInd }, result: "False"
                    };
                    return;
                }

                if (w1[j] !== w2[j]) {
                    const rank1 = orderInd[w1[j]];
                    const rank2 = orderInd[w2[j]];

                    yield {
                        cl: 13, phase: "search", msg: `Chars differ! '${w1[j]}' vs '${w2[j]}'. Check their ranks in Alien Dictionary.`,
                        arr: [w1, w2], vars: { "w1[j]": w1[j], "w2[j]": w2[j], "rank1": rank1, "rank2": rank2 },
                        map: { ...orderInd }, mapActiveKey: w1[j], mapHighlightKey: w2[j]
                    };

                    if (rank2 < rank1) {
                        yield {
                            cl: 15, phase: "done", msg: `rank(${w2[j]}) = ${rank2} is < rank(${w1[j]}) = ${rank1}. Not sorted!`,
                            arr: [w1, w2], vars: { rank1, rank2 }, map: { ...orderInd }, result: "False"
                        };
                        return;
                    } else {
                        yield {
                            cl: 16, phase: "build", msg: `rank(${w1[j]}) = ${rank1} is < rank(${w2[j]}) = ${rank2}. Words are properly ordered. Break and move to next pair.`,
                            arr: [w1, w2], vars: { rank1, rank2 }, map: { ...orderInd }
                        };
                        break;
                    }
                }
            }
        }

        yield {
            cl: 18, phase: "done", msg: "All adjacent pairs are sorted! Returning True.",
            arr: words, vars: {}, map: { ...orderInd }, result: "True"
        };
    }
};
