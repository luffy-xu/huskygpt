
import threeSum from '../three-sum';

describe('threeSum', () => {
  it('should return the correct result', () => {
    const nums = [-1, 0, 1, 2, -1, -4];
    const expectedResult = [[-1, -1, 2], [-1, 0, 1]];
    expect(threeSum(nums)).toEqual(expectedResult);
  });
});