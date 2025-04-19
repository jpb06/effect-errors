import path from 'node:path';

import type { Effect } from 'effect';

import { runPromise } from '../../runners/run-promise.js';

(async () => {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  const file = process.argv[2];
  const stripCwd = process.argv[3] === 'strip';
  const hideStackTrace = process.argv[4] === 'noStackTrace';

  const task: { default: Effect.Effect<unknown, unknown, never> } =
    await import(path.join('..', file));

  try {
    await runPromise(task.default, {
      stripCwd,
      hideStackTrace,
    });
    // biome-ignore lint/suspicious/noEmptyBlockStatements: /
  } catch (_) {}
})();
