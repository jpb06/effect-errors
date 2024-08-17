import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { mockProcess } from '../tests/mocks/process.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withCwdStrippingTask } from './strip-cwd.js';

mockProcess({
  cwd: vi.fn(() => '/Users/jpb06/repos/perso/effect-errors'),
});
mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('strip-cwd task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });

    expect(result).toContain(' SomethingBad ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at ./src/examples/strip-cwd/task.ts');
    expect(raw).toContain('╰─ at ./src/examples/strip-cwd.ts');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withCwdStrippingTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { stripCwd: true, reverseSpans: true });
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('🚨 Node Stacktrace');
    expect(raw).toContain('🚨 Spans Stacktrace');
    expect(raw).toMatch(/│ at .*\/src\/examples\/strip-cwd\.ts:20:44/);
    expect(raw).toMatch(/│ at .*\/src\/examples\/strip-cwd\.ts:11:25/);
  });
});
