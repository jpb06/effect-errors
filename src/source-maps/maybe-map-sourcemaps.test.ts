import { beforeEach } from 'node:test';

import { describe, it, expect, vi } from 'vitest';

import {
  fromPromiseTaskSources,
  fromPromiseStack,
} from '../tests/mock-data/from-promises-sources.mock-data.js';
import {
  parallelErrorsStack,
  parallelErrorsTaskSources,
} from '../tests/mock-data/parallel-errors.mock-data.js';
import { mockConsole } from '../tests/mocks/console.mock.js';
import { mockFsExtra } from '../tests/mocks/fs-extra.mock.js';
import { execShellCommand } from '../tests/util/exec-shell-command.util.js';
import { getExampleSources } from '../tests/util/get-example-sources.util.js';

void mockConsole({
  warn: vi.fn(),
});

describe('maybeMapSourcemaps function', () => {
  const { readFile, exists } = mockFsExtra();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract sources from a typescript file', async () => {
    const fromPromiseSources = await getExampleSources('from-promise');
    readFile
      .mockResolvedValueOnce(fromPromiseSources as never)
      .mockResolvedValueOnce(fromPromiseSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await maybeMapSourcemaps(fromPromiseStack);

    expect(result).toStrictEqual(fromPromiseTaskSources);
  });

  it('should extract sources from a parallel run', async () => {
    const parallelSources = await getExampleSources('parallel-errors');

    readFile
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await maybeMapSourcemaps(parallelErrorsStack);

    expect(result).toStrictEqual(parallelErrorsTaskSources);
  });

  it('should return no sources', async () => {
    const parallelSources = await getExampleSources('parallel-errors');

    readFile
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never)
      .mockResolvedValueOnce(parallelSources as never);

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await maybeMapSourcemaps([
      'at /Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts',
    ]);

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

    const result = await maybeMapSourcemaps([jsFile]);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([
      {
        runPath: jsFile,
        source: undefined,
        sourcesPath: undefined,
      },
    ]);
  });

  it('should return sources from the map file associated with a js file', async () => {
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
      '/Users/jpb06/repos/perso/effect-errors/src/tests/bundle/from-promise.js:44:216',
      '/Users/jpb06/repos/perso/effect-errors/src/tests/bundle/from-promise.js:44:497',
    ];
    expect(effectError.sources).toStrictEqual(
      fromPromiseTaskSources.map(({ runPath, source }, index) => ({
        sourcesPath: runPath,
        source: source.map((d) =>
          d.column !== undefined ? d : { code: d.code, line: d.line },
        ),
        runPath: runPaths.at(index),
      })),
    );
  });
});
