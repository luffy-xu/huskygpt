import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH } from 'src/constant';

export const readPromptFile = (fileName: string): string => {
  const userLocalPath = path.join(process.cwd(), './prompt', fileName);
  if (fs.existsSync(userLocalPath)) {
    return fs.readFileSync(userLocalPath, 'utf-8');
  }

  return fs.readFileSync(
    path.join(ROOT_SRC_DIR_PATH, './prompt', fileName),
    'utf-8',
  );
};
