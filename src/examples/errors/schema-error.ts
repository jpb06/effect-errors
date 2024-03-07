import * as Schema from '@effect/schema/Schema';

export class SchemaError extends Schema.TaggedError<SchemaError>()(
  'SomethingBad',
  {
    cause: Schema.optional(Schema.unknown),
    message: Schema.optional(Schema.string),
  },
) {}
