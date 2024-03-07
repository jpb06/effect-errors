import { TaggedError } from 'effect/Data';

export class TaggedErrorWithErrorCtor extends TaggedError('OhNo') {
  constructor(readonly error?: unknown) {
    super();
  }
}
