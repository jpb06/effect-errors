import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withSchemaErrorTask } from './schema-error.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('schema-error task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' SomethingBad ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at withSchemaErrorTask');
    expect(raw).toContain('╰─ at readUser');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withSchemaErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Effect Stacktrace');
    expect(result).toMatch(
      /│ at catcher \(.*\/effect-errors\/src\/examples\/schema-error\.ts:14:19\)/,
    );
  });
});
