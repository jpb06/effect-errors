import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { FetchError } from './errors/fetch-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise(async () => await readJson('cool.ts')),
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
  Effect.gen(function* (_) {
    yield* _(filename(__filename));

    const { id } = yield* _(readUser);
    const response = yield* _(fetchTask(id as never));

    return yield* _(unwrapResponseTask(response));
  }),
);

export default unknownErrorTask;
