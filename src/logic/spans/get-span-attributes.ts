import chalk from 'chalk';

import { splitSpansAttributesByTypes } from './split-spans-attributes-by-type';

const maybePrintPipe = (isLastEntry: boolean) =>
  isLastEntry ? ' ' : chalk.gray('│');

export const getSpanAttributes = (
  allAttributes: ReadonlyMap<string, unknown>,
  isLastEntry: boolean,
) => {
  if (allAttributes.size === 0) {
    return { formattedAttributes: '', stack: [] };
  }

  const { attributes, stacktrace } = splitSpansAttributesByTypes(allAttributes);

  const formattedAttributes = Array.from(attributes)
    .map(
      ([key, value]) =>
        `${maybePrintPipe(isLastEntry)}     ${chalk.blue(key)}${chalk.gray(':')} ${value as string}`,
    )
    .join('\r\n');

  return {
    formattedAttributes: `\r\n${formattedAttributes}`,
    stack: stacktrace,
  };
};
