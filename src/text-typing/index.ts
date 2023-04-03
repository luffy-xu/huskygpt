import ora, { Ora } from 'ora';

interface TypingSpinnerOptions {
  interval: number;
  timeout?: number;
}

type IStopType = 'succeed' | 'info' | 'fail';

class TypingSpinner {
  private text: string;
  private stopType: IStopType;
  // The interval of the spinner
  private interval: number;
  // The timeout of the spinner
  private timeout: number;
  // The spinner instance
  private spinner: Ora | null;
  // The interval id
  private intervalId: NodeJS.Timeout | null;
  private timeoutId: NodeJS.Timeout | null;

  constructor(
    { interval, timeout = 10000 }: TypingSpinnerOptions = { interval: 100 },
  ) {
    this.interval = interval;
    this.timeout = timeout;
    this.spinner = null;
    this.intervalId = null;
    this.timeoutId = null;
  }

  /**
   * Generate a text generator function that returns the next text
   */
  private textGenerator = (text: string): (() => string | null) => {
    if (!text) return () => null;

    const texts = text.split(' ');
    let i = 0;
    let prevText = '';

    return () => {
      if (i >= texts.length) {
        return null;
      }

      const nextText = texts[i];
      i++;
      prevText = `${prevText} ${nextText}`.trim();
      return prevText;
    };
  };

  /**
   * Start the spinner and return a promise
   */
  public run = async (text: string, stopType?: IStopType): Promise<void> => {
    if (!text) return;
    // if (this.spinner) this.stop();
    this.text = text;
    this.stopType = stopType || 'succeed';

    return new Promise((resolve) => {
      const textGeneratorFn = this.textGenerator(this.text);
      this.spinner = ora().start();

      this.intervalId = setInterval(() => {
        const next = textGeneratorFn();
        if (next === null) {
          this.stop();
          resolve();
        }

        this.spinner!.text = next as string;
      }, this.interval);

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      if (typeof this.timeout === 'number') {
        this.timeoutId = setTimeout(() => {
          this.stop();
          resolve();
        }, this.timeout);
      }
    });
  };

  /**
   * Stop the spinner
   */
  public stop = (): void => {
    clearInterval(this.intervalId!);
    clearTimeout(this.timeoutId!);
    this.spinner![this.stopType](this.text);
  };
}

export default TypingSpinner;
