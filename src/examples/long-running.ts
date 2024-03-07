import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { runPromise } from '../runners/run-promise';

import { SchemaError } from './errors/schema-error';
import { filename } from './util/filename.effect';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise({
    try: async () => {
      await delay(2000);
      return readJson('cool.ts');
    },
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

const mainTask = Effect.withSpan('mainTask')(
  Effect.gen(function* (_) {
    yield* _(filename(__filename));

    yield* _(readUser);
  }),
);

runPromise(mainTask);
