import { Effect } from 'effect';

import { runSync } from '../runners/run-sync';

import { TaggedErrorWithMeta } from './errors/tagged-error-with-meta';
import { filename } from './util/filename.effect';

const subTask = Effect.withSpan('subTask', {
  attributes: {
    cool: true,
    yolo: 'bro',
  },
})(Effect.fail(new TaggedErrorWithMeta({ cause: 'Oh no! I failed!' })));

const mainTask = Effect.withSpan('mainTask', {
  attributes: {
    struff: 'awoowoo',
  },
})(Effect.all([filename(__filename), subTask]));

runSync(mainTask);
