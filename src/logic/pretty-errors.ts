import { Cause, reduceWithContext } from 'effect/Cause';

import { PrettyError } from '../types/pretty-error.type';

import { defaultRenderError } from './default-render-error';

export const prettyErrors = <E>(cause: Cause<E>): readonly PrettyError[] =>
  reduceWithContext(cause, void 0, {
    emptyCase: (): readonly PrettyError[] => [],
    dieCase: (_, unknownError) => [defaultRenderError(unknownError)],
    failCase: (_, error) => [defaultRenderError(error)],
    interruptCase: () => [],
    parallelCase: (_, l, r) => [...l, ...r],
    sequentialCase: (_, l, r) => [...l, ...r],
  });
