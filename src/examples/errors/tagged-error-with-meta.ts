import { TaggedError } from 'effect/Data';

export class TaggedErrorWithMeta extends TaggedError('WithMeta')<{
  cause?: unknown;
  message?: string;
}> {}
