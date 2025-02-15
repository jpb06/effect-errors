import { expect } from 'vitest';

import { parallelErrorsTaskSources } from '@tests/mock-data';

import type { ErrorData } from '../../capture-errors.js';

export const checkParallelErrorsData = (
  { errorType, isPlainString, message, spans, sources }: ErrorData,
  readUserSpanName: 'yolo' | 'bro' | 'cool',
) => {
  expect(errorType).toBe('UserNotFound');
  expect(isPlainString).toBe(false);
  expect(message).toStrictEqual('Oh no, this user does no exist!');

  expect(spans).toHaveLength(3);
  expect(spans?.[0].name).toBe('read-user');
  expect(spans?.[0].attributes).toStrictEqual({
    name: readUserSpanName,
  });
  expect(spans?.[1].name).toBe('parallel-get');
  expect(spans?.[1].attributes).toStrictEqual({
    names: ['yolo', 'bro', 'cool'],
  });
  expect(spans?.[2].name).toBe('with-parallel-errors-task');
  expect(spans?.[2].attributes).toStrictEqual({});

  const sources0 = sources?.at(0);
  const expected0 = parallelErrorsTaskSources[0];
  expect(sources0?.runPath.endsWith(expected0.runPath)).toBe(true);
  expect(sources0?.sourcesPath).toBe(undefined);
  expect(sources0?.source).toStrictEqual(expected0?.source);
};
