const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    dateAdded: "04/18/2026",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

Example 1:
  Input:  nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: nums[0] + nums[1] == 9

Example 2:
  Input:  nums = [3,2,4], target = 6
  Output: [1,2]

Example 3:
  Input:  nums = [3,3], target = 6
  Output: [0,1]

Constraints:
  • 2 <= nums.length <= 10^4
  • -10^9 <= nums[i] <= 10^9
  • Only one valid answer exists.`,
    functionName: "twoSum",
    testCases: [
      { input: "[2,7,11,15], 9", expected: [0, 1] },
      { input: "[3,2,4], 6", expected: [1, 2] },
      { input: "[3,3], 6", expected: [0, 1] },
    ],
    starterCode: `function twoSum(nums, target) {
  // Your solution here

}`,
    tags: ["array", "hash-table"],
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example 1:
  Input: nums = [1,2,3,1]
  Output: true
  Explanation: The element 1 occurs at the indices 0 and 3.

Example 2:
  Input: nums = [1,2,3,4]
  Output: false
  Explanation: All elements are distinct.

Example 3:
  Input: nums = [1,1,1,3,3,4,3,2,4,2]
  Output: true

Constraints:
  • 1 <= nums.length <= 10^5
  • -10^9 <= nums[i] <= 10^9`,
    functionName: "containsDuplicate",
    testCases: [
      { input: "[1,2,3,1]", expected: true },
      { input: "[1,2,3,4]", expected: false },
      { input: "[1,1,1,3,3,4,3,2,4,2]", expected: true },
    ],
    starterCode: `function containsDuplicate(nums) {
  // Your solution here

}`,
    tags: ["array", "hash-table"],
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

Example 1:
  Input: s = "anagram", t = "nagaram"
  Output: true

Example 2:
  Input: s = "rat", t = "car"
  Output: false

Constraints:
  • 1 <= s.length, t.length <= 5 * 10^4
  • s and t consist of lowercase English letters.

Follow up:
  What if the inputs contain Unicode characters? How would you adapt your solution to such a case?`,
    functionName: "isAnagram",
    testCases: [
      { input: `"anagram", "nagaram"`, expected: true },
      { input: `"rat", "car"`, expected: false },
    ],
    starterCode: `function isAnagram(s, t) {
  // Your solution here

}`,
    tags: ["array", "hash-table", "string"],
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

Example 1:
  Input: s = "A man, a plan, a canal: Panama"
  Output: true
  Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
  Input: s = "race a car"
  Output: false
  Explanation: "raceacar" is not a palindrome.

Example 3:
  Input: s = " "
  Output: true
  Explanation: s is an empty string "" after removing non-alphanumeric characters.
  Since an empty string reads the same forward and backward, it is a palindrome.

Constraints:
  • 1 <= s.length <= 2 * 10^5
  • s consists only of printable ASCII characters.`,
    functionName: "isPalindrome",
    testCases: [
      { input: `"A man, a plan, a canal: Panama"`, expected: true },
      { input: `"race a car"`, expected: false },
      { input: `" "`, expected: true },
    ],
    starterCode: `function isPalindrome(s) {
  // Your solution here

}`,
    tags: ["string", "two-pointers"],
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
  Input: prices = [7,1,5,3,6,4]
  Output: 5
  Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
  Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
  Input: prices = [7,6,4,3,1]
  Output: 0
  Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
  • 1 <= prices.length <= 10^5
  • 0 <= prices[i] <= 10^4`,
    functionName: "maxProfit",
    testCases: [
      { input: "[7,1,5,3,6,4]", expected: 5 },
      { input: "[7,6,4,3,1]", expected: 0 },
    ],
    starterCode: `function maxProfit(prices) {
  // Your solution here

}`,
    tags: ["array", "dynamic-programming"],
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
  • Open brackets must be closed by the same type of brackets.
  • Open brackets must be closed in the correct order.
  • Every close bracket has a corresponding open bracket of the same type.

Example 1:
  Input: s = "()"
  Output: true

Example 2:
  Input: s = "()[]{}"
  Output: true

Example 3:
  Input: s = "(]"
  Output: false

Example 4:
  Input: s = "([])"
  Output: true

Example 5:
  Input: s = "([)]"
  Output: false

Constraints:
  • 1 <= s.length <= 10^4
  • s consists of parentheses only '()[]{}'.`,
    functionName: "isValid",
    testCases: [
      { input: `"()"`, expected: true },
      { input: `"()[]{}"`, expected: true },
      { input: `"(]"`, expected: false },
      { input: `"([])"`, expected: true },
      { input: `"([)]"`, expected: false },
    ],
    starterCode: `function isValid(s) {
  // Your solution here

}`,
    tags: ["string", "stack"],
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
  Input: nums = [-1,0,3,5,9,12], target = 9
  Output: 4
  Explanation: 9 exists in nums and its index is 4

