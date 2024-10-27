import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withTaggedErrorTask } from './tagged-error-with-error-ctor.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('tagged-error-with-error-ctor task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' OhNo ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open './src/examples/data/yolo.json'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(withTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at withTaggedErrorTask');
    expect(raw).toContain('╰─ at readUser');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Spans Stacktrace');
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-error-ctor\.ts:19:19/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-error-ctor\.ts:26:10/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-error-ctor\.ts:21:10/,
    );
  });
});
