import { Effect, pipe } from 'effect';

import { prettyPrint } from '..';
import {
  PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from '../types/pretty-print-options.type';

export const runPromise = <A, E>(
  effect: Effect.Effect<A, E>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
): Promise<A> =>
  Effect.runPromise(
    pipe(
      effect,
      Effect.sandbox,
      Effect.catchAll((e) => {
        if (options.enabled === false) {
          return Effect.fail(e);
        }

        console.error(prettyPrint(e, options));

        return Effect.fail('❌ runPromise failure') as never;
      }),
    ),
  );