Example 2:
  Input: nums = [-1,0,3,5,9,12], target = 2
  Output: -1
  Explanation: 2 does not exist in nums so return -1

Constraints:
  • 1 <= nums.length <= 10^4
  • -10^4 < nums[i], target < 10^4
  • All the integers in nums are unique.
  • nums is sorted in ascending order.`,
    functionName: "search",
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", expected: 4 },
      { input: "[-1,0,3,5,9,12], 2", expected: -1 },
    ],
    starterCode: `function search(nums, target) {
  // Your solution here

}`,
    tags: ["array", "binary-search"],
  },
  {
    title: "Last Stone Weight",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `You are given an array of integers stones where stones[i] is the weight of the ith stone.

We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights x and y with x <= y. The result of this smash is:
  • If x == y, both stones are destroyed
  • If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x

At the end of the game, there is at most one stone left.

Return the weight of the last remaining stone. If there are no stones left, return 0.

Example 1:
  Input: stones = [2,7,4,1,8,1]
  Output: 1

Example 2:
  Input: stones = [1]
  Output: 1

Constraints:
  • 1 <= stones.length <= 30
  • 1 <= stones[i] <= 1000`,
    functionName: "lastStoneWeight",
    testCases: [
      { input: "[2,7,4,1,8,1]", expected: 1 },
      { input: "[1]", expected: 1 },
    ],
    starterCode: `function lastStoneWeight(stones) {
  // Your solution here

}`,
    tags: ["array", "heap", "priority-queue"],
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:
  Input: n = 2
  Output: 2
  Explanation:
    1. 1 step + 1 step
    2. 2 steps

Example 2:
  Input: n = 3
  Output: 3
  Explanation:
    1. 1 + 1 + 1
    2. 1 + 2
    3. 2 + 1

Constraints:
  • 1 <= n <= 45`,
    functionName: "climbStairs",
    testCases: [
      { input: "2", expected: 2 },
      { input: "3", expected: 3 },
    ],
    starterCode: `function climbStairs(n) {
  // Your solution here

}`,
    tags: ["dynamic-programming", "math"],
  },
  {
    title: "Number of 1 Bits",
    difficulty: "Easy",
    dateAdded: "04/20/2026",
    description: `Given a positive integer n, write a function that returns the number of set bits in its binary representation (also known as the Hamming weight).

Example 1:
  Input: n = 11
  Output: 3
  Explanation: The input binary string 1011 has a total of three set bits.

Example 2:
  Input: n = 128
  Output: 1
  Explanation: The input binary string 10000000 has a total of one set bit.

Example 3:
  Input: n = 2147483645
  Output: 30
  Explanation: The input binary string 1111111111111111111111111111101 has a total of thirty set bits.

Constraints:
  • 1 <= n <= 2^31 - 1

Follow up:
  If this function is called many times, how would you optimize it?`,
    functionName: "hammingWeight",
    testCases: [
      { input: "11", expected: 3 },
      { input: "128", expected: 1 },
      { input: "2147483645", expected: 30 },
    ],
    starterCode: `function hammingWeight(n) {
  // Your solution here

}`,
    tags: ["bit-manipulation"],
  },
];

export default problems;
