import { Console } from 'effect';

const cwdRegex = new RegExp(process.cwd(), 'g');

export const filename = (path: string) =>
  Console.info(`\r\n📁 ${path.replace(cwdRegex, '.')}`);
