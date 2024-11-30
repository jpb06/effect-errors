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

export const longRunningTask = pipe(
  Effect.all([filename(fileName), Effect.sleep('2 seconds'), readUser]),
  Effect.withSpan('longRunningTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default longRunningTask;
