import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { TaggedErrorWithErrorCtor } from './errors/tagged-error-with-error-ctor.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readFileEffect = pipe(
  Effect.tryPromise<string, TaggedErrorWithErrorCtor>({
    try: async () =>
      await readFile('./src/examples/data/yolo.json', { encoding: 'utf-8' }),
    catch: (e) => new TaggedErrorWithErrorCtor(e),
  }),
  Effect.withSpan('read-file'),
);

export const withTaggedErrorTask = pipe(
  Effect.all([filename(fileName), readFileEffect]),
  Effect.withSpan('with-tagged-error-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default withTaggedErrorTask;
