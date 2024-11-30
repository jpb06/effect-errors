import { describe, expect, it } from 'vitest';

import { bigIntReplacer } from './big-int-replacer.js';

describe('bigIntReplacer function', () => {
  it('should return an integer', () => {
    const value = 1;
    const result = bigIntReplacer('yolo', value);

    expect(result).toBe(value);
  });

  it('should return a big int', () => {
    const value = BigInt(1);
    const result = bigIntReplacer('yolo', value);

    expect(result).toStrictEqual({ type: 'bigint', value: `${value}` });
  });
});
