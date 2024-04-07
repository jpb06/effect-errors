import { Span } from 'effect/Tracer';

export class PrettyError {
  constructor(
    readonly message: unknown,
    readonly stack: string | undefined,
    readonly span: Span | undefined,
    readonly errorType?: unknown,
    readonly isPlainString?: boolean,
  ) {}
}
