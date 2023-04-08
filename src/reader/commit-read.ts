import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH } from 'src/constant';

const filterEmpty = (line: string) => line.trim().length > 0;
enum EFileDiffType {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete',
  RENAME = 'rename',
}
export interface IFileDiff {
  source: string;
  filename: string;
  mode: EFileDiffType;
  diff: string;
  add: number;
  del: number;
}

const PriorityFileTypes = {
  '.ts': 10000,
  '.tsx': 10000,
  '.js': 10000,
  '.less': 100,
  '.json': 100,
}

enum PromptFile {
  summarize_file_diff = 'summarize_file_diff',
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

  private parseFile(file: string): IFileDiff {
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

  private sortAndFilter(files: IFileDiff[]) {
    const sortedFiles = files.sort((a, b) => {
      const aExt = path.extname(a.filename).slice(1);
      const bExt = path.extname(b.filename).slice(1);
      const priorityA = PriorityFileTypes[aExt] || 1;
      const priorityB = PriorityFileTypes[bExt] || 1;
      // delete should be last
      if (a.mode === EFileDiffType.DELETE) {
        return 1;
      }
      if (b.mode === EFileDiffType.DELETE) {
        return -1;
      }
      return (b.add + b.del) * priorityB - (a.add + a.del) * priorityA;
    });

    return sortedFiles;
  }

  getFileList(diffFile?: string) {
    const fileString = this.read(diffFile);
    const files = ('\n' + fileString).split('\ndiff --git ').filter(filterEmpty);
    const sorted = this.sortAndFilter(files.map((file) => this.parseFile(file)));
    return sorted;
  }

  getFileDiffParams(diffFile?: string) {
    const files = this.getFileList(diffFile);
    const prompt = this.getPrompt(PromptFile.summarize_file_diff);
    // no more than 5 files
    return files.slice(0, 5).map((file, i) => {
      if (i === 0)
        return prompt.replace('{{ file_diff }}', file.diff);
      return `This is anther git diff, please summarize: \n${file.diff}`;
    });
  }

  private getPrompt(filename: PromptFile) {
    const prompt = fs.readFileSync(
      path.join(ROOT_SRC_DIR_PATH, './prompt', `${filename}.txt`),
      'utf-8',
    );
    return prompt.toString();
  }
}
