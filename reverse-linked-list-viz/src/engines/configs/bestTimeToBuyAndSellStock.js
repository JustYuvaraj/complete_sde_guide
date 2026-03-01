// src/engines/configs/bestTimeToBuyAndSellStock.js

export const bestTimeToBuyAndSellStockConfig = {
    title: "Best Time to Buy and Sell Stock",
    subtitle: () => 'Find the maximum profit from a single buy-sell transaction',
    defaults: { prices: [7, 1, 5, 3, 6, 4] },
    panels: [],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `## LeetCode 121 — Best Time to Buy and Sell Stock

**Difficulty:** Easy   **Topics:** Array, Sliding Window

---

Given an array \`prices\` where \`prices[i]\` is the price on day i, find the **maximum profit** from one buy-sell transaction.

You must buy before you sell. If no profit possible, return 0.

---

### Examples

**Example 1:**
    Input:  prices = [7,1,5,3,6,4]
    Output: 5  (buy day 1 at 1, sell day 4 at 6)

**Example 2:**
    Input:  prices = [7,6,4,3,1]
    Output: 0  (prices only decrease)

### Constraints
- 1 <= prices.length <= 10⁵
- 0 <= prices[i] <= 10⁴`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Reframe the Problem

For each day, ask: "If I sell today, what's the best I can do?"
→ I need to know the **cheapest price before today**.

## Step 2 — Track the Minimum

As we scan left to right, track \`min_price\` seen so far.
At each price: profit = price - min_price.

## Step 3 — The Algorithm

1. Initialize min_price = ∞, max_profit = 0
2. For each price:
   - If price < min_price → update min_price
   - Else if price - min_price > max_profit → update max_profit
3. Return max_profit

## Key Takeaway
This is a **one-pass** problem. Track the minimum so far, compute profit at each step. No need for nested loops.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Single pass through the array |
| **Space** | **O(1)** | Only two variables tracked |

## Why Not Brute Force?
Checking all pairs = O(n²). Tracking min_price reduces to O(n) — classic sliding window / Kadane's pattern.`
        }
    ],

    code: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        
        return max_profit`.split("\n"),

    generator: function* (args) {
        const prices = args[0] || [7, 1, 5, 3, 6, 4];
        let minPrice = Infinity;
        let maxProfit = 0;
        let buyDay = -1;

        yield {
            cl: 2, phase: "init", msg: "Initialize: track minimum price seen so far and maximum profit",
            arr: prices, vars: { min_price: "∞", max_profit: 0 }
        };

        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];

            yield {
                cl: 5, phase: "search", msg: `Day ${i}: price = ${price}. Compare with min_price = ${minPrice === Infinity ? "∞" : minPrice}`,
                arr: prices, ptrs: { [i]: "i", ...(buyDay >= 0 ? { [buyDay]: "buy" } : {}) },
                vars: { price, min_price: minPrice === Infinity ? "∞" : minPrice, max_profit: maxProfit }
            };

            if (price < minPrice) {
                minPrice = price;
                buyDay = i;
                yield {
                    cl: 7, phase: "build", msg: `New minimum found! min_price = ${minPrice} (day ${i})`,
                    arr: prices, ptrs: { [i]: "buy" },
                    vars: { price, min_price: minPrice, max_profit: maxProfit }
                };
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
                yield {
                    cl: 9, phase: "build", msg: `New max profit! Buy at ${minPrice} (day ${buyDay}), sell at ${price} (day ${i}) → profit = ${maxProfit}`,
                    arr: prices, ptrs: { [buyDay]: "buy", [i]: "sell" },
                    vars: { price, min_price: minPrice, max_profit: maxProfit, profit: price - minPrice }
                };
            } else {
                yield {
                    cl: 5, phase: "search", msg: `No improvement. profit would be ${price - minPrice} ≤ ${maxProfit}`,
                    arr: prices, ptrs: { [i]: "i", ...(buyDay >= 0 ? { [buyDay]: "buy" } : {}) },
                    vars: { price, min_price: minPrice, max_profit: maxProfit }
                };
            }
        }

        yield {
            cl: 11, phase: "done", msg: `Maximum profit = ${maxProfit}`,
            arr: prices, vars: { max_profit: maxProfit },
            result: `${maxProfit}`
        };
    }
};
