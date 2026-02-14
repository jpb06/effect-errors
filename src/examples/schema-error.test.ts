import { pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { makeConsoleTestLayer } from '@tests/layers';
import { durationRegex } from '@tests/regex';
import { effectCause } from '@tests/runners';
import { stripAnsiCodes } from '@tests/util';

import { withSchemaErrorTask } from './schema-error.js';

describe('schema-error task', () => {
  const { ConsoleTestLayer } = makeConsoleTestLayer();
  const task = pipe(withSchemaErrorTask, ConsoleTestLayer);

  it('should display the error', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' SomethingBad ');
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
    expect(raw).toContain('├─ read-file');
    expect(raw).toContain('╰─ with-schema-error-task');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display sources by default', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).not.toContain('Node Stacktrace 🚨');
    expect(result).toMatch(
      /│ at catch \(.\/src\/examples\/schema-error\.ts:14:19\)/,
    );
  });

  it('should display node stack', async () => {
    const cause = await effectCause(task);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause, { hideStackTrace: false });
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('Sources 🕵️');
    expect(raw).toContain('Node Stacktrace 🚨');
    expect(result).toMatch(
      /│ at catch \(.*\/effect-errors\/src\/examples\/schema-error\.ts:14:19\)/,
    );
  });
});
