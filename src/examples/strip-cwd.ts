import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';
import fs from 'fs-extra';

import { SchemaError } from './errors/schema-error.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan(
  '/Users/jpb06/repos/perso/effect-errors/src/examples/strip-cwd.ts',
)(
  Effect.tryPromise({
    try: async () => await fs.readJson('cool.ts'),
    catch: (e) => new SchemaError({ cause: e }),
  }),
);

export const withCwdStrippingTask = Effect.withSpan(
  '/Users/jpb06/repos/perso/effect-errors/src/examples/strip-cwd/task.ts',
)(Effect.all([filename(fileName), readUser]));

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withCwdStrippingTask;
