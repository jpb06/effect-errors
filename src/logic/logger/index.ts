import { Context, Effect, Layer, pipe } from 'effect';

export class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly info: (
      message?: unknown,
      ...optionalParams: unknown[]
    ) => Effect.Effect<void>;
    readonly error: (
      message?: unknown,
      ...optionalParams: unknown[]
    ) => Effect.Effect<void>;
  }
>() {}
export type LoggerLayer = (typeof Logger)['Service'];

export const LoggerConsoleLive = Layer.succeed(Logger, {
  info: (message?: unknown, ...optionalParams: unknown[]) =>
    pipe(
      Effect.succeed(console.info(message, ...optionalParams)),
      Effect.withSpan('logger-console/info'),
    ),
  error: (message?: unknown, ...optionalParams: unknown[]) =>
    pipe(
      Effect.succeed(console.error(message, ...optionalParams)),
      Effect.withSpan('logger-console/error'),
    ),
});
