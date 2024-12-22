import color from 'picocolors';

import type { PrettyPrintOptions } from '../../../types/pretty-print-options.type.js';
import { filterStack } from '../../stack/filter-stack.js';

export const printEffectStacktrace = (
  spanAttributesStack: string[] | undefined,
  { stripCwd }: PrettyPrintOptions,
): string[] => {
  if (spanAttributesStack === undefined || spanAttributesStack.length === 0) {
    return [];
  }

  const cleanedStack = `│ ${filterStack(spanAttributesStack.join('\r\n│ '), 'effect', stripCwd === true)}`;

  const message = [
    '',
    `${color.bold(color.red('◯'))} ${color.red('Sources')} 🕵️`,
    `${color.red(cleanedStack)}`,
    `${color.red('┴')}`,
  ].join('\r\n');

  return [message];
};
