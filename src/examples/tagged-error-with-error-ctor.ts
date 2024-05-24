import { fileURLToPath } from 'node:url';

import { Effect } from 'effect';
import fs from 'fs-extra';

import { TaggedErrorWithErrorCtor } from './errors/tagged-error-with-error-ctor.js';
import { filename } from './util/filename.effect.js';

const fileName = fileURLToPath(import.meta.url);

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise<
    {
      id: string;
      name: string;
    },
    TaggedErrorWithErrorCtor
  >({
    try: async () => await fs.readJson('./src/examples/data/yolo.json'),
    catch: (e) => new TaggedErrorWithErrorCtor(e),
  }),
);

export const withTaggedErrorTask = Effect.withSpan('withTaggedErrorTask')(
  Effect.all([filename(fileName), readUser]),
);

export default withTaggedErrorTask;
