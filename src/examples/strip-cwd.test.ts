import { describe, expect, it, vi } from 'vitest';

import { Effect, pipe } from 'effect';
import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { mockProcess } from '../tests/mocks/process.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withCwdStrippingTask } from './strip-cwd.js';

mockProcess({
  cwd: vi.fn(() => '/Users/jpb06/repos/perso/effect-errors'),
});

describe('strip-cwd task', () => {
  const { LoggerTestLayer } = makeLoggerTestLayer({});
  const task = pipe(withCwdStrippingTask, Effect.provide(LoggerTestLayer));

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toContain(' SomethingBad ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ ./src/examples/strip-cwd/task.ts');
    expect(raw).toContain('╰─ ./src/examples/strip-cwd.ts');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).toContain('Node Stacktrace 🚨');
    expect(raw).toMatch(/│ at .*\/src\/examples\/strip-cwd\.ts:14:19/);
    expect(raw).toMatch(/│ at .*\/src\/examples\/strip-cwd\.ts:23:10/);
    expect(raw).toMatch(/│ at .*\/src\/examples\/strip-cwd\.ts:16:10/);
  });
});
