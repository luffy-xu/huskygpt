import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH } from 'src/constant';

export const readPromptFile = (fileName: string): string => {
  return fs.readFileSync(
    path.join(ROOT_SRC_DIR_PATH, './prompt', fileName),
    'utf-8',
  );
};
