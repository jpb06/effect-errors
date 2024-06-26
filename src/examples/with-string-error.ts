import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';

import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan('readUser')(Effect.fail('Oh no!'));

export const withStringErrorTask = Effect.withSpan('withStringErrorTask')(
  Effect.all([filename(fileName), readUser]),
);

export default withStringErrorTask;
