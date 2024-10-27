import { fileURLToPath } from 'node:url';

import { Effect, pipe } from 'effect';
import fs from 'fs-extra';

import { TaggedErrorWithErrorCtor } from './errors/tagged-error-with-error-ctor.js';
import { filename } from './util/filename.effect.js';

type User = {
  id: string;
  name: string;
};

const fileName = fileURLToPath(import.meta.url);

const readUser = pipe(
  Effect.tryPromise<User, TaggedErrorWithErrorCtor>({
    try: async () => await fs.readJson('./src/examples/data/yolo.json'),
    catch: (e) => new TaggedErrorWithErrorCtor(e),
  }),
  Effect.withSpan('readUser'),
);

export const withTaggedErrorTask = pipe(
  Effect.all([filename(fileName), readUser]),
  Effect.withSpan('withTaggedErrorTask'),
);

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withTaggedErrorTask;
