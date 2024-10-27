import type { ErrorRelatedSources } from '../../source-maps/get-sources-from-map-file.js';

export const parallelErrorsStack = [
  'at catch (effect-errors/src/examples/parallel-errors.ts:14:21)',
  'at readUser (effect-errors/src/examples/parallel-errors.ts:16:12)',
  'at parallelGet (effect-errors/src/examples/parallel-errors.ts:26:12)',
  'at module code (effect-errors/src/examples/parallel-errors.ts:33:10)',
];

export const parallelErrorsTaskSources: ErrorRelatedSources[] = [
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:14:21',
    sourcesPath: undefined,
    source: [
      { line: 11, code: '  pipe(', column: undefined },
      { line: 12, code: '    Effect.tryPromise({', column: undefined },
      {
        line: 13,
        code: "      try: async () => await Promise.reject('Oh no, this user does no exist!'),",
        column: undefined,
      },
      {
        line: 14,
        code: '      catch: (e) => new UserNotFoundError({ cause: e }),',
        column: 21,
      },
      { line: 15, code: '    }),', column: undefined },
      {
        line: 16,
        code: "    Effect.withSpan('readUser', {",
        column: undefined,
      },
      { line: 17, code: '      attributes: { name },', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:16:12',
    sourcesPath: undefined,
    source: [
      {
        line: 13,
        code: "      try: async () => await Promise.reject('Oh no, this user does no exist!'),",
        column: undefined,
      },
      {
        line: 14,
        code: '      catch: (e) => new UserNotFoundError({ cause: e }),',
        column: undefined,
      },
      { line: 15, code: '    }),', column: undefined },
      {
        line: 16,
        code: "    Effect.withSpan('readUser', {",
        column: 12,
      },
      { line: 17, code: '      attributes: { name },', column: undefined },
      { line: 18, code: '    }),', column: undefined },
      { line: 19, code: '  );', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:26:12',
    sourcesPath: undefined,
    source: [
      {
        line: 23,
        code: '    Effect.all(names.map(readUser), {',
        column: undefined,
      },
      { line: 24, code: "      concurrency: 'unbounded',", column: undefined },
      { line: 25, code: '    }),', column: undefined },
      { line: 26, code: "    Effect.withSpan('parallelGet', {", column: 12 },
      { line: 27, code: '      attributes: { names },', column: undefined },
      { line: 28, code: '    }),', column: undefined },
      { line: 29, code: '  );', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:33:10',
    sourcesPath: undefined,
    source: [
      { line: 30, code: '', column: undefined },
      {
        line: 31,
        code: 'export const withParallelErrorsTask = pipe(',
        column: undefined,
      },
      {
        line: 32,
        code: "  Effect.all([filename(fileName), parallelGet(['yolo', 'bro', 'cool'])]),",
        column: undefined,
      },
      {
        line: 33,
        code: "  Effect.withSpan('withParallelErrorsTask'),",
        column: 10,
      },
      { line: 34, code: ');', column: undefined },
      { line: 35, code: '', column: undefined },
      {
        line: 36,
        code: '// biome-ignore lint/style/noDefaultExport: <explanation>',
        column: undefined,
      },
    ],
  },
];
