import chalk from 'chalk';
import { type Span } from 'effect/Tracer';

import { type PrettyPrintOptions } from '../../types/pretty-print-options.type.js';
import { filterStack } from '../stack/filter-stack.js';

export const printEffectStacktrace = (
  d: string[],
  span: Span | undefined,
  spanAttributesStack: string[] | undefined,
  { stripCwd }: PrettyPrintOptions,
) => {
  if (spanAttributesStack === undefined || spanAttributesStack.length === 0) {
    return;
  }

  const cleanedStack = `│ ${filterStack(spanAttributesStack.join('\r\n│ '), stripCwd === true)}`;
  d.push(
    `\r\n${span !== undefined ? '\r\n' : ''}🚨 Effect Stacktrace\r\n${chalk.red(cleanedStack)}`,
  );
};
