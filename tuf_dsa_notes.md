# 📘 TUF DSA Notes — Striver's A2Z Sheet

> **Continuing from Problem 16 onwards** (Problems 1-15 are in `tuf_dsa_notes.txt`)

---

# 📂 Section 2: Arrays — Easy Problems (Continued)

---

## Problem 16: Union of Two Sorted Arrays

### 💡 What Is It?

Given **two sorted arrays**, return their **union** — a sorted array containing all **distinct** elements from both arrays.

```
arr1 = [1, 2, 3, 4, 5]
arr2 = [2, 3, 4, 4, 5, 6, 7]
Union = [1, 2, 3, 4, 5, 6, 7]
```

### 🧠 Approach & Logic

Since both arrays are **already sorted**, we use a **two-pointer merge** (similar to the merge step in Merge Sort), but **skip duplicates**.

Think of it like merging two sorted card decks, but throwing away any card you've already seen.

**Two Pointer Strategy:**
- `i` → pointer for `arr1`
- `j` → pointer for `arr2`
- At each step, pick the **smaller** element
- Only add it to the result if it's **not a duplicate** of the last added element

### 📝 Algorithm

```
1. Initialize i = 0, j = 0, result = []
2. While i < n1 AND j < n2:
     if arr1[i] < arr2[j]:
         if result is empty OR result.back() != arr1[i]:
             result.push(arr1[i])
         i++
     else if arr2[j] < arr1[i]:
         if result is empty OR result.back() != arr2[j]:
             result.push(arr2[j])
         j++
     else:  // equal
         if result is empty OR result.back() != arr1[i]:
             result.push(arr1[i])
         i++, j++
3. Add remaining from arr1 (skip duplicates)
4. Add remaining from arr2 (skip duplicates)
```

### 🔍 Dry Run

```
arr1 = [1, 2, 3, 4, 5]
arr2 = [2, 3, 4, 4, 5, 6, 7]

i=0, j=0: 1 < 2 → add 1, i=1          result: [1]
i=1, j=0: 2 == 2 → add 2, i=2, j=1    result: [1, 2]
i=2, j=1: 3 == 3 → add 3, i=3, j=2    result: [1, 2, 3]
i=3, j=2: 4 == 4 → add 4, i=4, j=3    result: [1, 2, 3, 4]
i=4, j=3: 5 > 4 → 4 == back, skip, j=4  result: [1, 2, 3, 4]
i=4, j=4: 5 == 5 → add 5, i=5, j=5    result: [1, 2, 3, 4, 5]
Remaining arr2: 6 → add, 7 → add       result: [1, 2, 3, 4, 5, 6, 7] ✅
```

### ⏱️ Complexity

| | Value |
|---|---|
| **Time** | O(n1 + n2) |
| **Space** | O(n1 + n2) for the result array |

### 💻 Code (C++)

```cpp
vector<int> unionOfArrays(vector<int>& a, vector<int>& b) {
    int i = 0, j = 0;
    vector<int> result;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) {
            if (result.empty() || result.back() != a[i])
                result.push_back(a[i]);
            if (a[i] == b[j]) j++;
            i++;
        } else {
            if (result.empty() || result.back() != b[j])
                result.push_back(b[j]);
            j++;
        }
    }
    while (i < a.size()) {
        if (result.empty() || result.back() != a[i])
            result.push_back(a[i]);
        i++;
    }
    while (j < b.size()) {
        if (result.empty() || result.back() != b[j])
            result.push_back(b[j]);
        j++;
    }
    return result;
}
```

### 🎯 Edge Cases
- One array empty → return the other (deduplicated)
- Completely overlapping arrays → return one copy
- No overlap → simple concatenation in sorted order

### 💬 Interview Tip
> This is a **classic two-pointer** problem. The key insight: since both arrays are sorted, we can do this in **O(n+m)** without using a Set/Map. Interviewers want to see you leverage the sorted property.

---

## Problem 17: Find Missing Number

### 💡 What Is It?

