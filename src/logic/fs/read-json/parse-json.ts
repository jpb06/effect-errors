import { parse } from 'comment-json';
import { Effect, pipe } from 'effect';
import { TaggedError } from 'effect/Data';

export class JsonParsingError extends TaggedError('json-parsing-error')<{
  cause?: unknown;
  message?: string;
}> {}

export const parseJson = (data: string) =>
  pipe(
    Effect.sync(() => parse(data, null, true)),
    Effect.catchAll((e) =>
      Effect.fail(
        new JsonParsingError({
          cause: e,
        }),
      ),
    ),
    Effect.withSpan('parse-json', {
      attributes: {
        data,
      },
    }),
  );
