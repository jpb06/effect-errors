import { Effect } from 'effect';

const cwdRegex = new RegExp(process.cwd(), 'g');

export const filename = (path: string) =>
  Effect.sync(() => {
    console.info(`\r\n📁 ${path.replace(cwdRegex, '.')}`);
  });
