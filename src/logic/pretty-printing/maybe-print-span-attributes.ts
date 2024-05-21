import chalk from 'chalk';
import { type Span } from 'effect/Tracer';

import { type PrettyPrintOptions } from '../../types/pretty-print-options.type';

import { formatSpanAttributes } from './format-span-attributes';

export const maybePrintSpanAttributes = (
  d: string[],
  span: Span | undefined,
  isPlainString: boolean,
  { stripCwd, reverseSpans }: PrettyPrintOptions,
) => {
  if (span !== undefined) {
    const spanData = formatSpanAttributes(span, {
      stripCwd,
      reverseSpans,
    });

    d.push(spanData.message);
    return spanData.stack;
  }

  if (!isPlainString) {
    d.push(
      `\r\n${chalk.gray('ℹ️  Consider using spans to improve errors reporting.\r\n')}`,
    );
  }
};
