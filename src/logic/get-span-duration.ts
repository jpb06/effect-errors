import chalk from 'chalk';
import { SpanStatus } from 'effect/Tracer';

export const getSpanDuration = (status: SpanStatus, isLastEntry: boolean) => {
  if (status._tag !== 'Ended') {
    return '';
  }

  return `\r\n${isLastEntry ? ' ' : chalk.gray('│')}     ~ ${(status.endTime - status.startTime) / BigInt(100000)}ms`;
};
