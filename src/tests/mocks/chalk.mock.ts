import { type Chalk } from 'chalk';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockChalk = () => {
  const chalkMock = mockDeep<Chalk>();
  vi.doMock('chalk', () => chalkMock);
};
