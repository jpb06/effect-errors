import chalk from 'chalk';

export const formatFailuresTitle = (
  errorType: unknown,
  message: unknown,
  failuresLength: number,
  failureIndex: number,
) =>
  '💥 ' +
  (failuresLength > 1
    ? chalk.bgRed.whiteBright(` #${failureIndex + 1} -`)
    : '') +
  chalk.bgRed.whiteBright(
    ` ${(errorType as string | undefined) ?? 'Unknown error'} `,
  ) +
  chalk.bold.whiteBright(` • ${message as string}`) +
  '\r\n';
