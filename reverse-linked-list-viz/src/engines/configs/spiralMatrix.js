export const spiralMatrixConfig = {
    title: "Spiral Matrix",
    subtitle: "LeetCode 54 • Matrix Traversal",
    input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    defaults: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
    variableDefinitions: [
        { name: "res", type: "List", purpose: "Accumulates elements in spiral order" },
        { name: "matrix", type: "Matrix", purpose: "Remaining elements (simulation)" },
        { name: "val", type: "Value", purpose: "Current element being processed" }
    ],
    code: [
        { text: "class Solution:", indent: 0 },
        { text: "def spiralOrder(self, matrix):", indent: 4 },
        { text: "res = []", indent: 8 },
        { text: "while matrix:", indent: 8 },
        { text: "res += matrix.pop(0)", indent: 12 },
        { text: "if matrix and matrix[0]:", indent: 12 },
        { text: "for row in matrix:", indent: 16 },
        { text: "res.append(row.pop())", indent: 20 },
        { text: "if matrix:", indent: 12 },
        { text: "res += matrix.pop()[::-1]", indent: 16 },
        { text: "if matrix and matrix[0]:", indent: 12 },
        { text: "for row in matrix[::-1]:", indent: 16 },
        { text: "res.append(row.pop(0))", indent: 20 },
        { text: "return res", indent: 8 },
    ],
    explain: [
        {
            title: "Problem Statement",
            content: "Given an `m x n` matrix, return all elements of the matrix in spiral order."
        },
        {
            title: "How to Think",
            content: "We can simulate the process layer by layer, or use a popping approach:\n1. Take the top row.\n2. Take the rightmost element of each remaining row.\n3. Take the bottom row in reverse.\n4. Take the leftmost element of each remaining row in reverse."
        }
    ],
    generator: function* (args) {
        const matrix = JSON.parse(JSON.stringify(args[0] || [[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
        const res = [];
        const visited = [];

        while (matrix.length > 0 && matrix[0].length > 0) {
            // 1. Top row
            const topRow = matrix.shift();
            for (let val of topRow) {
                res.push(val);
                yield {
                    cl: 4, phase: "top", msg: `Taking top row element: ${val}`,
                    matrix: [...matrix], // Note: this logic is slightly different from the real matrix but works for showing spiral
                    vars: { res: `[${res.join(",")}]` }
                };
            }

            if (matrix.length === 0 || matrix[0].length === 0) break;

            // 2. Right column
            for (let row of matrix) {
                const val = row.pop();
                res.push(val);
                yield {
                    cl: 7, phase: "right", msg: `Taking right column element: ${val}`,
                    matrix: [...matrix],
                    vars: { res: `[${res.join(",")}]` }
                };
            }

            if (matrix.length === 0 || matrix[0].length === 0) break;

            // 3. Bottom row
            const bottomRow = matrix.pop();
            for (let val of bottomRow.reverse()) {
                res.push(val);
                yield {
                    cl: 9, phase: "bottom", msg: `Taking bottom row element: ${val}`,
                    matrix: [...matrix],
                    vars: { res: `[${res.join(",")}]` }
                };
            }

            if (matrix.length === 0 || matrix[0].length === 0) break;

            // 4. Left column
            for (let i = matrix.length - 1; i >= 0; i--) {
                const val = matrix[i].shift();
                res.push(val);
                yield {
                    cl: 12, phase: "left", msg: `Taking left column element: ${val}`,
                    matrix: [...matrix],
                    vars: { res: `[${res.join(",")}]` }
                };
            }
        }

        yield {
            cl: 13, phase: "done", msg: "Spiral traversal complete!",
            matrix: [], vars: { result: `[${res.join(",")}]` }
        };
    }
};
