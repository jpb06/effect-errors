import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { fromPromiseTask } from './from-promise.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('from-promise task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' FetchError ');
    expect(result).toContain(' • TypeError: fetch failed');
  });

  it('should display spans', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at fromPromiseTask');
    expect(raw).toContain('╰─ at fetchUser');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain(`      userId: 123`);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(fromPromiseTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Spans Stacktrace');
    expect(raw).toContain('│ at fetchTask');
  });
});
