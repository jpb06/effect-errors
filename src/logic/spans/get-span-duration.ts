import chalk from 'chalk';
import { type SpanStatus } from 'effect/Tracer';

export const getSpanDuration = (status: SpanStatus, isLastEntry: boolean) => {
  if (status._tag !== 'Ended') {
    return '';
  }

  const duration = (status.endTime - status.startTime) / BigInt(1000000);

  return `\r\n${isLastEntry ? ' ' : chalk.gray('│')}     ~ ${duration}ms`;
};
