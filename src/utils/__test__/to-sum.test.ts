import towSum from '../to-sum';

describe('towSum', () => {
  it('should return the indices of the two numbers that add up to the target', () => {
    const nums = [2, 7, 11, 15];
    const target = 9;
    const expected = [0, 1];
    const result = towSum(nums, target);
    expect(result).toEqual(expected);
  });
});
