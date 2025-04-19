import { durationRegex } from '@tests/regex';
import { effectCause } from '@tests/runners';
import { stripAnsiCodes } from '@tests/util';
import { pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeConsoleTestLayer } from '@tests/layers';

import { withPlainObjectErrorTask } from './plain-object-error.js';

describe('plain-object-error task', () => {
  const { ConsoleTestLayer } = makeConsoleTestLayer();
  const task = pipe(withPlainObjectErrorTask, ConsoleTestLayer);

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' BigBadError ');
    expect(result).toContain(' • Oh no!');
  });

  it('should display spans', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ read-user');
    expect(raw).toContain('╰─ with-plain-object-error-task');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display sources by default', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).not.toContain('Node Stacktrace 🚨');
  });

  it('should not display any stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { hideStackTrace: false });

    expect(result).not.toContain('Node Stacktrace 🚨');
  });
});
