import { expect } from 'vitest';

export const chalkMatcher = async () => {
  expect.extend({
    toChalkMatch(received, expected) {
      let escaped: RegExp;
      if (expected instanceof RegExp) {
        escaped = expected;
      } else {
        escaped = RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm');
      }

      const match = escaped.test(received);

      return {
        pass: match === true,
        message: () =>
          match
            ? `${expected} present in ${received}`
            : `${expected} not present in: \r\n───────────────────────────────\r\n${received}\r\n───────────────────────────────`,
        expected,
      };
    },
  });
};
