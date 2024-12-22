import type { Span } from 'effect/Tracer';
import color from 'picocolors';

import type { PrettyPrintOptions } from '../../../../types/pretty-print-options.type.js';
import { stripCwdPath } from '../../../strip-cwd-path.js';
import { spanStackTrailingChar } from '../../common/index.js';
import { extractSpans } from './extract-spans.js';
import { getSpanAttributes, getSpanDuration } from './format/index.js';

type SpansAsTimeline = {
  message: string;
  stack: string[];
};

export const formatSpansAsTimeline = (
  span: Span | undefined,
  { stripCwd, reverseSpans }: PrettyPrintOptions,
): SpansAsTimeline => {
  const spans = extractSpans(span);

  const orderedSpans = reverseSpans === true ? spans.toReversed() : spans;
  return orderedSpans.reduce<SpansAsTimeline>(
    (output, { name, status, attributes }, index) => {
      const isFirstEntry = index === 0;
      const isLastEntry = index === spans.length - 1;

      const { formattedAttributes, stack } = getSpanAttributes(
        attributes,
        isLastEntry,
      );

      const maybeCircle = isFirstEntry ? `\r\n${color.gray('◯')}` : '';
      const trailing = spanStackTrailingChar(isLastEntry);
      const filePath = ` ${stripCwd !== undefined ? color.underline(color.bold(stripCwdPath(name))) : color.underline(name)}`;
      const duration = color.gray(getSpanDuration(status, isLastEntry));

      const message = `${maybeCircle}\r\n${trailing}${color.gray('─')}${filePath}${duration}${formattedAttributes}`;

      return {
        message: `${output.message}${message}`,
        stack: [...output.stack, ...stack],
      };
    },
    {
      message: '',
      stack: [],
    },
  );
};
