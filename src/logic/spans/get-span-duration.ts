import type { SpanStatus } from 'effect/Tracer';
import color from 'picocolors';

export const getSpanDuration = (status: SpanStatus, isLastEntry: boolean) => {
  if (status._tag !== 'Ended') {
    return '';
  }

  const duration = (status.endTime - status.startTime) / BigInt(1000000);

  return `\r\n${isLastEntry ? ' ' : color.gray('│')}     ~ ${duration}ms`;
};
