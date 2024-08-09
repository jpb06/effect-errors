import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withoutSpansTask } from './without-spans.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('without-spans task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' FileError ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should not display any span', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).not.toContain(/◯/);
    expect(raw).not.toContain(/│ {2}/);
    expect(raw).not.toContain(/├/);
    expect(raw).not.toContain(/╰/);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withoutSpansTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).not.toContain('🚨 Effect Stacktrace');
    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toMatch(
      /│ at catcher (.*\/effect-errors\/src\/examples\/without-spans.ts:14:17)/,
    );
  });
});
