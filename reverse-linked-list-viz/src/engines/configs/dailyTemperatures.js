export const dailyTemperaturesConfig = {
    title: "Daily Temperatures",
    subtitle: "LeetCode 739 • Monotonic Stack",
    input: [73, 74, 75, 71, 69, 72, 76, 73],
    defaults: {
        temperatures: [73, 74, 75, 71, 69, 72, 76, 73]
    },
    code: [
        { text: "class Solution:", indent: 0 },
        { text: "def dailyTemperatures(self, temperatures):", indent: 4 },
        { text: "res = [0] * len(temperatures)", indent: 8 },
        { text: "stack = []  # stores [temp, index]", indent: 8 },
        { text: "for i, t in enumerate(temperatures):", indent: 8 },
        { text: "while stack and t > stack[-1][0]:", indent: 12 },
        { text: "stackT, stackIdx = stack.pop()", indent: 16 },
        { text: "res[stackIdx] = i - stackIdx", indent: 16 },
        { text: "stack.append([t, i])", indent: 12 },
        { text: "return res", indent: 8 },
    ],
    explain: [
        {
            title: "Problem Statement",
            content: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead."
        },
        {
            title: "How to Think",
            content: "The brute force approach is $O(n^2)$. To optimize to $O(n)$, we use a **Monotonic Decreasing Stack**. We store temperatures and their indices in the stack. When we find a temperature warmer than the one at the top of the stack, we've found our 'next warmer day' for that previous temperature."
        }
    ],
    steps: [
        {
            i: -1,
            stack: [],
            results: [0, 0, 0, 0, 0, 0, 0, 0],
            explain: "Initialize an empty results array and a stack to store [temperature, index].",
        },
        {
            i: 0,
            stack: [{ val: 73, idx: 0 }],
            results: [0, 0, 0, 0, 0, 0, 0, 0],
            explain: "i=0: 73. Stack is empty, so we push [73, 0] onto the stack.",
        },
        {
            i: 1,
            stack: [],
            results: [1, 0, 0, 0, 0, 0, 0, 0],
            explain: "i=1: 74. 74 is warmer than 73 (stack top). Pop 73 and set res[0] = 1 - 0 = 1 day wait.",
        },
        {
            i: 1,
            stack: [{ val: 74, idx: 1 }],
            results: [1, 0, 0, 0, 0, 0, 0, 0],
            explain: "After popping 73, we push the current day [74, 1] onto the stack.",
        },
        {
            i: 2,
            stack: [],
            results: [1, 1, 0, 0, 0, 0, 0, 0],
            explain: "i=2: 75. 75 > 74. Pop 74, set res[1] = 2 - 1 = 1 day wait.",
        },
        {
            i: 2,
            stack: [{ val: 75, idx: 2 }],
            results: [1, 1, 0, 0, 0, 0, 0, 0],
            explain: "Push [75, 2] onto the stack.",
        },
        {
            i: 3,
            stack: [{ val: 75, idx: 2 }, { val: 71, idx: 3 }],
            results: [1, 1, 0, 0, 0, 0, 0, 0],
            explain: "i=3: 71. 71 is NOT warmer than 75. Push [71, 3] and wait for a warmer day.",
        },
        {
            i: 4,
            stack: [{ val: 75, idx: 2 }, { val: 71, idx: 3 }, { val: 69, idx: 4 }],
            results: [1, 1, 0, 0, 0, 0, 0, 0],
            explain: "i=4: 69. 69 is NOT warmer than 71. Push [69, 4].",
        },
        {
            i: 5,
            stack: [{ val: 75, idx: 2 }, { val: 71, idx: 3 }],
            results: [1, 1, 0, 0, 1, 0, 0, 0],
            explain: "i=5: 72. 72 > 69. Pop 69, set res[4] = 5 - 4 = 1 day wait.",
        },
        {
            i: 5,
            stack: [{ val: 75, idx: 2 }],
            results: [1, 1, 0, 2, 1, 0, 0, 0],
            explain: "72 is still warmer than 71. Pop 71, set res[3] = 5 - 3 = 2 days wait.",
        },
        {
            i: 5,
            stack: [{ val: 75, idx: 2 }, { val: 72, idx: 5 }],
            results: [1, 1, 0, 2, 1, 0, 0, 0],
            explain: "72 is NOT warmer than 75. Push [72, 5].",
        },
        {
            i: 6,
            stack: [{ val: 75, idx: 2 }],
            results: [1, 1, 0, 2, 1, 1, 0, 0],
            explain: "i=6: 76. 76 > 72. Pop 72, set res[5] = 6 - 5 = 1 day wait.",
        },
        {
            i: 6,
            stack: [],
            results: [1, 1, 4, 2, 1, 1, 0, 0],
            explain: "76 > 75. Pop 75, set res[2] = 6 - 2 = 4 days wait.",
        },
        {
            i: 6,
            stack: [{ val: 76, idx: 6 }],
            results: [1, 1, 4, 2, 1, 1, 0, 0],
            explain: "Push [76, 6].",
        },
        {
            i: 7,
            stack: [{ val: 76, idx: 6 }, { val: 73, idx: 7 }],
            results: [1, 1, 4, 2, 1, 1, 0, 0],
            explain: "i=7: 73. 73 < 76. Push [73, 7]. Loop ends.",
        },
        {
            i: -1,
            stack: [{ val: 76, idx: 6 }, { val: 73, idx: 7 }],
            results: [1, 1, 4, 2, 1, 1, 0, 0],
            explain: "Final Results: [1, 1, 4, 2, 1, 1, 0, 0]. Remaining days have no warmer future date.",
        }
    ]
};
