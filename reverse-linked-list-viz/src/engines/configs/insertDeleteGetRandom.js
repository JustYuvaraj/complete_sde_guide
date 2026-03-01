// src/engines/configs/insertDeleteGetRandom.js

export const insertDeleteGetRandomConfig = {
    title: "Insert Delete GetRandom O(1)",
    subtitle: () => 'Design a data structure with O(1) insert, delete, and getRandom',    defaults: { operations: [{ op: "insert", val: 1 }, { op: "remove", val: 2 }, { op: "insert", val: 2 }, { op: "getRandom" }, { op: "remove", val: 1 }, { op: "insert", val: 2 }, { op: "getRandom" }] },

    panels: ["hashmap"],

    explain:[{icon:"📋",title:"Problem Statement",color:"#ef4444",content:`
<p>Implement the <code>RandomizedSet</code> class:</p>

<ul>
	<li><code>RandomizedSet()</code> Initializes the <code>RandomizedSet</code> object.</li>
	<li><code>bool insert(int val)</code> Inserts an item <code>val</code> into the set if not present. Returns <code>true</code> if the item was not present, <code>false</code> otherwise.</li>
	<li><code>bool remove(int val)</code> Removes an item <code>val</code> from the set if present. Returns <code>true</code> if the item was present, <code>false</code> otherwise.</li>
	<li><code>int getRandom()</code> Returns a random element from the current set of elements (it&#39;s guaranteed that at least one element exists when this method is called). Each element must have the <b>same probability</b> of being returned.</li>
</ul>

<p>You must implement the functions of the class such that each function works in&nbsp;<strong>average</strong>&nbsp;<code>O(1)</code>&nbsp;time complexity.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input</strong>
[&quot;RandomizedSet&quot;, &quot;insert&quot;, &quot;remove&quot;, &quot;insert&quot;, &quot;getRandom&quot;, &quot;remove&quot;, &quot;insert&quot;, &quot;getRandom&quot;]
[[], [1], [2], [2], [], [1], [2], []]
<strong>Output</strong>
[null, true, false, true, 2, true, false, 2]

<strong>Explanation</strong>
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1); // Inserts 1 to the set. Returns true as 1 was inserted successfully.
randomizedSet.remove(2); // Returns false as 2 does not exist in the set.
randomizedSet.insert(2); // Inserts 2 to the set, returns true. Set now contains [1,2].
randomizedSet.getRandom(); // getRandom() should return either 1 or 2 randomly.
randomizedSet.remove(1); // Removes 1 from the set, returns true. Set now contains [2].
randomizedSet.insert(2); // 2 was already in the set, so return false.
randomizedSet.getRandom(); // Since 2 is the only number in the set, getRandom() will always return 2.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>-2<sup>31</sup> &lt;= val &lt;= 2<sup>31</sup> - 1</code></li>
	<li>At most <code>2 *&nbsp;</code><code>10<sup>5</sup></code> calls will be made to <code>insert</code>, <code>remove</code>, and <code>getRandom</code>.</li>
	<li>There will be <strong>at least one</strong> element in the data structure when <code>getRandom</code> is called.</li>
</ul>

`},{icon:"🧠",title:"How to Think & Solve",color:"#8b5cf6",content:`## HashMap + Array
- Array stores elements (random access by index for getRandom)
- HashMap stores value → index (O(1) lookup for insert/remove)
- Remove trick: swap element with last, pop last (O(1) removal from array)`},{icon:"⚡",title:"Code & Complexity",color:"#10b981",content:`## Complexity
| Metric | Value | Why |
|---|---|---|
| **Time** | **O(1)** per op | HashMap + array swap |
| **Space** | **O(n)** | Array + HashMap |`}],

    code: `class RandomizedSet:
    def __init__(self):
        self.numMap = {}
        self.numList = []

    def insert(self, val: int) -> bool:
        res = val not in self.numMap
        if res:
            self.numMap[val] = len(self.numList)
            self.numList.append(val)
        return res

    def remove(self, val: int) -> bool:
        res = val in self.numMap
        if res:
            idx = self.numMap[val]
            lastVal = self.numList[-1]
            self.numList[idx] = lastVal
            self.numList.pop()
            self.numMap[lastVal] = idx
            del self.numMap[val]
        return res

    def getRandom(self) -> int:
        return random.choice(self.numList)`.split("\n"),

    generator: function* (args) {
        // Define a sequence of operations to visualize
        const operations = args[0] || [
            { op: "insert", val: 1 },
            { op: "remove", val: 2 },
            { op: "insert", val: 2 },
            { op: "getRandom" },
            { op: "remove", val: 1 },
            { op: "insert", val: 2 },
            { op: "getRandom" }
        ];

        const numList = [];
        const numMap = {};

        yield {
            cl: 3, phase: "init", msg: "Initialize an array (for O(1) random) and a hashmap (for O(1) index lookup).",
            arr: [...numList], vars: { "operations left": operations.length }, map: { ...numMap }, mapTitle: "Val -> Index Map"
        };

        for (let i = 0; i < operations.length; i++) {
            const op = operations[i].op;
            const val = operations[i].val;

            yield {
                cl: 5, phase: "init", msg: `Operation ${i + 1}: ${op}(${val !== undefined ? val : ''})`,
                arr: [...numList], vars: { op, val, "operations left": operations.length - i }, map: { ...numMap }
            };

            if (op === "insert") {
                const res = !(val in numMap);
                yield {
                    cl: 7, phase: "search", msg: `Insert ${val}: Is it in map? ${!res}.`,
                    arr: [...numList], vars: { op, val, res }, map: { ...numMap }, mapActiveKey: String(val), mapStatus: "searching"
                };

                if (res) {
                    numMap[val] = numList.length;
                    numList.push(val);
                    yield {
                        cl: 9, phase: "build", msg: `Not in map. Add to end of list (index ${numList.length - 1}), array now has ${numList.length} items. Update map with index.`,
                        arr: [...numList], ptrs: { [numList.length - 1]: "new" }, vars: { op, val, res, "new_index": numList.length - 1 },
                        map: { ...numMap }, mapActiveKey: String(val), mapStatus: "inserting"
                    };
                }
            } else if (op === "remove") {
                const res = val in numMap;
                yield {
                    cl: 13, phase: "search", msg: `Remove ${val}: Is it in map? ${res}.`,
                    arr: [...numList], vars: { op, val, res }, map: { ...numMap }, mapActiveKey: String(val), mapStatus: "searching"
                };

                if (res) {
                    const idx = numMap[val];
                    const lastVal = numList[numList.length - 1];

                    yield {
                        cl: 15, phase: "build", msg: `Found ${val} at index ${idx}. To remove in O(1), swap it with the last element (${lastVal}).`,
                        arr: [...numList], ptrs: { [idx]: "to_delete", [numList.length - 1]: "last" }, vars: { op, val, idx, lastVal },
                        map: { ...numMap }, mapHighlightKey: String(val)
                    };

                    numList[idx] = lastVal;
                    yield {
                        cl: 17, phase: "build", msg: `Copied ${lastVal} into index ${idx}. Now pop the last element.`,
                        arr: [...numList], ptrs: { [idx]: "copied_last", [numList.length - 1]: "to_pop" }, vars: { op, val, idx, lastVal },
                        map: { ...numMap }, mapHighlightKey: String(lastVal)
                    };

                    numList.pop();
                    numMap[lastVal] = idx;
                    delete numMap[val];

                    yield {
                        cl: 19, phase: "build", msg: `Popped! Updated map so ${lastVal} points to index ${idx}. Removed ${val} from map.`,
                        arr: [...numList], ptrs: { [idx]: "lastVal_new_spot" }, vars: { op, val, idx, lastVal },
                        map: { ...numMap }, mapActiveKey: String(lastVal), mapStatus: "inserting"
                    };
                }
            } else if (op === "getRandom") {
                const randomIdx = Math.floor(Math.random() * numList.length);
                const randomVal = numList[randomIdx];

                yield {
                    cl: 24, phase: "search", msg: `GetRandom: Pick a random index between 0 and ${numList.length - 1}. Picked index ${randomIdx}. Result is ${randomVal}!`,
                    arr: [...numList], ptrs: { [randomIdx]: "random!" }, vars: { op, randomIdx, randomVal }, map: { ...numMap }
                };
            }
        }

        yield {
            cl: 25, phase: "done", msg: "All operations completed!",
            arr: [...numList], vars: {}, map: { ...numMap }
        };
    }
};
