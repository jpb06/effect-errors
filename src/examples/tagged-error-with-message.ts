import { Effect } from 'effect';

import { runSync } from '../runners/run-sync';

import { TaggedErrorWithMessage } from './errors/tagged-error-with-message';
import { filename } from './util/filename.effect';

const subTask = Effect.withSpan('subTask')(
  Effect.fail(new TaggedErrorWithMessage('Oh no! I failed!')),
);

const mainTask = Effect.withSpan('mainTask')(
  Effect.all([filename(__filename), subTask]),
);

runSync(mainTask);
