import { Effect } from 'effect';

import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(Effect.fail('Oh no!'));

export const withStringErrorTask = Effect.withSpan('withStringErrorTask')(
  Effect.all([filename(__filename), readUser]),
);

export default withStringErrorTask;
