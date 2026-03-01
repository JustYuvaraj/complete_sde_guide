// src/engines/configs/pascalsTriangle.js

export const pascalsTriangleConfig = {
    title: "Pascal's Triangle",
    subtitle: (args) => `Generate the first ${args[0]} rows of Pascal's triangle`,    defaults: { numRows: 5 },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`## LeetCode 118 — Pascal's Triangle
**Difficulty:** Easy · **Topics:** Array, Dynamic Programming

Generate the first numRows of Pascal's triangle. Each number = sum of two numbers above it.

### Example
    Input: numRows=5
    Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Build Row by Row
Each row starts and ends with 1. Middle elements = prev[j-1] + prev[j].

## Pattern
row[i][j] = row[i-1][j-1] + row[i-1][j]. This is a simple DP / simulation.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n²)** | n rows, each up to n elements |
| **Space** | **O(n²)** | Store entire triangle |`}],

    code: `class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        res = [[1]]
        
        for i in range(numRows - 1):
            temp = [0] + res[-1] + [0]
            row = []
            
            for j in range(len(res[-1]) + 1):
                row.append(temp[j] + temp[j+1])
                
            res.append(row)
            
        return res`.split("\n"),

    generator: function* (args) {
        const numRows = args[0] || 5;
        const res = [[1]];

        yield {
            cl: 3, phase: "init", msg: "Initialize result with the first row: [[1]]",
            arr: res.map(r => `[${r.join(",")}]`), vars: { numRows }
        };

        for (let i = 0; i < numRows - 1; i++) {
            yield {
                cl: 5, phase: "init", msg: `Generating row ${i + 2}`,
                arr: res.map(r => `[${r.join(",")}]`), vars: { i, numRows }
            };

            const lastRow = res[res.length - 1];
            const temp = [0, ...lastRow, 0];

            yield {
                cl: 6, phase: "build", msg: `Create padded temp array from previous row: [${temp.join(",")}]`,
                arr: res.map(r => `[${r.join(",")}]`), ptrs: { [res.length - 1]: "res[-1]" }, vars: { i, "temp": `[${temp.join(",")}]` }
            };

            const row = [];
            yield {
                cl: 7, phase: "init", msg: "Initialize new row = []",
                arr: res.map(r => `[${r.join(",")}]`), vars: { i, "temp": `[${temp.join(",")}]`, row: "[]" }
            };

            for (let j = 0; j < temp.length - 1; j++) {
                const sum = temp[j] + temp[j + 1];
                row.push(sum);

                yield {
                    cl: 10, phase: "build", msg: `row.append(temp[${j}] + temp[${j + 1}]) == ${temp[j]} + ${temp[j + 1]} = ${sum}`,
                    arr: res.map(r => `[${r.join(",")}]`), vars: { j, sum, "row": `[${row.join(",")}]` }
                };
            }

            res.push([...row]);
            yield {
                cl: 12, phase: "build", msg: `Append completed row to result`,
                arr: res.map((r, idx) => idx === res.length - 1 ? `[${r.join(",")}] <=` : `[${r.join(",")}]`),
                vars: { i }
            };
        }

        yield {
            cl: 14, phase: "done", msg: "Pascal's Triangle generation complete!",
            arr: res.map(r => `[${r.join(",")}]`), vars: { numRows }, result: `[[1], ...]`
        };
    }
};
