import type { Span } from 'effect/Tracer';

import { missingSpansWarning } from '@pretty-print/common';
import type { PrettyPrintOptions } from '@type';

import { formatSpansAsTimeline } from './format-spans-at-timeline.js';

type MaybePrintSpansTimelineOutput = {
  spanAttributesStack: string[] | undefined;
  spansTimeline: string[];
};

export const maybePrintSpansTimeline = (
  span: Span | undefined,
  isPlainString: boolean,
  options: PrettyPrintOptions,
): MaybePrintSpansTimelineOutput => {
  if (span === undefined) {
    return {
      spanAttributesStack: undefined,
      spansTimeline: isPlainString === false ? [missingSpansWarning] : [],
    };
  }

  const { stack, message } = formatSpansAsTimeline(span, options);

  return {
    spanAttributesStack: stack,
    spansTimeline: [message],
  };
};
