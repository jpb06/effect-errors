import { expect } from 'vitest';

export const spanAttributesMatcher = async () => {
  expect.extend({
    toHaveAttributes(received, expected) {
      if (!(received instanceof Map)) {
        return {
          pass: false,
          message: () => `Expecting an instance of Map as received input`,
        };
      }
      if (!Array.isArray(expected)) {
        return {
          pass: false,
          message: () => `Expecting an array as expected input`,
        };
      }

      const attributes = Array.from(received, ([key, value]) => ({
        key,
        value,
      }));
      if (attributes.length !== expected.length) {
        return {
          pass: false,
          message: () =>
            `Expected ${expected.length} attributes but got ${attributes.length}\r\n\r\nReceived: ${JSON.stringify(attributes, null, 2)}`,
        };
      }

      for (let index = 0; index < attributes.length; index++) {
        const receivedElement = attributes[index];
        const expectedElement = expected[index];

        const match =
          receivedElement.key === expectedElement.key &&
          JSON.stringify(receivedElement.value) ===
            JSON.stringify(expectedElement.value);

        if (!match) {
          return {
            pass: false,
            message: () =>
              `expected attributes to match\r\n\r\nReceived: ${JSON.stringify(attributes, null, 2)}`,
          };
        }
      }

      return {
        pass: true,
        message: () => 'spans attributes do match',
      };
    },
  });
};
