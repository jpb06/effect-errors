import { stripCwdPath } from '../strip-cwd-path.js';

import { stackAtRegex } from './stack-regex.js';

export const filterStack = (stack: string, stripCwd: boolean) => {
  const lines = stack.split('\r\n');
  const out: string[] = [];

  for (const line of lines) {
    out.push(line.replace(/at .*effect_cutpoint.*\((.*)\)/, 'at $1'));

    if (line.includes('effect_cutpoint')) {
      return out.join('\r\n');
    }
  }

  const final = out.join('\r\n').replace(stackAtRegex, '│ at ');

  return stripCwd ? stripCwdPath(final) : final;
};
