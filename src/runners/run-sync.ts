import { Effect, pipe } from 'effect';

import { pretty } from '..';
import { prettyPrintEnabled } from '../config/pretty-print-enabled';

export const runSync = <A, E>(effect: Effect.Effect<A, E>): A =>
  Effect.runSync(
    pipe(
      effect,
      Effect.sandbox,
      Effect.catchAll((e) => {
        if (prettyPrintEnabled) {
          console.error(pretty(e));

          return Effect.fail('runSync failure') as never;
        }

        return Effect.fail(e);
      }),
    ),
  );
