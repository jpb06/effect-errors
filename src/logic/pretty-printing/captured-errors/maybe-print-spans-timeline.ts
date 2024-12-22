import color from 'picocolors';

import type { ErrorSpan, PrettyPrintOptions } from '../../../index.js';
import { stripCwdPath } from '../../strip-cwd-path.js';
import {
  formatSpanAttributes,
  formatSpanDuration,
  missingSpansWarning,
  spanStackTrailingChar,
} from '../common/index.js';

export const maybePrintSpansTimeline = (
  spans: ErrorSpan[] | undefined,
  isPlainString: boolean,
  { stripCwd, reverseSpans }: PrettyPrintOptions,
): string[] => {
  if (spans === undefined) {
    return isPlainString === false ? ['', missingSpansWarning, ''] : [];
  }

  const orderedSpans = reverseSpans === true ? spans.toReversed() : spans;
  return orderedSpans.reduce<string[]>(
    (output, { name, durationInMilliseconds, attributes }, index) => {
      const isFirstEntry = index === 0;
      const isLastEntry = index === spans.length - 1;

      const maybeCircle = isFirstEntry ? `\r\n${color.gray('◯')}\r\n` : '';
      const trailing = spanStackTrailingChar(isLastEntry);
      const filePath = ` ${stripCwd !== undefined ? color.underline(color.bold(stripCwdPath(name))) : color.underline(name)}`;
      const duration =
        durationInMilliseconds !== undefined
          ? color.gray(formatSpanDuration(durationInMilliseconds, isLastEntry))
          : '';
      const formattedAttributes = formatSpanAttributes(attributes, isLastEntry);

      const timelineEntry = color.white(
        `${maybeCircle}${trailing}${color.gray('─')}${filePath}${duration}${formattedAttributes}`,
      );

      return [...output, timelineEntry];
    },
    [],
  );
};
