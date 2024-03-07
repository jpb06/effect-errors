import { Effect } from 'effect';

import { runPromise } from '../runners/run-promise';

import { filename } from './util/filename.effect';

const readUser = Effect.withSpan('readUser')(
  Effect.fail({ _tag: 'BigBadError', message: 'Oh no!' }),
);

const mainTask = Effect.withSpan('mainTask')(
  Effect.gen(function* (_) {
    yield* _(filename(__filename));

    yield* _(readUser);
  }),
);

runPromise(mainTask);
