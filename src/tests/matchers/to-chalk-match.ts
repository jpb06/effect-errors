import { expect } from 'vitest';

export const chalkMatcher = async () => {
  expect.extend({
    toChalkMatch(received, expected) {
      if (typeof received !== 'string') {
        return {
          pass: false,
          message: () => `Expect received to be a string`,
          received,
        };
      }

      let escaped: RegExp;
      if (expected instanceof RegExp) {
        escaped = expected;
      } else if (typeof expected === 'string') {
        escaped = RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm');
      } else {
        return {
          pass: false,
          message: () =>
            `Expect ${expected} to be a string or an instance of RegExp`,
          expected,
        };
      }

      const match = escaped.test(received);

      return {
        pass: match,
        message: () =>
          match
            ? `${expected} present in ${received}`
            : `${expected} not present in: \r\n───────────────────────────────\r\n${received}\r\n───────────────────────────────`,
        expected,
      };
    },
  });
};
