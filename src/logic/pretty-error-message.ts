import chalk from 'chalk';
import { isFunction } from 'effect/Function';
import { hasProperty } from 'effect/Predicate';

const cwdRegex = new RegExp(`${process.cwd()}`, 'g');

export const prettyErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') {
    return `Error: ${u}`;
  }

  if (
    hasProperty(u, 'toString') &&
    isFunction(u['toString']) &&
    u['toString'] !== Object.prototype.toString &&
    u['toString'] !== Array.prototype.toString
  ) {
    return u['toString']();
  }

  if (hasProperty(u, '_tag') && hasProperty(u, 'message')) {
    const message = u.message
      ? chalk
          .hex('#c25c30')(u.message as string)
          .replace(cwdRegex, '.')
      : undefined;

    return `💥 ${chalk.bgRed(` ${u._tag} `)} ${message ? `• ${message}` : ''}\r\n`;
  }

  return `Error: ${JSON.stringify(u)}`;
};
