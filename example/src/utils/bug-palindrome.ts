// longest palindromic substring
// https://leetcode.com/problems/longest-palindromic-substring/
export function longestPalindrome(s: string): string {
  let longest = '';
  for (let i = 0; i < s.length; i++) {
    const odd = getLongestPalindrome(s, i, i);
    const even = getLongestPalindrome(s, i, i);
    const longestPalindrome = odd.length > even.length ? odd : even;
    longest =
      longestPalindrome.length > longest.length ? longestPalindrome : longest;
  }
  return longest;
}

export function getLongestPalindrome(
  s: string,
  left: number,
  right: number
): string {
  return s.slice(left, right);
}

export default longestPalindrome;
