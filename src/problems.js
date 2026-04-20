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
  },
];

export default problems;
