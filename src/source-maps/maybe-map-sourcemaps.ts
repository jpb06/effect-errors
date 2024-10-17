import { Effect, pipe } from 'effect';

import type { FsError } from '../logic/effects/fs/fs-error.js';
import { stackAtRegex } from '../logic/stack/stack-regex.js';

import { getErrorRelatedSources } from './get-error-related-sources.js';
import type {
  ErrorRelatedSources,
  RawErrorLocation,
} from './get-sources-from-map-file.js';

export type StackEntry = {
  _tag: 'stack-entry';
  runPath: string;
};

export type MaybeMappedSources =
  | ErrorRelatedSources
  | RawErrorLocation
  | StackEntry;

export const maybeMapSourcemaps = (
  stacktrace: string[],
): Effect.Effect<MaybeMappedSources[], FsError> =>
  pipe(
    Effect.forEach(stacktrace, (stackLine) =>
      Effect.gen(function* () {
        const chunks = stackLine.trimStart().split(' ');
        const mapFileReportedPath =
          chunks.length === 2
            ? chunks[1]
            : chunks[chunks.length - 1].slice(1, -1);

        const details = yield* getErrorRelatedSources(mapFileReportedPath);
        if (details === undefined) {
          return {
            _tag: 'stack-entry' as const,
            runPath: stackLine.replaceAll(stackAtRegex, 'at '),
          };
        }
        if (details._tag === 'location') {
          return details;
        }

        const regex = new RegExp(`${process.cwd()}/node_modules/`);
        if (details.sourcesPath?.match(regex)) {
          return undefined;
        }

        return details;
      }),
    ),
    Effect.map((array) =>
      array.filter((maybeSources) => maybeSources !== undefined),
    ),
  );
