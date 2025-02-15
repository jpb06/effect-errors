import { type Effect, Layer } from 'effect';
import { vi } from 'vitest';

import { Logger, type LoggerLayer } from '@dependencies/logger';

type LoggerTestLayerInput = {
  info?: Effect.Effect<void>;
  error?: Effect.Effect<void>;
};

export const makeLoggerTestLayer = ({ info, error }: LoggerTestLayerInput) => {
  const infoMock = vi.fn().mockReturnValue(info);
  const errorMock = vi.fn().mockReturnValue(error);

  const make: Partial<LoggerLayer> = {
    info: infoMock,
    error: errorMock,
  };

  return {
    LoggerTestLayer: Layer.succeed(Logger, Logger.of(make as never)),
    infoMock,
    errorMock,
  };
};
