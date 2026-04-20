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
];

export default problems;
