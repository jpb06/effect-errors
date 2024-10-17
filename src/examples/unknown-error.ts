import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';
import fs from 'fs-extra';

import { FetchError } from './errors/fetch-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise(async () => await fs.readJson('cool.ts')),
);

const fetchTask = (userId: string) =>
  Effect.withSpan('fetchUser', {
    attributes: {
      userId,
    },
  })(
    Effect.tryPromise({
      try: async () =>
        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
      catch: (e) => new FetchError({ cause: e }),
    }),
  );

const unwrapResponseTask = (response: Response) =>
  Effect.withSpan('unwrapFetchUserResponse')(
    Effect.tryPromise({
      try: async () => await response.json(),
      catch: (e) => new FetchError({ cause: e }),
    }),
  );

export const unknownErrorTask = Effect.withSpan('unknownErrorTask')(
  Effect.gen(function* () {
    yield* filename(fileName);

    const { id } = yield* readUser;
    const response = yield* fetchTask(id as never);

    return yield* unwrapResponseTask(response);
  }),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default unknownErrorTask;
