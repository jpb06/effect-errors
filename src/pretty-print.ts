import chalk from 'chalk';
import { Option } from 'effect';
import { Cause, isInterruptedOnly } from 'effect/Cause';
import { ParentSpan, Span } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause';
import { getSpanAttributes } from './logic/spans/get-span-attributes';
import { getSpanDuration } from './logic/spans/get-span-duration';
import { spanStackTrailingChar } from './logic/spans/spans-stack-trailing-char';
import { filterStack } from './logic/stack/filter-stack';
import { stripCwdPath } from './logic/strip-cwd-path';
import {
  PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from './types/pretty-print-options.type';

export const prettyPrint = <E>(
  cause: Cause<E>,
  { stripCwd }: PrettyPrintOptions = prettyPrintOptionsDefault,
): string => {
  if (isInterruptedOnly(cause)) {
    return 'All fibers interrupted without errors.';
  }

  const failures = captureErrorsFrom<E>(cause);

  console.error(
    `\r\n🫠  ${chalk.bold.yellowBright.underline(
      `${failures.length} error${failures.length > 1 ? 's' : ''} occurred\r\n`,
    )}`,
  );

  return failures
    .map(({ message, stack, span }, failuresIndex) => {
      if (span) {
        let current: Span | ParentSpan | undefined = span;

        const spans = [];
        while (current && current._tag === 'Span') {
          spans.push(current);
          current = Option.getOrUndefined(current.parent);
        }

        message =
          '💥 ' +
          (failures.length > 1
            ? chalk.bgRed.whiteBright(` #${failuresIndex + 1} -`)
            : '') +
          message +
          spans
            .toReversed()
            .map(({ name, attributes, status }, index) => {
              const isFirstEntry = index === 0;
              const isLastEntry = index === spans.length - 1;

              const filePath = ` at ${stripCwd ? stripCwdPath(name) : name}`;

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
        message += `\r\n${span ? '\r\n' : ''}🚨 Stacktrace\r\n${chalk.red(filterStack(stack, stripCwd === true))}`;
      }

      return message + '\r\n';
    })
    .join('\r\n');
};
