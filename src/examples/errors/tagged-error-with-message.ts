import { TaggedError } from 'effect/Data';

export class TaggedErrorWithMessage extends TaggedError('WithMessage')<{
  cause?: unknown;
  message?: string;
}> {}
