import type * as FsExtra from 'fs-extra';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockFsExtra = () => {
  const fsExtraMock = mockDeep<typeof FsExtra>();
  vi.doMock('fs-extra', () => ({ default: fsExtraMock }));

  return fsExtraMock;
};
