import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { fromPromiseTask } from './from-promise';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('from-promise task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occurred'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed(' FetchError '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright('• TypeError: fetch failed'),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at fromPromiseTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at fetchUser`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      `${chalk.whiteBright(
        `      ${chalk.blue('userId')}${chalk.gray(':')} 123`,
      )}`,
    );
  });

  it('should display the stack', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Stacktrace');
    expect(result).toChalkMatch(/│ at /);
  });
});
