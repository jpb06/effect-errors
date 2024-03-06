import { TaggedClass } from 'effect/Data';

export class FileError extends TaggedClass('FileError') {
  constructor(readonly message: string) {
    super();
  }
}
