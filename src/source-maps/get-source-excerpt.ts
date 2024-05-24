import fs from 'fs-extra';

import { insertInto } from './insert-into.js';

// const whitePipe = chalk.whiteBright('|');

export const getSourceExcerpt = async (
  tsFileAbsolutePath: string,
  tsLine: number,
  tsColumn: number,
) => {
  const sourceCode = await fs.readFile(tsFileAbsolutePath, {
    encoding: 'utf-8',
  });
  const sourceCodeByLine = sourceCode.split('\n');

  const start = tsLine >= 4 ? tsLine - 4 : 0;
  const end =
    tsLine + 4 > sourceCodeByLine.length ? sourceCodeByLine.length : tsLine + 4;

  return sourceCodeByLine
    .splice(start, 7)
    .map((line, index) => {
      const currentLine = index + start + 1;
      const lineNumber = `${currentLine}`.padStart(`${end}`.length, '0');
      const code =
        currentLine === tsLine
          ? insertInto(line, '|', tsColumn === 0 ? 0 : tsColumn - 1, 0)
          : line;

      return `${lineNumber} ${code}`;
    })
    .join('\n');

  // return sourceCodeByLine
  //   .splice(start, 7)
  //   .map((line, index) => {
  //     const currentLine = index + start + 1;
  //     const lineNumber = chalk.white(
  //       `${currentLine}`.padStart(`${end}`.length, '0'),
  //     );
  //     const code =
  //       currentLine === tsLine
  //         ? chalk.redBright(
  //             insertInto(line, whitePipe, tsColumn === 0 ? 0 : tsColumn - 1, 0),
  //           )
  //         : chalk.gray(line);

  //     return `${lineNumber} ${code}`;
  //   })
  //   .join('\n');
};
