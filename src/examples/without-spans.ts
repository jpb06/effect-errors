import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { FetchError } from './errors/fetch-error';
import { FileError } from './errors/file-error';
import { filename } from './util/filename.effect';

const readUser = Effect.tryPromise({
  try: async () => await readJson('cool.ts'),
  catch: (e) => new FileError({ cause: e }),
});

const fetchTask = (userId: string) =>
  Effect.tryPromise({
    try: async () => await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
    catch: (e) => new FetchError({ cause: e }),
  });

const unwrapResponseTask = (response: Response) =>
  Effect.tryPromise({
    try: async () => await response.json(),
    catch: (e) => new FetchError({ cause: e }),
  });

export const withoutSpansTask = Effect.gen(function* (_) {
  yield* _(filename(__filename));

  const { id } = yield* _(readUser);
  const response = yield* _(fetchTask(id as never));

  return yield* _(unwrapResponseTask(response));
});

export default withoutSpansTask;
