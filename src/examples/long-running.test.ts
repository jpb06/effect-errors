import { Duration, Effect, Fiber, TestClock, TestContext, pipe } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { longRunningTask } from './long-running.js';

mockConsole({
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

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' SomethingBad ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at longRunningTask');
    expect(raw).toContain('╰─ at readUser');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Effect Stacktrace');
    expect(result).toMatch(
      /\/effect-errors\/src\/examples\/long-running.ts:18:39/,
    );
  });
});
