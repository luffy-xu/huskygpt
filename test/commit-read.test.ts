import { CommitRead } from "../src/reader/commit-read";

describe('commit-read', () => {
  it('should read from git', () => {
    const commitRead = new CommitRead();
    const ret = commitRead.getFileList(__dirname + '/mock/test.diff');
    expect(ret).toMatchSnapshot();
  });
});