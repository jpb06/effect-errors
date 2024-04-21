/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

interface CustomMatchers<R = unknown> {
  toChalkMatch: (input: string | RegExp) => R;
  toHaveAttributes: (input: Array<{ key: string; value: unknown }>) => R;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
