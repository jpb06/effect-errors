import { ErrorRelatedSources } from '../../source-maps/get-sources-from-map-file.js';

export const fromPromiseStack = [
  'at fetchTask (effect-errors/src/examples/from-promise.ts:25:10)',
  'at module code (effect-errors/src/examples/from-promise.ts:44:39)',
];

export const fromPromiseTaskSources: ErrorRelatedSources[] = [
  {
    runPath: 'effect-errors/src/examples/from-promise.ts:30:9',
    sourcesPath: undefined,
    source: [
      { line: 27, code: '      try: async () =>', column: undefined },
      {
        line: 28,
        code: '        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),',
        column: undefined,
      },
      { line: 29, code: '      catch: (e) =>', column: undefined },
      {
        line: 30,
        code: '        new FetchError({',
        column: 9,
      },
      { line: 31, code: '          cause: e,', column: undefined },
      { line: 32, code: '        }),', column: undefined },
      { line: 33, code: '    }),', column: undefined },
    ],
  },
  {
    runPath: 'effect-errors/src/examples/from-promise.ts:25:10',
    sourcesPath: undefined,
    source: [
      { line: 22, code: ');', column: undefined },
      { line: 23, code: '', column: undefined },
      {
        line: 24,
        code: 'const fetchTask = (userId: string) =>',
        column: undefined,
      },
      {
        line: 25,
        code: "  Effect.withSpan('fetchUser', { attributes: { userId } })(",
        column: 10,
      },
      { line: 26, code: '    Effect.tryPromise({', column: undefined },
      { line: 27, code: '      try: async () =>', column: undefined },
      {
        line: 28,
        code: '        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),',
        column: undefined,
      },
    ],
  },
  {
    runPath: 'effect-errors/src/examples/from-promise.ts:44:39',
    sourcesPath: undefined,
    source: [
      { line: 41, code: '    }),', column: undefined },
      { line: 42, code: '  );', column: undefined },
      { line: 43, code: '', column: undefined },
      {
        line: 44,
        code: "export const fromPromiseTask = Effect.withSpan('fromPromiseTask')(",
        column: 39,
      },
      { line: 45, code: '  Effect.gen(function* () {', column: undefined },
      { line: 46, code: '    yield* filename(fileName);', column: undefined },
      { line: 47, code: '', column: undefined },
    ],
  },
];
