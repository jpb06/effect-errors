/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaggedClass } from 'effect/Data';

export class UserNotFoundError extends TaggedClass('UserNotFound') {
  readonly message: string | undefined;

  constructor(error?: unknown) {
    super();

    if (error instanceof Error) {
      const { message } = error as Error;
      this.message = message;
    } else if ((error as any)?.message) {
      this.message = (error as any).message;
    } else if (typeof error === 'string') {
      this.message = error;
    } else {
      this.message = JSON.stringify(error, null, 2);
    }
  }
}
