// src/engines/configs/reorganizeString.js

export const reorganizeStringConfig = {
    title: "Reorganize String",
    subtitle: () => 'Rearrange characters so no two adjacent characters are the same',    defaults: { s: "aab" },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Given a string <code>s</code>, rearrange the characters of <code>s</code> so that any two adjacent characters are not the same.</p>

<p>Return <em>any possible rearrangement of</em> <code>s</code> <em>or return</em> <code>&quot;&quot;</code> <em>if not possible</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<pre><strong>Input:</strong> s = "aab"
<strong>Output:</strong> "aba"
</pre><p><strong class="example">Example 2:</strong></p>
<pre><strong>Input:</strong> s = "aaab"
<strong>Output:</strong> ""
</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 500</code></li>
	<li><code>s</code> consists of lowercase English letters.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Greedy with Max Heap
Always place the most frequent character next (skip if same as previous).
Use a max heap sorted by frequency. Alternate between top two characters.

## When Impossible?
If any character appears > (n+1)/2 times, no valid arrangement exists.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n log 26)** = O(n) | Heap ops with 26 chars |
| **Space** | **O(26)** = O(1) | Frequency map + heap |`}],

    code: `class Solution:
    def reorganizeString(self, s: str) -> str:
        count = Counter(s)
        maxHeap = [[-cnt, char] for char, cnt in count.items()]
        heapq.heapify(maxHeap) # O(n)
        
        prev = None
        res = ""
        while maxHeap or prev:
            if prev and not maxHeap:
                return ""
            
            cnt, char = heapq.heappop(maxHeap)
            res += char
            cnt += 1
            
            if prev:
                heapq.heappush(maxHeap, prev)
                prev = None
                
            if cnt != 0:
                prev = [cnt, char]
                
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "aab";
        const charCount = {};

        yield {
            cl: 3, phase: "init", msg: "Count frequency of each character in string",
            arr: s.split(""), vars: { s: `"${s}"` }, map: {}, mapTitle: "Character Frequencies"
        };

        for (let i = 0; i < s.length; i++) {
            const char = s[i];
            charCount[char] = (charCount[char] || 0) + 1;

            yield {
                cl: 3, phase: "build", msg: `Count char '${char}'`,
                arr: s.split(""), ptrs: { [i]: "i" }, vars: { s: `"${s}"`, char }, map: { ...charCount }, mapActiveKey: char
            };
        }

        const maxHeap = Object.keys(charCount).map(c => ({ char: c, cnt: charCount[c] }));

        // Helper to stringify heap state
        const stringifyHeap = (heap) => heap.map(item => `[${item.cnt}, '${item.char}']`);

        yield {
            cl: 5, phase: "init", msg: "Initialize Max Heap (represented by sorted array) with frequencies. Format: [count, char]",
            arr: stringifyHeap(maxHeap), vars: {}, map: { ...charCount }
        };

        maxHeap.sort((a, b) => b.cnt - a.cnt);

        yield {
            cl: 5, phase: "build", msg: "Heapify (Sort descending by frequency to simulate Max Heap).",
            arr: stringifyHeap(maxHeap), vars: {}, map: { ...charCount }
        };

        let prev = null;
        let res = "";

        yield {
            cl: 8, phase: "init", msg: "Initialize 'prev' storage to hold characters that must wait 1 turn before re-use, and 'res' string.",
            arr: stringifyHeap(maxHeap), vars: { "prev": "None", "res": `"${res}"` }, map: { ...charCount }
        };

        while (maxHeap.length > 0 || prev) {
            yield {
                cl: 9, phase: "search", msg: "Loop while we have items in maxHeap or a waiting 'prev' character",
                arr: stringifyHeap(maxHeap), vars: { "prev": prev ? `[${prev.cnt}, '${prev.char}']` : "None", "res": `"${res}"` }, map: { ...charCount }
            };

            if (prev && maxHeap.length === 0) {
                yield {
                    cl: 11, phase: "done", msg: "We have a waiting 'prev' char but heap is empty! We are forced to put adjacent duplicates. Thus, no valid string exists.",
                    arr: stringifyHeap(maxHeap), vars: { "prev": `[${prev.cnt}, '${prev.char}']`, "res": `"${res}"` }, map: { ...charCount }, result: '""'
                };
                return;
            }

            // Heappop
            const current = maxHeap.shift(); // take max

            yield {
                cl: 13, phase: "build", msg: `Pop most frequent char from heap: '${current.char}' (count ${current.cnt})`,
                arr: stringifyHeap(maxHeap), vars: { "popped!": `[${current.cnt}, '${current.char}']`, "prev": prev ? `[${prev.cnt}, '${prev.char}']` : "None", "res": `"${res}"` }, map: { ...charCount }
            };

            res += current.char;
            current.cnt -= 1;

            yield {
                cl: 14, phase: "build", msg: `Append '${current.char}' to result. Decrement its count. Count is now ${current.cnt}.`,
                arr: stringifyHeap(maxHeap), vars: { "current": `[${current.cnt}, '${current.char}']`, "prev": prev ? `[${prev.cnt}, '${prev.char}']` : "None", "res": `"${res}"` }, map: { ...charCount }
            };

            if (prev) {
                yield {
                    cl: 18, phase: "build", msg: `We have a waiting 'prev'. Push it back into the heap now that it's safe!`,
                    arr: stringifyHeap(maxHeap), vars: { "pushing": `[${prev.cnt}, '${prev.char}']`, "res": `"${res}"` }, map: { ...charCount }
                };

                maxHeap.push(prev);
                maxHeap.sort((a, b) => b.cnt - a.cnt);
                prev = null;

                yield {
                    cl: 19, phase: "build", msg: `Pushed and re-heapified. 'prev' is now None.`,
                    arr: stringifyHeap(maxHeap), vars: { "current": `[${current.cnt}, '${current.char}']`, "prev": "None", "res": `"${res}"` }, map: { ...charCount }
                };
            }

            if (current.cnt > 0) {
                prev = current;
                yield {
                    cl: 21, phase: "init", msg: `Remaining count is > 0. Put '${current.char}' in 'prev' so it waits 1 turn.`,
                    arr: stringifyHeap(maxHeap), vars: { "prev": `[${prev.cnt}, '${prev.char}']`, "res": `"${res}"` }, map: { ...charCount }
                };
            } else {
                yield {
                    cl: 22, phase: "init", msg: `Remaining count is 0. Character '${current.char}' is fully used.`,
                    arr: stringifyHeap(maxHeap), vars: { "prev": "None", "res": `"${res}"` }, map: { ...charCount }
                };
            }
        }

        yield {
            cl: 24, phase: "done", msg: "Success! All characters reordered.",
            arr: stringifyHeap(maxHeap), vars: { "res": `"${res}"` }, map: { ...charCount }, result: `"${res}"`
        };
    }
};
