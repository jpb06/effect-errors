import {
  formatCapturedError,
  formatTitle,
  interruptedMessage,
} from '@pretty-print';
import { type PrettyPrintOptions, prettyPrintOptionsDefault } from '@type';

import type { CapturedErrors } from './capture-errors.js';

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
