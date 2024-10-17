import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';
import fs from 'fs-extra';

import { SchemaError } from './errors/schema-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise({
    try: async () => await fs.readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

export const withSchemaErrorTask = Effect.withSpan('withSchemaErrorTask')(
  Effect.all([filename(fileName), readUser]),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withSchemaErrorTask;
