import { Effect, pipe } from 'effect';
import type { Cause } from 'effect/Cause';

import { Logger } from '@dependencies/logger';
import type { PrettyPrintOptions } from '@type';

import { captureErrors } from '../../capture-errors.js';
import { prettyPrintFromCapturedErrors } from '../../pretty-print-from-captured-errors.js';

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
