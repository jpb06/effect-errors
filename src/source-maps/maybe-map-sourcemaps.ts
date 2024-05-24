import { fileRegex, stackAtRegex } from '../logic/stack/stack-regex.js';

import {
  getTsCodeFromSourcemap,
  type TsCodeErrorDetails,
} from './get-ts-code-from-sourcemap.js';

export const maybeMapSourcemaps = async (
  stacktrace: string[],
): Promise<TsCodeErrorDetails[]> =>
  await Promise.all(
    stacktrace.map(async (stackLine) => {
      const matches = stackLine.matchAll(/^at .*\((.*)\)$/g);
      const path = [...matches].map((el) => el[1])[0];

      const r = await getTsCodeFromSourcemap(path);
      if (r === undefined) {
        return {
          file: stackLine.replaceAll(stackAtRegex, 'at '),
          codeExcerpt: '',
        };
      }

      return {
        file: stackLine
          .replaceAll(stackAtRegex, 'at ')
          .replaceAll(fileRegex, `(${r.file})`),
        codeExcerpt: r.codeExcerpt,
      };
    }),
  );
