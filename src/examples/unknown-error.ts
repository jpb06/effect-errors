import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';
import fs from 'fs-extra';

import { FetchError } from './errors/fetch-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(
  Effect.tryPromise(async () => await fs.readJson('cool.ts')),
  Effect.withSpan('readUser'),
);

const fetchTask = (userId: string) =>
  pipe(
    Effect.tryPromise({
      try: async () =>
        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
      catch: (e) => new FetchError({ cause: e }),
    }),
    Effect.withSpan('fetchUser', {
      attributes: { userId },
    }),
  );

const unwrapResponseTask = (response: Response) =>
  pipe(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
    Effect.withSpan('unwrapFetchUserResponse'),
  );

export const unknownErrorTask = pipe(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id as never);

    return yield* unwrapResponseTask(response);
  }),
  Effect.withSpan('unknownErrorTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default unknownErrorTask;
