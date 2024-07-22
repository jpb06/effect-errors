import { describe, expect, it, vi } from 'vitest';

import { captureErrors } from './capture-errors.js';
import { fromPromiseTask } from './examples/from-promise.js';
import { withParallelErrorsTask } from './examples/parallel-errors.js';
import { fromPromiseTaskSources } from './tests/mock-data/from-promises-sources.mock-data.js';
import { parallelErrorsTaskSources } from './tests/mock-data/parallel-errors.mock-data.js';
import { mockConsole } from './tests/mocks/console.mock.js';
import { effectCause } from './tests/runners/effect-cause.js';

void mockConsole({
  info: vi.fn(),
});

describe('captureErrors function', () => {
  it('should capture errors from promises', async () => {
    const cause = await effectCause(fromPromiseTask);

    const result = await captureErrors(cause, {
      reverseSpans: false,
      stripCwd: false,
    });

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

    expect(spans?.[0].attributes).toHaveAttributes([
      {
        key: 'userId',
        value: '123',
      },
    ]);
    expect(spans?.[1].attributes).toHaveAttributes([]);
    expect(stack).not.toHaveLength(0);

    expect(sources?.length).toBe(2);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (let i = 0; i < sources!.length; i++) {
      const current = sources?.at(i);
      const expected = fromPromiseTaskSources[i];
      expect(current?.runPath.endsWith(expected.runPath)).toBe(true);
      expect(current?.sourcesPath).toBe(undefined);
      expect(current?.source).toStrictEqual(expected?.source);
    }
  });

  // eslint-disable-next-line complexity
  it('should capture parallel errors', async () => {
    const cause = await effectCause(withParallelErrorsTask);

    const result = await captureErrors(cause, {
      reverseSpans: false,
      stripCwd: false,
    });

    expect(result.interrupted).toBe(false);
    expect(result.errors).toHaveLength(3);

    const firstError = result.errors[0];
    expect(firstError.errorType).toBe('UserNotFound');
    expect(firstError.isPlainString).toBe(false);
    expect(firstError.message).toStrictEqual('Oh no, this user does no exist!');

    expect(firstError.spans).toHaveLength(3);
    expect(firstError.spans?.[0].name).toBe('readUser');
    expect(firstError.spans?.[0].attributes).toHaveAttributes([
      {
        key: 'name',
        value: 'yolo',
      },
    ]);
    expect(firstError.spans?.[1].name).toBe('parallelGet');
    expect(firstError.spans?.[1].attributes).toHaveAttributes([
      {
        key: 'names',
        value: ['yolo', 'bro', 'cool'],
      },
    ]);
    expect(firstError.spans?.[2].name).toBe('withParallelErrorsTask');
    expect(firstError.spans?.[2].attributes).toHaveAttributes([]);

    const sources0 = firstError.sources?.at(0);
    const expected0 = parallelErrorsTaskSources[0];
    expect(sources0?.runPath.endsWith(expected0.runPath)).toBe(true);
    expect(sources0?.sourcesPath).toBe(undefined);
    expect(sources0?.source).toStrictEqual(expected0?.source);

    // ------------------------------------------------------------------------------

    const secondError = result.errors[1];
    expect(secondError.errorType).toBe('UserNotFound');
    expect(secondError.isPlainString).toBe(false);
    expect(secondError.message).toStrictEqual(
      'Oh no, this user does no exist!',
    );

    expect(secondError.spans).toHaveLength(3);
    expect(secondError.spans?.[0].name).toBe('readUser');
    expect(secondError.spans?.[0].attributes).toHaveAttributes([
      {
        key: 'name',
        value: 'bro',
      },
    ]);
    expect(secondError.spans?.[1].name).toBe('parallelGet');
    expect(secondError.spans?.[1].attributes).toHaveAttributes([
      {
        key: 'names',
        value: ['yolo', 'bro', 'cool'],
      },
    ]);
    expect(secondError.spans?.[2].name).toBe('withParallelErrorsTask');
    expect(secondError.spans?.[2].attributes).toHaveAttributes([]);

    const sources1 = firstError.sources?.at(1);
    const expected1 = parallelErrorsTaskSources[1];
    expect(sources1?.runPath.endsWith(expected1.runPath)).toBe(true);
    expect(sources1?.sourcesPath).toBe(undefined);
    expect(sources1?.source).toStrictEqual(expected1?.source);

    // ------------------------------------------------------------------------------

    const thirdError = result.errors[2];
    expect(thirdError.errorType).toBe('UserNotFound');
    expect(thirdError.isPlainString).toBe(false);
    expect(thirdError.message).toStrictEqual('Oh no, this user does no exist!');

    expect(thirdError.spans).toHaveLength(3);
    expect(thirdError.spans?.[0].name).toBe('readUser');
    expect(thirdError.spans?.[0].attributes).toHaveAttributes([
      {
        key: 'name',
        value: 'cool',
      },
    ]);
    expect(thirdError.spans?.[1].name).toBe('parallelGet');
    expect(thirdError.spans?.[1].attributes).toHaveAttributes([
      {
        key: 'names',
        value: ['yolo', 'bro', 'cool'],
      },
    ]);
    expect(thirdError.spans?.[2].name).toBe('withParallelErrorsTask');
    expect(thirdError.spans?.[2].attributes).toHaveAttributes([]);

    const sources3 = firstError.sources?.at(2);
    const expected3 = parallelErrorsTaskSources[2];
    expect(sources3?.runPath.endsWith(expected3.runPath)).toBe(true);
    expect(sources3?.sourcesPath).toBe(undefined);
    expect(sources3?.source).toStrictEqual(expected3?.source);
  });
});
