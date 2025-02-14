import { Effect, pipe } from 'effect';

import { type PrettyPrintOptions, prettyPrintOptionsDefault } from '@type';

import { prettyPrint } from '../pretty-print.js';

export const runPromise = async <A, E>(
  effect: Effect.Effect<A, E>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
): Promise<A> =>
  await Effect.runPromise(
    pipe(
      effect,
      Effect.sandbox,
      Effect.catchAll((e) => {
        if (options.enabled === false) {
          return Effect.fail(e);
        }

        const prettyError = prettyPrint(e, options);
        console.error(prettyError);

        return Effect.fail('❌ runPromise failure' as never);
      }),
    ),
  );