Given an array of `n` distinct numbers from the range `[0, n]`, find the **one number missing** from the range.

```
arr = [3, 0, 1]  →  Missing = 2
arr = [0, 1]     →  Missing = 2
arr = [9,6,4,2,3,5,7,0,1] → Missing = 8
```

### 🧠 Approach & Logic

**Approach 1 — Sum Formula (Math):**
- Sum of `0` to `n` = `n * (n + 1) / 2`
- Sum of array elements = some value
- **Missing = Expected Sum - Actual Sum**

This is the simplest and most elegant approach! ✨

**Approach 2 — XOR (Bit Manipulation):**
- XOR all numbers from `0` to `n`
- XOR all elements in the array
- The result is the missing number (because `a ^ a = 0`)

> **Why XOR works:** Every number that appears in both (range and array) cancels itself out. The only number left is the missing one.

### 📝 Algorithm (Sum Formula)

```
1. n = arr.size()
2. expectedSum = n * (n + 1) / 2
3. actualSum = sum of all elements in arr
4. return expectedSum - actualSum
```

### 📝 Algorithm (XOR)

```
1. xor1 = XOR of 0 to n
2. xor2 = XOR of all elements in arr
3. return xor1 ^ xor2
```

### 🔍 Dry Run (Sum Formula)

```
arr = [3, 0, 1], n = 3
expectedSum = 3 * 4 / 2 = 6
actualSum = 3 + 0 + 1 = 4
Missing = 6 - 4 = 2 ✅
```

### 🔍 Dry Run (XOR)

```
arr = [3, 0, 1], n = 3
xor1 = 0^1^2^3 = 0 (binary magic)
xor2 = 3^0^1 = 2
result = 0^2 = 2 ✅
```

### ⏱️ Complexity

| Approach | Time | Space |
|---|---|---|
| **Sum Formula** | O(n) | O(1) |
| **XOR** | O(n) | O(1) |

> ⚠️ Sum formula can **overflow** for very large `n`. XOR is safer.

### 💻 Code (C++)

```cpp
// Approach 1: Sum Formula
int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    for (int x : nums) actualSum += x;
    return expectedSum - actualSum;
}

// Approach 2: XOR (overflow-safe)
int missingNumberXOR(vector<int>& nums) {
    int xorAll = 0, xorArr = 0;
    int n = nums.size();
    for (int i = 0; i <= n; i++) xorAll ^= i;
    for (int x : nums) xorArr ^= x;
    return xorAll ^ xorArr;
}
```

### 💬 Interview Tip
> Always mention **both** approaches. Start with Sum (simpler to explain), then mention XOR as the "overflow-safe" alternative. This shows breadth of thinking.

---

## Problem 18: Maximum Consecutive Ones

### 💡 What Is It?

Given a **binary array** (only 0s and 1s), find the maximum number of **consecutive 1s**.

```
arr = [1, 1, 0, 1, 1, 1]  →  Answer: 3
arr = [1, 0, 1, 1, 0, 1]  →  Answer: 2
```

### 🧠 Approach & Logic

Dead simple — use a **counter**:
- Walk through the array
- If current element is `1`, increment the counter
- If current element is `0`, **reset** the counter to 0
- Track the **maximum** value the counter ever reaches

Think of it like counting your win streak in a game. Every loss resets the streak.

### 📝 Algorithm

```
1. count = 0, maxCount = 0
2. Loop through each element:
     if element == 1:
         count++
         maxCount = max(maxCount, count)
     else:
         count = 0
3. Return maxCount
```

### 🔍 Dry Run

```
arr = [1, 1, 0, 1, 1, 1]

i=0: 1 → count=1, max=1
i=1: 1 → count=2, max=2
i=2: 0 → count=0
i=3: 1 → count=1, max=2
i=4: 1 → count=2, max=2
i=5: 1 → count=3, max=3

Answer: 3 ✅
```

### ⏱️ Complexity

| | Value |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

### 💻 Code (C++)

