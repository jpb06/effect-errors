import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { SchemaError } from './errors/schema-error';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan(
  '/Users/jpb06/repos/perso/effect-errors/src/examples/strip-cwd.ts',
)(
  Effect.tryPromise({
    try: async () => await readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

export const withCwdStrippingTask = Effect.withSpan(
  '/Users/jpb06/repos/perso/effect-errors/src/examples/strip-cwd/task.ts',
)(Effect.all([filename(__filename), readUser]));

export default withCwdStrippingTask;
