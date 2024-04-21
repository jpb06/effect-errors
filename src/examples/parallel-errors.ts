import { Effect } from 'effect';

import { UserNotFoundError } from './errors/user-not-found.error';
import { filename } from './util/filename.effect';

const readUser = (name: string) =>
  Effect.withSpan('readUser', {
    attributes: {
      name,
    },
  })(
    Effect.tryPromise({
      // eslint-disable-next-line prefer-promise-reject-errors
      try: async () => await Promise.reject('Oh no, this user does no exist!'),
      catch: (e) => new UserNotFoundError({ cause: e }),
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

export const withParallelErrorsTask = Effect.withSpan('withParallelErrorsTask')(
  Effect.all([filename(__filename), parallelGet(['yolo', 'bro', 'cool'])]),
);

export default withParallelErrorsTask;
