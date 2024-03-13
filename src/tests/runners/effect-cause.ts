import { pipe, Effect } from 'effect';

export const effectCause = <A, E>(effect: Effect.Effect<A, E>) =>
  Effect.runPromise(
    pipe(
      effect,
      Effect.catchAllCause((e) => Effect.fail(e)),
      Effect.flip,
    ),
  );
