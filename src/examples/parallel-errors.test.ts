import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { effectCause } from '../tests/runners/effect-cause';
import { regex } from '../tests/util/regex';

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
    expect(vi.mocked(console.error).mock.calls[0][0]).toMatch(
      regex(chalk.bold.yellowBright.underline('3 errors occurred')),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(
      regex(
        `${chalk.bgRed.whiteBright(' #1 -')}${chalk.bgRed(' UserNotFound ')}`,
      ),
    );
    expect(result).toMatch(
      regex(
        `${chalk.bgRed.whiteBright(' #2 -')}${chalk.bgRed(' UserNotFound ')}`,
      ),
    );
    expect(result).toMatch(
      regex(
        `${chalk.bgRed.whiteBright(' #3 -')}${chalk.bgRed(' UserNotFound ')}`,
      ),
    );

    expect(result).toMatch(
      regex(chalk.bold.whiteBright('• Oh no, this user does no exist!')),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(regex(chalk.gray('◯')));
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('├')}${chalk.gray('─')} at withParallelErrorsTask`,
        ),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('├')}${chalk.gray('─')} at parallelGet`,
        ),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at readUser`),
      ),
    );
    expect(result).toMatch(/~ \dms/);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(
      regex(
        `${chalk.whiteBright(
          `${chalk.gray('│')}     ${chalk.blue('names')}${chalk.gray(':')} yolo,bro,cool`,
        )}`,
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} yolo`),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} bro`),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`      ${chalk.blue('name')}${chalk.gray(':')} cool`),
      ),
    );
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch('🚨 Stacktrace');
    expect(result).toMatch(/🭳 at /);
  });
});
