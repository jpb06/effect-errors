// biome-ignore lint/correctness/noUnusedImports: intended
import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

// biome-ignore lint/suspicious/noEmptyInterface: vitest related
// biome-ignore lint/correctness/noUnusedVariables: vitest related
interface CustomMatchers<R = unknown> {}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
