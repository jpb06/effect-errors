import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { runPromise } from '../runners/run-promise';

import { SchemaError } from './errors/schema-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise({
    try: () => readJson('cool.ts'),
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
