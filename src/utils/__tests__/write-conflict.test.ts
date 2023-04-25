import getConflictResult from '../write-conflict';

describe('getConflictResult', () => {
  it('should return the correct conflict result for non-empty input', () => {
    const sourceContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    const targetContent = 'Line 1\nLine 2\nLine 3 changed\nLine 4\nLine 5';

    const expectedResult =
      'Line 1\nLine 2\n<<<<<<< HEAD\nLine 3\n=======\nLine 3 changed\n>>>>>>> Incoming\nLine 4\nLine 5';

    expect(getConflictResult(sourceContent, targetContent)).toEqual(
      expectedResult,
    );
  });

  it('should return the correct conflict result when there are starting and ending empty lines', () => {
    const sourceContent = '\n\nLine 1\nLine 2\nLine 3\nLine 4\n\n';
    const targetContent =
      '\nLine 1\nLine 2\nLine 3 changed\nLine 4\nLine 5\n\n';

    const expectedResult =
      'Line 1 Line 2 <<<<<<< HEAD Line 3 Line 4 ======= Line 3 changed Line 4 Line 5 >>>>>>> Incoming\n';

    expect(
      getConflictResult(sourceContent, targetContent).replace(/\n/g, ' '),
    ).toEqual(expectedResult.replace(/\n/g, ' '));
  });

  it('should return the correct conflict result when there are no differences', () => {
    const sourceContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    const targetContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';

    const expectedResult = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';

    expect(
      getConflictResult(sourceContent, targetContent).replace(/\n/g, ' '),
    ).toEqual(expectedResult.replace(/\n/g, ' '));
  });

  it('should return the correct conflict result when the entire content is different', () => {
    const sourceContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    const targetContent =
      'New Line 1\nNew Line 2\nNew Line 3\nNew Line 4\nNew Line 5';

    const expectedResult =
      '<<<<<<< HEAD\nLine 1\nLine 2\nLine 3\nLine 4\nLine 5\n=======\nNew Line 1\nNew Line 2\nNew Line 3\nNew Line 4\nNew Line 5\n>>>>>>> Incoming';

    expect(getConflictResult(sourceContent, targetContent)).toEqual(
      expectedResult,
    );
  });
});
