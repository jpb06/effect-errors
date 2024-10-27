import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { UserNotFoundError } from './errors/user-not-found.error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = (name: string) =>
  pipe(
    Effect.tryPromise({
      try: async () => await Promise.reject('Oh no, this user does no exist!'),
      catch: (e) => new UserNotFoundError({ cause: e }),
    }),
    Effect.withSpan('readUser', {
      attributes: { name },
    }),
  );

const parallelGet = (names: string[]) =>
  pipe(
    Effect.all(names.map(readUser), {
      concurrency: 'unbounded',
    }),
    Effect.withSpan('parallelGet', {
      attributes: { names },
    }),
  );

export const withParallelErrorsTask = pipe(
  Effect.all([filename(fileName), parallelGet(['yolo', 'bro', 'cool'])]),
  Effect.withSpan('withParallelErrorsTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withParallelErrorsTask;
