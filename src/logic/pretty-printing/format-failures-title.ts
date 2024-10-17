import color from 'picocolors';

export const formatFailuresTitle = (
  errorType: unknown,
  message: unknown,
  failuresLength: number,
  failureIndex: number,
) => {
  const failuresCount =
    failuresLength > 1
      ? color.bgRed(color.white(` #${failureIndex + 1} -`))
      : '';
  const type = color.bgRed(
    color.white(` ${(errorType as string | undefined) ?? 'Unknown error'} `),
  );
  const formattedMessage = color.bold(color.white(` • ${message as string}`));

  return `💥 ${failuresCount}${type}${formattedMessage}\r\n`;
};
