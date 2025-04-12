import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeLoggerTestLayer } from '@tests/layers';
import { durationRegex } from '@tests/regex';
import { effectCause } from '@tests/runners';
import { stripAnsiCodes } from '@tests/util';

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
    expect(raw).toContain('├─ read-file');
    expect(raw).toContain('╰─ with-tagged-error-task');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(result).toMatch(
      /│ at catcher \(\.\/src\/examples\/tagged-error-with-error-ctor\.ts:15:19\)/,
    );
    expect(result).toMatch(
      /│ at \.\/src\/examples\/tagged-error-with-error-ctor\.ts:22:10/,
    );
    expect(result).toMatch(
      /│ at \.\/src\/examples\/tagged-error-with-error-ctor\.ts:17:10/,
    );
  });
});
