// src/engines/configs/zFunction.js

export const zFunctionConfig = {
    title: "Z Function",
    subtitle: () => 'Compute the Z-array: z[i] = length of longest substring starting at i that matches a prefix of the string',
    defaults: { str: "aabxaab" },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`## Z Function Algorithm
**Topics:** String, Pattern Matching

Build the Z-array: z[i] = length of the longest substring starting at i that matches a prefix of the string.

### Example
    Input: "aabxaa" → Z = [0, 1, 0, 0, 2, 1]`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Window Optimization
Maintain a window [l, r] of the rightmost Z-box found. For each i:
- If i < r, initialize z[i] from previously computed values
- Then extend z[i] character-by-character

## Application
Pattern matching: concatenate pattern + "$" + text. Z-values equal to pattern length indicate matches.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(n)** | Amortized linear |
| **Space** | **O(n)** | Z-array |`}],

    code: `def z_function(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    l, r = 0, 0
    
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        
        while (i + z[i] < n and 
               s[z[i]] == s[i + z[i]]):
            z[i] += 1
        
        if i + z[i] > r:
            l, r = i, i + z[i]
    
    return z`.split("\n"),

    generator: function* (args) {
        const s = args[0] || "aabxaab";
        const n = s.length;
        const z = new Array(n).fill(0);
        z[0] = n;
        let l = 0, r = 0;

        const chars = s.split("");

        yield {
            cl: 2, phase: "init", msg: `Initialize z-array of length ${n}. z[0] = ${n} (whole string is a prefix of itself)`,
            arr: chars, vars: { s: `"${s}"`, n, "z": JSON.stringify(z) }
        };

        yield {
            cl: 4, phase: "init", msg: "Initialize window [l, r) = [0, 0). This tracks the rightmost z-box found so far.",
            arr: chars, vars: { l, r, "z": JSON.stringify(z) }
        };

        for (let i = 1; i < n; i++) {
            yield {
                cl: 6, phase: "init", msg: `Processing i = ${i}. Character s[${i}] = '${s[i]}'`,
                arr: chars, ptrs: { [i]: "i", ...(r > 0 ? { [l]: "l" } : {}) }, vars: { i, l, r, "z[i]": z[i], "z": JSON.stringify(z) }
            };

            if (i < r) {
                z[i] = Math.min(r - i, z[i - l]);
                yield {
                    cl: 8, phase: "search", msg: `i (${i}) < r (${r}), so we can reuse: z[${i}] = min(r-i, z[i-l]) = min(${r - i}, ${z[i - l]}) = ${z[i]}`,
                    arr: chars, ptrs: { [i]: "i", [l]: "l" }, vars: { i, l, r, "r-i": r - i, "z[i-l]": z[i - l], "z[i]": z[i], "z": JSON.stringify(z) }
                };
            } else {
                yield {
                    cl: 8, phase: "search", msg: `i (${i}) >= r (${r}), no reuse possible. Start z[${i}] = 0.`,
                    arr: chars, ptrs: { [i]: "i" }, vars: { i, l, r, "z[i]": z[i], "z": JSON.stringify(z) }
                };
            }

            // Extend match
            let extended = false;
            while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
                z[i]++;
                extended = true;
            }

            if (extended) {
                yield {
                    cl: 11, phase: "build", msg: `Extended match: s[${z[i] > 0 ? 0 : ''}..${z[i] - 1}] matches s[${i}..${i + z[i] - 1}]. z[${i}] = ${z[i]}`,
                    arr: chars, ptrs: { [i]: "i", ...(z[i] > 0 ? { [i + z[i] - 1]: "end" } : {}) },
                    vars: { i, "z[i]": z[i], "match": `"${s.substring(i, i + z[i])}"`, "z": JSON.stringify(z) }
                };
            } else {
                yield {
                    cl: 11, phase: "search", msg: z[i] === 0
                        ? `No match at all: s[0]='${s[0]}' != s[${i}]='${s[i]}'. z[${i}] = 0`
                        : `No further extension. z[${i}] stays ${z[i]}`,
                    arr: chars, ptrs: { [i]: "i" }, vars: { i, "z[i]": z[i], "z": JSON.stringify(z) }
                };
            }

            if (i + z[i] > r) {
                l = i;
                r = i + z[i];
                yield {
                    cl: 15, phase: "build", msg: `Update window: new z-box goes further right. l = ${l}, r = ${r}`,
                    arr: chars, ptrs: { [l]: "l", ...(r < n ? { [r - 1]: "r-1" } : {}) },
                    vars: { i, l, r, "z[i]": z[i], "z": JSON.stringify(z) }
                };
            }
        }

        yield {
            cl: 17, phase: "done", msg: "Z-Function computation complete!",
            arr: chars, vars: { "z": JSON.stringify(z) },
            result: `[${z.join(", ")}]`
        };
    }
};
