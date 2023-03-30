export interface ISeatalkNoticeOptions {
  channel?: string;
  userEmail?: string;
}

export interface INoticeTask {
  message: string;
  filePath: string;
}

export const codeBlocksRegex = /```([\s\S]*?)```/g;

// Write the output text to a file if there are code blocks
export const reviewFileName = '.huskygpt_review.md';

// Send simple data to the webhook channel
export const simplyData = (data: string) => {
  return data
    .replace(codeBlocksRegex, `check your local __${reviewFileName}__`)
    .replace(/'/g, '')
    .replace(/`/g, '__')
    .replace(/\n/g, '\\r');
};
