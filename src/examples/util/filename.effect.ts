import { Effect } from 'effect';
import { Logger } from '../../logic/logger/index.js';

const cwdRegex = new RegExp(process.cwd(), 'g');

export const filename = (path: string) =>
  Effect.gen(function* () {
    const { info } = yield* Logger;

    info(`\r\n📁 ${path.replace(cwdRegex, '.')}`);
  });
