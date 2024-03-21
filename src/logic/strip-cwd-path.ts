const cwdRegex = global.process ? new RegExp(global.process.cwd(), 'g') : null;

export const stripCwdPath = (path: string) =>
  cwdRegex === null ? path : path.replace(cwdRegex, '.');
