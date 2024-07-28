import { Effect, pipe } from 'effect';
import fs from 'fs-extra';

import { FsError } from './fs-error.js';

export const readFileEffect = (path: string) =>
  pipe(
    Effect.tryPromise({
      try: async () => await fs.readFile(path, { encoding: 'utf8' }),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('readFile', { attributes: { path } }),
  );

export const existsEffect = (path: string) =>
  pipe(
    Effect.tryPromise({
      try: async () => await fs.exists(path),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('exists', { attributes: { path } }),
  );

export const readJsonEffect = <TResult>(path: string) =>
  pipe(
    Effect.tryPromise({
      try: async () => await (fs.readJson(path) as Promise<TResult>),
      catch: (e) => new FsError({ cause: e }),
    }),
    Effect.withSpan('readJson', { attributes: { path } }),
  );
