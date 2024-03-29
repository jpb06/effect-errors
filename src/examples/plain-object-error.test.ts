import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { withPlainObjectErrorTask } from './plain-object-error';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('plain-object-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occurred'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed(' BigBadError '));
    expect(result).toChalkMatch(chalk.bold.whiteBright('• Oh no!'));
  });

  it('should display spans', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at withPlainObjectErrorTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at readUser`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should not display any stack', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).not.toChalkMatch('🚨 Stacktrace');
  });
});
