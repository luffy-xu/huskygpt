/**
 * Get conflict result
 * @param sourceContent source content
 * @param targetContent target content
 * @returns conflict result
 */
function getConflictResult(sourceContent: string, targetContent: string) {
  return `<<<<<<< HEAD
${sourceContent}
=======
${targetContent}
>>>>>>> Incoming
`;
}

export default getConflictResult;
