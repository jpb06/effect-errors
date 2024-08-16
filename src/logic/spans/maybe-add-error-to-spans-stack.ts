export const removeNodeModulesEntriesFromStack = (stack: string) => {
  const lines = stack.split('\r\n');
  const regex = new RegExp(`${process.cwd()}/.(?![node_modules])`);

  return lines.filter((l) => l.match(regex)).map((l) => l.trimStart());
};

export const maybeAddErrorToSpansStack = (
  stack: string | undefined,
  spanAttributesStack: string[] | undefined,
) => {
  const effectStack: string[] = [];

  if (stack && spanAttributesStack !== undefined) {
    effectStack.push(...removeNodeModulesEntriesFromStack(stack));
  }
  if (spanAttributesStack !== undefined) {
    effectStack.push(...spanAttributesStack);
  }

  return effectStack;
};
