// src/engines/configs/loggerRateLimiter.js

export const loggerRateLimiterConfig = {
    title: "Logger Rate Limiter",
    subtitle: () => 'Determine if messages should be printed given a 10-second rule',
    defaults: { stream: [{ t: 1, m: "foo" }, { t: 2, m: "bar" }, { t: 3, m: "foo" }, { t: 8, m: "bar" }, { t: 10, m: "foo" }, { t: 11, m: "foo" }] },

    panels: ["hashmap"],

    explain: [{
        icon: "📋", title: "Problem Statement", color: "#ef4444", content: `## LeetCode 359 — Logger Rate Limiter
**Difficulty:** Easy · **Topics:** Hash Table, Design

Design a logger that receives messages with timestamps. Return true if message should be printed (not printed in last 10 seconds).

### Example
    logger.shouldPrintMessage(1,"foo") → true
    logger.shouldPrintMessage(2,"bar") → true  
    logger.shouldPrintMessage(3,"foo") → false (within 10s)`}, {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6", content: `## Simple HashMap
Store message → last printed timestamp. On new message:
- If not seen or timestamp - lastTime >= 10 → print, update map
- Else → don't print`}, {
        icon: "⚡", title: "Code & Complexity", color: "#10b981", content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(1)** per call | HashMap lookup |
| **Space** | **O(n)** | Store all unique messages |`}],

    code: `class Logger:
    def __init__(self):
        self.msgDict = {}

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        if message not in self.msgDict:
            self.msgDict[message] = timestamp
            return True
            
        if timestamp - self.msgDict[message] >= 10:
            self.msgDict[message] = timestamp
            return True
            
        return False`.split("\n"),

    generator: function* (args) {
        // We simulate a stream of incoming logs using an array of objects
        const stream = args[0] || [
            { t: 1, m: "foo" },
            { t: 2, m: "bar" },
            { t: 3, m: "foo" },
            { t: 8, m: "bar" },
            { t: 10, m: "foo" },
            { t: 11, m: "foo" }
        ];

        const arr = stream.map(s => `Log[t=${s.t}, m="${s.m}"]`);
        const msgDict = {};
        const results = [];

        yield {
            cl: 3, phase: "init", msg: "Initialize dictionary to store message timestamps",
            arr, vars: { "stream": JSON.stringify(arr) }, map: {}, mapTitle: "Last Printed Timestamps"
        };

        for (let i = 0; i < stream.length; i++) {
            const timestamp = stream[i].t;
            const message = stream[i].m;

            yield {
                cl: 5, phase: "init", msg: "Process incoming message: shouldPrintMessage()",
                arr, ptrs: { [i]: "i" }, vars: { timestamp, message, "results": JSON.stringify(results) }, map: { ...msgDict }
            };

            if (!(message in msgDict)) {
                yield {
                    cl: 6, phase: "search", msg: `Message '${message}' NOT in dictionary. It can be printed!`,
                    arr, ptrs: { [i]: "i" }, vars: { timestamp, message }, map: { ...msgDict }, mapStatus: "searching", mapActiveKey: message
                };

                msgDict[message] = timestamp;
                results.push(true);

                yield {
                    cl: 8, phase: "build", msg: `Update dictionary: '${message}' printed at t=${timestamp}. Return True.`,
                    arr, ptrs: { [i]: "i" }, vars: { timestamp, message }, map: { ...msgDict }, mapStatus: "inserting", mapActiveKey: message
                };
            } else {
                const prevTime = msgDict[message];
                const diff = timestamp - prevTime;

                yield {
                    cl: 10, phase: "search", msg: `Message '${message}' found in dict at t=${prevTime}. Diff is ${timestamp} - ${prevTime} = ${diff}.`,
                    arr, ptrs: { [i]: "i" }, vars: { timestamp, message, prevTime, diff }, map: { ...msgDict }, mapHighlightKey: message
                };

                if (diff >= 10) {
                    msgDict[message] = timestamp;
                    results.push(true);

                    yield {
                        cl: 12, phase: "build", msg: `Diff >= 10! Update dictionary to t=${timestamp}. Return True.`,
                        arr, ptrs: { [i]: "i" }, vars: { timestamp, message }, map: { ...msgDict }, mapStatus: "inserting", mapActiveKey: message
                    };
                } else {
                    results.push(false);
                    yield {
                        cl: 14, phase: "done", msg: `Diff < 10! Message blocked. Return False.`,
                        arr, ptrs: { [i]: "i" }, vars: { timestamp, message }, map: { ...msgDict }, mapHighlightKey: message
                    };
                }
            }
        }

        yield {
            cl: 15, phase: "done", msg: "Finished stream processing!",
            arr, vars: { "Final Results": JSON.stringify(results) }, map: { ...msgDict }, result: JSON.stringify(results)
        };
    }
};
