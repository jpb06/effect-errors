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

export const withSchemaErrorTask = pipe(
  Effect.all([filename(fileName), readFileEffect]),
  Effect.withSpan('with-schema-error-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default withSchemaErrorTask;
