import towSum from '../tow-sum';

describe('towSum', () => {
  it('should return the indices of the two numbers that add up to the target', () => {
    const nums = [2, 7, 11, 15];
    const target = 9;
    const expected = [0, 1];
    expect(towSum(nums, target)).toEqual(expected);
  });

  it('should return an empty array if no two numbers add up to the target', () => {
    const nums = [2, 7, 11, 15];
    const target = 20;
    const expected = [];
    expect(towSum(nums, target)).toEqual(expected);
  });
});
