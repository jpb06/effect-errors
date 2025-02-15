import { formatSpanAttributes } from '@pretty-print/common';

import { splitSpansAttributesByTypes } from '@logic/spans';

export const getSpanAttributes = (
  allAttributes: ReadonlyMap<string, unknown>,
  isLastEntry: boolean,
) => {
  if (allAttributes.size === 0) {
    return { formattedAttributes: '', stack: [] };
  }

  const { attributes, stacktrace } = splitSpansAttributesByTypes(allAttributes);

  const formattedAttributes = formatSpanAttributes(
    Object.fromEntries(attributes),
    isLastEntry,
  );

  return {
    formattedAttributes,
    stack: stacktrace,
  };
};
