import path from 'path';

import chalk from 'chalk';
import { Effect } from 'effect';
import { type RawSourceMap, SourceMapConsumer } from 'source-map-js';

import { type FsError } from '../logic/effects/fs/fs-error.js';
import {
  existsEffect,
  readJsonEffect,
} from '../logic/effects/fs/fs-extra.effects.js';

import { type ErrorLocation } from './get-error-location-from-file-path.js';
import { getSourceCode, type SourceCode } from './get-source-code.js';

export interface ErrorRelatedSources {
  source: SourceCode[] | undefined;
  runPath: string;
  sourcesPath: string | undefined;
}

export const getSourcesFromMapFile = (
  location: ErrorLocation,
): Effect.Effect<ErrorRelatedSources | undefined, FsError> =>
  Effect.gen(function* () {
    const fileExists = yield* existsEffect(`${location.filePath}.map`);
    if (!fileExists) {
      console.warn(
        `${chalk.blueBright.underline('effect-errors')}: ${chalk.yellow(`${location.filePath}.map does not exist: unable to retrieve spans sourcemaps.`)}  `,
      );
      return;
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
      runPath: `${location.filePath}:${location.line}:${location.column}`,
      sourcesPath: `${absolutePath}:${sources.line}:${sources.column + 1}`,
      source,
    };
  });
