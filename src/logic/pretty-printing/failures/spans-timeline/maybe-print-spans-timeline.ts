import type { Span } from 'effect/Tracer';

import type { PrettyPrintOptions } from '../../../../types/pretty-print-options.type.js';
import { missingSpansWarning } from '../../common/index.js';
import { formatSpansAsTimeline } from './format-spans-at-timeline.js';

type MaybePrintSpansTimelineOutput = {
  spanAttributesStack: string[] | undefined;
  spansTimeline: string[];
};

export const maybePrintSpansTimeline = (
  span: Span | undefined,
  isPlainString: boolean,
  { stripCwd, reverseSpans }: PrettyPrintOptions,
): MaybePrintSpansTimelineOutput => {
  if (span === undefined) {
    return {
      spanAttributesStack: undefined,
      spansTimeline: isPlainString === false ? [missingSpansWarning] : [],
    };
  }

  const { stack, message } = formatSpansAsTimeline(span, {
    stripCwd,
    reverseSpans,
  });

  return {
    spanAttributesStack: stack,
    spansTimeline: [message],
  };
};
