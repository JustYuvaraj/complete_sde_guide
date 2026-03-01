// src/engines/configs/maxPointsCards.js

export const maxPointsCardsConfig = {
    title: "Max Points You Can Obtain from Cards",
    subtitle: (args) => `Find maximum score picking exactly k=${args[1] || 3} cards from ends`,    defaults: { cardPoints: [1, 2, 3, 4, 5, 6, 1], k: 3 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>There are several cards <strong>arranged in a row</strong>, and each card has an associated number of points. The points are given in the integer array <code>cardPoints</code>.</p>

<p>In one step, you can take one card from the beginning or from the end of the row. You have to take exactly <code>k</code> cards.</p>

<p>Your score is the sum of the points of the cards you have taken.</p>

<p>Given the integer array <code>cardPoints</code> and the integer <code>k</code>, return the <em>maximum score</em> you can obtain.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> cardPoints = [1,2,3,4,5,6,1], k = 3
<strong>Output:</strong> 12
<strong>Explanation:</strong> After the first step, your score will always be 1. However, choosing the rightmost card first will maximize your total score. The optimal strategy is to take the three cards on the right, giving a final score of 1 + 6 + 5 = 12.
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> cardPoints = [2,2,2], k = 2
<strong>Output:</strong> 4
<strong>Explanation:</strong> Regardless of which two cards you take, your score will always be 4.
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> cardPoints = [9,7,7,9,7,7,9], k = 7
<strong>Output:</strong> 55
<strong>Explanation:</strong> You have to take all the cards. Your score is the sum of points of all cards.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= cardPoints.length &lt;= 10<sup>5</sup></code></li>
	<li><code>1 &lt;= cardPoints[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>1 &lt;= k &lt;= cardPoints.length</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Inverse Sliding Window
Taking k cards from ends = leaving a window of (n-k) in the middle.
Minimize the middle window sum → maximize the cards taken.

## Alternative
Prefix sum from left (take i from left) + suffix sum from right (take k-i from right). Try all splits.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single sliding window pass |
| **Space** | **O(1)** | Just running sums |`}],

    code: `class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        l, r = 0, len(cardPoints) - k
        total = sum(cardPoints[r:])
        res = total
        
        while r < len(cardPoints):
            total += (cardPoints[l] - cardPoints[r])
            res = max(res, total)
            l += 1
            r += 1
            
        return res`.split("\n"),

    generator: function* (args) {
        const cardPoints = args[0] || [1, 2, 3, 4, 5, 6, 1];
        const k = args[1] || 3;

        let l = 0;
        let r = cardPoints.length - k;

        yield {
            cl: 3, phase: "init", msg: `Initialize pointers. We want to pick k=${k} cards. This leaves a window of len-k=${cardPoints.length - k} cards we DO NOT pick in the middle.`,
            arr: cardPoints, ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r }
        };

        let total = 0;
        for (let i = r; i < cardPoints.length; i++) {
            total += cardPoints[i];
        }
        let res = total;

        yield {
            cl: 5, phase: "init", msg: "Calculate initial sum of the right-most k cards.",
            arr: cardPoints.map((c, idx) => idx >= r ? `${c} [PICK]` : c), ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r, total, res }
        };

        while (r < cardPoints.length) {
            yield {
                cl: 7, phase: "search", msg: `Slide window right. Add cardPoints[${l}] and remove cardPoints[${r}].`,
                arr: cardPoints, ptrs: { [l]: "add", [r]: "remove" }, vars: { k, l, r, total, res }
            };

            total += (cardPoints[l] - cardPoints[r]);
            res = Math.max(res, total);

            yield {
                cl: 9, phase: "build", msg: `New total is ${total}. Max result is ${res}.`,
                arr: cardPoints.map((c, idx) => (idx < l + 1 || idx > r) ? `${c} [PICK]` : c),
                ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r, total, res }
            };

            l += 1;
            r += 1;

            if (r < cardPoints.length) {
                yield {
                    cl: 10, phase: "init", msg: `Shift window logic pointers to l=${l}, r=${r}`,
                    arr: cardPoints.map((c, idx) => (idx < l || idx >= r) ? `${c} [PICK]` : c),
                    ptrs: { [l]: "l", [r]: "r" }, vars: { k, l, r, total, res }
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: "Sliding window complete! Max score determined.",
            arr: cardPoints, vars: { res }, result: String(res)
        };
    }
};
