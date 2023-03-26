import towSum from './towSum';

describe('towSum', () => {
  it('should return the indices of the two numbers that add up to the target', () => {
    const nums = [2, 7, 11, 15];
    const target = 9;
    const expected = [0, 1];
    expect(towSum(nums, target)).toEqual(expected);
  });
});
