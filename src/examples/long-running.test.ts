import { Duration, Effect, Fiber, TestClock, TestContext, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';

describe('long-running task', () => {
  const longRunningTaskEffect = async () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const { longRunningTask } = await import('./long-running.js');
    const task = pipe(longRunningTask, Effect.provide(LoggerTestLayer));

    return Effect.gen(function* () {
      const f = yield* pipe(task, Effect.fork);
      yield* TestClock.adjust(Duration.seconds(2));

      return yield* Fiber.join(f);
    }).pipe(
      Effect.catchAllCause((e) => Effect.fail(e)),
      Effect.flip,
      Effect.provide(TestContext.TestContext),
    );
  };

  it('should display the error', async () => {
    const effect = await longRunningTaskEffect();
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' SomethingBad ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const effect = await longRunningTaskEffect();
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ long-running-task');
    expect(raw).toContain('╰─ read-user');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display sources by default', async () => {
    const effect = await longRunningTaskEffect();
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).not.toContain('Node Stacktrace 🚨');
    expect(result).toMatch(
      /\/effect-errors\/src\/examples\/long-running.ts:14:19/,
    );
  });

  it('should display node stack', async () => {
    const effect = await longRunningTaskEffect();
    const cause = await Effect.runPromise(effect);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { hideStackTrace: false });
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).toContain('Node Stacktrace 🚨');
    expect(result).toMatch(
      /\/effect-errors\/src\/examples\/long-running.ts:14:19/,
    );
  });
});
