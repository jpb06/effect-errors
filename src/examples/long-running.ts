import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { SchemaError } from './errors/schema-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise({
    try: () => readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

export const longRunningTask = Effect.withSpan('longRunningTask')(
  Effect.all([filename(__filename), Effect.sleep('2 seconds'), readUser]),
);

export default longRunningTask;
