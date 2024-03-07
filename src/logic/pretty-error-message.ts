import chalk from 'chalk';
import { isFunction } from 'effect/Function';
import { hasProperty } from 'effect/Predicate';

const cwdRegex = new RegExp(`${process.cwd()}`, 'g');

export const prettyErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') {
    return `💥 ${u}`;
  }

  // TaggedError with error ctor
  if (u instanceof Error && hasProperty(u, 'error')) {
    return `💥 ${chalk.bgRed(` ${u.name} `)} ${chalk.bold.whiteBright(`• ${u.error}`)}\r\n`;
  }

  // TaggedError with cause
  if (u instanceof Error && hasProperty(u, 'cause')) {
    return `💥 ${chalk.bgRed(` ${u.name} `)} ${chalk.bold.whiteBright(`• ${u.cause}`)}\r\n`;
  }

  if (
    hasProperty(u, 'toString') &&
    isFunction(u['toString']) &&
    u['toString'] !== Object.prototype.toString &&
    u['toString'] !== Array.prototype.toString
  ) {
    const message = u['toString']();
    const maybeWithUnderlyingType = message.split(': ');

    if (maybeWithUnderlyingType.length > 1) {
      const [type, ...message] = maybeWithUnderlyingType;
      return `💥 ${chalk.bgRed(` ${type} `)} ${chalk.bold.whiteBright(`• ${message}`)}`;
    }

    return `💥 ${message}`;
  }

  if (hasProperty(u, '_tag') && hasProperty(u, 'message')) {
    const message = u.message
      ? chalk
          .hex('#c25c30')(u.message as string)
          .replace(cwdRegex, '.')
      : undefined;

    return `💥 ${chalk.bgRed(` ${u._tag} `)} ${message ? chalk.bold.whiteBright(`• ${message}`) : ''}\r\n`;
  }

  return `Error: ${JSON.stringify(u)}`;
};
