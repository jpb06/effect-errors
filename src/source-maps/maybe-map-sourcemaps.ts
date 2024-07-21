import { stackAtRegex } from '../logic/stack/stack-regex.js';

import { getErrorRelatedSources } from './get-error-related-sources.js';
import { type ErrorRelatedSources } from './get-sources-from-map-file.js';

export const maybeMapSourcemaps = async (
  stacktrace: string[],
): Promise<ErrorRelatedSources[]> =>
  await Promise.all(
    stacktrace.map(async (stackLine) => {
      const chunks = stackLine.split(' ');
      const path =
        chunks.length === 2
          ? chunks[1]
          : chunks[chunks.length - 1].slice(1, -1);

      const details = await getErrorRelatedSources(path);
      if (details === undefined) {
        return {
          runPath: stackLine.replaceAll(stackAtRegex, 'at '),
          source: undefined,
          sourcesPath: undefined,
        };
      }

      return {
        runPath: details.runPath,
        sourcesPath: details.sourcesPath,
        source: details.source,
      };
    }),
  );
