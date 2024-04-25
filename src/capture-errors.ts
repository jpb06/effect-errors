import { Option } from 'effect';
import { type Cause, isInterruptedOnly } from 'effect/Cause';
import { type AnySpan, type Span, type SpanStatus } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause';

export interface ErrorSpan {
  name: string;
  attributes: ReadonlyMap<string, unknown>;
  status: SpanStatus;
}

export interface ErrorData {
  errorType: unknown;
  message: unknown;
  stack?: string;
  spans?: ErrorSpan[];
  isPlainString: boolean;
}

export interface CapturedErrors {
  interrupted: boolean;
  errors: ErrorData[];
}

export interface CaptureErrorsOptions {
  reverseSpans: boolean;
}

export const captureErrors = <E>(
  cause: Cause<E>,
  { reverseSpans }: CaptureErrorsOptions = {
    reverseSpans: true,
  },
): CapturedErrors => {
  if (isInterruptedOnly(cause)) {
    return {
      interrupted: true,
      errors: [],
    };
  }

  const errors = captureErrorsFrom<E>(cause).map(
    ({ message, stack, span, errorType, isPlainString }) => {
      const spans = [];

      if (span !== undefined) {
        let current: Span | AnySpan | undefined = span;

        while (current !== undefined && current._tag === 'Span') {
          const { name, attributes, status } = current;
          spans.push({
            name,
            attributes,
            status,
          });
          current = Option.getOrUndefined(current.parent);
        }
      }

      return {
        errorType,
        message,
        stack,
        spans: reverseSpans ? spans.toReversed() : spans,
        isPlainString,
      };
    },
  );

  return {
    interrupted: false,
    errors,
  };
};
