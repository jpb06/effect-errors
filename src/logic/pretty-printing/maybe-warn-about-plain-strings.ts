import chalk from 'chalk';

export const maybeWarnAboutPlainStrings = (
  d: string[],
  isPlainString: boolean,
) => {
  if (!isPlainString) {
    return;
  }

  d.push(
    `\r\n${chalk.gray('ℹ️  You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.')}`,
  );
};
