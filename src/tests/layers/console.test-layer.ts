import { Effect } from 'effect';
import { vi } from 'vitest';

type ConsoleTestLayerInput = {
  info?: Effect.Effect<void>;
  error?: Effect.Effect<void>;
};

export const makeConsoleTestLayer = (
  { info, error }: ConsoleTestLayerInput = {
    info: Effect.void,
    error: Effect.void,
  },
) => {
  const infoMock = vi.fn().mockReturnValue(info);
  const errorMock = vi.fn().mockReturnValue(error);

  return {
    ConsoleTestLayer: Effect.withConsole({
      info: infoMock,
      error: errorMock,
    } as never),
    infoMock,
    errorMock,
  };
};
