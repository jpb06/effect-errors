import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';
import fs from 'fs-extra';

import { SchemaError } from './errors/schema-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(
  Effect.tryPromise({
    try: async () => await fs.readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
  Effect.withSpan('readUser'),
);

export const withSchemaErrorTask = pipe(
  Effect.all([filename(fileName), readUser]),
  Effect.withSpan('withSchemaErrorTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withSchemaErrorTask;
