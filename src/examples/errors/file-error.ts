import { TaggedError } from 'effect/Data';

export class FileError extends TaggedError('FileError')<{
  cause?: unknown;
  message?: string;
}> {}
