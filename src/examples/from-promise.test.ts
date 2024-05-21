import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { fromPromiseTask } from './from-promise';

void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('from-promise task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' FetchError '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(' • TypeError: fetch failed'),
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

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);

    expect(result).toChalkMatch('🚨 Effect Stacktrace');
    expect(result).toChalkMatch(/│ at fetchTask/);
  });
});
