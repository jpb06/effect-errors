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

export const longRunningTask = Effect.withSpan('longRunningTask')(
  Effect.all([filename(fileName), Effect.sleep('2 seconds'), readUser]),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default longRunningTask;
