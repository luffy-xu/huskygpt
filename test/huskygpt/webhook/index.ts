import { execSync } from 'child_process';
import { userOptions } from '../../constant';
import { getFileNameByPath, getUserEmail } from '../../utils/files';
import { INoticeTask, ISeatalkNoticeOptions } from './constant';

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

    this.tasks.push(`__${getFileNameByPath(task.filePath)}__ \\r• ${task.message}`);
  }

  /**
   * Publish all notices to the webhook channel
   */
  public publishNotice() {
    if (!this.tasks?.length) return;
    const content = this.tasks.join('\\r\\r');


    if (!this.channel || process.env.DEBUG) return console.log('publishNotice: ', content);

    this.tasks.unshift(`<mention-tag target=\\"seatalk://user?email=${this.userEmail || getUserEmail()}\\" />}__`);

    execSync(`curl -i -X POST -H 'Content-Type: application/json' -d '{ "tag": "markdown", "markdown": {"content": "${content}"}}}' ${this.channel}`);
  }
}

export default WebhookNotifier;
