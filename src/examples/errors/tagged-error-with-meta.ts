import { TaggedError } from 'effect/Data';

export class TaggedErrorWithMeta extends TaggedError('WithMeta') {
  constructor(readonly error?: unknown) {
    super();
  }
}
