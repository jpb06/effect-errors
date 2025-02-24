import color from 'picocolors';

import type { ErrorSpan } from '@type';

export const maybeAdviseSpansUsage = (
  spans: ErrorSpan[] | undefined,
): string[] => {
  if (spans === undefined || spans.length === 0) {
    return [
      '',
      color.gray('ℹ️  Consider using spans to improve errors reporting.'),
    ];
  }

  return [];
};
