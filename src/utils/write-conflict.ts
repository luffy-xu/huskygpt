/**
 * Get conflict result
 * @param sourceContent source content
 * @param targetContent target content
 * @returns conflict result
 */
function getConflictResult(
  sourceContent: string,
  targetContent: string,
): string {
  // Utility function to remove the start and end empty line of the content string
  const removeStartAndEndEmptyLine = (content: string): string[] => {
    const lines = content.split('\n');
    let start = 0;
    let end = lines.length - 1;
    return lines.filter((line, index) => {
      if (line.trim() === '' && index === start) {
        start += 1;
        return false;
      }
      if (line.trim() === '' && index === end) {
        end -= 1;
        return false;
      }
      return true;
    });
  };

  // Get the line number of the first difference between source and target
  const findFirstNotSameLineNumber = (
    sourceLines: string[],
    targetLines: string[],
  ): number => {
    let i = 0;
    for (; i < sourceLines.length && i < targetLines.length; i++) {
      if (sourceLines[i] !== targetLines[i]) {
        break;
      }
    }
    return i;
  };

  const sourceLines = removeStartAndEndEmptyLine(sourceContent);
  const targetLines = removeStartAndEndEmptyLine(targetContent);
  const firstNotSameLineNumber = findFirstNotSameLineNumber(
    sourceLines,
    targetLines,
  );

  // Build the result array
  const resultLines: string[] = [
    ...sourceLines.slice(0, firstNotSameLineNumber),
    '<<<<<<< HEAD',
    ...sourceLines.slice(firstNotSameLineNumber),
    '=======',
    ...targetLines.slice(firstNotSameLineNumber),
    '>>>>>>> Incoming',
  ];

  return resultLines.join('\n');
}

export default getConflictResult;
