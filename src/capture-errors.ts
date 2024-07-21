import { Option } from 'effect';
import { type Cause, isInterruptedOnly } from 'effect/Cause';
import { type AnySpan, type Span, type SpanStatus } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause.js';
import { splitSpansAttributesByTypes } from './logic/spans/split-spans-attributes-by-type.js';
import { stackAtRegex } from './logic/stack/stack-regex.js';
import { stripCwdPath } from './logic/strip-cwd-path.js';
import { type ErrorRelatedSources } from './source-maps/get-sources-from-map-file.js';
import { maybeMapSourcemaps } from './source-maps/maybe-map-sourcemaps.js';

export interface ErrorSpan {
  name: string;
  attributes: ReadonlyMap<string, unknown>;
  status: SpanStatus;
}

export interface ErrorData {
  errorType: unknown;
  message: unknown;
  stack: string[] | undefined;
  sources: ErrorRelatedSources[] | undefined;
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

export const captureErrors = async <E>(
  cause: Cause<E>,
  { reverseSpans, stripCwd }: CaptureErrorsOptions = {
    reverseSpans: true,
    stripCwd: true,
  },
): Promise<CapturedErrors> => {
  if (isInterruptedOnly(cause)) {
    return {
      interrupted: true,
      errors: [],
    };
  }

  const errors = await Promise.all(
    captureErrorsFrom<E>(cause).map(
      async ({
        message,
        stack: maybeStack,
        span,
        errorType,
        isPlainString,
      }) => {
        const sources: ErrorRelatedSources[] = [];
        const spans = [];

        if (span !== undefined) {
          let current: Span | AnySpan | undefined = span;

          while (current !== undefined && current._tag === 'Span') {
            const { name, attributes: allAttributes, status } = current;

            const { attributes, stacktrace } =
              splitSpansAttributesByTypes(allAttributes);

            const errorSources = await maybeMapSourcemaps(stacktrace);

            sources.push(...errorSources);
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
          stack: stack?.replaceAll(stackAtRegex, 'at ').split('\r\n'),
          sources: sources.length > 0 ? sources : undefined,
          spans: reverseSpans === true ? spans.toReversed() : spans,
          isPlainString,
        };
      },
    ),
  );

  return {
    interrupted: false,
    errors,
  };
};
