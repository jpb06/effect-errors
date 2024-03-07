import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { runPromise } from '../runners/run-promise';

import { FetchError } from './errors/fetch-error';
import { filename } from './util/filename.effect';

const readUser = Effect.tryPromise(() => readJson('cool.ts'));

const fetchTask = (userId: string) =>
  Effect.tryPromise({
    try: () => fetch(`https://yolo-bro-oh-no.org/users/${userId}`),
    catch: (e) => new FetchError({ cause: e }),
  });

const unwrapResponseTask = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (e) => new FetchError({ cause: e }),
  });

const mainTask = Effect.gen(function* (_) {
  yield* _(filename(__filename));

  const { id } = yield* _(readUser);
  const response = yield* _(fetchTask(id));

  return yield* _(unwrapResponseTask(response));
});

runPromise(mainTask);
