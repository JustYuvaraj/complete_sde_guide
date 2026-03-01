export const rotateImageConfig = {
    title: "Rotate Image",
    subtitle: "LeetCode 48 • Matrix Manipulation",
    input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    defaults: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
    variableDefinitions: [
        { name: "i, j", type: "Pointer", purpose: "Row and column indices for transposition and reversal" },
        { name: "n", type: "Size", purpose: "Matrix dimensions (n x n)" }
    ],
    code: [
        { text: "class Solution:", indent: 0 },
        { text: "def rotate(self, matrix):", indent: 4 },
        { text: "n = len(matrix)", indent: 8 },
        { text: "# Transpose", indent: 8 },
        { text: "for i in range(n):", indent: 8 },
        { text: "for j in range(i + 1, n):", indent: 12 },
        { text: "matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]", indent: 16 },
        { text: "# Reverse rows", indent: 8 },
        { text: "for i in range(n):", indent: 8 },
        { text: "matrix[i].reverse()", indent: 12 },
    ],
    explain: [
        {
            title: "Problem Statement",
            content: "You are given an `n x n` 2D matrix representing an image, rotate the image by **90 degrees** (clockwise). You have to rotate the image **in-place**."
        },
        {
            title: "The Trick",
            content: "A 90-degree rotation is equivalent to:\n1. **Transposing** the matrix (swapping `matrix[i][j]` with `matrix[j][i]`).\n2. **Reversing** each row."
        }
    ],
    generator: function* (args) {
        const matrix = JSON.parse(JSON.stringify(args[0] || [[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
        const n = matrix.length;

        yield {
            cl: 5, phase: "init", msg: "Initialize: We will first transpose the matrix.",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 }, vars: { n }
        };

        // Transpose
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
                yield {
                    cl: 7, phase: "transpose", msg: `Swapping matrix[${i}][${j}] and matrix[${j}][${i}]`,
                    matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: i, c: j }, vars: { i, j }
                };
            }
        }

        yield {
            cl: 9, phase: "reverse", msg: "Transposition complete. Now reversing each row.",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 }, vars: { n }
        };

        // Reverse rows
        for (let i = 0; i < n; i++) {
            matrix[i].reverse();
            yield {
                cl: 10, phase: "reverse", msg: `Reversed row ${i}`,
                matrix: JSON.parse(JSON.stringify(matrix)), hlRows: [i], vars: { row: i }
            };
        }

        yield {
            cl: 10, phase: "done", msg: "Rotation complete!",
            matrix: JSON.parse(JSON.stringify(matrix)), activeCell: { r: -1, c: -1 }, vars: {}
        };
    }
};
