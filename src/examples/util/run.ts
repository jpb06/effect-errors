import path from 'node:path';

import { runPromise } from '../../runners/run-promise.js';

(async () => {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  const file = process.argv[2];
  const stripCwd = process.argv[3] === 'strip';

  const task = await import(path.join('..', file));

  await runPromise(task.default as never, {
    stripCwd,
  });
})();
