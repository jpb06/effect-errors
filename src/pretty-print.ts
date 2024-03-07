import chalk from 'chalk';
import { Option } from 'effect';
import { Cause, isInterruptedOnly } from 'effect/Cause';
import { ParentSpan, Span } from 'effect/Tracer';

import { filterStack } from './logic/filter-stack';
import { getSpanAttributes } from './logic/get-span-attributes';
import { getSpanDuration } from './logic/get-span-duration';
import { prettyErrors } from './logic/pretty-errors';
import { spanStackTrailingChar } from './logic/spans-stack-trailing-char';

export const prettyPrint = <E>(cause: Cause<E>): string => {
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
      if (span) {
        let current: Span | ParentSpan | undefined = span;

        const spans = [];
        while (current && current._tag === 'Span') {
          spans.push(current);
          current = Option.getOrUndefined(current.parent);
        }

        message += spans
          .map(({ name, attributes, status }, index) => {
            const isFirstEntry = index === 0;
            const isLastEntry = index === spans.length - 1;

            const filePath = ` at ${name.replace(new RegExp(process.cwd()), '.')}`;

            return chalk.whiteBright(
              (isFirstEntry ? `\r\n${chalk.gray('◯')}` : '') +
                '\r\n' +
                spanStackTrailingChar(isLastEntry) +
                chalk.gray('─') +
                filePath +
                getSpanDuration(status, isLastEntry) +
                getSpanAttributes(attributes, isLastEntry),
            );
          })
          .join('');
      }

      if (stack) {
        message += `\r\n${span ? '\r\n' : ''}🚨 Stacktrace\r\n${chalk.red(filterStack(stack).replace(/ {4}at /g, '🭳 at '))}`;
      }

      return message + '\r\n';
    })
    .join('\r\n');
};
