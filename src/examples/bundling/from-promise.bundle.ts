import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';

import { LoggerConsoleLive } from '@dependencies/logger';

import { captureErrors } from '../../capture-errors.js';
import fromPromiseTask from '../from-promise.js';
import { bigIntReplacer } from './big-int-replacer.js';

Effect.runPromise(
  pipe(
    fromPromiseTask,
    Effect.sandbox,
    Effect.catchAll((e) =>
      Effect.gen(function* () {
        const errors = yield* captureErrors(e);

        return yield* Effect.fail(JSON.stringify(errors, bigIntReplacer, 2));
      }),
    ),
    Effect.provide(Layer.mergeAll(NodeFileSystem.layer, LoggerConsoleLive)),
  ),
).catch(console.error);
