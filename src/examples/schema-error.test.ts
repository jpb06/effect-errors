import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { effectCause } from '../tests/runners/effect-cause';
import { regex } from '../tests/util/regex';

import { withSchemaErrorTask } from './schema-error';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('schema-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toMatch(
      regex(chalk.bold.yellowBright.underline('1 error occurred')),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

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
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(regex(chalk.gray('◯')));
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('├')}${chalk.gray('─')} at withSchemaErrorTask`,
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

  it('should display the stack', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch('🚨 Stacktrace');
    expect(result).toMatch(/🭳 at /);
  });
});
