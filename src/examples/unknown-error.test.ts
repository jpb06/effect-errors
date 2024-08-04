import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { unknownErrorTask } from './unknown-error.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('unknown-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(unknownErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(unknownErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' UnknownException '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      ),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(unknownErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at unknownErrorTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at readUser`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(unknownErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);

    expect(result).toChalkMatch('🚨 Effect Stacktrace');
    expect(result).toChalkMatch(/│ at \//);
  });
});
