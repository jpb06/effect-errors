import { Effect } from 'effect';

import { runPromise } from '../runners/run-promise';

import { UserNotFoundError } from './errors/user-not-found.error';
import { filename } from './util/filename.effect';

const readUser = (name: string) =>
  Effect.withSpan('readUser', {
    attributes: {
      name,
    },
  })(
    Effect.tryPromise({
      try: () => Promise.reject('Oh no, this user does no exist!'),
      catch: (e) =>
        new UserNotFoundError({
          message: e,
        }),
    }),
  );

const parallelGet = (names: string[]) =>
  Effect.withSpan('parallelGet', {
    attributes: {
      names,
    },
  })(
    Effect.all(names.map(readUser), {
      concurrency: 'unbounded',
    }),
  );

const mainTask = Effect.withSpan('mainTask')(
  Effect.gen(function* (_) {
    yield* _(filename(__filename));

    return yield* _(parallelGet(['yolo', 'bro', 'cool']));
  }),
);

(async () => {
  await runPromise(mainTask);
})();
