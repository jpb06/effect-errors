import path from 'path';

import { runPromise } from '../../runners/run-promise';

(async () => {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  const file = process.argv[2];
  const stripCwd = process.argv[3] === 'strip';

  const task = await import(path.join('..', file));

  await runPromise(task.default, {
    stripCwd,
  });
})();
