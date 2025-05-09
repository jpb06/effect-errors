import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { FetchError } from './errors/fetch-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(
  Effect.gen(function* () {
    const data = yield* Effect.tryPromise(
      async () =>
        await readFile('./src/examples/data/user.json', { encoding: 'utf-8' }),
    );

    const userData = JSON.parse(data);

    return userData;
  }),
  Effect.withSpan('read-user'),
);

const fetchTask = (userId: string) =>
  pipe(
    Effect.tryPromise(
      async () => await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
    ),
    Effect.withSpan('fetch-user', {
      attributes: { userId },
    }),
  );

const unwrapResponseTask = (response: Response) =>
  pipe(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
    Effect.withSpan('unwrap-fetch-user-response'),
  );

export const unknownErrorTask = pipe(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id as never);

    return yield* unwrapResponseTask(response);
  }),
  Effect.withSpan('unknown-error-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default unknownErrorTask;
