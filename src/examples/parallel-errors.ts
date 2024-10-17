import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';

import { UserNotFoundError } from './errors/user-not-found.error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = (name: string) =>
  Effect.withSpan('readUser', {
    attributes: {
      name,
    },
  })(
    Effect.tryPromise({
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
  Effect.all([filename(fileName), parallelGet(['yolo', 'bro', 'cool'])]),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withParallelErrorsTask;
