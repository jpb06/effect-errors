import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { withoutSpansTask } from './without-spans.js';

void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('without-spans task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' FileError '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      ),
    );
  });

  it('should not display any span', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).not.toChalkMatch(/◯/);
    expect(result).not.toChalkMatch(/│ {2}/);
    expect(result).not.toChalkMatch(/├/);
    expect(result).not.toChalkMatch(/╰/);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);
  });
});
