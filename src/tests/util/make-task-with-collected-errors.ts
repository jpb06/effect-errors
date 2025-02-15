import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import type { Logger } from '@dependencies/logger';
import { makeLoggerTestLayer } from '@tests/layers';
import { type PrettyPrintOptions, prettyPrintOptionsDefault } from '@type';

import { collectErrorDetails } from './collect-error-details.util.js';

export const makeTaskWithCollectedErrors = (
  inputTask: Effect.Effect<unknown, unknown, Logger>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
) => {
  const { LoggerTestLayer, errorMock } = makeLoggerTestLayer({});
  const task = pipe(
    inputTask,
    Effect.sandbox,
    Effect.catchAll(collectErrorDetails(options)),
    Effect.provide(Layer.mergeAll(NodeFileSystem.layer, LoggerTestLayer)),
  );

  return { task, errorMock };
};
