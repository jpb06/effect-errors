import { Effect, pipe } from 'effect';

import { prettyPrint } from '..';
import { prettyPrintEnabled } from '../config/pretty-print-enabled';

export const runPromise = <A, E>(effect: Effect.Effect<A, E>): Promise<A> =>
  Effect.runPromise(
    pipe(
      effect,
      Effect.sandbox,
      Effect.catchAll((e) => {
        if (prettyPrintEnabled) {
          console.error(prettyPrint(e));

          return Effect.fail('❌ runPromise failure') as never;
        }

        return Effect.fail(e);
      }),
    ),
  );
