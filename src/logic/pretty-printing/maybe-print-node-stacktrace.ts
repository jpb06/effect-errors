import chalk from 'chalk';
import { type Span } from 'effect/Tracer';

import { type PrettyPrintOptions } from '../../types/pretty-print-options.type.js';
import { filterStack } from '../stack/filter-stack.js';

export const maybePrintNodeStacktrace = (
  d: string[],
  span: Span | undefined,
  stack: string | undefined,
  isPlainString: boolean,
  { stripCwd }: PrettyPrintOptions,
) => {
  if (stack !== undefined) {
    d.push(
      `\r\n${span !== undefined ? '\r\n' : ''}🚨 Node Stacktrace\r\n${chalk.red(filterStack(stack, stripCwd === true))}`,
    );
  } else if (!isPlainString) {
    d.push(
      `\r\n\r\n${chalk.gray('ℹ️  Consider using a yieldable error such as Data.TaggedError and Schema.TaggedError to get a stacktrace.')}`,
    );
  }
};
