import { Effect } from 'effect';

import { TaggedErrorWithMeta } from './errors/tagged-error-with-meta.js';
import { filename } from './util/filename.effect.js';

const subTask = Effect.withSpan('subTask', {
  attributes: {
    cool: true,
    yolo: 'bro',
  },
})(Effect.fail(new TaggedErrorWithMeta({ cause: 'Oh no! I failed!' })));

export const withMetaTaggedErrorTask = Effect.withSpan(
  'withMetaTaggedErrorTask',
  {
    attributes: {
      struff: 'awoowoo',
    },
  },
)(Effect.all([filename(__filename), subTask]));

export default withMetaTaggedErrorTask;
