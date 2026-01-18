import { pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeConsoleTestLayer } from '@tests/layers';
import { effectCause } from '@tests/runners';
import { makeTaskWithCollectedErrors, stripAnsiCodes } from '@tests/util';

import { runPromise } from '../runners/run-promise.js';
import { withoutSpansTask } from './without-spans.js';

describe('without-spans task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pretty-print', () => {
    const { ConsoleTestLayer } = makeConsoleTestLayer();
    const task = pipe(withoutSpansTask, ConsoleTestLayer);

    it('should display the error', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);

      expect(result).toContain(' FileError ');
      expect(result).toContain(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      );
    });

    it('should not display any span', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).not.toContain(/◯/);
      expect(raw).not.toContain(/│ {2}/);
      expect(raw).not.toContain(/├/);
      expect(raw).not.toContain(/╰/);
    });

    it('should not display sources', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).not.toContain('Sources 🕵️');
      expect(raw).toContain('Consider using spans to improve errors reporting');
    });

    it('should display the stack', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause, { hideStackTrace: false });
      const raw = stripAnsiCodes(result);

      expect(raw).not.toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
      expect(result).toMatch(
        /│ at catcher (.*\/effect-errors\/src\/examples\/without-spans.ts:14:17)/,
      );
    });
  });

  describe('pretty-print from captured errors', () => {
    it('should display the error', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(withoutSpansTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];

      expect(message).toContain(' FileError ');
      expect(message).toContain(
        " • Error: ENOENT: no such file or directory, open 'cool.ts'",
      );
    });

    it('should not display any span', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(withoutSpansTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).not.toContain(/◯/);
      expect(raw).not.toContain(/│ {2}/);
      expect(raw).not.toContain(/├/);
      expect(raw).not.toContain(/╰/);
    });

    it('should not display sources', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(withoutSpansTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).not.toContain('Sources 🕵️');
      expect(raw).toContain('Consider using spans to improve errors reporting');
    });

    it('should display the stack', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withoutSpansTask,
        { hideStackTrace: false },
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).not.toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
      expect(message).toMatch(
        /│ at catcher (.*\/src\/examples\/without-spans.ts:14:17)/,
      );
    });
  });
});
