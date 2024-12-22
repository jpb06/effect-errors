import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runPromise } from '../runners/run-promise.js';
import { makeLoggerTestLayer } from '../tests/layers/logger.test-layer.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';
import { makeTaskWithCollectedErrors } from '../tests/util/make-task-with-collected-errors.js';
import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withParallelErrorsTask } from './parallel-errors.js';

describe('parallel-errors task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pretty-print', () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const task = pipe(withParallelErrorsTask, Effect.provide(LoggerTestLayer));

    it('should report three errors', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);

      expect(result).toContain('3 errors occured');
    });

    it('should display the errors', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('#1 - UserNotFound');
      expect(raw).toContain('#2 - UserNotFound');
      expect(raw).toContain('#3 - UserNotFound');

      expect(result).toContain(' • Oh no, this user does no exist!');
    });

    it('should display spans', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(result).toContain('◯');
      expect(raw).toContain('├─ with-parallel-errors-task');
      expect(raw).toContain('├─ parallel-get');
      expect(raw).toContain('╰─ read-user');
      expect(raw.match(durationRegex)).toHaveLength(9);
    });

    it('should display span attributes', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('│    names: yolo,bro,cool');
      expect(raw).toContain('     name: yolo');
      expect(raw).toContain('     name: bro');
      expect(raw).toContain('     name: cool');
    });

    it('should display sources by default', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).not.toContain('Node Stacktrace 🚨');
      expect(result).toContain('│ at parallelGet');
      expect(result).toContain('│ at readUser');
    });

    it('should display node stack', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause, { hideStackTrace: false });
      const raw = stripAnsiCodes(result);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
      expect(result).toContain('│ at parallelGet');
      expect(result).toContain('│ at readUser');
    });
  });

  describe('pretty-print from captured errors', () => {
    it('should report three errors', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];

      expect(message).toContain('3 errors occured');
    });

    it('should display the errors', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain(' #1 - UserNotFound ');
      expect(raw).toContain(' #2 - UserNotFound ');
      expect(raw).toContain(' #3 - UserNotFound ');
      expect(raw).toContain(' • Oh no, this user does no exist!');
    });

    it('should display spans', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('◯');
      expect(raw).toContain('├─ with-parallel-errors-task');
      expect(raw).toContain('├─ parallel-get');
      expect(raw).toContain('╰─ read-user');
      expect(raw.match(durationRegex)).toHaveLength(9);
    });

    it('should display span attributes', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('│    names: yolo,bro,cool');
      expect(raw).toContain('     name: yolo');
      expect(raw).toContain('     name: bro');
      expect(raw).toContain('     name: cool');
    });

    it('should display sources by default', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).not.toContain('Node Stacktrace 🚨');
      expect(raw).toContain('│ at parallel-get');
      expect(raw).toContain('│ at read-user');
    });

    it('should display node stack', async () => {
      const { task, errorMock } = makeTaskWithCollectedErrors(
        withParallelErrorsTask,
        { hideStackTrace: false },
      );
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];
      const raw = stripAnsiCodes(message);

      expect(raw).toContain('Sources 🕵️');
      expect(raw).toContain('Node Stacktrace 🚨');
      expect(raw).toContain('│ at parallel-get');
      expect(raw).toContain('│ at read-user');
    });
  });
});
