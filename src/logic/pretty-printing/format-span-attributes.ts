import chalk from 'chalk';
import { Option } from 'effect';
import { type AnySpan, type Span } from 'effect/Tracer';

import { type PrettyPrintOptions } from '../../types/pretty-print-options.type';
import { getSpanAttributes } from '../spans/get-span-attributes';
import { getSpanDuration } from '../spans/get-span-duration';
import { spanStackTrailingChar } from '../spans/spans-stack-trailing-char';
import { stripCwdPath } from '../strip-cwd-path';

export const formatSpanAttributes = (
  span: Span | undefined,
  { stripCwd, reverseSpans }: PrettyPrintOptions,
) => {
  let current: Span | AnySpan | undefined = span;

  const spans = [];
  while (current !== undefined && current._tag === 'Span') {
    spans.push(current);
    current = Option.getOrUndefined(current.parent);
  }

  const orderedSpans = reverseSpans === true ? spans.toReversed() : spans;

  return orderedSpans
    .map(({ name, attributes, status }, index) => {
      const isFirstEntry = index === 0;
      const isLastEntry = index === spans.length - 1;

      const filePath = ` at ${stripCwd !== undefined ? stripCwdPath(name) : name}`;

      const { formattedAttributes, stack } = getSpanAttributes(
        attributes,
        isLastEntry,
      );

      const message = chalk.whiteBright(
        (isFirstEntry ? `\r\n${chalk.gray('◯')}` : '') +
          '\r\n' +
          spanStackTrailingChar(isLastEntry) +
          chalk.gray('─') +
          filePath +
          getSpanDuration(status, isLastEntry) +
          formattedAttributes,
      );

      return {
        message,
        stack,
      };
    })
    .reduce(
      (prev, curr) => ({
        message: prev.message + curr.message,
        stack: [...prev.stack, ...curr.stack],
      }),
      {
        message: '',
        stack: [],
      },
    );
};
