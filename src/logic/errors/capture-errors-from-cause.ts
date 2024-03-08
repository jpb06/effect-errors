import { Cause, reduceWithContext } from 'effect/Cause';

import { PrettyError } from '../../types/pretty-error.type';

import { parseError } from './parse-error';

export const captureErrorsFrom = <E>(cause: Cause<E>): readonly PrettyError[] =>
  reduceWithContext(cause, void 0, {
    emptyCase: (): readonly PrettyError[] => [],
    dieCase: (_, unknownError) => [parseError(unknownError)],
    failCase: (_, error) => [parseError(error)],
    interruptCase: () => [],
    parallelCase: (_, l, r) => [...l, ...r],
    sequentialCase: (_, l, r) => [...l, ...r],
  });
