import { Effect } from 'effect';

import { filename } from './util/filename.effect.js';

const readUser = Effect.withSpan('readUser')(
  Effect.fail({ _tag: 'BigBadError', message: 'Oh no!' }),
);

export const withPlainObjectErrorTask = Effect.withSpan(
  'withPlainObjectErrorTask',
)(Effect.all([filename(__filename), readUser]));

export default withPlainObjectErrorTask;
