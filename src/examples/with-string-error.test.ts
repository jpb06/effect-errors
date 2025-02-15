import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeLoggerTestLayer } from '@tests/layers';
import { effectCause } from '@tests/runners';
import { makeTaskWithCollectedErrors } from '@tests/util';

import { runPromise } from '../runners/run-promise.js';
import { withStringErrorTask } from './with-string-error.js';

describe('with-string-error task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pretty-print', () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const task = pipe(withStringErrorTask, Effect.provide(LoggerTestLayer));

    it('should display the error message', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);

      expect(result).toContain('Oh no!');
    });

    it('should display an info message', async () => {
      const cause = await effectCause(task);

      const { prettyPrint } = await import('./../pretty-print.js');
      const result = prettyPrint(cause);

      expect(result).toContain(
        'ℹ️  You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.',
      );
    });
  });

  describe('pretty-print from captured errors', () => {
    it('should display the error message', async () => {
      const { task, errorMock } =
        makeTaskWithCollectedErrors(withStringErrorTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];

      expect(message).toContain('Oh no!');
    });

    it('should display an info message', async () => {
      const { task, errorMock } =
        makeTaskWithCollectedErrors(withStringErrorTask);
      await runPromise(task);

      expect(errorMock).toHaveBeenCalledTimes(1);
      const message = errorMock.mock.calls[0][0];

      expect(message).toContain(
        'ℹ️  You used a plain string to represent a failure in the error channel (E). You should consider using tagged objects (with a _tag field), or yieldable errors such as Data.TaggedError and Schema.TaggedError for better handling experience.',
      );
    });
  });
});
