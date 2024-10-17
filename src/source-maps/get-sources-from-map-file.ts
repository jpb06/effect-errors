import path from 'node:path';

import { Effect } from 'effect';
import { type RawSourceMap, SourceMapConsumer } from 'source-map-js';

import type { FsError } from '../logic/effects/fs/fs-error.js';
import {
  existsEffect,
  readJsonEffect,
} from '../logic/effects/fs/fs-extra.effects.js';

import type { ErrorLocation } from './get-error-location-from-file-path.js';
import { type SourceCode, getSourceCode } from './get-source-code.js';

export interface ErrorRelatedSources {
  _tag: 'sources';
  source: SourceCode[];
  runPath: string;
  sourcesPath: string | undefined;
}

export interface RawErrorLocation extends ErrorLocation {
  _tag: 'location';
}

export const getSourcesFromMapFile = (
  location: ErrorLocation,
): Effect.Effect<ErrorRelatedSources | RawErrorLocation | undefined, FsError> =>
  Effect.gen(function* () {
    const fileExists = yield* existsEffect(`${location.filePath}.map`);
    if (!fileExists) {
      return {
        _tag: 'location' as const,
        ...location,
        filePath: location.filePath.replace(process.cwd(), ''),
      };
    }

    const data = yield* readJsonEffect<RawSourceMap>(
      `${location.filePath}.map`,
    );
    if (data.version === undefined || data.sources === undefined) {
      return;
    }

    const consumer = new SourceMapConsumer(data);
    const sources = consumer.originalPositionFor({
      column: location.column,
      line: location.line,
    });
    if (
      sources.source === null ||
      sources.line === null ||
      sources.column === null
    ) {
      return;
    }

    const absolutePath = path.resolve(
      location.filePath.substring(0, location.filePath.lastIndexOf('/')),
      sources.source,
    );
    const source = yield* getSourceCode(
      {
        filePath: absolutePath,
        line: sources.line,
        column: sources.column,
      },
      true,
    );

    return {
      _tag: 'sources' as const,
      runPath: `${location.filePath}:${location.line}:${location.column}`,
      sourcesPath: `${absolutePath}:${sources.line}:${sources.column + 1}`,
      source,
    };
  });
