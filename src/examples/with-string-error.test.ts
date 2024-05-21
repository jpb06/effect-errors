import chalk from 'chalk';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { effectCause } from '../tests/runners/effect-cause';

import { withStringErrorTask } from './with-string-error';

void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('with-string-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withStringErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error message', async () => {
    const cause = await effectCause(withStringErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(/Oh no!/);
  });

  it('should display an info message', async () => {
    const cause = await effectCause(withStringErrorTask);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(
      chalk.gray(
        'ℹ️  You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.',
      ),
    );
  });
});
