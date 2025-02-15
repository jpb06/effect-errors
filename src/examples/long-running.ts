import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { SchemaError } from './errors/schema-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readFileEffect = pipe(
  Effect.tryPromise({
    try: async () => await readFile('cool.ts', { encoding: 'utf-8' }),
    catch: (e) => new SchemaError({ cause: e }),
  }),
  Effect.withSpan('read-file'),
);

export const longRunningTask = pipe(
  Effect.all([filename(fileName), Effect.sleep('2 seconds'), readFileEffect]),
  Effect.withSpan('long-running-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default longRunningTask;
