import { Effect, Option } from 'effect';
import { type AnySpan, type Span } from 'effect/Tracer';

import { type CaptureErrorsOptions } from '../capture-errors.js';
import { splitSpansAttributesByTypes } from '../logic/spans/split-spans-attributes-by-type.js';
import { stackAtRegex } from '../logic/stack/stack-regex.js';
import { stripCwdPath } from '../logic/strip-cwd-path.js';
import { type PrettyError } from '../types/pretty-error.type.js';

import { type ErrorRelatedSources } from './get-sources-from-map-file.js';
import { maybeMapSourcemaps } from './maybe-map-sourcemaps.js';

export const transformRawError =
  ({ reverseSpans, stripCwd }: CaptureErrorsOptions) =>
  ({
    message,
    stack: maybeStack,
    span,
    errorType,
    isPlainString,
  }: PrettyError) =>
    Effect.gen(function* () {
      const sources: ErrorRelatedSources[] = [];
      const spans = [];

      if (span !== undefined) {
        let current: Span | AnySpan | undefined = span;

        while (current !== undefined && current._tag === 'Span') {
          const { name, attributes: allAttributes, status } = current;

          const { attributes, stacktrace } =
            splitSpansAttributesByTypes(allAttributes);

          const errorSources = yield* maybeMapSourcemaps(stacktrace);

          const duration =
            status._tag === 'Ended'
              ? +`${(status.endTime - status.startTime) / BigInt(1000000)}`
              : undefined;

          sources.push(...errorSources);
          spans.push({
            name,
            attributes: Object.fromEntries(attributes),
            durationInMilliseconds: duration,
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
    });
