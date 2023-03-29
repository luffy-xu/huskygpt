import fs from 'fs';
import path from 'path';
import { getFileNameByPath } from '../utils/files';

/**
 * Prompt example:
 *
  // Get the file context
  // const dependencyReader = new DependencyReader(filePath);
  // const context = dependencyReader
  //   .getDependencies()
  //   .map((dependency) => dependency.content)
  //   .join('\n');
 */
//   Please Write a javascript unit tests.
//   The test should import the test function from parent directory and file name is ${fileName}.
//   Should include at least one test case for each function or class.
//   No need to test the function only return another function.
//   No need to test variable definition.

//   ${context}

//   Need to write test content: ${fileContent}

interface Dependency {
  path: string;
  content: string;
}

class DependencyReader {
  private filePath: string;
  private fileContent: string;
  private basePath: string;
  private dependencies: Dependency[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.fileContent = this.readFileIgnoreExtension(filePath);
    this.basePath = path.dirname(filePath);
    this.dependencies = this.extractDependencies();
  }

  private readFileIgnoreExtension(filePath: string): string {
    const directoryPath = path.dirname(filePath);
    const fileName = getFileNameByPath(filePath);
    const files = fs.readdirSync(directoryPath);

    const matchingFiles = files.filter((file) => {
      const name = path.basename(file, path.extname(file));
      return name === fileName;
    });

    if (matchingFiles.length === 0) {
      throw new Error(`File not found: ${filePath}`);
    }

    const matchingFilePath = path.join(directoryPath, matchingFiles[0]);
    return fs.readFileSync(matchingFilePath, 'utf-8');
  }

  private extractDependencies(): Dependency[] {
    const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const dependencies: Dependency[] = [];

    let match;
    while ((match = regex.exec(this.fileContent)) !== null) {
      const dependencyPath = match[1];
      const absolutePath = path.join(this.basePath, dependencyPath);
      const dependencyContent = this.readFileIgnoreExtension(absolutePath);
      const nestedDependencies = new DependencyReader(absolutePath)
        .dependencies;
      dependencies.push(
        { path: absolutePath, content: dependencyContent },
        ...nestedDependencies
      );
    }

    return dependencies;
  }

  public getDependencies(): Dependency[] {
    return this.dependencies;
  }
}

export default DependencyReader;
