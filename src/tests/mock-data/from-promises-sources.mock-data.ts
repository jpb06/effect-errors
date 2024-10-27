import type { ErrorRelatedSources } from '../../source-maps/get-sources-from-map-file.js';

export const fromPromiseStack = [
  'at catch (effect-errors/src/examples/from-promise.ts:31:9)',
  'at fetchTask (effect-errors/src/examples/from-promise.ts:35:12)',
  'at module code (effect-errors/src/examples/from-promise.ts:56:10)',
];

export const fromPromiseTaskSources: ErrorRelatedSources[] = [
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/from-promise.ts:31:9',
    sourcesPath: undefined,
    source: [
      { line: 28, code: '      try: async () =>', column: undefined },
      {
        line: 29,
        code: '        await fetch(`https://yolo-bro-oh-no.org/users/${userId}`),',
        column: undefined,
      },
      { line: 30, code: '      catch: (e) =>', column: undefined },
      { line: 31, code: '        new FetchError({', column: 9 },
      { line: 32, code: '          cause: e,', column: undefined },
      { line: 33, code: '        }),', column: undefined },
      { line: 34, code: '    }),', column: undefined },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/from-promise.ts:35:12',
    sourcesPath: undefined,
    source: [
      { line: 32, code: '          cause: e,', column: undefined },
      { line: 33, code: '        }),', column: undefined },
      { line: 34, code: '    }),', column: undefined },
      {
        line: 35,
        code: "    Effect.withSpan('fetchUser', { attributes: { userId } }),",
        column: 12,
      },
      { line: 36, code: '  );', column: undefined },
      { line: 37, code: '', column: undefined },
      {
        line: 38,
        code: 'const unwrapResponseTask = (response: Response) =>',
        column: undefined,
      },
    ],
  },
  {
    _tag: 'sources',
    runPath: 'effect-errors/src/examples/from-promise.ts:56:10',
    sourcesPath: undefined,
    source: [
      { line: 53, code: '', column: undefined },
      {
        line: 54,
        code: '    return yield* unwrapResponseTask(response);',
        column: undefined,
      },
      { line: 55, code: '  }),', column: undefined },
      { line: 56, code: "  Effect.withSpan('fromPromiseTask'),", column: 10 },
      { line: 57, code: ');', column: undefined },
      { line: 58, code: '', column: undefined },
      {
        line: 59,
        code: '// biome-ignore lint/style/noDefaultExport: <explanation>',
        column: undefined,
      },
    ],
  },
];
