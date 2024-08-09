export const stripAnsiCodes = (data: string) =>
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  data.replace(/\u001b[^m]*?m/g, '');
