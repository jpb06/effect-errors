import { Effect, pipe } from 'effect';

import { type FsError } from '../logic/effects/fs/fs-error.js';
import { stackAtRegex } from '../logic/stack/stack-regex.js';

import { getErrorRelatedSources } from './get-error-related-sources.js';
import { type ErrorRelatedSources } from './get-sources-from-map-file.js';

export const maybeMapSourcemaps = (
  stacktrace: string[],
): Effect.Effect<ErrorRelatedSources[], FsError> =>
  pipe(
    Effect.forEach(stacktrace, (stackLine) =>
      Effect.gen(function* () {
        const chunks = stackLine.trimStart().split(' ');
        const path =
          chunks.length === 2
            ? chunks[1]
            : chunks[chunks.length - 1].slice(1, -1);

        const details = yield* getErrorRelatedSources(path);
        if (details === undefined) {
          return {
            runPath: stackLine.replaceAll(stackAtRegex, 'at '),
            source: undefined,
            sourcesPath: undefined,
          };
        }

        const regex = new RegExp(`${process.cwd()}/node_modules/`);
        if (details.sourcesPath?.match(regex)) {
          return undefined;
        }

        return {
          runPath: details.runPath,
          sourcesPath: details.sourcesPath,
          source: details.source,
        };
      }),
    ),
    Effect.map((array) =>
      array.filter((maybeSources) => maybeSources !== undefined),
    ),
  );
