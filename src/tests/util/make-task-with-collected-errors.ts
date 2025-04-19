import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';

import { makeConsoleTestLayer } from '@tests/layers';
import { type PrettyPrintOptions, prettyPrintOptionsDefault } from '@type';

import { collectErrorDetails } from './collect-error-details.util.js';

export const makeTaskWithCollectedErrors = <TSuccess, TError>(
  inputTask: Effect.Effect<TSuccess, TError, never>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
) => {
  const { ConsoleTestLayer, errorMock } = makeConsoleTestLayer();

  const task = pipe(
    inputTask,
    Effect.sandbox,
    Effect.catchAll(collectErrorDetails(options)),
    Effect.provide(NodeFileSystem.layer),
    ConsoleTestLayer,
  );

  return { task, errorMock };
};
