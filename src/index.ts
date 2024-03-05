import chalk from 'chalk';
import { Option } from 'effect';
import { Cause, isInterruptedOnly } from 'effect/Cause';
import { ParentSpan, Span } from 'effect/Tracer';

import { filterStack } from './logic/filter-stack';
import { prettyErrors } from './logic/pretty-errors';

export const pretty = <E>(cause: Cause<E>): string => {
  if (isInterruptedOnly(cause)) {
    return 'All fibers interrupted without errors.';
  }

  const failures = prettyErrors<E>(cause);

  console.error(
    `\r\n🫠  ${chalk.bold.yellowBright.underline(
      `${failures.length} error${failures.length > 1 ? 's' : ''} occurred\n`,
    )}`,
  );

  return failures
    .map(({ message, stack, span }) => {
      if (stack) {
        message += `\r\n${filterStack(stack)}`;
      }

      if (span) {
        let current: Span | ParentSpan | undefined = span;

        const spans = [];
        while (current && current._tag === 'Span') {
          spans.push(current);
          current = Option.getOrUndefined(current.parent);
        }

        message += spans
          .map(({ name }, index) => {
            const isFirstEntry = index === 0;
            const isLastEntry = index === spans.length - 1;

            const filePath = ` at ${name.replace(new RegExp(process.cwd()), '.')}`;

            return chalk.whiteBright(
              `${isFirstEntry ? `\r\n${chalk.gray('◯')}` : ''}\r\n${isLastEntry ? chalk.gray('╰') : chalk.gray('├')}${chalk.gray('─')}${filePath}`,
            );
          })
          .join('');
      }

      return message + '\r\n';
    })
    .join('\r\n');
};
