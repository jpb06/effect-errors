import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';
import fs from 'fs-extra';

import { FetchError } from './errors/fetch-error.js';
import { FileError } from './errors/file-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

interface User {
  id: string;
  name: string;
}

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise<User, FileError>({
    try: async () => await fs.readJson('./src/examples/data/user.json'),
    catch: (e) => new FileError({ cause: e }),
  }),
);

const fetchTask = (userId: string) =>
  Effect.withSpan('fetchUser', { attributes: { userId } })(
    Effect.tryPromise({
      try: async () =>
        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
      catch: (e) =>
        new FetchError({
          cause: e,
        }),
    }),
  );

const unwrapResponseTask = (response: Response) =>
  Effect.withSpan('unwrapFetchUserResponse')(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
  );

export const fromPromiseTask = Effect.withSpan('fromPromiseTask')(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id);

    return yield* unwrapResponseTask(response);
  }),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default fromPromiseTask;
