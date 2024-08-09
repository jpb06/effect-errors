import fs from 'fs';
import { beforeEach } from 'node:test';

import { Effect } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import {
  fromPromiseStack,
  fromPromiseTaskSources,
} from '../tests/mock-data/from-promises-sources.mock-data.js';
import {
  parallelErrorsStack,
  parallelErrorsTaskSources,
} from '../tests/mock-data/parallel-errors.mock-data.js';
import { mockConsole } from '../tests/mocks/console.mock.js';
import { mockFsExtra } from '../tests/mocks/fs-extra.mock.js';
import { execShellCommand } from '../tests/util/exec-shell-command.util.js';
import { getExampleSources } from '../tests/util/get-example-sources.util.js';

mockConsole({
  warn: vi.fn(),
});

describe('maybeMapSourcemaps function', () => {
  const { readFile, exists, readJson } = mockFsExtra();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract sources from a typescript file', async () => {
    const fromPromiseSources = await getExampleSources('from-promise');
    readFile
      .mockResolvedValueOnce(fromPromiseSources as never)
      .mockResolvedValueOnce(fromPromiseSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      maybeMapSourcemaps(fromPromiseStack),
    );

    expect(result).toStrictEqual(fromPromiseTaskSources);
  });

  it('should extract sources from a parallel run', async () => {
    const parallelSources = await getExampleSources('parallel-errors');

    readFile
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      maybeMapSourcemaps(parallelErrorsStack),
    );

    expect(result).toStrictEqual(parallelErrorsTaskSources);
  });

  it('should return no sources', async () => {
    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      maybeMapSourcemaps([
        'at /Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts',
      ]),
    );

    expect(result).toStrictEqual([
      {
        runPath:
          'at /Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts',
        source: undefined,
        sourcesPath: undefined,
      },
    ]);
  });

  it('should warn when no map file is associated to a js file', async () => {
    const jsFile =
      'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20';

    exists.mockResolvedValueOnce(false as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(maybeMapSourcemaps([jsFile]));

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([
      {
        runPath: jsFile,
        source: undefined,
        sourcesPath: undefined,
      },
    ]);
  });

  it('should return no sources if map file is invalid', async () => {
    const jsFile =
      'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20';

    exists.mockResolvedValueOnce(true as never);
    readJson.mockResolvedValueOnce({
      version: 3,
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(maybeMapSourcemaps([jsFile]));

    expect(result).toStrictEqual([
      {
        runPath: 'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20',
        source: undefined,
        sourcesPath: undefined,
      },
    ]);
  });

  it('should return sources from the map file associated with a js file', async () => {
    const jsFile =
      '/Users/jpb06/repos/perso/effect-errors/src/tests/bundle/from-promise.js:36:212';

    exists.mockResolvedValueOnce(true as never);
    const mapFile = await fs.promises.readFile(
      `./src/tests/bundle/from-promise.js.map`,
      {
        encoding: 'utf-8',
      },
    );
    readJson.mockResolvedValueOnce(JSON.parse(mapFile));
    const fromPromiseSources = await getExampleSources('from-promise');
    readFile.mockResolvedValueOnce(fromPromiseSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      maybeMapSourcemaps([`at ${jsFile}`]),
    );

    expect(result).toStrictEqual([
      {
        source: fromPromiseTaskSources[0].source,
        runPath: jsFile,
        sourcesPath:
          '/Users/jpb06/repos/perso/effect-errors/src/examples/from-promise.ts:25:10',
      },
    ]);
  });

  it('should return sources from a js bundle', async () => {
    const result = await execShellCommand(
      'node ./src/tests/bundle/from-promise.js',
    );

    expect(result.error).toBeDefined();
    expect(result.result).toBeUndefined();

    const parsedError = JSON.parse(result.error as never);

    expect(parsedError.interrupted).toBe(false);
    expect(Array.isArray(parsedError.errors)).toBe(true);
    expect(parsedError.errors.length).toBe(1);

    const effectError = parsedError.errors.at(0);

    const runPaths = [
      'effect-errors/src/tests/bundle/from-promise.js:36:213',
      'effect-errors/src/tests/bundle/from-promise.js:36:490',
    ];

    expect(effectError.sources?.length).toBe(2);
    for (let i = 0; i < effectError.sources.length; i++) {
      const error = effectError.sources[i];
      const expected = fromPromiseTaskSources[i];
      expect(error.runPath.endsWith(runPaths[i])).toBe(true);
      expect(error.sourcesPath.endsWith(expected.runPath)).toBe(true);
      expect(error.source).toStrictEqual(
        expected.source.map((d) =>
          d.column !== undefined ? d : { code: d.code, line: d.line },
        ),
      );
    }
  });
});
