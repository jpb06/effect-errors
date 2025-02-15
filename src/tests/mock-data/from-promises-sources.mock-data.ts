import type { ErrorRelatedSources } from '../../source-maps/get-sources-from-map-file.js';

export const fromPromiseStack = [
  'at catch (effect-errors/src/examples/from-promise.ts:38:9)',
  'at fetchTask (effect-errors/src/examples/from-promise.ts:42:12)',
  'at module code (effect-errors/src/examples/from-promise.ts:63:10)',
];

export const fromPromiseTaskSources: ErrorRelatedSources[] = [
  {
    _tag: 'sources',
    name: 'fetchTask',
    runPath: 'effect-errors/src/examples/from-promise.ts:38:9',
    sourcesPath: undefined,
    source: [
      { line: 35, code: '      try: async () =>', column: undefined },
      {
        line: 36,
        code: '        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),',
        column: undefined,
      },
      { line: 37, code: '      catch: (e) =>', column: undefined },
      { line: 38, code: '        new FetchError({', column: 9 },
      { line: 39, code: '          cause: e,', column: undefined },
      { line: 40, code: '        }),', column: undefined },
      { line: 41, code: '    }),', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    name: 'fetchTask',
    runPath: 'effect-errors/src/examples/from-promise.ts:42:12',
    sourcesPath: undefined,
    source: [
      { line: 39, code: '          cause: e,', column: undefined },
      { line: 40, code: '        }),', column: undefined },
      { line: 41, code: '    }),', column: undefined },
      {
        line: 42,
        code: "    Effect.withSpan('fetch-user', { attributes: { userId } }),",
        column: 12,
      },
      { line: 43, code: '  );', column: undefined },
      { line: 44, code: '', column: undefined },
      {
        line: 45,
        code: 'const unwrapResponseTask = (response: Response) =>',
        column: undefined,
      },
    ],
  },
  {
    _tag: 'sources',
    name: 'fetchTask',
    runPath: 'effect-errors/src/examples/from-promise.ts:63:10',
    sourcesPath: undefined,
    source: [
      { line: 60, code: '', column: undefined },
      {
        line: 61,
        code: '    return yield* unwrapResponseTask(response);',
        column: undefined,
      },
      { line: 62, code: '  }),', column: undefined },
      { line: 63, code: "  Effect.withSpan('from-promise-task'),", column: 10 },
      { line: 64, code: ');', column: undefined },
      { line: 65, code: '', column: undefined },
      {
        line: 66,
        code: '// biome-ignore lint/style/noDefaultExport: run-example',
        column: undefined,
      },
    ],
  },
];
