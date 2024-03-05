export const filterStack = (stack: string) => {
  const lines = stack.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    out.push(line.replace(/at .*effect_cutpoint.*\((.*)\)/, 'at $1'));

    if (line.includes('effect_cutpoint')) {
      return out.join('\n');
    }
  }

  return out.join('\n');
};
