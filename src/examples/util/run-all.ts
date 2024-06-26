import path from 'path';

import { readdir } from 'fs-extra';

import { runPromise } from '../../index.js';

void (async () => {
  const files = await readdir('./src/examples');
  for (const file of files) {
    if (
      file.endsWith('.ts') &&
      file !== 'index.ts' &&
      !file.endsWith('.test.ts')
    ) {
      const task = await import(path.join('..', file));

      try {
        await runPromise(task.default as never);
      } catch (e) {}
    }
  }
})();
