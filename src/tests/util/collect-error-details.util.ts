import { Effect, pipe } from 'effect';
import type { Cause } from 'effect/Cause';

import { captureErrors } from '../../capture-errors.js';
import { Logger } from '../../logic/logger/index.js';
import { prettyPrintFromCapturedErrors } from '../../pretty-print-from-captured-errors.js';
import type { PrettyPrintOptions } from '../../types/pretty-print-options.type.js';

export const collectErrorDetails =
  <E>(options: PrettyPrintOptions) =>
  (cause: Cause<E>) =>
    pipe(
      Effect.gen(function* () {
        const { error } = yield* Logger;
        const errors = yield* captureErrors(cause, {});

        const message = prettyPrintFromCapturedErrors(errors, options);

        error(message);
      }),
      Effect.scoped,
      Effect.withSpan('collect-error-details'),
    );
