import { isFunction } from 'effect/Function';
import { hasProperty } from 'effect/Predicate';

interface ErrorDetails {
  isPlainString?: boolean;
  type?: unknown;
  message: unknown;
}

export const extractErrorDetails = (error: unknown): ErrorDetails => {
  if (typeof error === 'string') {
    return {
      isPlainString: true,
      message: error,
    };
  }

  // TaggedError with cause
  if (
    error instanceof Error &&
    hasProperty(error, 'cause') &&
    hasProperty(error, '_tag')
  ) {
    return {
      type: error._tag,
      message: error.cause,
    };
  }

  // TaggedError with error ctor
  if (error instanceof Error && hasProperty(error, 'error')) {
    return {
      type: error.name,
      message: error.error,
    };
  }

  // Plain objects with tag attribute
  if (hasProperty(error, '_tag') && hasProperty(error, 'message')) {
    return {
      type: error._tag,
      message: error.message,
    };
  }

  // Plain objects with toString impl
  if (
    hasProperty(error, 'toString') &&
    isFunction(error['toString']) &&
    error['toString'] !== Object.prototype.toString &&
    error['toString'] !== Array.prototype.toString
  ) {
    const message = error.toString();
    const maybeWithUnderlyingType = message.split(': ');

    if (maybeWithUnderlyingType.length > 1) {
      const [type, ...message] = maybeWithUnderlyingType;

      return {
        type,
        message,
      };
    }

    return { message };
  }

  return { message: `Error: ${JSON.stringify(error)}` };
};
