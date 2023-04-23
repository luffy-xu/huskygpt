import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Get the file name from the file path
 * @param {string} filePath The file path
 */
export const getFileNameByPath = (filePath: string) =>
  filePath && path.basename(filePath, path.extname(filePath));

/**
 * Get the user email from the git config
 * @returns {string} The user email
 */
export const getUserEmail = () => {
  const output = execSync('git config user.email').toString().trim();
  return output;
};

/**
 * Delete the file by the file path
 */
export const deleteFileSync = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;
  fs.unlinkSync(filePath);
};

// Create the directory if it doesn't exist
export const makeDirExist = (dirPath: string) => {
  if (fs.existsSync(dirPath)) return;
  fs.mkdirSync(dirPath, { recursive: true });
};

/**
 * Get the file name to camel case
 * @param {string} fileName The file name
 * @returns {string} The file name to camel case
 * @example
 * // returns 'exampleModule'
 */
export const getFileNameToCamelCase = (
  fileName: string,
  isFirstUpper = false,
) => {
  if (!fileName) return '';
  if (fileName.indexOf('-') === -1) {
    return isFirstUpper
      ? fileName.slice(0, 1).toUpperCase() + fileName.slice(1)
      : fileName.slice(0, 1).toLowerCase() + fileName.slice(1);
  }

  fileName
    .split('-')
    .map((word, index) => {
      if (index !== 0) {
        return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
      }

      return isFirstUpper
        ? word.slice(0, 1).toUpperCase()
        : word.slice(0, 1).toLowerCase();
    })
    .join('');
};

export * from './simply-result';
