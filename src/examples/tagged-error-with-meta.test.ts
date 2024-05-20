import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';
import { effectCause } from '../tests/runners/effect-cause';

import { withMetaTaggedErrorTask } from './tagged-error-with-meta';

void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('tagged-error-with-meta task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' WithMeta '));
    expect(result).toChalkMatch(chalk.bold.whiteBright(' • Oh no! I failed!'));
  });

  it('should display spans', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at withMetaTaggedErrorTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at subTask`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      `${chalk.whiteBright(
        `${chalk.gray('│')}     ${chalk.blue('struff')}${chalk.gray(':')} awoowoo`,
      )}`,
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`      ${chalk.blue('cool')}${chalk.gray(':')} true`),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`      ${chalk.blue('yolo')}${chalk.gray(':')} bro`),
    );
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);
  });
});
