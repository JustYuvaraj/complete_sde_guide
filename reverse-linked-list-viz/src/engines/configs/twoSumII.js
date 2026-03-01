// src/engines/configs/twoSumII.js

export const twoSumIIConfig = {
    title: "Two Sum II - Input Array Is Sorted",
    subtitle: () => "Find two numbers that add up to target using converging pointers",    defaults: { numbers: [2, 7, 11, 15], target: 9 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`## LeetCode 167 — Two Sum II (Sorted Array)
**Difficulty:** Medium · **Topics:** Array, Two Pointers, Binary Search

Given a sorted array, find two numbers that sum to target. Return 1-indexed positions.

### Examples
    Input: numbers=[2,7,11,15], target=9 → [1,2]`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Two Pointers (Sorted Array)
Left at start, right at end:
- Sum too small → move left right
- Sum too big → move right left
- Sum equals target → found!

## Why Two Pointers?
Array is sorted, so we can use the ordering to eliminate candidates. O(n) time vs O(n) space for a HashMap.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | At most n steps |
| **Space** | **O(1)** | Just two pointers |`}],

    code: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1

        while l < r:
            curSum = numbers[l] + numbers[r]

            if curSum > target:
                r -= 1
            elif curSum < target:
                l += 1
            else:
                return [l + 1, r + 1]
        return []`.split("\n"),

    generator: function* (args) {
        const numbers = args[0] || [2, 7, 11, 15];
        const target = args[1] !== undefined ? args[1] : 9;

        let l = 0;
        let r = numbers.length - 1;

        yield {
            cl: 3, phase: "init", msg: `Initialize left pointer at start, right pointer at end. Target = ${target}`,
            arr: numbers, ptrs: { [l]: "l", [r]: "r" }, vars: { target, l, r }
        };

        while (l < r) {
            const curSum = numbers[l] + numbers[r];

            yield {
                cl: 6, phase: "search", msg: `Calculate curSum = numbers[${l}] + numbers[${r}] => ${numbers[l]} + ${numbers[r]} = ${curSum}`,
                arr: numbers, ptrs: { [l]: "l", [r]: "r" }, vars: { target, curSum, "nums[l]": numbers[l], "nums[r]": numbers[r] }
            };

            if (curSum > target) {
                yield {
                    cl: 8, phase: "search", msg: `curSum (${curSum}) > target (${target}). Since array is sorted, shift right pointer leftward to decrease sum. r -= 1`,
                    arr: numbers, ptrs: { [l]: "l", [r]: "r" }, vars: { target, curSum }
                };
                r -= 1;
            } else if (curSum < target) {
                yield {
                    cl: 10, phase: "search", msg: `curSum (${curSum}) < target (${target}). Shift left pointer rightward to increase sum. l += 1`,
                    arr: numbers, ptrs: { [l]: "l", [r]: "r" }, vars: { target, curSum }
                };
                l += 1;
            } else {
                yield {
                    cl: 13, phase: "done", msg: `Match found! curSum == target. Return 1-indexed indices: [${l + 1}, ${r + 1}]`,
                    arr: numbers, ptrs: { [l]: "l", [r]: "r" }, vars: { target, curSum }, result: `[${l + 1}, ${r + 1}]`
                };
                return;
            }
        }

        yield {
            cl: 14, phase: "done", msg: "Pointers crossed. No solution found.",
            arr: numbers, vars: {}, result: "[]"
        };
    }
};
