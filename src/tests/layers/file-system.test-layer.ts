import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, Layer } from 'effect';
import { TaggedError } from 'effect/Data';
import { type Mock, vi } from 'vitest';

const init = <T>(
  input: Effect.Effect<T> | Mock | undefined,
  name: keyof FileSystem,
) => {
  if (input === undefined) {
    return vi.fn().mockReturnValue(
      Effect.fail(
        new TestLayerError({
          cause: `No implementation provided for ${name}`,
        }),
      ),
    );
  }

  if (Effect.isEffect(input)) {
    return vi.fn().mockReturnValue(input);
  }

  return input;
};

export class TestLayerError extends TaggedError('test-layer-error')<{
  cause?: unknown;
  message?: string;
}> {}

type FsTestLayerInput = {
  exists?: Effect.Effect<boolean> | Effect.Effect<never, TestLayerError>;
  readFileString?: Effect.Effect<string> | Mock;
};

export const makeFsTestLayer = (input: FsTestLayerInput) => {
  const existsMock = vi.fn().mockReturnValue(input.exists);
  const readFileStringMock = init(input.readFileString, 'readFileString');

  const make: Partial<FileSystem> = {
    exists: existsMock,
    readFileString: readFileStringMock,
  };

  return {
    FsTestLayer: Layer.succeed(FileSystem, FileSystem.of(make as never)),
    existsMock,
    readFileStringMock,
  };
};
