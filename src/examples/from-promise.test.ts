import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeLoggerTestLayer } from '@tests/layers';
import { durationRegex } from '@tests/regex';
import { effectCause } from '@tests/runners';
import { makeTaskWithCollectedErrors, stripAnsiCodes } from '@tests/util';

import { runPromise } from '../runners/run-promise.js';
import { fromPromiseTask } from './from-promise.js';

describe('from-promise task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pretty-print', () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const task = pipe(fromPromiseTask, Effect.provide(LoggerTestLayer));

    it('should display the error', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);

      expect(result).toContain(' FetchError ');
      expect(result).toContain(' • TypeError: fetch failed');
    });

    it('should display spans', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(result).toContain('◯');
      expect(raw).toContain('├─ from-promise-task');
      expect(raw).toContain('╰─ fetch-user');
      expect(raw.match(durationRegex)).toHaveLength(2);
    });

    it('should display span attributes', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('    userId: 123');
    });

    it('should display sources by default', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).not.toContain('Node Stacktrace 🚨');
      expect(raw).toContain('│ at fetchTask');
    });

    it('should display node stack', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause, { hideStackTrace: false });
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
      expect(raw).toContain('│ at fetchTask');
    });
  });

  describe('pretty-print from captured errors', () => {
    it('should display the error', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(fromPromiseTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];

      expect(message).toContain(' FetchError ');
      expect(message).toContain(' • TypeError: fetch failed');
    });

    it('should display spans', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(fromPromiseTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('◯');
      expect(raw).toContain('├─ from-promise-task');
      expect(raw).toContain('╰─ fetch-user');
      expect(raw.match(durationRegex)).toHaveLength(2);
    });

    it('should display span attributes', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(fromPromiseTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('    userId: 123');
    });

    it('should display sources by default', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(fromPromiseTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).toContain('│ at module code');
      expect(raw).toContain('/from-promise.ts:38:9');
      expect(raw).toContain('│ at fetch-user');
      expect(raw).toContain('/from-promise.ts:42:12');
      expect(raw).toContain('│ at from-promise-task');
      expect(raw).toContain('/from-promise.ts:63:10');

      expect(raw).not.toContain('Node Stacktrace 🚨');
    });

    it('should display node stack', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(fromPromiseTask, {
        hideStackTrace: false,
      });
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
    });
  });
});
