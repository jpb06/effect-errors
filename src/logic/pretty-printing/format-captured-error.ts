import type { ErrorData } from '../../capture-errors.js';
import type { PrettyPrintOptions } from '../../types/pretty-print-options.type.js';
import {
  maybePrintNodeStacktrace,
  maybePrintSpansTimeline,
  printEffectStacktrace,
} from './captured-errors/index.js';
import { maybeAdviseSpansUsage } from './captured-errors/maybe-advise-spans-usage.js';
import {
  formatErrorTitle,
  maybeWarnAboutPlainStrings,
} from './common/index.js';

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
