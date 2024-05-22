import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { mockProcess } from '../tests/mocks/process.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { withCwdStrippingTask } from './strip-cwd.js';

void mockProcess({
  cwd: vi.fn(() => '/Users/jpb06/repos/perso/effect-errors'),
});
void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('strip-cwd task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' SomethingBad '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      ),
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

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

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);

    expect(result).toChalkMatch('🚨 Effect Stacktrace');
  });
});
