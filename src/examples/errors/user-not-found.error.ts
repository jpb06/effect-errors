import { TaggedError } from 'effect/Data';

export class UserNotFoundError extends TaggedError('UserNotFound')<{
  cause?: unknown;
  message?: string;
}> {}
