const cwdRegex = process ? new RegExp(process.cwd(), 'g') : null;

export const stripCwdPath = (path: string) =>
  cwdRegex === null ? path : path.replace(cwdRegex, '.');
