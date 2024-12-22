import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';

import { TaggedErrorWithMeta } from './errors/tagged-error-with-meta.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const subTask = pipe(
  Effect.fail(new TaggedErrorWithMeta({ cause: 'Oh no! I failed!' })),
  Effect.withSpan('sub-task', {
    attributes: { cool: true, yolo: 'bro' },
  }),
);

export const withMetaTaggedErrorTask = pipe(
  Effect.all([filename(fileName), subTask]),
  Effect.withSpan('with-meta-tagged-error-task', {
    attributes: { struff: 'awoowoo' },
  }),
);

// biome-ignore lint/style/noDefaultExport: run-example
export default withMetaTaggedErrorTask;
