// src/engines/configs/encodeDecodeStrings.js

export const encodeDecodeStringsConfig = {
    title: "Encode and Decode Strings",
    subtitle: () => 'Encode a list of strings into a single string and decode it back',
    defaults: { strs: ["neet", "code", "love", "you"] },
    panels: [],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`## LeetCode 271 — Encode and Decode Strings
**Difficulty:** Medium · **Topics:** String, Design

Design encode/decode for a list of strings into a single string.

### Example
    Input: ["Hello","World"] → encode → decode → ["Hello","World"]`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## Length-Prefix Encoding
Encode each string as: length + delimiter + string. e.g. "5#Hello5#World".
Decode by reading length, then extracting that many characters.`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(total chars)** | Process all chars once |
| **Space** | **O(total chars)** | Encoded string |`}],

    code: `class Codec:
    def encode(self, strs: List[str]) -> str:
        res = ""
        for s in strs:
            res += str(len(s)) + "#" + s
        return res

    def decode(self, s: str) -> List[str]:
        res, i = [], 0
        while i < len(s):
            j = i
            while s[j] != "#":
                j += 1
            length = int(s[i:j])
            res.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length
        return res`.split("\n"),

    generator: function* (args) {
        const strs = args[0] || ["neet", "code", "love", "you"];

        yield {
            cl: 3, phase: "init", msg: "--- PHASE 1: ENCODE --- Initialize empty encoded string",
            arr: strs, vars: { encoded: '""' }
        };

        let encoded = "";
        for (let idx = 0; idx < strs.length; idx++) {
            const s = strs[idx];
            yield {
                cl: 4, phase: "init", msg: `Read word '${s}' from input`,
                arr: strs, ptrs: { [idx]: "s" }, vars: { s, "len(s)": s.length, encoded: `"${encoded}"` }
            };

            const chunk = s.length + "#" + s;
            encoded += chunk;

            yield {
                cl: 5, phase: "build", msg: `Append chunk '${chunk}' (length + '#' + word) to encoded result.`,
                arr: strs, ptrs: { [idx]: "s" }, vars: { s, chunk: `"${chunk}"`, encoded: `"${encoded}"` }
            };
        }

        yield {
            cl: 6, phase: "done", msg: `Encoding Complete! Final Encoded String: "${encoded}"`,
            arr: strs, vars: { encoded: `"${encoded}"` }
        };

        // --- DECODE PHASE ---
        const encArr = encoded.split("");
        const res = [];
        let i = 0;

        yield {
            cl: 9, phase: "init", msg: "--- PHASE 2: DECODE --- Read the encoded string char by char",
            arr: encArr, ptrs: { [i]: "i" }, vars: { i, res: `[${res.join(",")}]` }
        };

        while (i < encArr.length) {
            let j = i;
            yield {
                cl: 11, phase: "search", msg: `Set j = i. Search forward for the '#' delimiter.`,
                arr: encArr, ptrs: { [i]: "i", [j]: "j" }, vars: { i, j }
            };

            while (encArr[j] !== "#") {
                j++;
                yield {
                    cl: 13, phase: "search", msg: `Not '#'. Increment j to ${j}.`,
                    arr: encArr, ptrs: { [i]: "i", [j]: "j" }, vars: { i, j }
                };
            }

            const lenStr = encoded.substring(i, j);
            const length = parseInt(lenStr, 10);

            yield {
                cl: 14, phase: "build", msg: `Found '#' at j=${j}! Parsed length prefix from i to j: "${lenStr}" => ${length}`,
                arr: encArr, ptrs: { [i]: "i", [j]: "#" }, vars: { i, j, length }
            };

            const word = encoded.substring(j + 1, j + 1 + length);
            res.push(word);

            yield {
                cl: 15, phase: "build", msg: `Extract word of length ${length} starting after j. Extracted "${word}". Append to decode list.`,
                arr: encArr, ptrs: { [i]: "i", [j]: "#", [j + 1 + length - 1]: "end" }, vars: { length, word, res: JSON.stringify(res) }
            };

            i = j + 1 + length;

            if (i < encArr.length) {
                yield {
                    cl: 16, phase: "init", msg: "Advance i to the start of the next length prefix.",
                    arr: encArr, ptrs: { [i]: "i" }, vars: { i, res: JSON.stringify(res) }
                };
            }
        }

        yield {
            cl: 17, phase: "done", msg: "Decoding complete! We have successfully reconstructed the original array.",
            arr: res, vars: {}, result: JSON.stringify(res)
        };
    }
};
