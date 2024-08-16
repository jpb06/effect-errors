import { Effect } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import { captureErrors } from './capture-errors.js';
import { fromPromiseTask } from './examples/from-promise.js';
import { withParallelErrorsTask } from './examples/parallel-errors.js';
import { checkParallelErrorsData } from './tests/assertions/check-parallel-errors-data.js';
import { fromPromiseTaskSources } from './tests/mock-data/from-promises-sources.mock-data.js';
import { mockConsole } from './tests/mocks/console.mock.js';
import { effectCause } from './tests/runners/effect-cause.js';

mockConsole({
  info: vi.fn(),
});

describe('captureErrors function', () => {
  it('should capture errors from promises', async () => {
    const cause = await effectCause(fromPromiseTask);

    const result = await Effect.runPromise(
      captureErrors(cause, {
        reverseSpans: false,
        stripCwd: false,
      }),
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
    expect(spans?.[0].name).toBe('fetchUser');

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
    const cause = await effectCause(withParallelErrorsTask);

    const result = await Effect.runPromise(
      captureErrors(cause, {
        reverseSpans: false,
        stripCwd: false,
      }),
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
      captureErrors(cause, {
        reverseSpans: false,
        stripCwd: false,
      }),
    );

    expect(result).toStrictEqual({
      errors: [],
      interrupted: true,
    });
  });
});
