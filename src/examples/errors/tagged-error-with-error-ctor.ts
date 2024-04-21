import { TaggedError } from 'effect/Data';

export class TaggedErrorWithErrorCtor extends TaggedError('OhNo') {
  // eslint-disable-next-line n/handle-callback-err
  constructor(readonly error?: unknown) {
    super();
  }
}
