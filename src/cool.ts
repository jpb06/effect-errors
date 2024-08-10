import { Effect, pipe } from 'effect';
import fromPromiseTask from './examples/from-promise.js';
import { prettyPrint } from './pretty-print.js';

await Effect.runPromise(
  pipe(
    Effect.gen(function* () {
      return yield* fromPromiseTask;
    }),
    Effect.sandbox,
    Effect.catchAll((e) => {
      console.error(prettyPrint(e));

      return Effect.fail('❌ runPromise failure');
    }),
  ),
);
