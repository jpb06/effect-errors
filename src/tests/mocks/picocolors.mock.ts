import type pico from 'picocolors';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockPicoColors = () => {
  const picoColorsMock = mockDeep<typeof pico>();
  vi.doMock('picocolors', () => picoColorsMock);
};
