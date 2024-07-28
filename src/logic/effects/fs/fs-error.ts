import { TaggedError } from 'effect/Data';

export class FsError extends TaggedError('fs-error')<{
  cause?: unknown;
  message?: string;
}> {}
