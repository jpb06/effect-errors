export const bigIntReplacer = (_: string, value: unknown) => {
  if (typeof value === 'bigint') {
    return {
      type: 'bigint',
      value: value.toString(),
    };
  }
  return value;
};
