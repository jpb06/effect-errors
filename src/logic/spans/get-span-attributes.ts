import color from 'picocolors';

import { splitSpansAttributesByTypes } from './split-spans-attributes-by-type.js';

const maybePrintPipe = (isLastEntry: boolean) =>
  isLastEntry ? ' ' : color.gray('│');

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
        `${maybePrintPipe(isLastEntry)}     ${color.blue(key)}${color.gray(':')} ${value as string}`,
    )
    .join('\r\n');

  return {
    formattedAttributes: `${formattedAttributes.length > 0 ? '\r\n' : ''}${formattedAttributes}`,
    stack: stacktrace,
  };
};
