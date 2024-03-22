import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { mockProcess } from '../tests/mocks/process.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { withCwdStrippingTask } from './strip-cwd';

mockProcess({
  cwd: vi.fn(() => '/Users/jpb06/repos/perso/effect-errors'),
});
mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('strip-cwd task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause, { stripCwd: true });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occurred'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toChalkMatch(chalk.bgRed(' SomethingBad '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(
        "• Error: ENOENT: no such file or directory, open 'cool.ts'",
      ),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at ./src/examples/strip-cwd/task.ts`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('╰')}${chalk.gray('─')} at ./src/examples/strip-cwd.ts`,
      ),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toChalkMatch('🚨 Stacktrace');
    expect(result).toChalkMatch(/│ at /);
  });
});
