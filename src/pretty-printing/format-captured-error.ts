import {
  formatErrorTitle,
  maybeWarnAboutPlainStrings,
} from '@pretty-print/common';
import type { PrettyPrintOptions } from '@type';

import type { ErrorData } from '../capture-errors.js';
import {
  maybeAdviseSpansUsage,
  maybePrintNodeStacktrace,
  maybePrintSpansTimeline,
  printEffectStacktrace,
} from './captured-errors/index.js';

export const formatCapturedError =
  (failuresCount: number, options: PrettyPrintOptions) =>
  (
    { errorType, message, stack, spans, sources, isPlainString }: ErrorData,
    index: number,
  ) => {
    const title = formatErrorTitle(errorType, message, failuresCount, index);
    const plainStringWarning = maybeWarnAboutPlainStrings(isPlainString);
    const spansTimeline = maybePrintSpansTimeline(
      spans,
      isPlainString,
      options,
    );
    const spansUsageAdvice = maybeAdviseSpansUsage(spans);

    const effectStacktrace = printEffectStacktrace(sources, spans, options);
    const nodeStacktrace = maybePrintNodeStacktrace(
      stack,
      isPlainString,
      options,
    );

    return [
      ...title,
      ...plainStringWarning,
      ...spansTimeline,
      ...spansUsageAdvice,
      '',
      ...effectStacktrace,
      ...nodeStacktrace,
      '',
    ].join('\r\n');
  };
