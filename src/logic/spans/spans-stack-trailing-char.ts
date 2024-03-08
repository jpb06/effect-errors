import chalk from 'chalk';

export const spanStackTrailingChar = (isLastEntry: boolean) =>
  isLastEntry ? chalk.gray('╰') : chalk.gray('├');
