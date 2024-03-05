import { Span } from 'effect/Tracer';

interface Error {
  message: string;
  stack?: string;
  span?: Span;
}

export class PrettyError {
  constructor(
    readonly message: string,
    readonly stack: string | undefined,
    readonly span: Span | undefined,
  ) {}

  toJSON() {
    const out: Error = { message: this.message };
    if (this.stack) {
      out.stack = this.stack;
    }
    if (this.span) {
      out.span = this.span;
    }
    return out;
  }
}
