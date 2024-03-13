import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { effectCause } from '../tests/runners/effect-cause';
import { regex } from '../tests/util/regex';

import { withMetaTaggedErrorTask } from './tagged-error-with-meta';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('tagged-error-with-meta task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toMatch(
      regex(chalk.bold.yellowBright.underline('1 error occurred')),
    );
  });

  it('should display the error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(regex(chalk.bgRed(' WithMeta ')));
    expect(result).toMatch(regex(chalk.bold.whiteBright('• Oh no! I failed!')));
  });

  it('should display spans', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(regex(chalk.gray('◯')));
    expect(result).toMatch(
      regex(
        chalk.whiteBright(
          `${chalk.gray('├')}${chalk.gray('─')} at withMetaTaggedErrorTask`,
        ),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at subTask`),
      ),
    );
    expect(result).toMatch(/~ \dms/);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch(
      regex(
        `${chalk.whiteBright(
          `${chalk.gray('│')}     ${chalk.blue('struff')}${chalk.gray(':')} awoowoo`,
        )}`,
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`      ${chalk.blue('cool')}${chalk.gray(':')} true`),
      ),
    );
    expect(result).toMatch(
      regex(
        chalk.whiteBright(`      ${chalk.blue('yolo')}${chalk.gray(':')} bro`),
      ),
    );
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toMatch('🚨 Stacktrace');
    expect(result).toMatch(/🭳 at /);
  });
});
