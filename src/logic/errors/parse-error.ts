import { hasProperty } from 'effect/Predicate';
import { Span } from 'effect/Tracer';

import { PrettyError } from '../../types/pretty-error.type';

import { extractErrorDetails } from './extract-error-details';

const spanSymbol = Symbol.for('effect/SpanAnnotation');

export const parseError = (error: unknown): PrettyError => {
  const span = (hasProperty(error, spanSymbol) && error[spanSymbol]) as Span;
  const { message, type, isPlainString } = extractErrorDetails(error);

  if (error instanceof Error) {
    return new PrettyError(
      message,
      error.stack
        ?.split('\n')
        .filter((el) => /at (.*)/.exec(el))
        .join('\r\n'),
      span,
      type,
    );
  }

  return new PrettyError(message, void 0, span, type, isPlainString);
};
