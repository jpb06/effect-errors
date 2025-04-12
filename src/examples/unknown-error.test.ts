import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeLoggerTestLayer } from '@tests/layers';
import { durationRegex } from '@tests/regex';
import { effectCause } from '@tests/runners';
import { stripAnsiCodes } from '@tests/util';

import { unknownErrorTask } from './unknown-error.js';

describe('unknown-error task', () => {
  const { LoggerTestLayer } = makeLoggerTestLayer({});
  const task = pipe(unknownErrorTask, Effect.provide(LoggerTestLayer));

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' UnknownException ');
    expect(result).toContain(' • TypeError: fetch failed');
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ fetch-user');
    expect(raw).toContain('╰─ unknown-error-task');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display the stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(result).toMatch(/│ at .*\/src\/examples\/unknown-error\.ts:53:10/);
    expect(result).toMatch(/│ at .*\/src\/examples\/unknown-error\.ts:30:12/);
  });
});
