import { hasProperty } from 'effect/Predicate';
import { Span } from 'effect/Tracer';

import { PrettyError } from '../../types/pretty-error.type';

import { prettyErrorMessage } from './pretty-error-message';

const spanSymbol = Symbol.for('effect/SpanAnnotation');

export const parseError = (error: unknown): PrettyError => {
  const span = (hasProperty(error, spanSymbol) && error[spanSymbol]) as Span;
  if (error instanceof Error) {
    return new PrettyError(
      prettyErrorMessage(error),
      error.stack
        ?.split('\n')
        .filter((el) => /at (.*)/.exec(el)) // el.match(/at (.*)/))
        .join('\n'),
      span,
    );
  }

  return new PrettyError(prettyErrorMessage(error), void 0, span);
};
