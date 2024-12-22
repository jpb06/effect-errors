import { describe, expect, it } from 'vitest';

import { Effect, pipe } from 'effect';
import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withMetaTaggedErrorTask } from './tagged-error-with-meta.js';

describe('tagged-error-with-meta task', () => {
  const { LoggerTestLayer } = makeLoggerTestLayer({});
  const task = pipe(withMetaTaggedErrorTask, Effect.provide(LoggerTestLayer));

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' WithMeta ');
    expect(result).toContain(' • Oh no! I failed!');
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ with-meta-tagged-error-task');
    expect(raw).toContain('╰─ sub-task');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('│    struff: awoowoo');
    expect(raw).toContain('     cool: true');
    expect(raw).toContain('     yolo: bro');
  });

  it('should display the stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-meta\.ts:11:15/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-meta\.ts:19:10/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-meta\.ts:12:10/,
    );
  });
});
