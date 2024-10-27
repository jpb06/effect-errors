import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';
import fs from 'fs-extra';

import { FetchError } from './errors/fetch-error.js';
import { FileError } from './errors/file-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

interface User {
  id: string;
  name: string;
}

const readUser = pipe(
  Effect.tryPromise<User, FileError>({
    try: async () => await fs.readJson('./src/examples/data/user.json'),
    catch: (e) => new FileError({ cause: e }),
  }),
  Effect.withSpan('readUser'),
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
    Effect.withSpan('fetchUser', { attributes: { userId } }),
  );

const unwrapResponseTask = (response: Response) =>
  pipe(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
    Effect.withSpan('unwrapFetchUserResponse'),
  );

export const fromPromiseTask = pipe(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id);

    return yield* unwrapResponseTask(response);
  }),
  Effect.withSpan('fromPromiseTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default fromPromiseTask;
