// src/engines/configs/integerToRoman.js

export const integerToRomanConfig = {
    title: "Integer to Roman",
    subtitle: () => 'Convert an integer to its Roman numeral representation',    defaults: { num: 3749 },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Seven different symbols represent Roman numerals with the following values:</p>

<table>
	<thead>
		<tr>
			<th>Symbol</th>
			<th>Value</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>I</td>
			<td>1</td>
		</tr>
		<tr>
			<td>V</td>
			<td>5</td>
		</tr>
		<tr>
			<td>X</td>
			<td>10</td>
		</tr>
		<tr>
			<td>L</td>
			<td>50</td>
		</tr>
		<tr>
			<td>C</td>
			<td>100</td>
		</tr>
		<tr>
			<td>D</td>
			<td>500</td>
		</tr>
		<tr>
			<td>M</td>
			<td>1000</td>
		</tr>
	</tbody>
</table>

<p>Roman numerals are formed by appending&nbsp;the conversions of&nbsp;decimal place values&nbsp;from highest to lowest. Converting a decimal place value into a Roman numeral has the following rules:</p>

<ul>
	<li>If the value does not start with 4 or&nbsp;9, select the symbol of the maximal value that can be subtracted from the input, append that symbol to the result, subtract its value, and convert the remainder to a Roman numeral.</li>
	<li>If the value starts with 4 or 9 use the&nbsp;<strong>subtractive form</strong>&nbsp;representing&nbsp;one symbol subtracted from the following symbol, for example,&nbsp;4 is 1 (<code>I</code>) less than 5 (<code>V</code>): <code>IV</code>&nbsp;and 9 is 1 (<code>I</code>) less than 10 (<code>X</code>): <code>IX</code>.&nbsp;Only the following subtractive forms are used: 4 (<code>IV</code>), 9 (<code>IX</code>),&nbsp;40 (<code>XL</code>), 90 (<code>XC</code>), 400 (<code>CD</code>) and 900 (<code>CM</code>).</li>
	<li>Only powers of 10 (<code>I</code>, <code>X</code>, <code>C</code>, <code>M</code>) can be appended consecutively at most 3 times to represent multiples of 10. You cannot append 5&nbsp;(<code>V</code>), 50 (<code>L</code>), or 500 (<code>D</code>) multiple times. If you need to append a symbol&nbsp;4 times&nbsp;use the <strong>subtractive form</strong>.</li>
</ul>

<p>Given an integer, convert it to a Roman numeral.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">num = 3749</span></p>

<p><strong>Output:</strong> <span class="example-io">&quot;MMMDCCXLIX&quot;</span></p>

<p><strong>Explanation:</strong></p>

<pre>
3000 = MMM as 1000 (M) + 1000 (M) + 1000 (M)
 700 = DCC as 500 (D) + 100 (C) + 100 (C)
  40 = XL as 10 (X) less of 50 (L)
   9 = IX as 1 (I) less of 10 (X)
Note: 49 is not 1 (I) less of 50 (L) because the conversion is based on decimal places
</pre>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">num = 58</span></p>

<p><strong>Output:</strong> <span class="example-io">&quot;LVIII&quot;</span></p>

<p><strong>Explanation:</strong></p>

<pre>
50 = L
 8 = VIII
</pre>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">num = 1994</span></p>

<p><strong>Output:</strong> <span class="example-io">&quot;MCMXCIV&quot;</span></p>

<p><strong>Explanation:</strong></p>

<pre>
1000 = M
 900 = CM
  90 = XC
   4 = IV
</pre>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= num &lt;= 3999</code></li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Greedy with Value Table
Create a table of values in descending order including subtractive forms (900, 400, 90, 40, 9, 4).
Greedily subtract the largest value that fits, appending its symbol.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(1)** | Max 15 symbols (3999 limit) |
| **Space** | **O(1)** | Fixed lookup table |`}],

    code: `class Solution:
    def intToRoman(self, num: int) -> str:
        symList = [
            ["I", 1], ["IV", 4], ["V", 5], ["IX", 9],
            ["X", 10], ["XL", 40], ["L", 50], ["XC", 90],
            ["C", 100], ["CD", 400], ["D", 500], ["CM", 900],
            ["M", 1000]
        ]
        
        res = ""
        for sym, val in reversed(symList):
            if num // val:
                count = num // val
                res += (sym * count)
                num %= val
                
        return res`.split("\n"),

    generator: function* (args) {
        let num = parseInt(args[0]) || 3749;
        const initialNum = num;

        const symList = [
            ["I", 1], ["IV", 4], ["V", 5], ["IX", 9],
            ["X", 10], ["XL", 40], ["L", 50], ["XC", 90],
            ["C", 100], ["CD", 400], ["D", 500], ["CM", 900],
            ["M", 1000]
        ];

        const map = Object.fromEntries(symList.map(pair => [pair[0], pair[1]]));

        let res = "";

        yield {
            cl: 3, phase: "init", msg: "Initialize symbol list and result string",
            arr: [], vars: { num, res: `"${res}"` }, map, mapTitle: "Symbol Values"
        };

        for (let i = symList.length - 1; i >= 0; i--) {
            const sym = symList[i][0];
            const val = symList[i][1];

            yield {
                cl: 9, phase: "init", msg: `Checking symbol '${sym}' (value ${val})`,
                arr: [], vars: { num, res: `"${res}"`, sym, val }, map, mapHighlightKey: sym
            };

            const count = Math.floor(num / val);

            yield {
                cl: 10, phase: "search", msg: `Does ${val} fit into ${num}? Count = ${num} // ${val} = ${count}`,
                arr: [], vars: { num, res: `"${res}"`, sym, val, count }, map, mapActiveKey: sym
            };

            if (count > 0) {
                const addedStr = sym.repeat(count);
                res += addedStr;
                num %= val;

                yield {
                    cl: 12, phase: "build", msg: `Yes! Append '${sym}' ${count} time(s). Result: '${res}'. New num: ${num}.`,
                    arr: [], vars: { count, res: `"${res}"`, num, sym, val, "added": addedStr }, map, mapStatus: "found", mapActiveKey: sym
                };
            }

            if (num === 0) {
                yield {
                    cl: 14, phase: "done", msg: "Number is 0. We formed the complete Roman Numeral!",
                    arr: [], vars: { "original_num": initialNum, num, res: `"${res}"` }, map, result: `"${res}"`
                };
                return;
            }
        }

        yield {
            cl: 16, phase: "done", msg: "Finished.",
            arr: [], vars: { "original_num": initialNum, res: `"${res}"` }, map, result: `"${res}"`
        };
    }
};
