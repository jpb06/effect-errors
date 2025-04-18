import type { Span } from 'effect/Tracer';
import color from 'picocolors';

import { stripCwdPath } from '@logic/path';
import { spanStackTrailingChar } from '@pretty-print/common';
import type { PrettyPrintOptions } from '@type';

import { extractSpans } from './extract-spans.js';
import { getSpanAttributes, getSpanDuration } from './format/index.js';

type SpansAsTimeline = {
  message: string;
  stack: string[];
};

export const formatSpansAsTimeline = (
  span: Span | undefined,
  { stripCwd }: PrettyPrintOptions,
): SpansAsTimeline => {
  const spans = extractSpans(span);

  return spans.reduce<SpansAsTimeline>(
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
