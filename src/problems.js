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
];

export default problems;
