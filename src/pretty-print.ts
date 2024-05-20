import chalk from 'chalk';
import { Option } from 'effect';
import { type Cause, isInterruptedOnly } from 'effect/Cause';
import { type AnySpan, type Span } from 'effect/Tracer';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause';
import { getSpanAttributes } from './logic/spans/get-span-attributes';
import { getSpanDuration } from './logic/spans/get-span-duration';
import { spanStackTrailingChar } from './logic/spans/spans-stack-trailing-char';
import { filterStack } from './logic/stack/filter-stack';
import { stripCwdPath } from './logic/strip-cwd-path';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from './types/pretty-print-options.type';

export const prettyPrint = <E>(
  cause: Cause<E>,
  { stripCwd, reverseSpans }: PrettyPrintOptions = prettyPrintOptionsDefault,
): string => {
  if (isInterruptedOnly(cause)) {
    return 'All fibers interrupted without errors.';
  }

  const failures = captureErrorsFrom<E>(cause);

  console.error(
    `\r\n🫠  ${chalk.bold.yellowBright.underline(
      `${failures.length} error${failures.length > 1 ? 's' : ''} occured\r\n`,
    )}`,
  );

  return failures
    .map(
      (
        { errorType, message: errorMessage, stack, span, isPlainString },
        failuresIndex,
      ) => {
        let message =
          '💥 ' +
          (failures.length > 1
            ? chalk.bgRed.whiteBright(` #${failuresIndex + 1} -`)
            : '') +
          chalk.bgRed.whiteBright(
            ` ${(errorType as string | undefined) ?? 'Unknown error'} `,
          ) +
          chalk.bold.whiteBright(` • ${errorMessage as string}`) +
          '\r\n';

        if (isPlainString) {
          message += `\r\n${chalk.gray('ℹ️  You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.')}`;
        }

        const spanAttributesStack: string[] = [];

        if (span !== undefined) {
          let current: Span | AnySpan | undefined = span;

          const spans = [];
          while (current !== undefined && current._tag === 'Span') {
            spans.push(current);
            current = Option.getOrUndefined(current.parent);
          }

          const orderedSpans =
            reverseSpans === true ? spans.toReversed() : spans;

          message += orderedSpans
            .map(({ name, attributes, status }, index) => {
              const isFirstEntry = index === 0;
              const isLastEntry = index === spans.length - 1;

              const filePath = ` at ${stripCwd !== undefined ? stripCwdPath(name) : name}`;

              const { formattedAttributes, stack } = getSpanAttributes(
                attributes,
                isLastEntry,
              );

              spanAttributesStack.push(...stack);

              return chalk.whiteBright(
                (isFirstEntry ? `\r\n${chalk.gray('◯')}` : '') +
                  '\r\n' +
                  spanStackTrailingChar(isLastEntry) +
                  chalk.gray('─') +
                  filePath +
                  getSpanDuration(status, isLastEntry) +
                  formattedAttributes,
              );
            })
            .join('');
        } else if (!isPlainString) {
          message += `\r\n${chalk.gray('ℹ️  Consider using spans to improve errors reporting.\r\n')}`;
        }

        if (spanAttributesStack.length > 0) {
          message += `\r\n🚨 Effect Stacktrace\r\n${chalk.red(`│ ${filterStack(spanAttributesStack.join('\r\n│ '), stripCwd === true)}`)}`;
        }

        if (stack !== undefined) {
          message += `\r\n${span !== undefined ? '\r\n' : ''}🚨 Node Stacktrace\r\n${chalk.red(filterStack(stack, stripCwd === true))}`;
        } else if (!isPlainString) {
          message += `\r\n\r\n${chalk.gray('ℹ️  Consider using a yieldable error such as Data.TaggedError and Schema.TaggedError to get a stacktrace.')}`;
        }

        return message + '\r\n';
      },
    )
    .join('\r\n');
};
