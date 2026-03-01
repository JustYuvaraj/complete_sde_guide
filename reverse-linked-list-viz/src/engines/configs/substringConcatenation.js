// src/engines/configs/substringConcatenation.js

export const substringConcatenationConfig = {
    title: "Substring with Concatenation of All Words",
    subtitle: () => 'Find all starting indices of concatenations of all words in s',
    defaults: { s: "barfoothefoobarman", words: ["foo", "bar"] },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `
<p>You are given a string <code>s</code> and an array of strings <code>words</code>. All the strings of <code>words</code> are of <strong>the same length</strong>.</p>

<p>A <strong>concatenated string</strong> is a string that exactly contains all the strings of any permutation of <code>words</code> concatenated.</p>

<ul>
	<li>For example, if <code>words = [&quot;ab&quot;,&quot;cd&quot;,&quot;ef&quot;]</code>, then <code>&quot;abcdef&quot;</code>, <code>&quot;abefcd&quot;</code>, <code>&quot;cdabef&quot;</code>, <code>&quot;cdefab&quot;</code>, <code>&quot;efabcd&quot;</code>, and <code>&quot;efcdab&quot;</code> are all concatenated strings. <code>&quot;acdbef&quot;</code> is not a concatenated string because it is not the concatenation of any permutation of <code>words</code>.</li>
</ul>

<p>Return an array of <em>the starting indices</em> of all the concatenated substrings in <code>s</code>. You can return the answer in <strong>any order</strong>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;barfoothefoobarman&quot;, words = [&quot;foo&quot;,&quot;bar&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[0,9]</span></p>

<p><strong>Explanation:</strong></p>

<p>The substring starting at 0 is <code>&quot;barfoo&quot;</code>. It is the concatenation of <code>[&quot;bar&quot;,&quot;foo&quot;]</code> which is a permutation of <code>words</code>.<br />
The substring starting at 9 is <code>&quot;foobar&quot;</code>. It is the concatenation of <code>[&quot;foo&quot;,&quot;bar&quot;]</code> which is a permutation of <code>words</code>.</p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;wordgoodgoodgoodbestword&quot;, words = [&quot;word&quot;,&quot;good&quot;,&quot;best&quot;,&quot;word&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[]</span></p>

<p><strong>Explanation:</strong></p>

<p>There is no concatenated substring.</p>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">s = &quot;barfoofoobarthefoobarman&quot;, words = [&quot;bar&quot;,&quot;foo&quot;,&quot;the&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[6,9,12]</span></p>

<p><strong>Explanation:</strong></p>

<p>The substring starting at 6 is <code>&quot;foobarthe&quot;</code>. It is the concatenation of <code>[&quot;foo&quot;,&quot;bar&quot;,&quot;the&quot;]</code>.<br />
The substring starting at 9 is <code>&quot;barthefoo&quot;</code>. It is the concatenation of <code>[&quot;bar&quot;,&quot;the&quot;,&quot;foo&quot;]</code>.<br />
The substring starting at 12 is <code>&quot;thefoobar&quot;</code>. It is the concatenation of <code>[&quot;the&quot;,&quot;foo&quot;,&quot;bar&quot;]</code>.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>1 &lt;= words.length &lt;= 5000</code></li>
	<li><code>1 &lt;= words[i].length &lt;= 30</code></li>
	<li><code>s</code> and <code>words[i]</code> consist of lowercase English letters.</li>
</ul>

`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Fixed Total Window

Total window size = wordLen × numWords. Each position in the window must match a word from the list.

## Step 2 — Word-Level Sliding Window

Treat the window as chunks of wordLen. At each starting position, check if each chunk is a valid word and counts match.

## Step 3 — The Algorithm

1. Build wordCount map from words
2. For each starting index i (0 to len(s) - totalLen):
   - Extract wordLen chunks
   - Build seen map, compare with wordCount
   - If all match → add i to result

## Key Takeaway
This combines fixed-window with frequency matching at the **word level**. Think of it as "Permutation in String" but with words instead of characters.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n × m)** | n = len(s), m = numWords |
| **Space** | **O(m)** | Word frequency maps |

