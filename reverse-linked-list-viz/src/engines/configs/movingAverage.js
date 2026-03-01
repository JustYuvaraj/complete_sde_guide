// src/engines/configs/movingAverage.js

export const movingAverageConfig = {
    title: "Moving Average from Data Stream",
    subtitle: () => 'Calculate the moving average of a stream given a window size',
    defaults: { stream: [1, 10, 3, 5], size: 3 },
    panels: [],

    explain: [
        {
            icon: "📋", title: "Problem Statement", color: "#ef4444",
            content: `## LeetCode 346 — Moving Average from Data Stream

**Difficulty:** Easy   **Topics:** Queue, Sliding Window, Design

---

Design a class that calculates the **moving average** of the last \`size\` values from a data stream.

Implement \`next(val)\` — adds val to stream and returns the average of the last \`size\` values.

---

### Example

    MovingAverage m = new MovingAverage(3)
    m.next(1) = 1.0          // [1]
    m.next(10) = 5.5         // [1, 10]
    m.next(3) = 4.667        // [1, 10, 3]
    m.next(5) = 6.0          // [10, 3, 5] (1 dropped)`
        },
        {
            icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6",
            content: `## Step 1 — Fixed Window Queue

Maintain a queue of the last \`size\` values. When it exceeds size, remove the oldest.

## Step 2 — Running Total

Instead of recalculating sum each time, maintain a running total:
- Add new value
- If queue > size, subtract the removed value

## Key Takeaway
Fixed-size sliding window with a queue. Classic stream processing pattern. Keep a running sum to avoid O(k) recalculation.`
        },
        {
            icon: "⚡", title: "Code & Complexity", color: "#10b981",
            content: `## Complexity

| Metric | Value | Why |
|---|---|---|
| **Time** | **O(1)** per call | Add, subtract, divide — all O(1) |
| **Space** | **O(size)** | Queue stores last \`size\` elements |

## Design Pattern
This is the **Producer-Consumer** / **streaming** pattern. Useful in real-time analytics, sensor data, stock tickers.`
        }
    ],

    code: `class MovingAverage:
    def __init__(self, size):
        self.size = size
        self.queue = []
        self.total = 0
    
    def next(self, val):
        self.queue.append(val)
        self.total += val
        
        if len(self.queue) > self.size:
            self.total -= self.queue.pop(0)
        
        return self.total / len(self.queue)`.split("\n"),

    generator: function* (args) {
        const stream = args[0] || [1, 10, 3, 5];
        const size = args[1] !== undefined ? args[1] : 3;
        const queue = [];
        let total = 0;

        yield {
            cl: 2, phase: "init", msg: `Window size = ${size}. Process stream values one by one.`,
            arr: stream, vars: { size, queue: "[]", total: 0 }
        };

        for (let i = 0; i < stream.length; i++) {
            const val = stream[i];
            queue.push(val);
            total += val;

            yield {
                cl: 7, phase: "build", msg: `Stream value ${val}: add to window. Queue = [${queue.join(", ")}], total = ${total}`,
                arr: stream, ptrs: { [i]: "val", [Math.max(0, i - size + 1)]: "l" },
                vars: { val, queue: `[${queue.join(", ")}]`, total, window_len: queue.length }
            };

            if (queue.length > size) {
                const removed = queue.shift();
                total -= removed;
                yield {
                    cl: 11, phase: "search", msg: `Window full! Remove oldest: ${removed}. Queue = [${queue.join(", ")}]`,
                    arr: stream, ptrs: { [i]: "r", [i - size + 1]: "l" },
                    vars: { removed, queue: `[${queue.join(", ")}]`, total, window_len: queue.length }
                };
            }

            const avg = total / queue.length;
            yield {
                cl: 13, phase: "build", msg: `Moving average = ${total} / ${queue.length} = ${avg.toFixed(2)}`,
                arr: stream, ptrs: { [i]: "r", [Math.max(0, i - queue.length + 1)]: "l" },
                vars: { total, count: queue.length, average: avg.toFixed(2) }
            };
        }

        const finalAvg = total / queue.length;
        yield {
            cl: 13, phase: "done", msg: `Stream processed. Final moving average = ${finalAvg.toFixed(2)}`,
            arr: stream, vars: { total, window: `[${queue.join(", ")}]` },
            result: `${finalAvg.toFixed(2)}`
        };
    }
};
