import { splitSpansAttributesByTypes } from '../../../../spans/split-spans-attributes-by-type.js';
import { formatSpanAttributes } from '../../../common/index.js';

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
