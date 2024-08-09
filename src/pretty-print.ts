import { type Cause, isInterruptedOnly } from 'effect/Cause';
import color from 'picocolors';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause.js';
import { formatFailuresTitle } from './logic/pretty-printing/format-failures-title.js';
import { maybePrintNodeStacktrace } from './logic/pretty-printing/maybe-print-node-stacktrace.js';
import { maybePrintSpanAttributes } from './logic/pretty-printing/maybe-print-span-attributes.js';
import { maybeWarnAboutPlainStrings } from './logic/pretty-printing/maybe-warn-about-plain-strings.js';
import { printEffectStacktrace } from './logic/pretty-printing/print-effect-stacktrace.js';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from './types/pretty-print-options.type.js';

export const prettyPrint = <E>(
  cause: Cause<E>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
): string => {
  if (isInterruptedOnly(cause)) {
    return 'All fibers interrupted without errors.';
  }

  const failures = captureErrorsFrom<E>(cause);

  const title = `\r\n🫠  ${color.bold(
    color.yellow(
      color.underline(
        `${failures.length} error${failures.length > 1 ? 's' : ''} occured`,
      ),
    ),
  )}\r\n\r\n`;

  return (
    title +
    failures
      .map(
        (
          { errorType, message: errorMessage, stack, span, isPlainString },
          failureIndex,
        ) => {
          const d: string[] = [
            formatFailuresTitle(
              errorType,
              errorMessage,
              failures.length,
              failureIndex,
            ),
          ];

          maybeWarnAboutPlainStrings(d, isPlainString);

          const spanAttributesStack = maybePrintSpanAttributes(
            d,
            span,
            isPlainString,
            options,
          );

          printEffectStacktrace(d, span, spanAttributesStack, options);
          maybePrintNodeStacktrace(d, span, stack, isPlainString, options);

          return [...d, '\r\n'].join('');
        },
      )
      .join('\r\n')
  );
};
