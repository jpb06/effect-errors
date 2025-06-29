import fs from 'node:fs';

import { FileSystem } from '@effect/platform/FileSystem';
import { NodeFileSystem } from '@effect/platform-node';
import { Effect, Layer, Match, pipe } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import { makeFsTestLayer } from '@tests/layers';
import {
  fromPromiseStack,
  fromPromiseTaskSources,
  parallelErrorsStack,
  parallelErrorsTaskSources,
} from '@tests/mock-data';
import { execShellCommand, getExampleSources } from '@tests/util';

import type { RawErrorLocation } from './get-sources-from-map-file.js';

describe('maybeMapSourcemaps function', () => {
  it('should extract sources from a typescript file', async () => {
    const fromPromiseSources = await getExampleSources('from-promise');
    const { FsTestLayer } = makeFsTestLayer({
      readFileString: Effect.succeed(fromPromiseSources),
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(
        maybeMapSourcemaps('fetchTask', fromPromiseStack),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(result).toStrictEqual(fromPromiseTaskSources);
  });

  it('should extract sources from a parallel run', async () => {
    const parallelSources = await getExampleSources('parallel-errors');
    const { FsTestLayer } = makeFsTestLayer({
      readFileString: Effect.succeed(parallelSources),
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(
        maybeMapSourcemaps('readUser', parallelErrorsStack),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(result).toStrictEqual(parallelErrorsTaskSources);
  });

  it('should return no sources', async () => {
    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(
        maybeMapSourcemaps('readUser', [
          'at /Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts',
        ]),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(result).toStrictEqual([
      {
        _tag: 'stack-entry',
        runPath:
          'at /Users/jpb06/repos/perso/effect-errors/src/examples/parallel-errors.ts',
      },
    ]);
  });

  it('should return locations when no map file is associated to a js file', async () => {
    const jsFile =
      'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(false),
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(maybeMapSourcemaps('yolo', [jsFile]), Effect.provide(FsTestLayer)),
    );

    expect(result).toHaveLength(1);
    expect(result[0]._tag).toBe('location');

    const location = result[0] as RawErrorLocation;
    expect(location.column).toBe(20);
    expect(location.line).toBe(40);
    expect(location.filePath.endsWith('/src/yolo.js'));
  });

  it('should return no sources if map file is invalid', async () => {
    const jsFile =
      'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: Effect.succeed(`{ "version": 3 }`),
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(maybeMapSourcemaps('ono', [jsFile]), Effect.provide(FsTestLayer)),
    );

    expect(result).toStrictEqual([
      {
        _tag: 'stack-entry',
        runPath: 'at /Users/jpb06/repos/perso/effect-errors/src/yolo.js:40:20',
      },
    ]);
  });

  it('should return sources from the map file associated with a js file', async () => {
    const jsFile =
      '/Users/jpb06/repos/perso/effect-errors/src/tests/bundle/from-promise.js:168:388';
    const mapFile = await fs.promises.readFile(
      './src/tests/bundle/from-promise.js.map',
      {
        encoding: 'utf-8',
      },
    );
    const fromPromiseSources = await getExampleSources('from-promise');

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: vi.fn().mockImplementation((path: string) => {
        return Match.value(path).pipe(
          Match.when(
            (path) => path.endsWith('from-promise.js.map'),
            () => Effect.succeed(mapFile),
          ),
          Match.when(
            (path) => path.endsWith('from-promise.ts'),
            () => Effect.succeed(fromPromiseSources),
          ),
          Match.orElseAbsurd,
        );
      }),
    });

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(
        maybeMapSourcemaps('fetchTask', [`at ${jsFile}`]),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(result).toStrictEqual([
      {
        ...fromPromiseTaskSources[1],
        runPath: jsFile,
        sourcesPath: `/Users/jpb06/repos/perso/${fromPromiseTaskSources[1].runPath}`,
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
      'effect-errors/src/tests/bundle/from-promise.js:168:366',
      'effect-errors/src/tests/bundle/from-promise.js:168:388',
      'effect-errors/src/tests/bundle/from-promise.js:168:655',
    ];

    expect(effectError.sources?.length).toBe(3);
    for (let i = 0; i < effectError.sources.length; i++) {
      const error = effectError.sources[i];
      const expected = fromPromiseTaskSources[i];

      expect(error.runPath.endsWith(runPaths[i])).toBe(true);
      expect(error.sourcesPath.endsWith(expected.runPath)).toBe(true);
      expect(error.source).not.toBeUndefined();
      expect(error.source).toStrictEqual(
        expected.source!.map((d) =>
          d.column !== undefined ? d : { code: d.code, line: d.line },
        ),
      );
    }
  });

  it('should handle stacktraces with trailing spaces', async () => {
    const jsFile =
      '/Users/jpb06/repos/perso/effect-errors/src/tests/bundle/from-promise.js:168:388';

    const mapFile = await fs.promises.readFile(
      './src/tests/bundle/from-promise.js.map',
      {
        encoding: 'utf-8',
      },
    );
    const fromPromiseSources = await getExampleSources('from-promise');
    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(true),
        readFileString: (path: string) => {
          return Match.value(path).pipe(
            Match.when(
              (path) => path.endsWith('from-promise.js.map'),
              () => Effect.succeed(mapFile),
            ),
            Match.when(
              (path) => path.endsWith('from-promise.ts'),
              () => Effect.succeed(fromPromiseSources),
            ),
            Match.orElseAbsurd,
          );
        },
      } as unknown as FileSystem),
    );

    const { maybeMapSourcemaps } = await import('./maybe-map-sourcemaps.js');

    const result = await Effect.runPromise(
      pipe(
        maybeMapSourcemaps('fetchTask', [`    at file://${jsFile}`]),
        Effect.provide(TestFileSystemlayer),
      ),
    );

    expect(result).toStrictEqual([
      {
        ...fromPromiseTaskSources[1],
        runPath: jsFile,
        sourcesPath: `/Users/jpb06/repos/perso/${fromPromiseTaskSources[1].runPath}`,
      },
    ]);
  });
});
