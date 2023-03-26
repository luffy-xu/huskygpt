import fs from 'fs';
import path from 'path';

function getFilePaths(dirPath: string, fileExtensions: string[]): string[] {
  let filePaths: string[] = [];

  // Read the contents of the directory
  const files = fs.readdirSync(dirPath);

  // Iterate over the files
  for (const file of files) {
    const filePath = path.join(dirPath, file);

    // Check if the file is a directory
    if (fs.statSync(filePath).isDirectory()) {
      // Recursively call getFilePaths on the subdirectory
      filePaths = filePaths.concat(getFilePaths(filePath, fileExtensions));
    } else {
      // Check if the file has a valid extension and exclude .test files
      const extension = path.extname(file);
      if (
        fileExtensions.includes(extension) &&
        !file.endsWith('.test' + extension)
      ) {
        filePaths.push(filePath);
      }
    }
  }

  return filePaths;
}

const getTestFilePath = ({
  dirPath = path.join(process.cwd(), 'src'),
  fileExtensions = ['.ts', '.tsx'],
} = {}): string[] => {
  const filePaths = getFilePaths(dirPath, fileExtensions);

  console.log(filePaths);
  return filePaths;
};

export default getTestFilePath;
