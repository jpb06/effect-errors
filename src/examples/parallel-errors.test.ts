import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { withParallelErrorsTask } from './parallel-errors';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('parallel-errors task', () => {
  it('should report three errors', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('3 errors occurred'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      `${chalk.bgRed.whiteBright(' #1 -')}${chalk.bgRed.whiteBright(' UserNotFound ')}`,
    );
    expect(result).toChalkMatch(
      `${chalk.bgRed.whiteBright(' #2 -')}${chalk.bgRed.whiteBright(' UserNotFound ')}`,
    );
    expect(result).toChalkMatch(
      `${chalk.bgRed.whiteBright(' #3 -')}${chalk.bgRed.whiteBright(' UserNotFound ')}`,
    );

    expect(result).toChalkMatch(
      chalk.bold.whiteBright(' • Oh no, this user does no exist!'),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at withParallelErrorsTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('├')}${chalk.gray('─')} at parallelGet`),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at readUser`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      `${chalk.whiteBright(
        `${chalk.gray('│')}     ${chalk.blue('names')}${chalk.gray(':')} yolo,bro,cool`,
      )}`,
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} yolo`),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} bro`),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} cool`),
    );
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Stacktrace');
    expect(result).toChalkMatch(/│ at /);
  });
});
