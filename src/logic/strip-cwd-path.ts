const cwdRegex = new RegExp(process.cwd(), 'g');

export const stripCwdPath = (path: string) => path.replace(cwdRegex, '.');
