import { type Mock, vi } from 'vitest';

interface ProcessMockingArgs {
  cwd?: Mock;
}

export const mockProcess = async (args: ProcessMockingArgs) => {
  global.process = {
    ...(await vi.importActual('node:process')),
    ...args,
  };
};
