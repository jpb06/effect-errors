import { TaggedClass } from 'effect/Data';

export class FetchError extends TaggedClass('FetchError') {
  readonly message: string | undefined;

  constructor(error: { code: string; message: string }) {
    super();

    this.message = `${error.code}: ${error.message}`;
  }
}
