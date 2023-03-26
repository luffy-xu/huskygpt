// tow sum
// https://leetcode.com/problems/two-sum/description/
function towSum(nums: number[], target: number): number[] {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const diff = target - num;
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(num, i);
  }
  return [];
}

export default towSum;
