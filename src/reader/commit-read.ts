import { execSync } from 'child_process';
import fs from 'fs';

const filterEmpty = (line: string) => line.trim().length > 0;
enum EFileDiffType {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete',
  RENAME = 'rename',
}
export class CommitRead {
  private read(diffFile?: string) {
    if (diffFile && fs.existsSync(diffFile)) {
      return fs.readFileSync(diffFile).toString();
    }
    return this.readFromGit();
  }

  private readFromGit() {
    const files = execSync(
      'git diff --staged --ignore-all-space --diff-algorithm=minimal --function-context --no-ext-diff --no-color',
    ).toString();
    return files;
  }

  private parseFile(file: string) {
    const lines = file.split('\n');
    const [source, target] = lines[0].split(' ').filter(filterEmpty);
    const addLines = lines.filter((line) => line.startsWith('+')).length;
    const delLines = lines.filter((line) => line.startsWith('-')).length;

    let trimLines = 4;
    let mode = EFileDiffType.MODIFY;
    const line1 = lines[1];
    if (line1.startsWith('new file mode')) {
      mode = EFileDiffType.ADD;
      trimLines = 5;
    }

    if (line1.startsWith('deleted file mode')) {
      mode = EFileDiffType.DELETE;
      trimLines = 5;
    }

    if (line1.startsWith('similarity index')) {
      mode = EFileDiffType.RENAME;
      trimLines = 6;
    }

    return {
      source: source.slice(1),
      filename: target.slice(1),
      mode,
      diff: lines.slice(trimLines).join('\n').replace( /@@\s-.+\s\+.+\s@@\s+/, ''),
      add: addLines,
      del: delLines,
    }
  }

  getFileList(diffFile?: string) {
    const fileString = this.read(diffFile);
    const files = ('\n' + fileString).split('\ndiff --git ').filter(filterEmpty);
    return files.map((file) => this.parseFile(file));
  }
}
