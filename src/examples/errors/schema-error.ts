import * as Schema from '@effect/schema/Schema';

export class SchemaError extends Schema.TaggedError<SchemaError>()(
  'SomethingBad',
  {
    cause: Schema.optional(Schema.Unknown),
    message: Schema.optional(Schema.String),
  },
) {}
