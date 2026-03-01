// src/engines/configs/diagonalTraverse.js

export const diagonalTraverseConfig = {
    title: "Diagonal Traverse",
    subtitle: () => 'Return all elements of an m x n matrix in diagonal order',
    defaults: { mat: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
    variableDefinitions: [
        { name: "r", type: "Pointer", purpose: "Tracks current row index" },
        { name: "c", type: "Pointer", purpose: "Tracks current column index" },
        { name: "up", type: "Flag", purpose: "Boolean: True if moving up-right, False if down-left" },
    ],
    panels: [],

    explain: [{
        icon: "📋", title: "Problem Statement", color: "#ef4444", content: `
<p>Given an <code>m x n</code> matrix <code>mat</code>, return <em>an array of all the elements of the array in a diagonal order</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<img alt="" src="https://assets.leetcode.com/uploads/2021/04/10/diag1-grid.jpg" style="width: 334px; height: 334px;" />
<pre>
<strong>Input:</strong> mat = [[1,2,3],[4,5,6],[7,8,9]]
<strong>Output:</strong> [1,2,4,7,5,3,6,8,9]
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> mat = [[1,2],[3,4]]
<strong>Output:</strong> [1,2,3,4]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>m == mat.length</code></li>
	<li><code>n == mat[i].length</code></li>
	<li><code>1 &lt;= m, n &lt;= 10<sup>4</sup></code></li>
	<li><code>1 &lt;= m * n &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>5</sup> &lt;= mat[i][j] &lt;= 10<sup>5</sup></code></li>
</ul>

`}, {
        icon: "🧠", title: "How to Think & Solve", color: "#8b5cf6", content: `## Direction Simulation
Track direction (up-right or down-left). At boundaries, switch direction and move to next diagonal.
Handle 4 boundary cases: top edge, right edge, bottom edge, left edge.`}, {
        icon: "⚡", title: "Code & Complexity", color: "#10b981", content: `## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(m×n)** | Visit each element once |
| **Space** | **O(1)** | Just direction and position |`}],

    code: `class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        if not mat or not mat[0]:
            return []
            
        m, n = len(mat), len(mat[0])
        res = []
        r, c = 0, 0
        up = True
        
        while len(res) < m * n:
            res.append(mat[r][c])
            
            if up:
                if c == n - 1:
                    r += 1
                    up = False
                elif r == 0:
                    c += 1
                    up = False
                else:
                    r -= 1
                    c += 1
            else:
                if r == m - 1:
                    c += 1
                    up = True
                elif c == 0:
                    r += 1
                    up = True
                else:
                    r += 1
                    c -= 1
                    
        return res`.split("\n"),

    generator: function* (args) {
        const mat = args[0] || [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];

        if (!mat || mat.length === 0) {
            yield { cl: 3, phase: "done", msg: "Empty matrix", matrix: [], vars: {}, result: "[]" };
            return;
        }

        const m = mat.length;
        const n = mat[0].length;
        const res = [];
        const visited = [];

        yield {
            cl: 6, phase: "init", msg: "Initialize bounds m and n, empty result array, starting coordinates (0,0), and direction 'up'",
            matrix: mat, activeCell: { r: -1, c: -1 }, visited: [], vars: { m, n, r: 0, c: 0, up: "True", res: "[]" }
        };

        let r = 0;
        let c = 0;
        let up = true;

        while (res.length < m * n) {
            const val = mat[r][c];
            res.push(val);
            visited.push({ r, c });

            yield {
                cl: 11, phase: "build", msg: `Append mat[${r}][${c}] = ${val} to result.`,
                matrix: mat, activeCell: { r, c }, visited: [...visited], vars: { r, c, up: up ? "True" : "False", val, res: `[${res.join(",")}]` }
            };

            if (up) {
                if (c === n - 1) {
                    r += 1;
                    up = false;
                } else if (r === 0) {
                    c += 1;
                    up = false;
                } else {
                    r -= 1;
                    c += 1;
                }
            } else {
                if (r === m - 1) {
                    c += 1;
                    up = true;
                } else if (c === 0) {
                    r += 1;
                    up = true;
                } else {
                    r += 1;
                    c -= 1;
                }
            }

            if (res.length < m * n) {
                yield {
                    cl: 10, phase: "init", msg: `Moving to next cell: [${r}, ${c}]. Direction: ${up ? 'UP-RIGHT' : 'DOWN-LEFT'}`,
                    matrix: mat, activeCell: { r, c }, visited: [...visited], vars: { r, c, up: up ? "True" : "False" }
                };
            }
        }

        yield {
            cl: 34, phase: "done", msg: "Traversed all elements! Return final result array.",
            matrix: mat, activeCell: { r: -1, c: -1 }, visited: [...visited], vars: {}, result: `[${res.join(", ")}]`
        };
    }

};
