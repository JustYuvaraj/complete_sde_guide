export const matrixDiagonalSumConfig = {
    title: "Matrix Diagonal Sum",
    subtitle: "LeetCode 1572 • Matrix Traversal & Sum",
    input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    defaults: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
    variableDefinitions: [
        { name: "i", type: "Index", purpose: "Loop index tracks current row" },
        { name: "total", type: "Sum", purpose: "Accumulated diagonal sum" },
        { name: "j", type: "Index", purpose: "Secondary diagonal column index (n-1-i)" },
    ],
    code: [
        { text: "class Solution:", indent: 0 },
        { text: "def diagonalSum(self, mat):", indent: 4 },
        { text: "n = len(mat)", indent: 8 },
        { text: "total = 0", indent: 8 },
        { text: "for i in range(n):", indent: 8 },
        { text: "total += mat[i][i]", indent: 12 },
        { text: "total += mat[i][n - 1 - i]", indent: 12 },
        { text: "if n % 2 == 1:", indent: 8 },
        { text: "total -= mat[n // 2][n // 2]", indent: 12 },
        { text: "return total", indent: 8 },
    ],
    explain: [
        {
            title: "Problem Statement",
            content: "Given a square matrix `mat`, return the sum of the matrix diagonals.\n\nOnly include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal."
        },
        {
            title: "How to Think",
            content: "1. Iterate through the matrix once using a single loop index `i` from `0` to `n-1`.\n2. The primary diagonal element is at `[i][i]`.\n3. The secondary diagonal element is at `[i][n - 1 - i]`.\n4. If the matrix has an odd size, the middle element is counted twice, so subtract it once at the end."
        }
    ],
    generator: function* (args) {
        const matrix = args[0] || [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const n = matrix.length;
        let total = 0;
        const visited = [];

        yield {
            cl: 3, phase: "init", msg: `Matrix size n = ${n}. Initialize total = 0.`,
            matrix, activeCell: { r: -1, c: -1 }, visited: [], vars: { n, total }
        };

        for (let i = 0; i < n; i++) {
            // Primary diagonal
            const val1 = matrix[i][i];
            total += val1;
            visited.push({ r: i, c: i });
            yield {
                cl: 5, phase: "primary", msg: `Adding primary diagonal element mat[${i}][${i}] = ${val1}.`,
                matrix, activeCell: { r: i, c: i }, visited: [...visited], vars: { i, n, total }
            };

            // Secondary diagonal
            const j = n - 1 - i;
            const val2 = matrix[i][j];

            // Check if it's the same cell (only happens once for odd matrices)
            if (i !== j) {
                total += val2;
                visited.push({ r: i, c: j });
                yield {
                    cl: 6, phase: "secondary", msg: `Adding secondary diagonal element mat[${i}][${j}] = ${val2}.`,
                    matrix, activeCell: { r: i, c: j }, visited: [...visited], vars: { i, j, n, total }
                };
            } else {
                yield {
                    cl: 6, phase: "secondary", msg: `Skipping mat[${i}][${j}] because it's already counted in the primary diagonal.`,
                    matrix, activeCell: { r: i, c: j }, visited: [...visited], vars: { i, j, n, total }
                };
            }
        }

        if (n % 2 === 1) {
            const mid = Math.floor(n / 2);
            yield {
                cl: 7, phase: "middle", msg: `Matrix size is odd. Middle element was already handled by the i !== j check.`,
                matrix, activeCell: { r: mid, c: mid }, visited: [...visited], vars: { n, total }
            };
        }

        yield {
            cl: 9, phase: "done", msg: `Final sum of diagonals is ${total}.`,
            matrix, activeCell: { r: -1, c: -1 }, visited: [...visited], vars: { total }, result: total
        };
    }
};
