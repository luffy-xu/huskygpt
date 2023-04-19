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

export * from './simply-result';
