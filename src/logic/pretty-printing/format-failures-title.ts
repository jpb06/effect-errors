import color from 'picocolors';

export const formatFailuresTitle = (
  errorType: unknown,
  message: unknown,
  failuresLength: number,
  failureIndex: number,
) =>
  '💥 ' +
  (failuresLength > 1
    ? color.bgRed(color.white(` #${failureIndex + 1} -`))
    : '') +
  color.bgRed(
    color.white(` ${(errorType as string | undefined) ?? 'Unknown error'} `),
  ) +
  color.bold(color.white(` • ${message as string}`)) +
  '\r\n';
