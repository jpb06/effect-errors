import { Effect } from 'effect';

import { TaggedErrorWithMeta } from './errors/tagged-error-with-meta';
import { filename } from './util/filename.effect';

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
