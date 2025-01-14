import { Effect, Layer, pipe } from 'effect';

import { NodeFileSystem } from '@effect/platform-node';

import { captureErrors } from '../../capture-errors.js';
import { LoggerConsoleLive } from '../../logic/logger/index.js';
import { bigIntReplacer } from '../../logic/util/big-int-replacer.js';
import fromPromiseTask from '../from-promise.js';

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
