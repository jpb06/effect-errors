import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';

import { FetchError } from './errors/fetch-error.js';
import { FileError } from './errors/file-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readFileEffect = Effect.tryPromise({
  try: async () => await readFile('cool.ts', { encoding: 'utf-8' }),
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

export const withoutSpansTask = Effect.gen(function* () {
  yield* filename(fileName);

  yield* readFileEffect;
  const response = yield* fetchTask('1');

  return yield* unwrapResponseTask(response);
});

// biome-ignore lint/style/noDefaultExport: run-example
export default withoutSpansTask;
