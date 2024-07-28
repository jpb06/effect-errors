import { Effect, pipe } from 'effect';

import { captureErrors } from '../../capture-errors.js';
import { bigIntReplacer } from '../../logic/util/big-int-replacer.js';
import fromPromiseTask from '../from-promise.js';

void Effect.runPromise(
  pipe(
    fromPromiseTask,
    Effect.sandbox,
    Effect.catchAll((e) =>
      Effect.gen(function* () {
        const errors = yield* Effect.tryPromise(
          async () => await captureErrors(e),
        );

        return yield* Effect.fail(JSON.stringify(errors, bigIntReplacer, 2));
      }),
    ),
  ),
).catch(console.error);
