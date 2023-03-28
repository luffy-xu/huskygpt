// longest palindromic substring
// https://leetcode.com/problems/longest-palindromic-substring/
export function longestPalindrome(s: string): string {
  let longest = '';
  for (let i = 0; i < s.length; i++) {
    const odd = getLongestPalindrome(s, i, i);
    const even = getLongestPalindrome(s, i, i + 1);
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
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  return s.slice(left + 1, right);
}

export default longestPalindrome;
