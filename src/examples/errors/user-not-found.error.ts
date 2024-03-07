import { TaggedError } from 'effect/Data';

export class UserNotFoundError extends TaggedError('UserNotFound') {
  constructor(readonly error?: unknown) {
    super();
  }
}
