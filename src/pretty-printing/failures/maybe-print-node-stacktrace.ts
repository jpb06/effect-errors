import color from 'picocolors';

import { filterStack } from '@logic/stack';
import type { PrettyPrintOptions } from '@type';

export const maybePrintNodeStacktrace = (
  stack: string | undefined,
  isPlainString: boolean,
  { stripCwd, hideStackTrace }: PrettyPrintOptions,
): string[] => {
  if (hideStackTrace) {
    return [];
  }

  if (stack !== undefined) {
    const line = [
      '',
      `${color.bold(color.red('◯'))} ${color.red('Node Stacktrace')} 🚨`,
      `${color.red(filterStack(stack, 'node', stripCwd === true))}`,
      `${color.red('┴')}`,
    ].join('\r\n');

    return [line];
  }

  if (!isPlainString) {
    const line = [
      '',
      `${color.gray('ℹ️  Consider using a yieldable error such as Data.TaggedError and Schema.TaggedError to get a stacktrace.')}`,
    ].join('\r\n');

    return [line];
  }
  return [];
};
