import { execSync } from 'child_process';
import fs from 'fs';
import { userOptions } from '../../constant';
import { getFileNameByPath, getUserEmail } from '../../utils/files';
import {
  codeBlocksRegex,
  INoticeTask,
  ISeatalkNoticeOptions,
  reviewFileName,
  simplyData,
} from './constant';
import path from 'path';

/**
 * Webhook notifier
 * @param {string} channel The webhook channel
 * @param {string} userEmail The user email
 */
class WebhookNotifier {
  private readonly userEmail: string;
  private readonly channel: string;
  private tasks: string[];

  constructor({
    channel = userOptions.options.reviewReportWebhook,
    userEmail = '',
  }: ISeatalkNoticeOptions = {}) {
    this.tasks = [];

    if (!channel) return;
    this.userEmail = userEmail;
    this.channel = channel;
  }

  /**
   * Add a notice task
   */
  public addNoticeTask(task: INoticeTask) {
    if (!task) return;

    this.tasks.push(
      `__${getFileNameByPath(task.filePath)}__ \\r• ${task.message}`
    );
  }

  /**
   * Publish all notices to the webhook channel
   */
  public publishNotice() {
    if (!this.tasks?.length) return;
    const content = this.tasks.join('\\r\\r');

    // Write the output text to a file if there are code blocks
    if (codeBlocksRegex.test(content)) {
      fs.writeFileSync(
        `${path.join(process.cwd(), reviewFileName)}`,
        content,
        'utf-8'
      );
    }

    // If no channel is provided, log the content to the console
    if (!this.channel || process.env.DEBUG)
      return console.log('publishNotice: ', content);

    const data = `<mention-tag target=\\"seatalk://user?email=${
      this.userEmail || getUserEmail()
    }\\" />\\r\\r${simplyData(content)}`;

    execSync(
      `curl -i -X POST -H 'Content-Type: application/json' -d '{ "tag": "markdown", "markdown": {"content": "${data}"}}' ${this.channel}`
    );
  }
}

export default WebhookNotifier;
