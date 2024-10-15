import { ErrorRelatedSources } from '../../source-maps/get-sources-from-map-file.js';

export const parallelErrorsStack = [
  'at readUser (effect-errors/src/examples/parallel-errors.ts:11:10)',
  'at parallelGet (effect-errors/src/examples/parallel-errors.ts:23:10)',
  'at module code (effect-errors/src/examples/parallel-errors.ts:33:46)',
];

export const parallelErrorsTaskSources: ErrorRelatedSources[] = [
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:18:21',
    sourcesPath: undefined,
    source: [
      { line: 15, code: '  })(', column: undefined },
      { line: 16, code: '    Effect.tryPromise({', column: undefined },
      {
        line: 17,
        code: "      try: async () => await Promise.reject('Oh no, this user does no exist!'),",
        column: undefined,
      },
      {
        line: 18,
        code: '      catch: (e) => new UserNotFoundError({ cause: e }),',
        column: 21,
      },
      { line: 19, code: '    }),', column: undefined },
      { line: 20, code: '  );', column: undefined },
      { line: 21, code: '', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:11:10',
    sourcesPath: undefined,
    source: [
      {
        line: 8,
        code: 'const fileName = fileURLToPath(import.meta.url);',
        column: undefined,
      },
      { line: 9, code: '', column: undefined },
      {
        line: 10,
        code: 'const readUser = (name: string) =>',
        column: undefined,
      },
      { line: 11, code: "  Effect.withSpan('readUser', {", column: 10 },
      { line: 12, code: '    attributes: {', column: undefined },
      { line: 13, code: '      name,', column: undefined },
      { line: 14, code: '    },', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:23:10',
    sourcesPath: undefined,
    source: [
      { line: 20, code: '  );', column: undefined },
      { line: 21, code: '', column: undefined },
      {
        line: 22,
        code: 'const parallelGet = (names: string[]) =>',
        column: undefined,
      },
      { line: 23, code: "  Effect.withSpan('parallelGet', {", column: 10 },
      { line: 24, code: '    attributes: {', column: undefined },
      { line: 25, code: '      names,', column: undefined },
      { line: 26, code: '    },', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/parallel-errors.ts:33:46',
    sourcesPath: undefined,
    source: [
      { line: 30, code: '    }),', column: undefined },
      { line: 31, code: '  );', column: undefined },
      { line: 32, code: '', column: undefined },
      {
        line: 33,
        code: "export const withParallelErrorsTask = Effect.withSpan('withParallelErrorsTask')(",
        column: 46,
      },
      {
        line: 34,
        code: "  Effect.all([filename(fileName), parallelGet(['yolo', 'bro', 'cool'])]),",
        column: undefined,
      },
      { line: 35, code: ');', column: undefined },
      { line: 36, code: '', column: undefined },
    ],
  },
];
