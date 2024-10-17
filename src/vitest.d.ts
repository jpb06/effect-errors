// biome-ignore lint/correctness/noUnusedImports: <explanation>
import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface CustomMatchers<R = unknown> {}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
