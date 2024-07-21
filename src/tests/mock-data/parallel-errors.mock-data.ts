export const parallelErrorsStack = [
  'at readUser (/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:11:10)',
  'at parallelGet (/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:24:10)',
  'at module code (/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:34:46)',
];

export const parallelErrorsTaskSources = [
  {
    runPath:
      '/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:11:10',
    sourcesPath: undefined,
    source: [
      {
        line: 8,
        code: 'const fileName = fileURLToPath(import.meta.url);',
        column: undefined,
      },
      {
        line: 9,
        code: '',
        column: undefined,
      },
      {
        line: 10,
        code: 'const readUser = (name: string) =>',
        column: undefined,
      },
      {
        line: 11,
        code: "  Effect.withSpan('readUser', {",
        column: 10,
      },
      {
        line: 12,
        code: '    attributes: {',
        column: undefined,
      },
      {
        line: 13,
        code: '      name,',
        column: undefined,
      },
      {
        line: 14,
        code: '    },',
        column: undefined,
      },
    ],
  },
  {
    runPath:
      '/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:24:10',
    sourcesPath: undefined,
    source: [
      {
        line: 21,
        code: '  );',
        column: undefined,
      },
      {
        line: 22,
        code: '',
        column: undefined,
      },
      {
        line: 23,
        code: 'const parallelGet = (names: string[]) =>',
        column: undefined,
      },
      {
        line: 24,
        code: "  Effect.withSpan('parallelGet', {",
        column: 10,
      },
      {
        line: 25,
        code: '    attributes: {',
        column: undefined,
      },
      {
        line: 26,
        code: '      names,',
        column: undefined,
      },
      {
        line: 27,
        code: '    },',
        column: undefined,
      },
    ],
  },
  {
    runPath:
      '/Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts:34:46',
    sourcesPath: undefined,
    source: [
      {
        line: 31,
        code: '    }),',
        column: undefined,
      },
      {
        line: 32,
        code: '  );',
        column: undefined,
      },
      {
        line: 33,
        code: '',
        column: undefined,
      },
      {
        line: 34,
        code: "export const withParallelErrorsTask = Effect.withSpan('withParallelErrorsTask')(",
        column: 46,
      },
      {
        line: 35,
        code: "  Effect.all([filename(fileName), parallelGet(['yolo', 'bro', 'cool'])]),",
        column: undefined,
      },
      {
        line: 36,
        code: ');',
        column: undefined,
      },
      {
        line: 37,
        code: '',
        column: undefined,
      },
    ],
  },
];
