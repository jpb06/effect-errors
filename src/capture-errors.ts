import { Option } from 'effect';
import { type Cause, isInterruptedOnly } from 'effect/Cause';
import { type AnySpan, type Span, type SpanStatus } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause';
import { splitSpansAttributesByTypes } from './logic/spans/split-spans-attributes-by-type';
import { stripCwdPath } from './logic/strip-cwd-path';

export interface ErrorSpan {
  name: string;
  attributes: ReadonlyMap<string, unknown>;
  status: SpanStatus;
}

export interface ErrorData {
  errorType: unknown;
  message: unknown;
  stack?: string;
  effectStacktrace?: string;
  spans?: ErrorSpan[];
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
  { reverseSpans, stripCwd }: CaptureErrorsOptions = {
    reverseSpans: true,
    stripCwd: true,
  },
): CapturedErrors => {
  if (isInterruptedOnly(cause)) {
    return {
      interrupted: true,
      errors: [],
    };
  }

  const errors = captureErrorsFrom<E>(cause).map(
    ({ message, stack: maybeStack, span, errorType, isPlainString }) => {
      const effectStacktrace: string[] = [];
      const spans = [];

      if (span !== undefined) {
        let current: Span | AnySpan | undefined = span;

        while (current !== undefined && current._tag === 'Span') {
          const { name, attributes: allAttributes, status } = current;

          const { attributes, stacktrace } =
            splitSpansAttributesByTypes(allAttributes);

          effectStacktrace.push(...stacktrace);

          spans.push({
            name,
            attributes,
            status,
          });
          current = Option.getOrUndefined(current.parent);
        }
      }

      let stack;
      if (maybeStack !== undefined) {
        stack = stripCwd === true ? stripCwdPath(maybeStack) : maybeStack;
      }

      return {
        errorType,
        message,
        stack,
        effectStacktrace:
          effectStacktrace.length > 0
            ? effectStacktrace.join('\r\n')
            : undefined,
        spans: reverseSpans === true ? spans.toReversed() : spans,
        isPlainString,
      };
    },
  );

  return {
    interrupted: false,
    errors,
  };
};