```cpp
int findMaxConsecutiveOnes(vector<int>& nums) {
    int count = 0, maxCount = 0;
    for (int num : nums) {
        if (num == 1) {
            count++;
            maxCount = max(maxCount, count);
        } else {
            count = 0;
        }
    }
    return maxCount;
}
```

### 🎯 Edge Cases
- All 1s → answer = n
- All 0s → answer = 0
- Single element `[1]` → answer = 1
- Alternating `[1,0,1,0,1]` → answer = 1

---

## Problem 19: Find the Number that Appears Once (Others Appear Twice)

### 💡 What Is It?

Given an array where **every element appears twice** except for **one element** which appears **only once**, find that single element.

```
arr = [2, 2, 1]           →  Answer: 1
arr = [4, 1, 2, 1, 2]     →  Answer: 4
arr = [1]                  →  Answer: 1
```

### 🧠 Approach & Logic

**The XOR trick — the most elegant solution in DSA!** 🎩

Key XOR properties:
- `a ^ a = 0` (same numbers cancel out)
- `a ^ 0 = a` (XOR with 0 gives the number itself)
- XOR is **commutative** and **associative** (order doesn't matter)

So if you XOR **every element** in the array:
- All pairs cancel out → `0`
- The single number remains!

```
2 ^ 2 ^ 1 = (2 ^ 2) ^ 1 = 0 ^ 1 = 1  ✅
```

### 📝 Algorithm

```
1. result = 0
2. For each element in arr:
     result = result ^ element
3. Return result
```

That's it. **Three lines of code.** 🔥

### 🔍 Dry Run

```
arr = [4, 1, 2, 1, 2]

result = 0
0 ^ 4 = 4
4 ^ 1 = 5
5 ^ 2 = 7
7 ^ 1 = 6
6 ^ 2 = 4

Answer: 4 ✅
```

### ⏱️ Complexity

| | Value |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

### 💻 Code (C++)

```cpp
int singleNumber(vector<int>& nums) {
    int xorResult = 0;
    for (int num : nums) {
        xorResult ^= num;
    }
    return xorResult;
}
```

### 💬 Interview Tip
> This is **LeetCode 136**. If you use a HashMap, you get O(n) space. The XOR approach gives O(1) space. Always mention XOR — it's the "wow" solution that impresses interviewers.

---

## Problem 20: Longest Subarray with Sum K (Positives Only)

### 💡 What Is It?

Given an array of **positive integers** and a number `K`, find the **length of the longest subarray** whose elements sum up to `K`.

```
arr = [2, 3, 5, 1, 9], K = 10
Subarray [2, 3, 5] has sum 10, length 3
Subarray [1, 9] has sum 10, length 2
Answer: 3 (longest)
```

### 🧠 Approach & Logic

**Optimal — Sliding Window / Two Pointer** (works because all elements are **positive**):

Since all numbers are positive, adding more elements **always increases** the sum, and removing elements **always decreases** it. This monotonic property lets us use a sliding window!

**Window strategy:**
- Expand the window (move `right` forward) to **increase** the sum
- Shrink the window (move `left` forward) to **decrease** the sum
- When `sum == K`, record the window length

### 📝 Algorithm

```
1. left = 0, right = 0, sum = 0, maxLen = 0
2. While right < n:
     sum += arr[right]
     While sum > K:
         sum -= arr[left]
         left++
     If sum == K:
         maxLen = max(maxLen, right - left + 1)
     right++
3. Return maxLen
```

### 🔍 Dry Run

```
arr = [2, 3, 5, 1, 9], K = 10

right=0: sum=2, <10
right=1: sum=5, <10
right=2: sum=10, ==K → maxLen=3 (window [2,3,5])
right=3: sum=11, >10 → shrink: sum-2=9, left=1 → 9<10
right=4: sum=18, >10 → shrink: sum-3=15, left=2 → 15>10
                       → shrink: sum-5=10, left=3 → ==K → maxLen=max(3,2)=3

Answer: 3 ✅
```

### ⏱️ Complexity

| | Value |
|---|---|
| **Time** | O(n) — each element is added/removed at most once |
| **Space** | O(1) |

### 💻 Code (C++)

```cpp
int longestSubarrayWithSumK(vector<int>& arr, int k) {
    int left = 0, sum = 0, maxLen = 0;
    for (int right = 0; right < arr.size(); right++) {
        sum += arr[right];
        while (sum > k) {
            sum -= arr[left];
            left++;
        }
        if (sum == k) {
            maxLen = max(maxLen, right - left + 1);
        }
    }
    return maxLen;
}
```

### ⚠️ Important Note
> This sliding window approach **only works for positive numbers**. If the array can have **negatives or zeros**, you need the **Prefix Sum + HashMap** approach (next problem).

---

## Problem 21: Longest Subarray with Sum K (With Negatives)

### 💡 What Is It?

Same as above, but now the array can contain **negative numbers and zeros**. Find the longest subarray with sum `K`.

```
arr = [2, 0, 0, 3], K = 3  →  Answer: 3  (subarray [0, 0, 3])
arr = [-1, 1, 1], K = 1    →  Answer: 3  (entire array sums to 1)
```

### 🧠 Approach & Logic

Sliding window **won't work** here because adding a negative number can **decrease** the sum (no monotonic property).

**Approach: Prefix Sum + HashMap** 🗺️

**Key insight:** If the prefix sum at index `j` is `S`, and the prefix sum at some earlier index `i` is `S - K`, then the subarray `[i+1 ... j]` has sum `K`.

```
prefixSum[j] - prefixSum[i] = K
→ prefixSum[i] = prefixSum[j] - K
```

So for each index, we check: "Have I seen a prefix sum of `currentSum - K` before?"

We store prefix sums in a HashMap. To get the **longest** subarray, we only store the **first occurrence** of each prefix sum.

### 📝 Algorithm

```
1. Create a HashMap: prefixSumMap
2. sum = 0, maxLen = 0
3. For each index i:
     sum += arr[i]
     If sum == K:
         maxLen = i + 1  (subarray from 0 to i)
     If (sum - K) exists in map:
         maxLen = max(maxLen, i - map[sum - K])
     If sum NOT in map:
         map[sum] = i  (store FIRST occurrence only)
4. Return maxLen
```

### 🔍 Dry Run

```
arr = [2, 0, 0, 3], K = 3

i=0: sum=2, 2!=3, 2-3=-1 not in map → map={2:0}
i=1: sum=2, 2!=3, 2-3=-1 not in map → 2 already in map, skip
i=2: sum=2, 2!=3, 2-3=-1 not in map → 2 already in map, skip
i=3: sum=5, 5!=3, 5-3=2 IS in map at idx 0 → len=3-0=3, maxLen=3

Answer: 3 (subarray [0, 0, 3] from index 1 to 3) ✅
```

### ⏱️ Complexity

| | Value |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) for the HashMap |

### 💻 Code (C++)

```cpp
int longestSubarrayWithSumK(vector<int>& arr, int k) {
    unordered_map<int, int> prefixMap;
    int sum = 0, maxLen = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
        if (sum == k) {
            maxLen = i + 1;
        }
        if (prefixMap.find(sum - k) != prefixMap.end()) {
            maxLen = max(maxLen, i - prefixMap[sum - k]);
        }
        if (prefixMap.find(sum) == prefixMap.end()) {
            prefixMap[sum] = i;  // store FIRST occurrence
        }
    }
    return maxLen;
}
```

### 💬 Interview Tip
> **Prefix Sum + HashMap** is one of the **most important patterns** in DSA. It solves:
> - Longest subarray with sum K
> - Count subarrays with sum K
> - Subarray sum equals K
> 
> Master this pattern → unlock 5+ interview problems.

---

> ### 📌 End of Batch 4 — Problems 16 to 21
> **Next up:** Section 3 — Arrays Medium Problems (Two Sum, Sort 0s/1s/2s, Majority Element, Kadane's Algorithm, Stock Buy & Sell, and more!)
