import { readdir } from 'node:fs/promises';
import path from 'node:path';

import type { Effect } from 'effect';

import { runPromise } from '../../index.js';

(async () => {
  const files = await readdir('./src/examples');
  for (const file of files) {
    if (
      file.endsWith('.ts') &&
      file !== 'index.ts' &&
      !file.endsWith('.test.ts')
    ) {
      const task: { default: Effect.Effect<unknown, unknown, never> } =
        await import(path.join('..', file));

      try {
        await runPromise(task.default);
      } catch (_) {
        //  console.error(error);
      }
    }
  }
})();
