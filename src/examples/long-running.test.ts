import chalk from 'chalk';
import { Duration, Effect, Fiber, pipe, TestClock, TestContext } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock';
import { durationRegex } from '../tests/regex/duration.regex';

import { longRunningTask } from './long-running';

void mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('long-running task', () => {
  const effect = Effect.gen(function* () {
    const f = yield* pipe(longRunningTask, Effect.fork);
    yield* TestClock.adjust(Duration.seconds(2));

    return yield* Fiber.join(f);
  }).pipe(
    Effect.catchAllCause((e) => Effect.fail(e)),
    Effect.flip,
    Effect.provide(TestContext.TestContext),
  );

  it('should report one error', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print');
    prettyPrint(cause);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0][0]).toChalkMatch(
      chalk.bold.yellowBright.underline('1 error occured'),
    );
  });

  it('should display the error', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.bgRed.whiteBright(' SomethingBad '));
    expect(result).toChalkMatch(
      chalk.bold.whiteBright(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      ),
    );
  });

  it('should display spans', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch(chalk.gray('◯'));
    expect(result).toChalkMatch(
      chalk.whiteBright(
        `${chalk.gray('├')}${chalk.gray('─')} at longRunningTask`,
      ),
    );
    expect(result).toChalkMatch(
      chalk.whiteBright(`${chalk.gray('╰')}${chalk.gray('─')} at readUser`),
    );
    expect(result).toChalkMatch(durationRegex);
  });

  it('should display the stack', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print');
    const result = prettyPrint(cause);

    expect(result).toChalkMatch('🚨 Node Stacktrace');
    expect(result).toChalkMatch(/│ at /);

    expect(result).toChalkMatch('🚨 Effect Stacktrace');
    expect(result).toChalkMatch(/│ at \//);
  });
});
