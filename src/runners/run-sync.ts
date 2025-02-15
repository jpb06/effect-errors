import { Effect, pipe } from 'effect';

import { type PrettyPrintOptions, prettyPrintOptionsDefault } from '@type';

import { prettyPrint } from '../pretty-print.js';

export const runSync = <A, E>(
  effect: Effect.Effect<A, E>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
): A =>
  Effect.runSync(
    pipe(
      effect,
      Effect.sandbox,
      Effect.catchAll((e) => {
        if (options.enabled === true) {
          console.error(prettyPrint(e, options));

          return Effect.fail('❌ runSync failure') as never;
        }

        return Effect.fail(e);
      }),
    ),
  );
