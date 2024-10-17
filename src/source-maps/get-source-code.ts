import { Effect } from 'effect';

import type { FsError } from '../logic/effects/fs/fs-error.js';
import { readFileEffect } from '../logic/effects/fs/fs-extra.effects.js';

import type { ErrorLocation } from './get-error-location-from-file-path.js';

export interface SourceCode {
  line: number;
  code: string;
  column: number | undefined;
}

const numberOflinesToExtract = 7;

export const getSourceCode = (
  { filePath, line, column }: ErrorLocation,
  isFromJs = false,
): Effect.Effect<SourceCode[], FsError> =>
  Effect.gen(function* () {
    const start = line >= 4 ? line - 4 : 0;

    const sourceCode = yield* readFileEffect(filePath);

    return sourceCode
      .split('\n')
      .splice(start, numberOflinesToExtract)
      .map((currentLine, index) => {
        const currentLineNumber = index + start + 1;

        const actualColumn = isFromJs ? column + 1 : column;

        return {
          line: currentLineNumber,
          code: currentLine,
          column: currentLineNumber === line ? actualColumn : undefined,
        };
      });
  });
