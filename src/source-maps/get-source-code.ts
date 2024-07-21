import fs from 'fs-extra';

import { type ErrorLocation } from './get-error-location-from-file-path.js';

export interface SourceCode {
  line: number;
  code: string;
  column: number | undefined;
}

const numberOflinesToExtract = 7;

export const getSourceCode = async (
  { filePath, line, column }: ErrorLocation,
  isFromJs = false,
): Promise<SourceCode[]> => {
  const start = line >= 4 ? line - 4 : 0;

  const sourceCode = await fs.readFile(filePath, {
    encoding: 'utf-8',
  });

  return sourceCode
    .split('\n')
    .splice(start, numberOflinesToExtract)
    .map((currentLine, index) => {
      const currentLineNumber = index + start + 1;

      return {
        line: currentLineNumber,
        code: currentLine,
        column:
          currentLineNumber === line
            ? isFromJs
              ? column + 1
              : column
            : undefined,
      };
    });
};
