import { Effect } from 'effect';

import { type FsError } from '../logic/effects/fs/fs-error.js';

import { getErrorLocationFrom } from './get-error-location-from-file-path.js';
import { getSourceCode } from './get-source-code.js';
import {
  type ErrorRelatedSources,
  type RawErrorLocation,
  getSourcesFromMapFile,
} from './get-sources-from-map-file.js';

export const getErrorRelatedSources = (
  sourceFile: string,
): Effect.Effect<ErrorRelatedSources | RawErrorLocation | undefined, FsError> =>
  Effect.gen(function* () {
    const location = getErrorLocationFrom(sourceFile);
    if (location === undefined) {
      return;
    }

    const { filePath, line, column } = location;

    const isTypescriptFile =
      filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    if (isTypescriptFile) {
      const source = yield* getSourceCode(location);

      return {
        _tag: 'sources' as const,
        runPath: `${filePath}:${line}:${column}`,
        sourcesPath: undefined,
        source,
      };
    }

    return yield* getSourcesFromMapFile(location);
  });
