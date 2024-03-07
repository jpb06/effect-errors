import chalk from 'chalk';
import { isFunction } from 'effect/Function';
import { hasProperty } from 'effect/Predicate';

export const prettyErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') {
    return `💥 ${u}`;
  }

  // TaggedError with cause
  if (u instanceof Error && hasProperty(u, 'cause') && hasProperty(u, '_tag')) {
    return `💥 ${chalk.bgRed(` ${u._tag} `)} ${chalk.bold.whiteBright(`• ${u.cause}`)}\r\n`;
  }

  // TaggedError with error ctor
  if (u instanceof Error && hasProperty(u, 'error')) {
    return `💥 ${chalk.bgRed(` ${u.name} `)} ${chalk.bold.whiteBright(`• ${u.error}`)}\r\n`;
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

  return `Error: ${JSON.stringify(u)}`;
};
