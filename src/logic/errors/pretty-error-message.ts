import chalk from 'chalk';
import { isFunction } from 'effect/Function';
import { hasProperty } from 'effect/Predicate';

const redBackground = (text: unknown) => chalk.bgRed(` ${text} `);
const whiteBright = (text: unknown) => chalk.bold.whiteBright(`• ${text}`);

export const prettyErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') {
    return `${u}\r\n\r\nℹ️  ${chalk.gray('You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.')}`;
  }

  // TaggedError with cause
  if (u instanceof Error && hasProperty(u, 'cause') && hasProperty(u, '_tag')) {
    return `${redBackground(u._tag)} ${whiteBright(u.cause)}\r\n`;
  }

  // TaggedError with error ctor
  if (u instanceof Error && hasProperty(u, 'error')) {
    return `${redBackground(u.name)} ${whiteBright(u.error)}\r\n`;
  }

  // Plain objects with tag attribute
  if (hasProperty(u, '_tag') && hasProperty(u, 'message')) {
    return `${redBackground(u._tag)} ${whiteBright(u.message)}\r\n`;
  }

  // Plain objects with toString impl
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
      return `${redBackground(type)} ${whiteBright(message)}`;
    }

    return `${message}`;
  }

  return `Error: ${JSON.stringify(u)}`;
};
