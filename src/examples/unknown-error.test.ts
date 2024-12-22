import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { unknownErrorTask } from './unknown-error.js';

describe('unknown-error task', () => {
  const { LoggerTestLayer } = makeLoggerTestLayer({});
  const task = pipe(unknownErrorTask, Effect.provide(LoggerTestLayer));

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' UnknownException ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open 'cool.ts'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ unknown-error-task');
    expect(raw).toContain('╰─ read-user');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/unknown-error\.ts:46:10/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/unknown-error\.ts:13:10/,
    );
  });
});
