import { expect } from 'vitest';

import { type ErrorData } from '../../capture-errors.js';
import { parallelErrorsTaskSources } from '../mock-data/parallel-errors.mock-data.js';

export const checkParallelErrorsData = (
  { errorType, isPlainString, message, spans, sources }: ErrorData,
  readUserSpanName: 'yolo' | 'bro' | 'cool',
) => {
  expect(errorType).toBe('UserNotFound');
  expect(isPlainString).toBe(false);
  expect(message).toStrictEqual('Oh no, this user does no exist!');

  expect(spans).toHaveLength(3);
  expect(spans?.[0].name).toBe('readUser');
  expect(spans?.[0].attributes).toHaveAttributes([
    {
      key: 'name',
      value: readUserSpanName,
    },
  ]);
  expect(spans?.[1].name).toBe('parallelGet');
  expect(spans?.[1].attributes).toHaveAttributes([
    {
      key: 'names',
      value: ['yolo', 'bro', 'cool'],
    },
  ]);
  expect(spans?.[2].name).toBe('withParallelErrorsTask');
  expect(spans?.[2].attributes).toHaveAttributes([]);

  const sources0 = sources?.at(0);
  const expected0 = parallelErrorsTaskSources[0];
  expect(sources0?.runPath.endsWith(expected0.runPath)).toBe(true);
  expect(sources0?.sourcesPath).toBe(undefined);
  expect(sources0?.source).toStrictEqual(expected0?.source);
};
