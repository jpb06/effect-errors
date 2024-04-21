import chalk from 'chalk';

export const getSpanAttributes = (
  attributes: ReadonlyMap<string, unknown>,
  isLastEntry: boolean,
) => {
  if (attributes.size === 0) {
    return '';
  }

  const formattedAttributes = Array.from(attributes.entries())
    .map(
      ([key, value]) =>
        `${isLastEntry ? ' ' : chalk.gray('│')}     ${chalk.blue(key)}${chalk.gray(':')} ${value as string}`,
    )
    .join('\r\n');

  return `\r\n${formattedAttributes}`;
};
