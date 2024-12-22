import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(Effect.fail('Oh no!'), Effect.withSpan('read-user'));

export const withStringErrorTask = pipe(
  Effect.all([filename(fileName), readUser]),
  Effect.withSpan('with-string-error-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default withStringErrorTask;
