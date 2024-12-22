import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import type { Logger } from '../../logic/logger/index.js';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from '../../types/pretty-print-options.type.js';
import { makeLoggerTestLayer } from '../layers/logger.test-layer.js';
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
