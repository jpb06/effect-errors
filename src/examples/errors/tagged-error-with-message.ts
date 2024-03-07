import { TaggedError } from 'effect/Data';

export class TaggedErrorWithMessage extends TaggedError('WithMessage') {
  constructor(readonly error?: unknown) {
    super();
  }
}
