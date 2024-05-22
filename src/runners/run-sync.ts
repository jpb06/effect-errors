import { Effect, pipe } from 'effect';

import { prettyPrint } from '../index.js';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from '../types/pretty-print-options.type.js';

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
