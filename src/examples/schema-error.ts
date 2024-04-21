import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { SchemaError } from './errors/schema-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise({
    try: async () => await readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

export const withSchemaErrorTask = Effect.withSpan('withSchemaErrorTask')(
  Effect.all([filename(__filename), readUser]),
);

export default withSchemaErrorTask;
