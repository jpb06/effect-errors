import type { PlatformError } from '@effect/platform/Error';
import type { FileSystem } from '@effect/platform/FileSystem';
import { Effect } from 'effect';

import type { JsonParsingError } from '@dependencies/fs';

import { getErrorLocationFrom } from './get-error-location-from-file-path.js';
import { getSourceCode } from './get-source-code.js';
import {
  type ErrorRelatedSources,
  type RawErrorLocation,
  getSourcesFromMapFile,
} from './get-sources-from-map-file.js';

export const getErrorRelatedSources = (
  name: string,
  sourceFile: string,
): Effect.Effect<
  ErrorRelatedSources | RawErrorLocation | undefined,
  PlatformError | JsonParsingError,
  FileSystem
> =>
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
        name,
        runPath: `${filePath}:${line}:${column}`,
        sourcesPath: undefined,
        source,
      };
    }

    return yield* getSourcesFromMapFile(name, location);
  });
