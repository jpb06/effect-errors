import { pipe, Effect } from 'effect';

export const effectCause = async <A, E>(effect: Effect.Effect<A, E>) =>
  await Effect.runPromise(
    pipe(
      effect,
      Effect.catchAllCause((e) => Effect.fail(e)),
      Effect.flip,
    ),
  );
