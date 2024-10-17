import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';

import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan('readUser')(
  Effect.fail({ _tag: 'BigBadError', message: 'Oh no!' }),
);

export const withPlainObjectErrorTask = Effect.withSpan(
  'withPlainObjectErrorTask',
)(Effect.all([filename(fileName), readUser]));

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withPlainObjectErrorTask;
