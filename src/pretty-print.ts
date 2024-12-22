import { type Cause, isInterruptedOnly } from 'effect/Cause';

import { captureErrorsFrom } from './logic/errors/capture-errors-from-cause.js';
import {
  formatFailure,
  formatTitle,
  interruptedMessage,
} from './logic/pretty-printing/index.js';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from './types/pretty-print-options.type.js';

export const prettyPrint = <E>(
  cause: Cause<E>,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
): string => {
  if (isInterruptedOnly(cause)) {
    return interruptedMessage;
  }

  const failures = captureErrorsFrom<E>(cause);

  const title = formatTitle(failures.length);
  const formattedFailures = failures.map(
    formatFailure(failures.length, options),
  );

  return [...title, ...formattedFailures].join('\r\n');
};
