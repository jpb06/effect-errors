import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { withParallelErrorsTask } from './parallel-errors.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('parallel-errors task', () => {
  it('should report three errors', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('3 errors occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
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

    const { prettyPrint } = await import('./../pretty-print.js');
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

    const { prettyPrint } = await import('./../pretty-print.js');
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

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);

    expect(result).toChalkMatch('🚨 Effect Stacktrace');
    expect(result).toChalkMatch(/│ at parallelGet/);
    expect(result).toChalkMatch(/│ at readUser/);
  });
});
