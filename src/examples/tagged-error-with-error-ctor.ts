import { Effect } from 'effect';
import { readJson } from 'fs-extra';

import { TaggedErrorWithErrorCtor } from './errors/tagged-error-with-error-ctor';
import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.tryPromise<
    {
      id: string;
      name: string;
    },
    TaggedErrorWithErrorCtor
  >({
    try: async () => await readJson('./src/examples/data/yolo.json'),
    catch: (e) => new TaggedErrorWithErrorCtor(e),
  }),
);

export const withTaggedErrorTask = Effect.withSpan('withTaggedErrorTask')(
  Effect.all([filename(__filename), readUser]),
);

export default withTaggedErrorTask;
