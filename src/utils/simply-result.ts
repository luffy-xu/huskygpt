import { codeBlocksRegex, reviewFileName } from 'src/constant';

export const replaceCodeBlock = (
  data: string,
  placeholder: string = `check your local __${reviewFileName}__`,
) => {
  return data.replace(codeBlocksRegex, placeholder);
};

// Math all code blocks
export const getAllCodeBlock = (data: string): string => {
  const codeBlocks = data.match(codeBlocksRegex);
  return codeBlocks
    ? codeBlocks?.map((t) => t.replace(/```/g, '')).join('\n')
    : '';
};

// Send simple data, remove code blocks and replace with a string
export const simplyReviewData = (data: string) => {
  return replaceCodeBlock(data)
    .replace(/'/g, '')
    .replace(/`/g, '__')
    .replace(/\n/g, '\\r');
};
