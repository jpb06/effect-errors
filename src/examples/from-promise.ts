import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { runPromise } from '../runners/run-promise';

import { FetchError } from './errors/fetch-error';
import { FileError } from './errors/file-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise<
    {
      id: string;
      name: string;
    },
    FileError
  >({
    try: () => readJson('./src/examples/data/user.json'),
    catch: (e) => new FileError((e as { message: string }).message),
  }),
);

const fetchTask = (userId: string) =>
  Effect.withSpan('fetchUser', {
    attributes: {
      userId,
    },
  })(
    Effect.tryPromise({
      try: () => fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
      catch: (e) => new FetchError(e as never),
    }),
  );

const unwrapResponseTask = (response: Response) =>
  Effect.withSpan('unwrapFetchUserResponse')(
    Effect.tryPromise({
      try: () => response.json(),
      catch: (e) => new FetchError(e as never),
    }),
  );

const mainTask = Effect.withSpan('mainTask')(
  Effect.gen(function* (_) {
    yield* _(filename(__filename));

    const { id } = yield* _(readUser);
    const response = yield* _(fetchTask(id));

    return yield* _(unwrapResponseTask(response));
  }),
);

runPromise(mainTask);
