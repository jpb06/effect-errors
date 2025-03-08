import { Schema } from 'effect';

export class SchemaError extends Schema.TaggedError<SchemaError>()(
  'SomethingBad',
  {
    cause: Schema.Defect,
    // message: Schema.optional(Schema.String),
  },
) {}
