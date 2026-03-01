// src/engines/configs/validPalindrome.js

export const validPalindromeConfig = {
    title: "Valid Palindrome",
    subtitle: () => "Use two pointers converging from both ends to check for a palindrome",    defaults: { s: "A man, a plan, a canal: Panama" },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>

<p>Given a string <code>s</code>, return <code>true</code><em> if it is a <strong>palindrome</strong>, or </em><code>false</code><em> otherwise</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;A man, a plan, a canal: Panama&quot;
<strong>Output:</strong> true
<strong>Explanation:</strong> &quot;amanaplanacanalpanama&quot; is a palindrome.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> s = &quot;race a car&quot;
<strong>Output:</strong> false
<strong>Explanation:</strong> &quot;raceacar&quot; is not a palindrome.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> s = &quot; &quot;
<strong>Output:</strong> true
<strong>Explanation:</strong> s is an empty string &quot;&quot; after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 2 * 10<sup>5</sup></code></li>
	<li><code>s</code> consists only of printable ASCII characters.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers
Left and right pointers move inward. Skip non-alphanumeric characters. Compare lowercase versions.

## Why Two Pointers?
O(n) time, O(1) space. No need to create a cleaned string first.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass inward |
| **Space** | **O(1)** | Just two pointers |`}],

    code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        
        while l < r:
            while l < r and not self.alphaNum(s[l]):
                l += 1
            while r > l and not self.alphaNum(s[r]):
                r -= 1
                
            if s[l].lower() != s[r].lower():
                return False
                
            l, r = l + 1, r - 1
            
        return True
        
    def alphaNum(self, c):
        return (ord('A') <= ord(c) <= ord('Z') or 
                ord('a') <= ord(c) <= ord('z') or 
                ord('0') <= ord(c) <= ord('9'))`.split("\n"),

    generator: function* (args) {
        let s = args[0] || "A man, a plan, a canal: Panama";
        const arr = s.split("");

        const alphaNum = (c) => {
            const charCode = c.charCodeAt(0);
            return (charCode >= 48 && charCode <= 57) || // 0-9
                (charCode >= 65 && charCode <= 90) || // A-Z
                (charCode >= 97 && charCode <= 122);  // a-z
        };

        yield {
            cl: 3, phase: "init", msg: "Initialize left pointer at start, right pointer at end",
            arr, ptrs: { 0: "l", [arr.length - 1]: "r" }, vars: { l: 0, r: arr.length - 1 }
        };

        let l = 0;
        let r = arr.length - 1;

        while (l < r) {
            yield {
                cl: 5, phase: "search", msg: `Check characters at l=${l} ('${arr[l]}') and r=${r} ('${arr[r]}')`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r, "s[l]": `"${arr[l]}"`, "s[r]": `"${arr[r]}"` }
            };

            let movedLeft = false;
            while (l < r && !alphaNum(arr[l])) {
                l++;
                movedLeft = true;
            }
            if (movedLeft) {
                yield {
                    cl: 7, phase: "search", msg: `Skip non-alphanumeric chars from left. l is now ${l}`,
                    arr, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
                };
            }

            let movedRight = false;
            while (r > l && !alphaNum(arr[r])) {
                r--;
                movedRight = true;
            }
            if (movedRight) {
                yield {
                    cl: 9, phase: "search", msg: `Skip non-alphanumeric chars from right. r is now ${r}`,
                    arr, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
                };
            }

            if (l >= r) {
                yield {
                    cl: 5, phase: "search", msg: "Pointers crossed while skipping non-alphanumerics. We are done.",
                    arr, ptrs: { [l]: "l,r" }, vars: { l, r }
                };
                break;
            }

            const leftChar = arr[l].toLowerCase();
            const rightChar = arr[r].toLowerCase();

            yield {
                cl: 11, phase: "search", msg: `Compare lowercased characters: '${leftChar}' vs '${rightChar}'`,
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { "left": `"${leftChar}"`, "right": `"${rightChar}"` }
            };

            if (leftChar !== rightChar) {
                yield {
                    cl: 12, phase: "done", msg: `Mismatch! '${leftChar}' != '${rightChar}'. Thus, it is NOT a palindrome. Return False.`,
                    arr, ptrs: { [l]: "Mismatch", [r]: "Mismatch" }, vars: { "left": `"${leftChar}"`, "right": `"${rightChar}"` }, result: "False"
                };
                return;
            }

            yield {
                cl: 14, phase: "build", msg: "Match! Move pointers inward: l++, r--",
                arr, ptrs: { [l]: "l", [r]: "r" }, vars: { l, r }
            };

            l++;
            r--;
        }

        yield {
            cl: 16, phase: "done", msg: "All valid characters matched! It is a Valid Palindrome. Return True.",
            arr, ptrs: { [l]: "l", ...(r >= 0 ? { [r]: r } : {}) }, vars: {}, result: "True"
        };
    }
};
