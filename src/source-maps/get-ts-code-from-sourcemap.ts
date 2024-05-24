import path from 'path';

import chalk from 'chalk';
import fs from 'fs-extra';
import { SourceMapConsumer } from 'source-map';

import { getSourceExcerpt } from './get-source-excerpt.js';

const sourceFileRegex = /^(file:\/\/)?(.*.(j|t)s)(\?.*)?:(\d*):(\d*)$/;

export interface TsCodeErrorDetails {
  codeExcerpt?: string;
  file: string;
}

export const getTsCodeFromSourcemap = async (
  sourceFile: string,
): Promise<TsCodeErrorDetails | undefined> => {
  const regex = sourceFileRegex.exec(sourceFile);
  if (regex === null || regex.length !== 7) {
    return;
  }

  const filePath = regex[2];
  const line = +regex[5];
  const column = +regex[6];

  if (filePath.endsWith('.ts')) {
    const codeExcerpt = await getSourceExcerpt(filePath, line, column);

    return {
      file: `${filePath}:${line}:${column}`,
      codeExcerpt,
    };
  }

  const fileExists = await fs.exists(`${filePath}.map`);
  if (!fileExists) {
    console.warn(
      `${chalk.blueBright.underline('effect-errors')}: ${chalk.yellow(`${filePath}.map does not exist: unable to retrieve spans sourcemaps.`)}  `,
    );
    return;
  }

  const data = await fs.readFile(`${filePath}.map`, {
    encoding: 'utf-8',
  });

  return await SourceMapConsumer.with(data, null, async (consumer) => {
    const tsCode = consumer.originalPositionFor({ line, column });
    if (
      tsCode.source === null ||
      tsCode.line === null ||
      tsCode.column === null
    ) {
      return;
    }

    const tsFileAbsolutePath = path.resolve(
      filePath.substring(0, filePath.lastIndexOf('/')),
      tsCode.source,
    );

    const codeExcerpt = await getSourceExcerpt(
      tsFileAbsolutePath,
      tsCode.line,
      tsCode.column,
    );

    return {
      file: `${tsFileAbsolutePath}:${tsCode.line}:${tsCode.column}`,
      codeExcerpt,
    };
  });
};
