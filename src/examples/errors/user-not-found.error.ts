import { TaggedError } from 'effect/Data';

export class UserNotFoundError extends TaggedError('UserNotFound') {
  constructor(readonly error?: unknown) {
    super();
    if (error instanceof Error) {
      this.error = error;
    }
  }
}
