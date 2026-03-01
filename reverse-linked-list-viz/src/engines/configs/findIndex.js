// src/engines/configs/findIndex.js

export const findIndexConfig = {
    title: "Find Index of First Occurrence",
    subtitle: (args) => `Find the index of needle '${args[1]}' in haystack '${args[0]}'`,    defaults: { haystack: "sadbutsad", needle: "sad" },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`## LeetCode 28 — Find the Index of the First Occurrence
**Difficulty:** Easy · **Topics:** String, Two Pointers, String Matching

Return the index of the first occurrence of \`needle\` in \`haystack\`, or -1 if not found.

### Examples
    Input: haystack="sadbutsad", needle="sad" → 0
    Input: haystack="leetcode", needle="leeto" → -1`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Simple Sliding Window
Slide a window of needle's length across haystack. Compare substring at each position.

## Advanced: KMP Algorithm
For optimal O(n+m), use KMP with a failure function. But for interviews, the simple approach is usually fine.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n·m)** | n positions, m-length comparison each |
| **Space** | **O(1)** | No extra space |`}],

    code: `class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if needle == "": return 0
        
        for i in range(len(haystack) + 1 - len(needle)):
            if haystack[i  :  i + len(needle)] == needle:
                return i
                
        return -1`.split("\n"),

    generator: function* (args) {
        const haystack = args[0] || "sadbutsad";
        const needle = args[1] || "sad";

        const arr = haystack.split("");

        yield {
            cl: 3, phase: "init", msg: "Check if needle is empty",
            arr: arr, vars: { needle }
        };

        if (needle === "") {
            yield { cl: 3, phase: "done", msg: "Needle is empty! Return 0", arr: arr, vars: {}, result: "0" };
            return;
        }

        const iterMax = haystack.length + 1 - needle.length;
        yield {
            cl: 5, phase: "init", msg: `Iterate through haystack. Max start index is ${iterMax - 1}`,
            arr: arr, vars: { needle, "len(haystack)": haystack.length, "len(needle)": needle.length }
        };

        for (let i = 0; i < iterMax; i++) {
            yield {
                cl: 5, phase: "init", msg: `Checking index ${i}`,
                arr: arr, ptrs: { [i]: "i" }, vars: { i, needle }
            };

            const slice = haystack.slice(i, i + needle.length);

            yield {
                cl: 6, phase: "search", msg: `Extract substring of length ${needle.length}: '${slice}'`,
                arr: arr, ptrs: { [i]: "i", [i + needle.length - 1]: "end" }, vars: { i, needle, slice }
            };

            if (slice === needle) {
                yield {
                    cl: 7, phase: "done", msg: `Substring matches needle! Returning index ${i}`,
                    arr: arr, ptrs: { [i]: "i" }, vars: { i, needle, slice }, result: String(i)
                };
                return;
            } else {
                yield {
                    cl: 6, phase: "search", msg: `Substring '${slice}' does not match '${needle}'`,
                    arr: arr, ptrs: { [i]: "i" }, vars: { i, needle, slice }
                };
            }
        }

        yield {
            cl: 9, phase: "done", msg: "Finished array. Needle not found in haystack. Return -1",
            arr: arr, vars: { needle }, result: "-1"
        };
    }
};
