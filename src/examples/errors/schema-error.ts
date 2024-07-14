import { Schema } from '@effect/schema';

export class SchemaError extends Schema.TaggedError<SchemaError>()(
  'SomethingBad',
  {
    cause: Schema.CauseDefectUnknown,
    // message: Schema.optional(Schema.String),
  },
) {}
