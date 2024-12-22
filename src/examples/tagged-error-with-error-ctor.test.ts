import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withTaggedErrorTask } from './tagged-error-with-error-ctor.js';

describe('tagged-error-with-error-ctor task', () => {
  const { LoggerTestLayer } = makeLoggerTestLayer({});
  const task = pipe(withTaggedErrorTask, Effect.provide(LoggerTestLayer));

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' OhNo ');
    expect(result).toContain(
      " • Error: ENOENT: no such file or directory, open './src/examples/data/yolo.json'",
    );
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ with-tagged-error-task');
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
