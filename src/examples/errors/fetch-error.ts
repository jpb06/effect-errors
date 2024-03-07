import { TaggedError } from 'effect/Data';

export class FetchError extends TaggedError('FetchError')<{
  cause?: unknown;
}> {}
