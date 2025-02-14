import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { FetchError } from './errors/fetch-error.js';
import { FileError } from './errors/file-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

interface User {
  id: string;
  name: string;
}

const readUser = pipe(
  Effect.gen(function* () {
    const data = yield* Effect.tryPromise<string, FileError>({
      try: async () =>
        await readFile('./src/examples/data/user.json', { encoding: 'utf-8' }),
      catch: (e) => new FileError({ cause: e }),
    });

    const userData: User = JSON.parse(data);

    return userData;
  }),
  Effect.withSpan('read-user'),
);

const fetchTask = (userId: string) =>
  pipe(
    Effect.tryPromise({
      try: async () =>
        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
      catch: (e) =>
        new FetchError({
          cause: e,
        }),
    }),
    Effect.withSpan('fetch-user', { attributes: { userId } }),
  );

const unwrapResponseTask = (response: Response) =>
  pipe(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
    Effect.withSpan('unwrap-fetch-user-response'),
  );

export const fromPromiseTask = pipe(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id);

    return yield* unwrapResponseTask(response);
  }),
  Effect.withSpan('from-promise-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default fromPromiseTask;
