import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(
  Effect.fail({ _tag: 'BigBadError', message: 'Oh no!' }),
  Effect.withSpan('read-user'),
);

export const withPlainObjectErrorTask = pipe(
  Effect.all([filename(fileName), readUser]),
  Effect.withSpan('with-plain-object-error-task'),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default withPlainObjectErrorTask;
