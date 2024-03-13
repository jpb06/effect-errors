import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { effectCause } from '../tests/runners/effect-cause';
import { regex } from '../tests/util/regex';

import { withCwdStrippingTask } from './strip-cwd';

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
    expect(vi.mocked(console.error).mock.calls[0][0]).toMatch(
      regex(chalk.bold.yellowBright.underline('1 error occurred')),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toMatch(regex(chalk.bgRed(' SomethingBad ')));
    expect(result).toMatch(
      regex(
        chalk.bold.whiteBright(
          "• Error: ENOENT: no such file or directory, open 'cool.ts'",
        ),
      ),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toMatch(regex(chalk.gray('◯')));
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('├')}${chalk.gray('─')} at ./src/examples/strip-cwd/task.ts`,
        ),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('╰')}${chalk.gray('─')} at ./src/examples/strip-cwd.ts`,
        ),
      ),
    );
    expect(result).toMatch(/~ \dms/);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause, { stripCwd: true });

    expect(result).toMatch('🚨 Stacktrace');
    expect(result).toMatch(/🭳 at /);
  });
});
