import { Option } from 'effect';
import { Cause, isInterruptedOnly } from 'effect/Cause';
import { ParentSpan, Span, SpanStatus } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause';

export interface CapturedSpan {
  name: string;
  attributes: ReadonlyMap<string, unknown>;
  status: SpanStatus;
}

export interface CapturedError {
  errorType: unknown;
  message: unknown;
  stack?: string;
  spans?: CapturedSpan[];
  isPlainString?: boolean;
}

export const captureErrors = <E>(
  cause: Cause<E>,
): 'All fibers interrupted without errors.' | CapturedError[] => {
  if (isInterruptedOnly(cause)) {
    return 'All fibers interrupted without errors.' as const;
  }

  return captureErrorsFrom<E>(cause).map(
    ({ message, stack, span, errorType, isPlainString }) => {
      const spans = [];

      if (span) {
        let current: Span | ParentSpan | undefined = span;

        while (current && current._tag === 'Span') {
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
        spans,
        isPlainString,
      };
    },
  );
};
