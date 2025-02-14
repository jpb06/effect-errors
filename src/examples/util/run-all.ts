import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { Effect, pipe } from 'effect';

import { type Logger, LoggerConsoleLive } from '@dependencies/logger';

import { runPromise } from '../../index.js';

(async () => {
  const files = await readdir('./src/examples');
  for (const file of files) {
    if (
      file.endsWith('.ts') &&
      file !== 'index.ts' &&
      !file.endsWith('.test.ts')
    ) {
      const task: { default: Effect.Effect<unknown, unknown, Logger> } =
        await import(path.join('..', file));

      try {
        await runPromise(pipe(task.default, Effect.provide(LoggerConsoleLive)));
      } catch (_) {
        //  console.error(error);
      }
    }
  }
})();