## Optimization
Instead of checking every position, only check wordLen starting offsets (0, 1, ..., wordLen-1) and slide by wordLen steps. Reduces to O(n × wordLen).`
        }
    ],

    code: `class Solution:
    def findSubstring(self, s, words):
        if not s or not words:
            return []
        
        wordLen = len(words[0])
        totalLen = wordLen * len(words)
        wordCount = {}
        for w in words:
            wordCount[w] = wordCount.get(w, 0) + 1
        
        res = []
        for i in range(len(s) - totalLen + 1):
            seen = {}
            j = 0
            while j < len(words):
                word = s[i + j*wordLen : i + (j+1)*wordLen]
                if word in wordCount:
                    seen[word] = seen.get(word, 0) + 1
                    if seen[word] > wordCount[word]:
                        break
                else:
                    break
                j += 1
            if j == len(words):
                res.append(i)
        
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "barfoothefoobarman";
        const words = args[1] || ["foo", "bar"];
        const chars = s.split("");
        const wordLen = words[0].length;
        const totalLen = wordLen * words.length;
        const wordCount = {};
        for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;
        const res = [];

        yield {
            cl: 5, phase: "init", msg: `Words: [${words.map(w => `"${w}"`).join(", ")}]. Each word length = ${wordLen}, total window = ${totalLen}`,
            arr: chars, vars: { wordLen, totalLen, numWords: words.length },
            map: { ...wordCount }, mapTitle: "Word Count"
        };

        for (let i = 0; i <= s.length - totalLen; i++) {
            const seen = {};
            let j = 0;
            let valid = true;

            yield {
                cl: 11, phase: "search", msg: `Try starting index ${i}: check window [${i}..${i + totalLen - 1}]`,
                arr: chars, ptrs: { [i]: "start" },
                vars: { i, window: `"${s.substring(i, i + totalLen)}"` },
                map: { ...wordCount }, mapTitle: "Word Count",
                map2: {}, map2Title: "Seen Words"
            };

            while (j < words.length) {
                const word = s.substring(i + j * wordLen, i + (j + 1) * wordLen);

                if (word in wordCount) {
                    seen[word] = (seen[word] || 0) + 1;
                    if (seen[word] > wordCount[word]) {
                        yield {
                            cl: 19, phase: "search", msg: `Word "${word}" seen too many times (${seen[word]} > ${wordCount[word]}). Break.`,
                            arr: chars, ptrs: { [i + j * wordLen]: "w" },
                            vars: { word: `"${word}"`, seen_count: seen[word], allowed: wordCount[word] },
                            map: { ...wordCount }, mapTitle: "Word Count",
                            map2: { ...seen }, map2Title: "Seen Words", map2HighlightKey: word
                        };
                        valid = false;
                        break;
                    }
                } else {
                    yield {
                        cl: 22, phase: "search", msg: `Word "${word}" not in word list. Break.`,
                        arr: chars, ptrs: { [i + j * wordLen]: "w" },
                        vars: { word: `"${word}"` },
                        map: { ...wordCount }, mapTitle: "Word Count",
                        map2: { ...seen }, map2Title: "Seen Words"
                    };
                    valid = false;
                    break;
                }
                j++;
            }

            if (valid && j === words.length) {
                res.push(i);
                yield {
                    cl: 25, phase: "build", msg: `Match at index ${i}! "${s.substring(i, i + totalLen)}" contains all words.`,
                    arr: chars, ptrs: { [i]: "start", [i + totalLen - 1]: "end" },
                    vars: { match: `"${s.substring(i, i + totalLen)}"`, result: `[${res.join(", ")}]` },
                    map: { ...wordCount }, mapTitle: "Word Count",
                    map2: { ...seen }, map2Title: "Seen Words"
                };
            }
        }

        yield {
            cl: 27, phase: "done", msg: `Found ${res.length} valid starting indices`,
            arr: chars, vars: { result: `[${res.join(", ")}]` },
            map: { ...wordCount }, mapTitle: "Word Count",
            map2: {}, map2Title: "Seen Words",
            result: `[${res.join(", ")}]`
        };
    }
};
