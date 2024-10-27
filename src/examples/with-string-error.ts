import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(Effect.fail('Oh no!'), Effect.withSpan('readUser'));

export const withStringErrorTask = pipe(
  Effect.all([filename(fileName), readUser]),
  Effect.withSpan('withStringErrorTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withStringErrorTask;
