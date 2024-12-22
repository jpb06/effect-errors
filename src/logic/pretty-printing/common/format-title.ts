import color from 'picocolors';

export const formatTitle = (errorsCount: number): string[] => {
  if (errorsCount === 1) {
    return [''];
  }

  const libName = color.cyanBright(
    `${color.underline(color.bold('effect-errors'))}`,
  );
  const title = color.bold(
    color.redBright(
      `${errorsCount} error${errorsCount > 1 ? 's' : ''} occured`,
    ),
  );

  return ['', `${libName} ❌ - ${title}`, '', ''];
};
