import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withPlainObjectErrorTask } from './plain-object-error.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('plain-object-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' BigBadError ');
    expect(result).toContain(' • Oh no!');
  });

  it('should display spans', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at withPlainObjectErrorTask');
    expect(raw).toContain('╰─ at readUser');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should not display any stack', async () => {
    const cause = await effectCause(withPlainObjectErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).not.toContain('🚨 Node Stacktrace');
  });
});
