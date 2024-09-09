import { type Span } from 'effect/Tracer';
import color from 'picocolors';

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
      `\r\n${span !== undefined ? '\r\n' : ''}🚨 Node Stacktrace\r\n${color.red(filterStack(stack, 'node', stripCwd === true))}`,
    );
  } else if (!isPlainString) {
    d.push(
      `\r\n\r\n${color.gray('ℹ️  Consider using a yieldable error such as Data.TaggedError and Schema.TaggedError to get a stacktrace.')}`,
    );
  }
};
