export const bigIntReplacer = (key: string, value: unknown) => {
  if (typeof value === 'bigint') {
    return {
      type: 'bigint',
      value: value.toString(),
    };
  }
  return value;
};
