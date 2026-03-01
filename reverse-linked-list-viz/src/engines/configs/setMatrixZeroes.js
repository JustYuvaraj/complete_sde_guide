export const setMatrixZeroesConfig = {
    title: "Set Matrix Zeroes",
    subtitle: "LeetCode 73 • Space Optimization",
    input: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
    defaults: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] },
    variableDefinitions: [
        { name: "r_zero", type: "Set", purpose: "Stores rows that have at least one zero" },
        { name: "c_zero", type: "Set", purpose: "Stores columns that have at least one zero" },
        { name: "r, c", type: "Pointer", purpose: "Current cell being checked or updated" }
    ],
    code: [
        { text: "class Solution:", indent: 0 },
        { text: "def setZeroes(self, matrix):", indent: 4 },
        { text: "m, n = len(matrix), len(matrix[0])", indent: 8 },
        { text: "r_zero, c_zero = set(), set()", indent: 8 },
        { text: "for r in range(m):", indent: 8 },
        { text: "for c in range(n):", indent: 12 },
        { text: "if matrix[r][c] == 0:", indent: 16 },
        { text: "r_zero.add(r)", indent: 20 },
        { text: "c_zero.add(c)", indent: 20 },
        { text: "for r in range(m):", indent: 8 },
        { text: "for c in range(n):", indent: 12 },
        { text: "if r in r_zero or c in c_zero:", indent: 16 },
        { text: "matrix[r][c] = 0", indent: 20 },
    ],
    explain: [
        {
            title: "Problem Statement",
            content: "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0's. Do it **in-place**."
        },
        {
            title: "How to Think",
            content: "1. Scan the matrix and identify rows and columns that contain a zero.\n2. In a second pass, set `matrix[i][j]` to 0 if its row `i` or column `j` was flagged."
        }
    ],
    generator: function* (args) {
        const matrix = JSON.parse(JSON.stringify(args[0] || [[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
        const m = matrix.length;
        const n = matrix[0].length;

        const rowZero = new Set();
        const colZero = new Set();

        yield {
            cl: 5, phase: "init", msg: "Scanning matrix for zeroes.",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 }, vars: { m, n }
        };

        for (let r = 0; r < m; r++) {
            for (let c = 0; c < n; c++) {
                if (matrix[r][c] === 0) {
                    rowZero.add(r);
                    colZero.add(c);
                    yield {
                        cl: 7, phase: "marking", msg: `Found zero at [${r}, ${c}]. Mark row ${r} and column ${c}.`,
                        matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r, c }, hlRows: [r], hlCols: [c],
                        vars: { r_zero: Array.from(rowZero).join(","), c_zero: Array.from(colZero).join(",") }
                    };
                }
            }
        }

        yield {
            cl: 9, phase: "fill", msg: "All zeroes found. Now filling marked rows and columns.",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 },
            vars: { r_zero: Array.from(rowZero).join(","), c_zero: Array.from(colZero).join(",") }
        };

        for (let r = 0; r < m; r++) {
            for (let c = 0; c < n; c++) {
                if (rowZero.has(r) || colZero.has(c)) {
                    matrix[r][c] = 0;
                    yield {
                        cl: 12, phase: "filling", msg: `Setting [${r}, ${c}] to 0 because its row or column is marked.`,
                        matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r, c },
                        vars: { r_zero: Array.from(rowZero).join(","), c_zero: Array.from(colZero).join(",") }
                    };
                }
            }
        }

        yield {
            cl: 12, phase: "done", msg: "Matrix zeroing complete!",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 }, vars: {}
        };
    }
};
