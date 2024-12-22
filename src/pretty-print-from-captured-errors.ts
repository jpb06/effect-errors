import type { CapturedErrors } from './capture-errors.js';
import {
  formatCapturedError,
  formatTitle,
  interruptedMessage,
} from './logic/pretty-printing/index.js';
import {
  type PrettyPrintOptions,
  prettyPrintOptionsDefault,
} from './types/pretty-print-options.type.js';

export const prettyPrintFromCapturedErrors = (
  { errors, interrupted }: CapturedErrors,
  options: PrettyPrintOptions = prettyPrintOptionsDefault,
) => {
  if (interrupted) {
    return interruptedMessage;
  }

  const title = formatTitle(errors.length);
  const formattedFailures = errors.map(
    formatCapturedError(errors.length, options),
  );

  return [...title, ...formattedFailures].join('\r\n');
};
