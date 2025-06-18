export const stripAnsiCodes = (data: string) =>
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intended
  data.replace(/\u001b[^m]*?m/g, '');
