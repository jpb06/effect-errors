import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

import { captureErrors } from './capture-errors.js';
import { fromPromiseTask } from './examples/from-promise.js';
import { withParallelErrorsTask } from './examples/parallel-errors.js';
import { checkParallelErrorsData } from './tests/assertions/check-parallel-errors-data.js';
import { makeLoggerTestLayer } from './tests/layers/logger.test-layer.js';
import { fromPromiseTaskSources } from './tests/mock-data/index.js';
import { effectCause } from './tests/runners/effect-cause.js';

describe('captureErrors function', () => {
  it('should capture errors from promises', async () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const task = pipe(fromPromiseTask, Effect.provide(LoggerTestLayer));
    const cause = await effectCause(task);

    const result = await Effect.runPromise(
      pipe(
        captureErrors(cause, {
          reverseSpans: false,
          stripCwd: false,
        }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(result.interrupted).toBe(false);
    expect(result.errors).toHaveLength(1);

    const { errorType, isPlainString, message, spans, sources, stack } =
      result.errors[0];

    expect(errorType).toBe('FetchError');
    expect(isPlainString).toBe(false);
    expect((message as { toString: () => string }).toString()).toStrictEqual(
      'TypeError: fetch failed',
    );
    expect(spans).toHaveLength(2);
    expect(spans?.[0].name).toBe('fetch-user');

    expect(spans?.[0].attributes).toStrictEqual({ userId: '123' });
    expect(spans?.[1].attributes).toStrictEqual({});
    expect(stack).not.toHaveLength(0);

    expect(sources?.length).toBe(3);
    for (let i = 0; i < sources!.length; i++) {
      const current = sources?.at(i);
      const expected = fromPromiseTaskSources[i];
      expect(current?.runPath.endsWith(expected.runPath)).toBe(true);
      expect(current?.sourcesPath).toBe(undefined);
      expect(current?.source).toStrictEqual(expected?.source);
    }
  });

  it('should capture parallel errors', async () => {
    const { LoggerTestLayer } = makeLoggerTestLayer({});
    const task = pipe(withParallelErrorsTask, Effect.provide(LoggerTestLayer));
    const cause = await effectCause(task);

    const result = await Effect.runPromise(
      pipe(
        captureErrors(cause, {
          reverseSpans: false,
          stripCwd: false,
        }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(result.interrupted).toBe(false);
    expect(result.errors).toHaveLength(3);

    checkParallelErrorsData(result.errors[0], 'yolo');
    checkParallelErrorsData(result.errors[1], 'bro');
    checkParallelErrorsData(result.errors[2], 'cool');
  });

  it('should return no errors if effect is interrupted', async () => {
    const cause = await effectCause(Effect.interrupt);

    const result = await Effect.runPromise(
      pipe(
        captureErrors(cause, {
          reverseSpans: false,
          stripCwd: false,
        }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(result).toStrictEqual({
      errors: [],
      interrupted: true,
    });
  });
});
