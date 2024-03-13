import { ChalkInstance } from 'chalk';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockChalk = () => {
  const chalkMock = mockDeep<ChalkInstance>();
  vi.doMock('chalk', () => chalkMock);
};
