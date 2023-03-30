import { codeBlocksRegex, reviewFileName } from '../constant';

export const replaceCodeBlock = (data: string, placeholder: string = `check your local __${reviewFileName}__`) => {
  return data.replace(codeBlocksRegex, placeholder);
};

// Send simple data, remove code blocks and replace with a string
export const simplyReviewData = (data: string) => {
  return replaceCodeBlock(data)
    .replace(/'/g, '')
    .replace(/`/g, '__')
    .replace(/\n/g, '\\r');
};

