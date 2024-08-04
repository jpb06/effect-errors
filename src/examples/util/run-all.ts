import path from 'path';

import fs from 'fs-extra';

import { runPromise } from '../../index.js';

(async () => {
  const files = await fs.readdir('./src/examples');
  for (const file of files) {
    if (
      file.endsWith('.ts') &&
      file !== 'index.ts' &&
      !file.endsWith('.test.ts')
    ) {
      const task = await import(path.join('..', file));

      try {
        await runPromise(task.default as never);
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      } catch (_) {}
    }
  }
})();
