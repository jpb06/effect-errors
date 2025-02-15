import color from 'picocolors';

import { filterStack } from '@logic/stack';
import type { PrettyPrintOptions } from '@type';

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
