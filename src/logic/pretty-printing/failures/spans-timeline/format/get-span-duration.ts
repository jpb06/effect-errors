import type { SpanStatus } from 'effect/Tracer';

import { formatSpanDuration } from '../../../common/index.js';

export const getSpanDuration = (status: SpanStatus, isLastEntry: boolean) => {
  if (status._tag !== 'Ended') {
    return '';
  }

  const duration = (status.endTime - status.startTime) / BigInt(1000000);

  return formatSpanDuration(duration, isLastEntry);
};
