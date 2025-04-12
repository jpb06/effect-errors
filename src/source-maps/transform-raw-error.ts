import { Effect, pipe } from 'effect';

import { stripCwdPath } from '@logic/path';
import { stackAtRegex } from '@logic/stack';

import type { CaptureErrorsOptions } from '../capture-errors.js';
import type { PrettyError } from '../types/pretty-error.type.js';
import { getSourcesFromSpan } from './get-sources-from-span.js';
import { getSourcesFromStack } from './get-sources-from-stack.js';

export const transformRawError =
  ({ stripCwd }: CaptureErrorsOptions) =>
  ({
    message,
    stack: maybeStack,
    span,
    errorType,
    isPlainString,
  }: PrettyError) =>
    pipe(
      Effect.gen(function* () {
        const data = yield* getSourcesFromStack(maybeStack);
        const { spans, sources, location } = yield* getSourcesFromSpan({
          span,
          ...data,
        });

        let stack: string | undefined;
        if (maybeStack !== undefined) {
          stack = stripCwd === true ? stripCwdPath(maybeStack) : maybeStack;
        }

        return {
          errorType,
          message,
          stack: stack?.replaceAll(stackAtRegex, 'at ').split('\r\n'),
          sources:
            sources.length > 0
              ? sources.map(({ _tag, ...data }) => data)
              : undefined,
          location:
            location.length > 0
              ? location.map(({ _tag, ...data }) => data)
              : undefined,
          spans,
          isPlainString,
        };
      }),
      Effect.withSpan('transform-raw-error'),
    );
