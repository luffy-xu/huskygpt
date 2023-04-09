import { CommitRead } from "../src/reader/commit-read";

describe('commit-read', () => {
  it('should read from git', () => {
    const commitRead = new CommitRead();
    const ret = commitRead.getFileList(__dirname + '/mock/test.diff');
    expect(ret).toMatchSnapshot();
  });

  it('should get file diff params', () => {
    const commitRead = new CommitRead();
    const ret = commitRead.getFilePrompts(__dirname + '/mock/commit.diff');
    expect(ret).toMatchSnapshot();
  });

  it('should get file diff params', () => {
    const commitRead = new CommitRead();
    const ret = commitRead.getFilePrompts(__dirname + '/mock/a.diff');
    expect(ret).toMatchSnapshot();
  });
});