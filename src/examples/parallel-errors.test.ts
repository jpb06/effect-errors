import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withParallelErrorsTask } from './parallel-errors.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('parallel-errors task', () => {
  it('should report three errors', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('3 errors occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('#1 - UserNotFound');
    expect(raw).toContain('#2 - UserNotFound');
    expect(raw).toContain('#3 - UserNotFound');

    expect(result).toContain(' • Oh no, this user does no exist!');
  });

  it('should display spans', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at withParallelErrorsTask');
    expect(raw).toContain('├─ at parallelGet');
    expect(raw).toContain('╰─ at readUser');
    expect(raw.match(durationRegex)).toHaveLength(9);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('│     names: yolo,bro,cool');
    expect(raw).toContain('      name: yolo');
    expect(raw).toContain('      name: bro');
    expect(raw).toContain('      name: cool');
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Effect Stacktrace');
    expect(result).toContain('│ at parallelGet');
    expect(result).toContain('│ at readUser');
  });
});
