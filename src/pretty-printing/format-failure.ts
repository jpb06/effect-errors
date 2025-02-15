import { maybeAddErrorToSpansStack } from '@logic/spans';
import {
  formatErrorTitle,
  maybeWarnAboutPlainStrings,
} from '@pretty-print/common';
import type { PrettyError, PrettyPrintOptions } from '@type';

import {
  maybePrintNodeStacktrace,
  maybePrintSpansTimeline,
  printEffectStacktrace,
} from './failures/index.js';

export const formatFailure =
  (failuresCount: number, options: PrettyPrintOptions) =>
  (
    { errorType, message, stack, span, isPlainString }: PrettyError,
    index: number,
  ) => {
    const title = formatErrorTitle(errorType, message, failuresCount, index);
    const plainStringWarning = maybeWarnAboutPlainStrings(isPlainString);
    const { spanAttributesStack, spansTimeline } = maybePrintSpansTimeline(
      span,
      isPlainString,
      options,
    );
    const effectStack = maybeAddErrorToSpansStack(stack, spanAttributesStack);

    const effectStacktrace = printEffectStacktrace(effectStack, options);
    const nodeStacktrace = maybePrintNodeStacktrace(
      stack,
      isPlainString,
      options,
    );

    return [
      ...title,
      ...plainStringWarning,
      ...spansTimeline,
      ...effectStacktrace,
      ...nodeStacktrace,
      '',
    ].join('\r\n');
  };
