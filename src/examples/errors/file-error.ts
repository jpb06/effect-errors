import { TaggedError } from 'effect/Data';

export class FileError extends TaggedError('FileError') {
  constructor(readonly error?: unknown) {
    super();
  }
}
