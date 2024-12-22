import path from 'node:path';

import { Effect, pipe } from 'effect';
import { type Logger, LoggerConsoleLive } from '../../logic/logger/index.js';
import { runPromise } from '../../runners/run-promise.js';

(async () => {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  const file = process.argv[2];
  const stripCwd = process.argv[3] === 'strip';
  const hideStackTrace = process.argv[4] === 'noStackTrace';

  const task: { default: Effect.Effect<unknown, unknown, Logger> } =
    await import(path.join('..', file));

  await runPromise(pipe(task.default, Effect.provide(LoggerConsoleLive)), {
    stripCwd,
    hideStackTrace,
  });
})();
