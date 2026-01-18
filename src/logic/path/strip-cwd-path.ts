const cwdRegex =
  globalThis.process === undefined
    ? null
    : new RegExp(globalThis.process.cwd(), 'g');

export const stripCwdPath = (path: string): string =>
  cwdRegex === null ? path : path.replace(cwdRegex, '.');
