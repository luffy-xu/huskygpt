import fs from 'fs';
import path from 'path';
import { userOptions } from 'src/constant';
import { HuskyGPTCreate } from 'src/huskygpt';
import { getFileNameToCamelCase, makeDirExist } from 'src/utils';
import { readPromptFile } from 'src/utils/read-prompt-file';
import getConflictResult from 'src/utils/write-conflict';

import { IOptionCreated, OptionType, OptionTypeExtension } from './constant';

interface IWriteFileOptions {
  fileName: string;
  fileContent: string;
  optionType: OptionType;
  needCreateDir?: boolean;
  rootDirPath?: string;
}

/**
 * Code Generator for create command
 * @usage new CreateCodeGenerator(options).run()
 */
class CreateCodeGenerator {
  private option: OptionType;
  private description: string;
  private dirName: string;
  private name: string;
  private huskygpt: HuskyGPTCreate;

  constructor() {
    this.init();
  }

  private init() {
    this.huskygpt = new HuskyGPTCreate();
  }

  // Get crete prompts
  private getPrompts() {
    const { option, description, dirName, name } = this;
    const basePrompts = [
      `${readPromptFile(`create-${option}.txt`)}
            Please note is's modelName is "${dirName}${getFileNameToCamelCase(
        name,
        true,
      )}", and reply "${option}" code by following requirements: ${description}.
          `,
    ];
    if (option === OptionType.Models) {
      // basePrompts.push(
      //   `${readPromptFile(`create-${OptionType.Services}.txt`)}
      //       Note that you should consider the method name and relationship between the "${
      //         OptionType.Models
      //       }" that you reply before.
      //       Please reply "${
      //         OptionType.Services
      //       }" code by following requirements: ${description}.
      //     `,
      // );
      basePrompts.push(
        `${readPromptFile(`create-${OptionType.Mock}.txt`)}
            Please reply "${
              OptionType.Mock
            }" code by following requirements: ${description}.
          `,
      );
    }
    return basePrompts;
  }

  // Write AI message to file
  private writeFile(options: IWriteFileOptions) {
    const {
      fileName,
      fileContent,
      needCreateDir,
      optionType,
      rootDirPath = '',
    } = options;
    const dirPath =
      rootDirPath ||
      path.join(
        process.cwd(),
        userOptions.options.readFilesRootName,
        optionType,
        needCreateDir ? getFileNameToCamelCase(this.dirName, true) : '',
      );
    makeDirExist(dirPath);
    const filePath = path.join(
      dirPath,
      `${fileName}.${OptionTypeExtension[optionType]}`,
    );

    const existFileContent =
      fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf-8');
    fs.writeFileSync(
      filePath,
      existFileContent
        ? getConflictResult(existFileContent, fileContent)
        : fileContent,
    );
  }

  // Handle models option
  private handleModelsOption(dirName: string, name: string, message: string[]) {
    const [modelContent, mockContent] = message;
    const fileName = `${dirName}${getFileNameToCamelCase(name, true)}`;
    this.writeFile({
      fileName,
      fileContent: modelContent,
      needCreateDir: false,
      optionType: OptionType.Models,
    });
    // this.writeFile({
    //   fileName,
    //   fileContent: serviceContent,
    //   needCreateDir: false,
    //   optionType: OptionType.Services,
    // });
    this.writeFile({
      fileName,
      fileContent: mockContent,
      rootDirPath: path.join(process.cwd(), OptionType.Mock),
      optionType: OptionType.Mock,
    });
  }

  // Set options
  setOptions(options: IOptionCreated) {
    this.option = options.option;
    this.description = options.description;
    this.dirName = options.dirName;
    this.name = options.name;
  }

  // Run code generator
  async generator() {
    const prompts = this.getPrompts();
    const message = await this.huskygpt.run({ prompts });
    if (!message.length) return;

    if ([OptionType.Models].includes(this.option)) {
      this.handleModelsOption(this.dirName, this.name, message);
      return;
    }

    let optionType = this.option;
    if ([OptionType.Sections].includes(this.option)) {
      optionType = OptionType.Pages;
    }

    this.writeFile({
      fileName: this.name,
      fileContent: message.join('\n'),
      needCreateDir: true,
      optionType: optionType,
    });
  }
}

export default CreateCodeGenerator;
