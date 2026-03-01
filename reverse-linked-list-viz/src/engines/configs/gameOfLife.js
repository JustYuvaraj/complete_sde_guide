// src/engines/configs/gameOfLife.js

export const gameOfLifeConfig = {
    title: "Game of Life",
    subtitle: () => "Simulate the next state of Conway's Game of Life in-place",    defaults: { board: [[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]] },

    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>According to <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Wikipedia&#39;s article</a>: &quot;The <b>Game of Life</b>, also known simply as <b>Life</b>, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.&quot;</p>

<p>The board is made up of an <code>m x n</code> grid of cells, where each cell has an initial state: <b>live</b> (represented by a <code>1</code>) or <b>dead</b> (represented by a <code>0</code>). Each cell interacts with its <a href="https://en.wikipedia.org/wiki/Moore_neighborhood" target="_blank">eight neighbors</a> (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):</p>

<ol>
	<li>Any live cell with fewer than two live neighbors dies as if caused by under-population.</li>
	<li>Any live cell with two or three live neighbors lives on to the next generation.</li>
	<li>Any live cell with more than three live neighbors dies, as if by over-population.</li>
	<li>Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</li>
</ol>

<p><span>The next state of the board is determined by applying the above rules simultaneously to every cell in the current state of the <code>m x n</code> grid <code>board</code>. In this process, births and deaths occur <strong>simultaneously</strong>.</span></p>

<p><span>Given the current state of the <code>board</code>, <strong>update</strong> the <code>board</code> to reflect its next state.</span></p>

<p><strong>Note</strong> that you do not need to return anything.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/12/26/grid1.jpg" style="width: 562px; height: 322px;" />
<pre>
<strong>Input:</strong> board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
<strong>Output:</strong> [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
</pre>

<p><strong class="example">Example 2:</strong></p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/12/26/grid2.jpg" style="width: 402px; height: 162px;" />
<pre>
<strong>Input:</strong> board = [[1,1],[1,0]]
<strong>Output:</strong> [[1,1],[1,1]]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>m == board.length</code></li>
	<li><code>n == board[i].length</code></li>
	<li><code>1 &lt;= m, n &lt;= 25</code></li>
	<li><code>board[i][j]</code> is <code>0</code> or <code>1</code>.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong></p>

<ul>
	<li>Could you solve it in-place? Remember that the board needs to be updated simultaneously: You cannot update some cells first and then use their updated values to update other cells.</li>
	<li>In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches upon the border of the array (i.e., live cells reach the border). How would you address these problems?</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## In-Place with State Encoding
Use extra states: 2 = was alive, now dead. 3 = was dead, now alive.
First pass: apply rules with encoded states. Second pass: convert to 0/1.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(m×n)** | Visit each cell, check 8 neighbors |
| **Space** | **O(1)** | In-place state encoding |`}],

    code: `class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        # Original | New | State
        #    0     |  0  |   0
        #    1     |  0  |   1
        #    0     |  1  |   2
        #    1     |  1  |   3
        
        ROWS, COLS = len(board), len(board[0])
        
        def countNeighbors(r, c):
            nei = 0
            for i in range(r - 1, r + 2):
                for j in range(c - 1, c + 2):
                    if ((i == r and j == c) or i < 0 or j < 0 or 
                        i == ROWS or j == COLS):
                        continue
                    if board[i][j] in [1, 3]:
                        nei += 1
            return nei

        for r in range(ROWS):
            for c in range(COLS):
                nei = countNeighbors(r, c)
                if board[r][c]:
                    if nei in [2, 3]:
                        board[r][c] = 3
                elif nei == 3:
                    board[r][c] = 2
                    
        for r in range(ROWS):
            for c in range(COLS):
                if board[r][c] == 2:
                    board[r][c] = 1
                elif board[r][c] == 3:
                    board[r][c] = 1
                elif board[r][c] == 1:
                    board[r][c] = 0`.split("\n"),

    generator: function* (args) {
        const board = args[0] || [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ];

        const ROWS = board.length;
        const COLS = board[0].length;

        const stringifyBoard = (b) => b.map(row => `[${row.join(", ")}]`);

        yield {
            cl: 3, phase: "init", msg: "Initialize Game of Life constraints. We map states to 0, 1, 2, 3 to track old AND new states.",
            arr: stringifyBoard(board), vars: { ROWS, COLS }
        };

        // Count neighbors logic
        const countNeighbors = (r, c) => {
            let nei = 0;
            for (let i = r - 1; i <= r + 1; i++) {
                for (let j = c - 1; j <= c + 1; j++) {
                    if ((i === r && j === c) || i < 0 || j < 0 || i === ROWS || j === COLS) continue;
                    if (board[i][j] === 1 || board[i][j] === 3) {
                        nei++;
                    }
                }
            }
            return nei;
        };

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                yield {
                    cl: 20, phase: "init", msg: `Calculate neighbors for cell (${r}, ${c})`,
                    arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c }
                };

                const nei = countNeighbors(r, c);
                yield {
                    cl: 22, phase: "search", msg: `Cell (${r}, ${c}) has ${nei} live neighbors. Original value is ${board[r][c]}.`,
                    arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c, nei, "board[r][c]": board[r][c] }
                };

                if (board[r][c] === 1) { // Currently Alive
                    if (nei === 2 || nei === 3) {
                        board[r][c] = 3; // 1 -> 1
                        yield {
                            cl: 25, phase: "build", msg: `Alive with 2-3 neighbors. Stays alive! Set to state 3 (was 1, now 1)`,
                            arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c, nei }
                        };
                    } else {
                        // 1 -> 0 (Dies). It just stays 1 in our state machine (was 1, now 0).
                        yield {
                            cl: 23, phase: "search", msg: `Alive with ${nei} neighbors. Under/over-population! Dies (state remains 1 for now).`,
                            arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c, nei }
                        };
                    }
                } else if (board[r][c] === 0) { // Currently Dead
                    if (nei === 3) {
                        board[r][c] = 2; // 0 -> 1
                        yield {
                            cl: 27, phase: "build", msg: `Dead with 3 neighbors. Reproduction! Becomes alive. Set to state 2 (was 0, now 1)`,
                            arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c, nei }
                        };
                    } else {
                        yield {
                            cl: 26, phase: "search", msg: `Dead and doesn't have 3 neighbors. Stays dead.`,
                            arr: stringifyBoard(board), ptrs: { [r]: `row=${r}, col=${c}` }, vars: { r, c, nei }
                        };
                    }
                }
            }
        }

        yield {
            cl: 29, phase: "init", msg: "State calculation complete! Now we shift to the new generation by stripping the old states.",
            arr: stringifyBoard(board), vars: { ROWS, COLS }
        };

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] === 2) {
                    board[r][c] = 1;
                } else if (board[r][c] === 3) {
                    board[r][c] = 1;
                } else if (board[r][c] === 1) {
                    board[r][c] = 0;
                }
            }
        }

        yield {
            cl: 36, phase: "done", msg: "Converted all states (2->1, 3->1, 1->0). Game of Life tick complete!",
            arr: stringifyBoard(board), vars: { "Final State": "Simulated" }, result: "Updated In-Place"
        };
    }
};
