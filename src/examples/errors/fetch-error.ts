import { TaggedError } from 'effect/Data';

export class FetchError extends TaggedError('FetchError') {
  constructor(readonly error?: unknown) {
    super();
  }
}
