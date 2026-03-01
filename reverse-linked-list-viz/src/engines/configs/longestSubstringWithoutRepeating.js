// src/engines/configs/longestSubstringWithoutRepeating.js

export const longestSubstringWithoutRepeatingConfig = {
    title: "Longest Substring Without Repeating Characters",
    subtitle: () => 'Find the length of the longest substring without repeating characters',
    defaults: { s: "abcabcbb" },
    panels: ["hashmap"],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `## LeetCode 3 — Longest Substring Without Repeating Characters

**Difficulty:** Medium   **Topics:** Hash Table, Sliding Window, String

---

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

---

### Examples

**Example 1:**
    Input:  s = "abcabcbb"
    Output: 3  ("abc")

**Example 2:**
    Input:  s = "bbbbb"
    Output: 1  ("b")

**Example 3:**
    Input:  s = "pwwkew"
    Output: 3  ("wke")

### Constraints
- 0 <= s.length <= 5 × 10⁴`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Sliding Window Intuition

Use two pointers [l, r] defining a window. Expand r to include new chars.
When a **duplicate** is found, shrink from l until the window is valid again.

## Step 2 — What Data Structure?

A **Set** (or HashMap) to track which characters are currently in the window.
O(1) lookup for "is this char already in my window?"

## Step 3 — The Algorithm

1. Initialize l = 0, charSet = {}, result = 0
2. For each r:
   - While s[r] is in charSet → remove s[l], l++
   - Add s[r] to charSet
   - result = max(result, r - l + 1)

## Key Takeaway
Variable-size sliding window: expand right, shrink left when constraint violated. Classic pattern for substring/subarray problems.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Each char added/removed at most once |
| **Space** | **O(min(n, m))** | m = size of character set (26 for lowercase) |

## Pattern Recognition
Whenever you see "longest/shortest substring with condition X" → think **sliding window + set/map**.`
        }
    ],

    code: `class Solution:
    def lengthOfLongestSubstring(self, s):
        charSet = set()
        l = 0
        res = 0
        
        for r in range(len(s)):
            while s[r] in charSet:
                charSet.remove(s[l])
                l += 1
            charSet.add(s[r])
            res = max(res, r - l + 1)
        
        return res`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "abcabcbb";
        const chars = s.split("");
        const charSet = {};
        let l = 0;
        let res = 0;
        let resL = 0, resR = 0;

        yield {
            cl: 2, phase: "init", msg: "Initialize sliding window with left pointer at 0",
            arr: chars, ptrs: { 0: "l" }, vars: { l: 0, res: 0 },
            map: {}, mapTitle: "Character Set"
        };

        for (let r = 0; r < s.length; r++) {
            yield {
                cl: 6, phase: "search", msg: `Expand window: r = ${r}, char = '${s[r]}'`,
                arr: chars, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, "s[r]": s[r], res },
                map: { ...charSet }, mapTitle: "Character Set", mapActiveKey: s[r]
            };

            while (s[r] in charSet) {
                yield {
                    cl: 8, phase: "build", msg: `'${s[r]}' already in set! Shrink: remove '${s[l]}', move l from ${l} to ${l + 1}`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, removing: s[l], res },
                    map: { ...charSet }, mapTitle: "Character Set", mapHighlightKey: s[r]
                };
                delete charSet[s[l]];
                l++;
            }

            charSet[s[r]] = true;
            const windowLen = r - l + 1;

            if (windowLen > res) {
                res = windowLen;
                resL = l;
                resR = r;
                yield {
                    cl: 11, phase: "build", msg: `New longest! Window [${l}..${r}] = "${s.substring(l, r + 1)}", length = ${res}`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, window: `"${s.substring(l, r + 1)}"`, res },
                    map: { ...charSet }, mapTitle: "Character Set", mapActiveKey: s[r], mapStatus: "inserting"
                };
            } else {
                yield {
                    cl: 11, phase: "search", msg: `Window [${l}..${r}] = "${s.substring(l, r + 1)}", length = ${windowLen}. Best still ${res}`,
                    arr: chars, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, window_len: windowLen, res },
                    map: { ...charSet }, mapTitle: "Character Set", mapActiveKey: s[r], mapStatus: "inserting"
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: `Longest substring without repeating = "${s.substring(resL, resR + 1)}", length = ${res}`,
            arr: chars, vars: { res },
            map: {}, mapTitle: "Character Set",
            result: `${res}`
        };
    }
};
