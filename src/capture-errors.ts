import { Effect } from 'effect';
import { type Cause, isInterruptedOnly } from 'effect/Cause';

import type { FsError } from './logic/effects/fs/fs-error.js';
import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause.js';
import type { ErrorLocation } from './source-maps/get-error-location-from-file-path.js';
import type { ErrorRelatedSources } from './source-maps/get-sources-from-map-file.js';
import { transformRawError } from './source-maps/transform-raw-error.js';

export interface ErrorSpan {
  name: string;
  attributes: Record<string, unknown>;
  durationInMilliseconds: number | undefined;
}

export interface ErrorData {
  errorType: unknown;
  message: unknown;
  stack: string[] | undefined;
  sources: Omit<ErrorRelatedSources, '_tag'>[] | undefined;
  location: Omit<ErrorLocation, '_tag'>[] | undefined;
  spans: ErrorSpan[] | undefined;
  isPlainString: boolean;
}

export interface CapturedErrors {
  interrupted: boolean;
  errors: ErrorData[];
}

export interface CaptureErrorsOptions {
  reverseSpans?: boolean;
  stripCwd?: boolean;
}

export const captureErrors = <E>(
  cause: Cause<E>,
  options: CaptureErrorsOptions = {
    reverseSpans: true,
    stripCwd: true,
  },
): Effect.Effect<CapturedErrors, FsError> =>
  Effect.gen(function* () {
    if (isInterruptedOnly(cause)) {
      return {
        interrupted: true,
        errors: [],
      };
    }

    const rawErrors = captureErrorsFrom<E>(cause);
    const errors = yield* Effect.forEach(rawErrors, transformRawError(options));

    return {
      interrupted: false,
      errors,
    };
  });
