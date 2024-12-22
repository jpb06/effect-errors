import { Option } from 'effect';
import type { AnySpan, Span } from 'effect/Tracer';

export const extractSpans = (span: Span | undefined) => {
  let current: AnySpan | undefined = span;

  const spans = [];
  while (current !== undefined && current._tag === 'Span') {
    spans.push(current);
    current = Option.getOrUndefined(current.parent);
  }

  return spans;
};
